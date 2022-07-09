<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

// Other
use DateTime;

// THe DOMPDF library 
use Dompdf\Dompdf;

class CertificateController extends BaseController
{
    function certificatesGet (Request $request) {
        $creator_id = $request->get('uid');
    
        // Get the certificate data
        $certificate_query = 'SELECT certificates.*, templates.name AS "template_name" FROM certificates INNER JOIN templates ON certificates.template_id=templates.id WHERE certificates.creator_id = "' . $creator_id . '" ORDER BY certificates.created';
        $certificate_results = app('db')->select($certificate_query);
    
        // Send a positive response
        return response()->json([
            'status' => true,
            'message' => 'Certificate data retrieved succesfully.',
            'data' => $certificate_results,
        ]);
    }

    function certificateCreate (Request $request) {
        $data = $request->json()->all();
        
        $date = new DateTime();
        $timestamp = $date->getTimeStamp();
        
        $creator_id = $request->get('uid');
        $template_id = $data['template_id'];
        $certificate_id = md5($timestamp) . $creator_id; // The creator id guarantees a unique id even if the strings match
        $certificate_name = $data['name'];
        $certificate_notes = $data['notes'];
        $date_created = $timestamp;
        $date_edited = $timestamp;
        $certificate_fields = $data['fields'];
    
        // Save the certificate
        $certificate_values = '"' . $certificate_id . '", "' . $template_id . '", "' . $creator_id . '", "' . $certificate_name . '", "' . $certificate_notes . '", "' . $date_created . '", "' . $date_edited . '"';
        $certificate_query = 'INSERT INTO certificates (id, template_id, creator_id, name, notes, created, edited) VALUES (' . $certificate_values . ')';
        $certificate_results = app('db')->insert($certificate_query);
    
        if ($certificate_results == 1) {
            foreach ($certificate_fields as $current_field) {
                $field_id = $current_field['id'];
                $field_type = $current_field['type'];
                $field_name = $current_field['name'];
                $field_value = $current_field['value'];
        
                $field_values = '"' . $field_id . '", "' . $certificate_id . '", "' . $field_type . '", "' . $field_name . '", "' . $field_value . '"';
                $field_query = 'INSERT INTO certificate_fields (id, certificate_id, type, name, value) VALUES (' . $field_values . ')';
                $field_results = app('db')->insert($field_query);
        
                if ($field_results < 1) {
                    // Send an error response
                    return response()->json([
                        'status' => false, 
                        'message' => 'An error occured with the field insert.',
                    ]);
                }
            }
    
            // If the certificates and fields didn't provide any errors
            // Generate a certificate
            $isCertificateGenerated = $this->certificateGenerate($certificate_id, $template_id, $creator_id);

            if ($isCertificateGenerated) {
                // Send a positive response response
                return response()->json([
                    'status' => true, 
                    'message' => 'Certificate was created successfully.',
                ]);
            }

            // Send a negative response
            return response()->json([
                'status' => false, 
                'message' => 'An error occured with the certificate generation.',
            ]);
        }
    
        // Send a negative response
        return response()->json([
            'status' => false, 
            'message' => 'An error occured with the certificate insert.',
        ]);
    }

