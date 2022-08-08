<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\User as UserResource;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Str;

class RegisterController extends Controller
{
    public function store(RegisterRequest $request)
    {
        $random_password = Str::random(6);
        $user = User::create([
            'nik' => $request->nik,
            'role' => $request->role,
            'password' => bcrypt($random_password)
        ]);

        $credentials = [
            'nik' => $request->nik,
            'password' => $random_password
        ];

        $token = auth()->attempt($credentials);

        $data = [
            'nik' => $request->nik,
            'role' => $request->role,
            'password' => $random_password
        ];

        return response()->json([
            'status' => 200,
            'message' => 'User Succesfully Created.',
            'data' => $data
        ]);
    }

    public function index()
    {
        $user = User::all();

        return $user;
    }
}
