<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\User as UserResource;
use App\Models\User;
use Exception;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function index()
    {
        $user = User::all();

        return $user;
    }

    public function store(Request $request)
    {
        try {

            $credentials = $request->only('nik', 'password');
            
            if(auth()->attempt($credentials)){
                $user = JWTAuth::parseToken()->authenticate();
            }else{
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
        return new UserResource($user);
    }
}
