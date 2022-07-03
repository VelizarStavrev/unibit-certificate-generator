<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

use Illuminate\Http\Request;
use Illuminate\Http\Response;

// Used for token generation on login
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Test routes
$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('/test', function () use ($router) {
    return 'test get';
});

$router->post('/test', function () use ($router) {
    return 'test post';
});

// Test routes - DB
$router->get('/test_database/', function () {

    $results = app('db')->select('SELECT * FROM test');
    $results_array = [];

    for ($i = 0; $i < count($results); $i++) {
        array_push($results_array, $results[$i]->word);
    }

    $results_string = implode(', ', $results_array);
    return 'Your results: ' . $results_string;
});

$router->post('/test_database/{testWord}', function ($testWord = null) {
    $query = 'INSERT INTO test (word) VALUES ("' . $testWord . '")';
    $results = app('db')->insert($query);
    return $results ? 'Your result was saved!' : 'An error occured.';
});

$router->post('/test/{testUser}/test/{testId}', function ($testUser = null, $testId = null) {
    return 'The test route has a user of ' . $testUser . ' and a test id of ' . $testId;
});

// Account related routes
$router->post('/user/register', function (Request $request) {
    // Get the received JSON data
    $user_role = 2; // User role
    $date = new DateTime();
    $timestamp = $date->getTimeStamp();
    $user_email = $request->json()->get('email');
    $user_username = $request->json()->get('username');
    $user_password = $request->json()->get('password');
    $user_password_hashed = password_hash($user_password, PASSWORD_BCRYPT);
    $user_created = $timestamp;

    // Validate the received data
    // TO DO

    // Check if certain fields exist in the DB
    function checkIfUserFieldDataExists($field_name, $field_data)
    {
        $query_check_existence = 'SELECT * FROM users WHERE ' . $field_name . '="' . $field_data . '"';
        $db_check_existence = app('db')->select($query_check_existence);

        if (count($db_check_existence)) {
            return [
                'status' => true,
                'message' => 'User with ' . $field_name . ' = ' . $field_data . ' already exists!'
            ];
        }

        return [
            'status' => false,
            'message' => 'User with ' . $field_name . ' = ' . $field_data . ' does not exist!'
        ];
    }

    // Check if email exists
    $checkEmailExistence = checkIfUserFieldDataExists('email', $user_email);
    if ($checkEmailExistence['status']) {
        return response()->json([
            'status' => false, 
            'message' => $checkEmailExistence['message'],
            'type' => 'exists-email'
        ]);
    }

    // Check if username exists
    $checkUsernameExistence = checkIfUserFieldDataExists('username', $user_username);
    if ($checkUsernameExistence['status']) {
        return response()->json([
            'status' => false, 
            'message' => $checkUsernameExistence['message'],
            'type' => 'exists-username'
        ]);
    };

    // Save the user
    $values = '"' . $user_role . '", "' . $user_email . '", "' . $user_username . '", "' . $user_password_hashed . '", "' . $user_created . '"';
    $query = 'INSERT INTO users (role, email, username, password, created) VALUES (' . $values . ')';
    $results = app('db')->insert($query);

    if ($results == 1) {
        return response()->json([
            'status' => true, 
            'message' => 'User registered successfully!',
            'type' => 'success'
        ]);
    }

    // Return an error message
    return response()->json([
        'status' => false, 
        'message' => 'An error occured with the user registration!',
        'type' => 'error'
    ]);
});

$router->post('/user/login', function (Request $request) {
    // Get the received JSON data
    $user_username = $request->json()->get('username');
    $user_password = $request->json()->get('password');

    // Get the user data from the DB
    $query_user_data = 'SELECT id, password FROM users WHERE username="' . $user_username . '"';
    $result_user_data = app('db')->select($query_user_data);

    // Check if the username exists
    if (count($result_user_data)) {
        // Check if the password is valid
        $password_from_DB = $result_user_data[0]->password;
        $isPasswordValid = password_verify($user_password, $password_from_DB);

        if ($isPasswordValid) {
            $user_id = $result_user_data[0]->id;
            $key = 'UNIBIT';
            $payload = [
                'uname' => $user_username,
                'uid' => $user_id,
                'pa1' => 'lovet',
                'pa2' => 'his44'
            ];

            $jwt = JWT::encode($payload, $key, 'HS256');

            return response()->json([
                'status' => true, 
                'message' => 'User logged in successfully!',
                'token' => $jwt
            ]);
        }

        return response()->json(['status' => false, 'message' => 'Wrong password!']);
    }

    return response()->json(['status' => false, 'message' => 'Non-existent username!']);
});

// Data related routes
// Templates
// Get all templates
$router->get('/templates', function (Request $request) {
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

    // Get the template data
    $template_query = 'SELECT * FROM templates WHERE creator_id = "' . $creator_id . '" ORDER BY created';
    $template_results = app('db')->select($template_query);

    // Send a positive response
    return response()->json([
        'status' => true,
        'message' => 'Template data retrieved succesfully.',
        'data' => $template_results,
    ]);
});

// Create a new template
$router->post('/template/new', function (Request $request) {
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
});

// Edit a template (save changes)
$router->post('/template/edit/{templateId}', function (Request $request, $templateId) {
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
});

// Delete a template
$router->post('/template/delete/{templateId}', function (Request $request, $templateId) {
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
});

// Get a template by id
$router->get('/template/{templateId}', function (Request $request, $templateId) {
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
    $template_id = $templateId;

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
        'message' => 'Template data retrieved succesfully.',
        'data' => $template_data_final,
    ]);
});

// Certificates
// Get all certificates
$router->get('/certificates', function (Request $request) {
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
});

// Create a new certificate
$router->post('/certificate/new', function (Request $request) {
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
});

// Edit a certificate (save changes)
$router->post('/certificate/edit/{certificateId}', function (Request $request, $certificateId) {
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
});

// Delete a certificate
$router->post('/certificate/delete/{certificateId}', function (Request $request, $certificateId) {
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
});

// Get a certificate by id
$router->get('/certificate/{certificateId}', function (Request $request, $certificateId) {
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
    // TO DO - make a reusable function - is the same as the template data retrieve
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
});

// Verify a certificate
$router->get('/verify/{certificateId}', function ($certificateId) {
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
});

// Token validation
function isTokenValid($received_token) {
    $key = 'UNIBIT';

    try {
        $decoded = JWT::decode($received_token, new Key($key, 'HS256'));
        $decoded_array = (array) $decoded;
        return [
            'status' => true,
            'decoded_token' => $decoded_array
        ];
    } catch (Exception $e) {
        return [
            'status' => false,
        ];
    }

    return [
        'status' => false,
    ];
}