<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ContractController;

//Routes of the User
Route::get('/users', [UserController::class,'index']);
Route::post('/user/create', [UserController::class, 'store']);
Route::get('/user/{id}', [UserController::class, 'show']);
Route::delete('/user/{id}',[UserController::class,'destroy']);
Route::patch('/user/{id}',[UserController::class,'updatePartial']);
Route::put('/user/{id}',[UserController::class,'update']);

//Routes of Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:api'])->group(function () {
    Route::get('/me', [AuthController::class,'me']);
    Route::post('/logout',[AuthController::class,'logout']);
    Route::post('/refresh',[AuthController::class,'refresh']);

    Route::get('/profile/{id}',[AuthController::class,'getUserProfile']);
    Route::put('/profile/{id}',[AuthController::class, 'updateUserProfile']);

    Route::post('/contract/create',[ContractController::class,'store']);
    Route::put('/contract/{id}', [ContractController::class, 'update']);
    Route::patch('/contract/{id}',[ContractController::class,'updatePartial']);
    Route::delete('/contract/{id}',[ContractController::class,'destroy']);

    Route::post('/service/create', [ServiceController::class, 'store']);
    Route::put('/service/{id}',[ServiceController::class,'update']);
    Route::patch('/service/{id}',[ServiceController::class,'updatePartial']);
    Route::delete('/service/{id}',[ServiceController::class,'destroy']);
});

//Routes of Services
Route::get('/services',[ServiceController::class,'index']);
Route::get('/service/{id}', [ServiceController::class, 'show']);

//Routes of contract
Route::get('/contracts',[ContractController::class,'index']);
Route::get('/contract/{id}',[ContractController::class, 'show']);

