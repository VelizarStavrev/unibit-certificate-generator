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
            'message' => 'User successfully registered!',
            'type' => 'success'
        ]);
    }

    // Return an error message
    return response()->json([
        'status' => false, 
        'message' => 'An error occured!',
        'type' => 'error'
    ]);
});

$router->post('/user/login', function (Request $request) {
    // Get the received JSON data
    $user_username = $request->json()->get('username');
    $user_password = $request->json()->get('password');

    // Get the user data from the DB
    $query_user_data = 'SELECT password FROM users WHERE username="' . $user_username . '"';
    $result_user_data = app('db')->select($query_user_data);

    // Check if the username exists
    if (count($result_user_data)) {
        // Check if the password is valid
        $password_from_DB = $result_user_data[0]->password;
        $isPasswordValid = password_verify($user_password, $password_from_DB);

        if ($isPasswordValid) {
            $key = 'UNIBIT';
            $payload = [
                'uname' => $user_username,
                'pa1' => 'lovet',
                'pa2' => 'his44'
            ];

            $jwt = JWT::encode($payload, $key, 'HS256');
            // TO DO - add to data get request middleware
            // $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
            // $decoded_array = (array) $decoded;
            // dump($jwt);
            // dump($decoded_array);

            return response()->json([
                'status' => true, 
                'message' => 'The password is valid and the user should be logged in!',
                'token' => $jwt
            ]);
        }

        return response()->json(['status' => false, 'message' => 'The password is NOT valid and the user should NOT be logged in!']);
    }

    return response()->json(['status' => false, 'message' => 'The username does not exist.']);
});