    function certificateEdit (Request $request, $certificateId) { 
        $data = $request->json()->all();

        $creator_id = $request->get('uid');
        $template_id = $data['template_id'];
        $certificate_id = $certificateId;
    
        $date = new DateTime();
        $timestamp = $date->getTimeStamp();
        
        $certificate_name = $data['name'];
        $certificate_notes = $data['notes'];
        $date_edited = $timestamp;
        $certificate_fields = $data['fields'];
    
        // Save the certificate
        $certificate_query = 'UPDATE certificates SET name="' . $certificate_name . '", notes = "'. $certificate_notes . '", template_id = "'. $template_id . '", edited = "'. $date_edited . '" WHERE creator_id = "' . $creator_id . '" AND id = "' . $certificate_id . '"';
        $certificate_results = app('db')->update($certificate_query);
        
        if ($certificate_results == 1) {
            // Delete all previous fields and create new ones
            $field_query_delete = 'DELETE FROM certificate_fields WHERE certificate_id = "' . $certificate_id . '"';
            $field_results_delete = app('db')->delete($field_query_delete);
    
            foreach ($certificate_fields as $current_field) {
                $field_id = $current_field['id'];
                $field_type = $current_field['type'];
                $field_name = $current_field['name'];
                $field_value = $current_field['value'];
        
                $field_values = '"' . $field_id . '", "' . $certificate_id . '", "' . $field_type . '", "' . $field_name . '", "' . $field_value . '"';
                $field_query = 'INSERT INTO certificate_fields (id, certificate_id, type, name, value) VALUES (' . $field_values . ')';
                $field_results = app('db')->insert($field_query);
        
                if ($field_results < 1) {
                    // Send an error response
                    return response()->json([
                        'status' => false, 
                        'message' => 'An error occured with the field insert.',
                    ]);
                }
            }
    
            // If the certificates and fields didn't provide any errors
            // Generate a certificate
            $isCertificateGenerated = $this->certificateGenerate($certificate_id, $template_id, $creator_id);

            if ($isCertificateGenerated) {
                // Send a positive response response
                return response()->json([
                    'status' => true, 
                    'message' => 'Certificate was edited successfully.',
                ]);
            }
            
            // Send a negative response
            return response()->json([
                'status' => false, 
                'message' => 'An error occured with the certificate generation.',
            ]);
        }
    
        // Send a negative response
        return response()->json([
            'status' => false, 
            'message' => 'An error occured with the certificate insert.',
        ]);
    }

    function certificateDelete (Request $request, $certificateId) {
        $creator_id = $request->get('uid');
        $certificate_id = $certificateId;
    
        // Delete all previous fields and create new ones
        $field_query_delete = 'DELETE FROM certificates WHERE id = "' . $certificate_id . '" AND creator_id = "' . $creator_id . '"';
        $field_results_delete = app('db')->delete($field_query_delete);
        
        // Check if the certificate was deleted
        if ($field_results_delete > 0) {
            return response()->json([
                'status' => true, 
                'message' => 'Certificate was deleted successfully.',
            ]);
        }

        return response()->json([
            'status' => false, 
            'message' => 'Certificate was not deleted.',
        ]);
    }

    function certificateGet (Request $request, $certificateId) {
        $creator_id = $request->get('uid');
        $certificate_id = $certificateId;
    
        // Get the certificate data by id
        $certificate_data_final = $this->certificateDataGet($certificate_id, $creator_id);

        // Get the template data by id
        $template_data_final = $this->templateGet($certificate_data_final->template_id, $creator_id);

        // Send a positive response
        return response()->json([
            'status' => true,
            'message' => 'Certificate data retrieved succesfully.',
            'data' => $certificate_data_final,
            'template_data' => $template_data_final
        ]);
    }

    function certificatePDFGet(Request $request, $certificateId) {
        // Check if the certificate directory exists
        $certificate_dir = 'files/' . $certificateId;

        if (!is_dir($certificate_dir)) {
            return response()->json([
                'status' => false, 
                'message' => 'The certificate was not found.',
            ]);
        }

        $host = $request->getSchemeAndHttpHost();
        $url = $host . '/' . $certificate_dir . '/'. $certificateId . '.pdf';

        return response()->json([
            'status' => true, 
            'message' => 'The certificate was found.',
            'url' => $url
        ]);
    }

    function certificateVerify ($certificateId) {
        // Anonymous users can check this data, too
        $certificate_id = $certificateId;
    
        // Get the certificate data
        $certificate_query = 'SELECT * FROM certificates WHERE id = "' . $certificate_id . '"';
        $certificate_results = app('db')->select($certificate_query);
    
        if (count($certificate_results)) {
            // Send a positive response
            return response()->json([
                'status' => true,
                'message' => 'Certificate exists.',
            ]);
        }
        
        return response()->json([
            'status' => false, 
            'message' => 'The certificate was not found.',
        ]);
    }

