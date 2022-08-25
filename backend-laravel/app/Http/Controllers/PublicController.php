<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;

class PublicController extends Controller
{
    public function store(Request $request)
    {
        try {

            $credentials = $request->only('nik', 'password');
            
            if(!$token = auth()->attempt($credentials)){
                return response()->json(['error' => 'NIK or password invalid.'], 401);
            }

        } catch (Exception $e) {
            if($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return response()->json(['error' => 'token_invalid'], 400);
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException ){
                return response()->json(['error' => 'token_expired'], 400);
            }else{
                return response()->json(['error' => 'token_not_found'], 401);
            }
        }
        
        return response()->json([
            'status' => 200,
            'message' => 'Succesfully get token.',
            'token' => $token
        ]);
    }
}
