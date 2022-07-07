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

// Used for token generation on login
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Account related routes
$router->post('/user/register', 'UserController@userRegister');

$router->post('/user/login', 'UserController@userLogin');

// Data related routes
// Templates
// Get all templates
$router->get('/templates', 'TemplateController@templatesGet');

// Create a new template
$router->post('/template/new', 'TemplateController@templateCreate');

// Edit a template (save changes)
$router->post('/template/edit/{templateId}', 'TemplateController@templateEdit');

// Delete a template
$router->post('/template/delete/{templateId}', 'TemplateController@templateDelete');

// Get a template by id
$router->get('/template/{templateId}', 'TemplateController@templateGet');

// Certificates
// Get all certificates
$router->get('/certificates', 'CertificateController@certificatesGet');

// Create a new certificate
$router->post('/certificate/new', 'CertificateController@certificateCreate');

// Edit a certificate (save changes)
$router->post('/certificate/edit/{certificateId}', 'CertificateController@certificateEdit');

// Delete a certificate
$router->post('/certificate/delete/{certificateId}', 'CertificateController@certificateDelete');

// Get a certificate file by id
$router->get('/certificate/file/{certificateId}', 'CertificateController@certificatePDFGet');

// Get a certificate by id
$router->get('/certificate/{certificateId}', 'CertificateController@certificateGet');

// Verify a certificate
$router->get('/verify/{certificateId}', 'CertificateController@certificateVerify');

// TO DO - use a middleware for validation
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