    // Certificate reusable functions
    // Get the certificate data
    function certificateDataGet($certificateId, $creatorId) {
        $certificate_id = $certificateId;
        $creator_id = $creatorId;

        $certificate_query = 'SELECT * FROM certificates WHERE id = "' . $certificate_id . '" AND creator_id = "' . $creator_id . '"';
        $certificate_results = app('db')->select($certificate_query);
        $certificate_fields_data = [];
    
        if (count($certificate_results)) {
            // Get the field ids
            $certificate_fields_query = 'SELECT * FROM certificate_fields WHERE certificate_id = "' . $certificate_id . '"';
            $certificate_fields_results = app('db')->select($certificate_fields_query);
            
            if (count($certificate_fields_results)) {
                foreach ($certificate_fields_results as $current_field) {
                    $current_field_data = $current_field;
                    $current_field_id = $current_field->id;
    
                    $certificate_fields_data[$current_field_id] = $current_field_data;
                }
            } else {
                return response()->json([
                    'status' => false, 
                    'message' => 'The certificate fields could not be retrieved.',
                ]);
            }
        } else {
            return response()->json([
                'status' => false, 
                'message' => 'The certificate was not found.',
            ]);
        }
    
        $certificate_data_final = $certificate_results[0];
        $certificate_data_final->fields = $certificate_fields_data;

        return $certificate_data_final;
    }

    // Set the data format, units and styles
    function getFieldStyles($properties) {
        $currentProperties = $properties;

        foreach($currentProperties as $key => $property) {
            if (in_array($key, ['content', 'url', 'editable', 'unit', 'units'])) {
                continue;
            }
            
            if ($key === 'transform') {
                $currentProperties[$key]->value = 'rotate(' . $currentProperties[$key]->value . 'deg)';
            }
            
            if (in_array($key, ['left', 'top', 'maxWidth', 'fontSize', 'height', 'width'])) {
                $currentProperties[$key]->value = $currentProperties[$key]->value . $currentProperties[$key]->unit;
            }
        }
        
        $finalCSSObject = [];
        
        foreach($currentProperties as $key => $property) {
            if (in_array($key, ['content', 'url', 'editable', 'unit', 'units'])) {
                continue;
            }

            $currentPropertyValue = $currentProperties[$key]->value;

            switch ($key) {
                case 'top':
                case 'transform':
                case 'left':
                    break;

                case 'fontSize':
                    $key = 'font-size';
                    break;

                case 'fontStyle':
                    $key = 'font-style';
                    break;

                case 'fontWeight':
                    $key = 'font-weight';
                    break;

                case 'maxWidth':
                    $key = 'max-width';
                    break;

                case 'textAlign':
                    $key = 'text-align';
                    break;

                case 'textDecoration':
                    $key = 'text-decoration';
                    break;

                case 'zIndex':
                    $key = 'z-index';
                    break;

                // TO DO
                // Add fields for images and links
            }

            $currentCSSValue = $key . ':' . $currentPropertyValue;
            array_push($finalCSSObject, $currentCSSValue);
        }
        
        array_push($finalCSSObject, 'position: absolute');
        return implode('; ', $finalCSSObject);
    }

