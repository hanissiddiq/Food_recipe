<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RecipeController;

Route::apiResource('recipes', RecipeController::class);
// Route::apiResource('recipes', \App\Http\Controllers\Api\RecipeController::class);
