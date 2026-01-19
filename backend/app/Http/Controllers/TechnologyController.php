<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTechnologyRequest;
use App\Http\Requests\UpdateTechnologyRequest;

class TechnologyController extends Controller
{
    /**
     * Get all technologies with their IDs
     */
    public function index()
    {
        $technologies = Technology::all();
        return response()->json($technologies);
    }

    /**
     * Store a newly created technology in storage.
     */
    public function store(StoreTechnologyRequest $request)
    {
        $technology = Technology::create($request->validated());
        return response()->json($technology, 201);
    }

    /**
     * Display the specified technology.
     */
    public function show($id)
    {
        $technology = Technology::find($id);

        if (!$technology) {
            return response()->json(['message' => 'Technology not found'], 404);
        }

        return response()->json($technology);
    }

    /**
     * Update the specified technology in storage.
     */
    public function update(UpdateTechnologyRequest $request, $id)
    {
        $technology = Technology::find($id);

        if (!$technology) {
            return response()->json(['message' => 'Technology not found'], 404);
        }

        $technology->update($request->validated());
        return response()->json($technology);
    }

    /**
     * Get technologies grouped by category (for experience section)
     */
    public function byCategory()
    {
        $technologies = Technology::whereNotNull('category')
            ->orderBy('category')
            ->orderBy('title')
            ->get();

        // Group by category
        $grouped = $technologies->groupBy('category')->map(function ($items, $category) {
            return [
                'title' => $category,
                'skills' => $items->map(function ($tech) {
                    return [
                        'name' => $tech->title,
                        'icon' => $tech->icon
                    ];
                })->toArray()
            ];
        })->values();

        return response()->json($grouped);
    }

    /**
     * Remove the specified technology from storage.
     */
    public function destroy($id)
    {
        $technology = Technology::find($id);

        if (!$technology) {
            return response()->json(['message' => 'Technology not found'], 404);
        }

        $technology->delete();
        return response()->json(['message' => 'Technology deleted successfully'], 200);
    }
}