    // Generate the certificate PDF
    function certificateGenerate ($certificateId, $templateId, $creatorId) {
        // Generate the HTML
        $certificate_data = $this->certificateDataGet($certificateId, $creatorId);
        $template_data = $this->templateGet($templateId, $creatorId);

        // Set the certificate data in the template data
        foreach ($certificate_data->fields as $key => $property) {
            $current_field_certificate = $certificate_data->fields[$key];
            $current_field_template = $template_data->fields[$key];
            $current_field_template->properties[$current_field_certificate->name]->value = $current_field_certificate->value;
        }

        $template_fields = $template_data->fields;
        $template_HTML = '';
        
        foreach ($template_fields as $field) {
            $field_properties = $field->properties;
            $field_styles = $this->getFieldStyles($field_properties);
            $current_field_HTML = '';

            switch ($field->type) {
                case 'Text':
                    $current_field_HTML = '<div style="' . $field_styles . '">' . $field_properties['content']->value . '</div>';
                    break;

                case 'Image':
                    $current_field_HTML = '<div style="' . $field_styles . '"><img style="height: inherit; width: inherit" src=' . $field_properties['url']->value . 'alt="" /></div>';
                    break;
    
                case 'Link':
                    $current_field_HTML = '<div style="' . $field_styles . '"><a style="font-size: inherit; color: inherit; text-decoration: inherit" href=' . $field_properties['url']->value . '>' . $field_properties['content']->value . '</a></div>';
                    break;
    
                default:
                    return null;
            }

            $template_HTML = $template_HTML . $current_field_HTML;
        }

        // Instantiate and use the dompdf class
        $dompdf = new Dompdf();

        $options = new \Dompdf\Options();
        // Set the options
        $options->set(['isHtml5ParserEnabled' => true, 'isRemoteEnabled' => true]);

        // TO DO
        // Received URL or image normal path
        // $data = file_get_contents('https://teafloor.com/wp-content/themes/teafloor2-0/assets/images/logo.png');
        // $data = file_get_contents('./testimage.jpg');
        // $type = 'jpeg';
        // $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

        $html = '<html> 
                    <head>
                        <style> 
                            @page { margin: 0px; } 
                            body { margin: 0px; } 
                        </style> 
                    </head>
                    
                    <body>
                        <div style="width: 100%; height: 100%; position: relative; overflow: hidden;">
                            <style> 
                                body { 
                                    margin: 0; 
                                } 
                            </style>
                            ' . $template_HTML . '
                        </div>
                    </body> 
                </html>';

        $dompdf->loadHtml($html);

        // (Optional) Setup the paper size and orientation
        $dompdf->setPaper('A4', 'portrait'); // portrait or landscape

        // Render the HTML as PDF
        $dompdf->render();

        // Save to file - testing
        $output = $dompdf->output();

        // Check if the certificate directory exists
        $certificate_dir = 'files/' . $certificateId;

        if (!is_dir($certificate_dir)) {
            // if the path doesn't exist, create it
            mkdir($certificate_dir);
        }

        file_put_contents($certificate_dir . '/'. $certificateId . '.pdf', $output);

        // Return a positive response
        return true;
    }
    
    // Get the template for the certificate
    function templateGet ($templateId, $creatorId) {
        // Get the template data
        $template_id = $templateId;
        $creator_id = $creatorId;

        // Get the template data
        $template_query = 'SELECT * FROM templates WHERE id = "' . $template_id . '" AND creator_id = "' . $creator_id . '"';
        $template_results = app('db')->select($template_query);
        $template_fields_data = [];
    
        if (count($template_results)) {
            // Get the field ids
            $template_fields_query = 'SELECT * FROM template_fields WHERE template_id = "' . $template_id . '"';
            $template_fields_results = app('db')->select($template_fields_query);
            
            if (count($template_fields_results)) {
                foreach ($template_fields_results as $current_field) {
                    $current_field_data = $current_field;
                    $current_field_id = $current_field->id;
    
                    // Get the field attributes
                    $template_field_attributes_query = 'SELECT * FROM template_field_attributes WHERE field_id = "' . $current_field_id . '"';
                    $template_field_attributes_results = app('db')->select($template_field_attributes_query);
                    $template_field_results_final = [];
    
                    if (count($template_field_attributes_results)) {
                        foreach ($template_field_attributes_results as $current_attribute) {
                            $template_field_results_final[$current_attribute->name] = $current_attribute;
                        }
            
                        $current_field_data->properties = $template_field_results_final;
                        $template_fields_data[$current_field_id] = $current_field_data;
                    } else {
                        return response()->json([
                            'status' => false, 
                            'message' => 'The template field attributes could not be retrieved.',
                        ]);
                    }
                }
            } else {
                return response()->json([
                    'status' => false, 
                    'message' => 'The template fields could not be retrieved.',
                ]);
            }
        } else {
            return response()->json([
                'status' => false, 
                'message' => 'The template was not found.',
            ]);
        }
    
        $template_data_final = $template_results[0];
        $template_data_final->fields = $template_fields_data;
        return $template_data_final;
    }
}
