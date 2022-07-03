<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

// Other
use DateTime;

class CertificateController extends BaseController
{
    function certificatesGet (Request $request) {
        $token = $request->bearerToken();
        $isTokenValid = isTokenValid($token);
        
        if (!$isTokenValid['status']) {
            // TO DO
            // Give the FE info to delete the invalid token in the browser
            // Redirect the user to login
    
            // Send a negative response
            return response()->json([
                'status' => false, 
                'message' => 'Your token is invalid.',
            ]);
        }
    
        $creator_id = $isTokenValid['decoded_token']['uid'];
    
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
        $token = $request->bearerToken();
        $isTokenValid = isTokenValid($token);
        
        if (!$isTokenValid['status']) {
            // TO DO
            // Give the FE info to delete the invalid token in the browser
            // Redirect the user to login
    
            // Send a negative response
            return response()->json([
                'status' => false, 
                'message' => 'Your token is invalid.',
            ]);
        }
    
        $data = $request->json()->all();
        
        $date = new DateTime();
        $timestamp = $date->getTimeStamp();
        
        $creator_id = $isTokenValid['decoded_token']['uid'];
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
    
            // If the for each didn't provide any errors
            // Send a positive response response
            return response()->json([
                'status' => true, 
                'message' => 'Certificate was created successfully.',
            ]);
        }
    
        // Send a negative response
        return response()->json([
            'status' => false, 
            'message' => 'An error occured with the certificate insert.',
        ]);
    }

    function certificateEdit (Request $request, $certificateId) {
        $token = $request->bearerToken();
        $isTokenValid = isTokenValid($token);
        
        if (!$isTokenValid['status']) {
            // TO DO
            // Give the FE info to delete the invalid token in the browser
            // Redirect the user to login
    
            // Send a negative response
            return response()->json([
                'status' => false, 
                'message' => 'Your token is invalid.',
            ]);
        }
    
        $data = $request->json()->all();
    
        $creator_id = $isTokenValid['decoded_token']['uid'];
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
    
            // If the for each didn't provide any errors
            // Send a positive response response
            return response()->json([
                'status' => true, 
                'message' => 'Certificate was edited successfully.',
            ]);
        }
    
        // Send a negative response
        return response()->json([
            'status' => false, 
            'message' => 'An error occured with the certificate insert.',
        ]);
    }

    function certificateDelete (Request $request, $certificateId) {
        $token = $request->bearerToken();
        $isTokenValid = isTokenValid($token);
        
        if (!$isTokenValid['status']) {
            // TO DO
            // Give the FE info to delete the invalid token in the browser
            // Redirect the user to login
    
            // Send a negative response
            return response()->json([
                'status' => false, 
                'message' => 'Your token is invalid.',
            ]);
        }
    
        $creator_id = $isTokenValid['decoded_token']['uid'];
        $certificate_id = $certificateId;
    
        // Delete all previous fields and create new ones
        $field_query_delete = 'DELETE FROM certificates WHERE id = "' . $certificate_id . '" AND creator_id = "' . $creator_id . '"';
        $field_results_delete = app('db')->delete($field_query_delete);
        
        // Send a positive response response
        // TO DO - add a check if the certificate was deleted - do the same for the tempaltes
        return response()->json([
            'status' => true, 
            'message' => 'Certificate was deleted successfully.',
            'results' => $field_results_delete
        ]);
    }

    function certificateGet (Request $request, $certificateId) {
        $token = $request->bearerToken();
        $isTokenValid = isTokenValid($token);
        
        if (!$isTokenValid['status']) {
            // TO DO
            // Give the FE info to delete the invalid token in the browser
            // Redirect the user to login
    
            // Send a negative response
            return response()->json([
                'status' => false, 
                'message' => 'Your token is invalid.',
            ]);
        }
    
        $creator_id = $isTokenValid['decoded_token']['uid'];
        $certificate_id = $certificateId;
    
        // Get the certificate data
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
    
        // Get the template data
        $template_id = $certificate_data_final->template_id;
    
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
    
        // Send a positive response
        return response()->json([
            'status' => true,
            'message' => 'Certificate data retrieved succesfully.',
            'data' => $certificate_data_final,
            'template_data' => $template_data_final
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

    function certificateGenerate () {
        // TO DO
    }
}
