<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

// Other
use DateTime;

class TemplateController extends BaseController
{
    function templatesGet (Request $request) {
        $creator_id = $request->get('uid');
    
        // Get the template data
        $template_query = 'SELECT * FROM templates WHERE creator_id = "' . $creator_id . '" ORDER BY created';
        $template_results = app('db')->select($template_query);
    
        // Send a positive response
        return response()->json([
            'status' => true,
            'message' => 'Template data retrieved succesfully.',
            'data' => $template_results,
        ]);
    }

    function templateCreate (Request $request) {
        $data = $request->json()->all();
        
        $date = new DateTime();
        $timestamp = $date->getTimeStamp();
        
        $creator_id = $request->get('uid');
        $template_id = md5($timestamp) . $creator_id; // The creator id guarantees a unique id even if the strings match
        $template_name = $data['name'];
        $template_notes = $data['notes'];
        $template_orientation = $data['orientation'];
        $date_created = $timestamp;
        $date_edited = $timestamp;
        $template_fields = $data['fields'];
    
        // Save the template
        $template_values = '"' . $template_id . '", "' . $creator_id . '", "' . $template_name . '", "' . $template_notes . '", "' . $template_orientation . '", "' . $date_created . '", "' . $date_edited . '"';
        $template_query = 'INSERT INTO templates (id, creator_id, name, notes, orientation, created, edited) VALUES (' . $template_values . ')';
        $template_results = app('db')->insert($template_query);
    
        if ($template_results == 1) {
            foreach ($template_fields as $current_field) {
                $field_id = $current_field['id'];
                $field_type = $current_field['type'];
                $field_properties = $current_field['properties'];
        
                $field_values = '"' . $field_id . '", "' . $template_id . '", "' . $field_type . '"';
                $field_query = 'INSERT INTO template_fields (id, template_id, type) VALUES (' . $field_values . ')';
                $field_results = app('db')->insert($field_query);
        
                if ($field_results == 1) {
                    $property_values_final = [];
                    foreach ($field_properties as $current_property_name => $current_property) {
                        $property_name = $current_property_name;
                        $property_label = $current_property['label'];
                        $property_value = $current_property['value'];
                        $property_type = $current_property['type'];
                        $property_unit = isset($current_property['unit']) ? $current_property['unit'] : 'NULL';
                        $property_units = isset($current_property['units']) ? implode(', ', $current_property['units']) : 'NULL';
                        $property_options = isset($current_property['options']) ? implode(', ', $current_property['options']) : 'NULL';
                        
                        if ($property_type === 'boolean') {
                            $property_value = $property_value ? '1' : '0';
                        }
                        
                        $property_values = '("' . $field_id . '", "' . $property_name . '", "' . $property_label . '", "' . $property_value . '", "' . $property_type . '", "' . $property_unit . '", "' . $property_units . '", "' . $property_options . '")';
                        array_push($property_values_final, $property_values);
                    }
                    
                    $property_values_final_string = implode(', ', $property_values_final);
                    $property_query = 'INSERT INTO template_field_attributes (field_id, name, label, value, type, unit, units, options) VALUES ' . $property_values_final_string;
                    $property_results = app('db')->insert($property_query);
    
                    if ($property_results != 1) {
                        // Send an error response
                        return response()->json([
                            'status' => false, 
                            'message' => 'An error occured with the property insert.',
                        ]);
                    }
                } else {
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
                'message' => 'Template was created successfully.',
            ]);
        }
    
        // Send a negative response
        return response()->json([
            'status' => false, 
            'message' => 'An error occured with the template insert.',
        ]);
    }

