<?php

namespace App\Http\Middleware;

use Closure;

// JWT library functionality
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $token = $request->bearerToken();
        $key = 'UNIBIT';

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $decoded_array = (array) $decoded;

            $request->attributes->add(['uid' => $decoded_array['uid']]);
            
            return $next($request);
        } catch (\Exception $e) {
            // Send a negative response
            return response()->json([
                'status' => false, 
                'message' => 'An error occured on token validation.',
            ]);
        }

        // Send a negative response
        return response()->json([
            'status' => false, 
            'message' => 'An error occured on token validation.',
        ]);
    }
}
