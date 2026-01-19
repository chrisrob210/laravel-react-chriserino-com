<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with('technologies')->get();
        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $validated = $request->validated();
        $technologies = $validated['technologies'] ?? [];
        unset($validated['technologies']);
        
        $project = Project::create($validated);
        
        if (!empty($technologies)) {
            $project->technologies()->attach($technologies);
        }
        
        $project->load('technologies');
        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $project = Project::with('technologies')->find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        // Get validated data
        $validated = $request->validated();
        
        // Extract technologies if present
        $technologies = $validated['technologies'] ?? null;
        unset($validated['technologies']); // Remove from array so it doesn't try to update on project
        
        // Update project fields
        $project->update($validated);
        
        // Sync technologies if provided
        if ($technologies !== null) {
            $project->technologies()->sync($technologies);
        }
        
        // Reload with technologies for response
        $project->load('technologies');
        
        return response()->json($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();
        return response()->json(['message' => 'Project deleted successfully'], 200);
    }

    /**
     * Get projects that should be displayed in the portfolio
     */
    public function portfolio()
    {
        $projects = Project::where('show_in_portfolio', true)
            ->with('technologies')
            ->get();

        return response()->json($projects);
    }
}
