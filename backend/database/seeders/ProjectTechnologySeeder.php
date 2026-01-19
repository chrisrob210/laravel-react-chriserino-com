<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Technology;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectTechnologySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Map projects to their technologies based on repos.ts structure
        $projectTechnologies = [
            'Map By Schema Prototype' => [
                'PHP',
                'MySQL',
                'Artisan CLI',
                'Eloquent',
                'Laravel 12'
            ],
            'Ebay Barcode Search' => [
                'React',
                'Ebay API',
                'Zxing Barcode Scanner'
            ],
            'Trivia Battle Arena' => [
                'React',
                'Open Trivia Db API'
            ]
        ];

        foreach ($projectTechnologies as $projectTitle => $technologyTitles) {
            $project = Project::where('title', $projectTitle)->first();
            
            if (!$project) {
                continue;
            }

            foreach ($technologyTitles as $techTitle) {
                $technology = Technology::where('title', $techTitle)->first();
                
                if ($technology) {
                    // Check if the relationship already exists, if not insert it
                    $exists = DB::table('project_technologies')
                        ->where('project_id', $project->id)
                        ->where('technology_id', $technology->id)
                        ->exists();
                    
                    if (!$exists) {
                        DB::table('project_technologies')->insert([
                            'project_id' => $project->id,
                            'technology_id' => $technology->id,
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                    }
                }
            }
        }
    }
}
