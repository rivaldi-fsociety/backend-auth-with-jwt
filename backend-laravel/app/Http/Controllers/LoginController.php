<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;

class LoginController extends Controller
{
    public function store(LoginRequest $request)
    {
        $credentials = $request->only('nik', 'password');

        if(!$token = auth()->attempt($credentials)){
            return response()->json(['error' => 'NIK or password invalid.'], 401);
        }
        cookie('jwt', $token, 60);
        $data = [
            'id' => $request->user()->id,
            'nik' => $request->user()->nik,
            'role' => $request->user()->role,
            'token' => $token
        ];
        
        return response()->json([
            'status' => 200,
            'message' => 'Succesfully get token.',
            'data' => $data
        ]);
    }
}