    function templateEdit (Request $request, $templateId) {
        $creator_id = $request->get('uid');
        $template_id = $templateId;
    
        $data = $request->json()->all();
        
        $date = new DateTime();
        $timestamp = $date->getTimeStamp();
        
        $template_name = $data['name'];
        $template_notes = $data['notes'];
        $template_orientation = $data['orientation'];
        $date_edited = $timestamp;
        $template_fields = $data['fields'];
    
        // Save the template
        $template_query = 'UPDATE templates SET name="' . $template_name . '", notes = "'. $template_notes . '", orientation = "'. $template_orientation . '", edited = "'. $date_edited . '" WHERE creator_id = "' . $creator_id . '" AND id = "' . $template_id . '"';
        $template_results = app('db')->update($template_query);
        
        if ($template_results == 1) {
            // Delete all previous fields and create new ones
            $field_query_delete = 'DELETE FROM template_fields WHERE template_id = "' . $template_id . '"';
            $field_results_delete = app('db')->delete($field_query_delete);
    
            foreach ($template_fields as $current_field) {
                $field_id = $current_field['id'];
                $field_type = $current_field['type'];
                $field_properties = $current_field['properties'];
        
                $field_values = '"' . $field_id . '", "' . $template_id . '", "' . $field_type . '"';
                $field_query = 'INSERT INTO template_fields (id, template_id, type) VALUES (' . $field_values . ')';
                $field_results = app('db')->insert($field_query);
        
                if ($field_results > 0) {
                    $property_values_final = [];
    
                    foreach ($field_properties as $current_property_name => $current_property) {
                        $property_name = $current_property_name;
                        $property_label = $current_property['label'];
                        $property_value = $current_property['value'];
                        $property_type = $current_property['type'];
                        $property_unit = isset($current_property['unit']) ? $current_property['unit'] : 'NULL';
                        $property_units = isset($current_property['units']) ? implode(', ', $current_property['units']) : 'NULL';
                        $property_options = isset($current_property['options']) ? implode(', ', $current_property['options']) : 'NULL';
                        
                        $property_values = '("' . $field_id . '", "' . $property_name . '", "' . $property_label . '", "' . $property_value . '", "' . $property_type . '", "' . $property_unit . '", "' . $property_units . '", "' . $property_options . '")';
                        array_push($property_values_final, $property_values);
                    }
                    
                    $property_values_final_string = implode(', ', $property_values_final);
                    $property_query = 'INSERT INTO template_field_attributes (field_id, name, label, value, type, unit, units, options) VALUES ' . $property_values_final_string;
                    $property_results = app('db')->insert($property_query);
    
                    if ($property_results != 1) {
                        // Send an error response
                        return response()->json([
                            'status' => false, 
                            'message' => 'An error occured with the property insert.',
                        ]);
                    }
                } else {
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
                'message' => 'Template was edited successfully.',
            ]);
        }
    
        // Send a negative response
        return response()->json([
            'status' => false, 
            'message' => 'An error occured with the template insert.',
        ]);
    }

    function templateDelete (Request $request, $templateId) {
        $creator_id = $request->get('uid');
        $template_id = $templateId;
    
        // Delete all previous fields and create new ones
        $field_query_delete = 'DELETE FROM templates WHERE id = "' . $template_id . '" AND creator_id = "' . $creator_id . '"';
        $field_results_delete = app('db')->delete($field_query_delete);
        
        // Send a positive response response
        return response()->json([
            'status' => true, 
            'message' => 'Template was deleted successfully.',
            'results' => $field_results_delete
        ]);
    }

    function templateGet (Request $request, $templateId) {
        $creator_id = $request->get('uid');
        $template_id = $templateId;
    
        // Get the template data
        $template_query = 'SELECT * FROM templates WHERE id = "' . $template_id . '" AND creator_id = "' . $creator_id . '"';
        $template_results = app('db')->select($template_query);
        $template_fields_data = [];
    
        if (count($template_results)) {
            // Get the field ids
            $template_fields_query = 'SELECT * FROM template_fields WHERE template_id = "' . $template_id . '"';
            $template_fields_results = app('db')->select($template_fields_query);
            
            if (count($template_fields_results) > 0) {
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
            'message' => 'Template data retrieved succesfully.',
            'data' => $template_data_final,
        ]);
    }
}
