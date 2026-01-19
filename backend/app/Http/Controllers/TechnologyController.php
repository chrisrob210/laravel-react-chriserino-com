<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use Illuminate\Http\Request;

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
}
