<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Recipe;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class RecipeController extends Controller
{
    // list all recipes
    public function index()
    {
        $recipes = Recipe::orderBy('created_at','desc')->get()->map(function($r) {
            $r->image_url = $r->image ? asset('storage/'.$r->image) : null;
            return $r;
        });
        return response()->json($recipes);
    }

    // store new recipe
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'ingredients' => 'required|string',
            'steps' => 'required|string',
            'image' => 'nullable|image|max:5120', // max 5MB
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('recipes', $filename, 'public'); // storage/app/public/recipes/...
            $validated['image'] = $path;
        }

        $recipe = Recipe::create($validated);
        $recipe->image_url = $recipe->image ? asset('storage/'.$recipe->image) : null;
        return response()->json($recipe, 201);
    }

    // show single recipe
    public function show(Recipe $recipe)
    {
        $recipe->image_url = $recipe->image ? asset('storage/'.$recipe->image) : null;
        return response()->json($recipe);
    }

    // update recipe
    public function update(Request $request, Recipe $recipe)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'ingredients' => 'sometimes|required|string',
            'steps' => 'sometimes|required|string',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            // delete old image if exists
            if ($recipe->image && Storage::disk('public')->exists($recipe->image)) {
                Storage::disk('public')->delete($recipe->image);
            }
            $file = $request->file('image');
            $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('recipes', $filename, 'public');
            $validated['image'] = $path;
        }

        $recipe->update($validated);
        $recipe->image_url = $recipe->image ? asset('storage/'.$recipe->image) : null;
        return response()->json($recipe);
    }

    // delete recipe
    public function destroy(Recipe $recipe)
    {
        if ($recipe->image && \Storage::disk('public')->exists($recipe->image)) {
            \Storage::disk('public')->delete($recipe->image);
        }
        $recipe->delete();
        return response()->json(['message' => 'Recipe deleted']);
    }
}
