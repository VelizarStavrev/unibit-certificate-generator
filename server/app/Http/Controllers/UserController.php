<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

// Used for token generation on login
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Other
use DateTime;

class UserController extends BaseController
{
    function userLogin(Request $request) {
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
    }

    function userRegister (Request $request) {
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
    }
}
