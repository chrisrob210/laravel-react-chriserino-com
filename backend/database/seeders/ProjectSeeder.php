<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Map By Schema Prototype',
                'category' => 'Dev Tools',
                'description' => 'A Laravel-based CLI tool that auto-generates Eloquent models from your database schema — no manual coding required.',
                'uri' => '',
                'image' => '/images/repos/mbn1.png',
                'github' => 'https://github.com/chrisrob210/map-by-schema-prototype',
                'show_in_portfolio' => true
            ],
            [
                'title' => 'Ebay Barcode Search',
                'category' => 'E-Commerce Tool',
                'description' => 'Use a camera to scan a barcode and get Suggested and Average Pricing.',
                'uri' => '/projects/barcode-scanner',
                'image' => '/images/repos/ebay-barcode-app.png',
                'github' => 'https://github.com/chrisrob210/ebay-barcode-search',
                'show_in_portfolio' => true
            ],
            [
                'title' => 'Trivia Battle Arena',
                'category' => 'Game',
                'description' => 'Guess the correct answer and the AI loses HP, guess wrong and YOU lose HP. Defeat the AI and win.',
                'uri' => '/projects/trivia-battle-arena',
                'image' => '/images/repos/trivia-battle.png',
                'github' => 'https://github.com/chrisrob210/trivia-battle-arena',
                'show_in_portfolio' => true
            ]
        ];

        foreach ($projects as $project) {
            Project::firstOrCreate(
                ['title' => $project['title']],
                $project
            );
        }
    }
}
