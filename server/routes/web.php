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

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('/test', function () use ($router) {
    return 'test get';
});

$router->post('/test', function () use ($router) {
    return 'test post';
});

$router->post('/test/{testUser}/test/{testId}', function ($testUser = null, $testId = null) {
    return 'The test route has a user of '.$testUser.' and a test id of '.$testId;
});
