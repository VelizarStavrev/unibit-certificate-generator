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

// Account related routes
// User registration
$router->post('/user/register', 'UserController@userRegister');

// User login
$router->post('/user/login', 'UserController@userLogin');

// Data related routes
// Templates
// Get all templates
$router->get('/templates', ['middleware' => 'auth', 'uses' => 'TemplateController@templatesGet']);

// Create a new template
$router->post('/template/new', ['middleware' => 'auth', 'uses' => 'TemplateController@templateCreate']);

// Edit a template (save changes)
$router->post('/template/edit/{templateId}', ['middleware' => 'auth', 'uses' => 'TemplateController@templateEdit']);

// Delete a template
$router->post('/template/delete/{templateId}', ['middleware' => 'auth', 'uses' => 'TemplateController@templateDelete']);

// Get a template by id
$router->get('/template/{templateId}', ['middleware' => 'auth', 'uses' => 'TemplateController@templateGet']);

// Certificates
// Get all certificates
$router->get('/certificates', ['middleware' => 'auth', 'uses' => 'CertificateController@certificatesGet']);

// Create a new certificate
$router->post('/certificate/new', ['middleware' => 'auth', 'uses' => 'CertificateController@certificateCreate']);

// Edit a certificate (save changes)
$router->post('/certificate/edit/{certificateId}', ['middleware' => 'auth', 'uses' => 'CertificateController@certificateEdit']);

// Delete a certificate
$router->post('/certificate/delete/{certificateId}', ['middleware' => 'auth', 'uses' => 'CertificateController@certificateDelete']);

// Get a certificate file by id
$router->get('/certificate/file/{certificateId}', 'CertificateController@certificatePDFGet');

// Get a certificate by id
$router->get('/certificate/{certificateId}', ['middleware' => 'auth', 'uses' => 'CertificateController@certificateGet']);

// Verify a certificate
$router->get('/verify/{certificateId}', 'CertificateController@certificateVerify');
