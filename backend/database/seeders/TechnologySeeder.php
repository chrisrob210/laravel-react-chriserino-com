<?php

namespace Database\Seeders;

use App\Models\Technology;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TechnologySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Experience skills with categories and icons
        $experienceSkills = [
            // Front End
            ['title' => 'HTML5', 'url' => 'https://developer.mozilla.org/en-US/docs/Web/HTML', 'category' => 'Front End', 'icon' => '/images/icons/HTML5_Logo_64.png'],
            ['title' => 'CSS', 'url' => 'https://developer.mozilla.org/en-US/docs/Web/CSS', 'category' => 'Front End', 'icon' => '/images/icons/CSS3_Logo_64.png'],
            ['title' => 'JavaScript', 'url' => 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', 'category' => 'Front End', 'icon' => '/images/icons/JS_Logo_64.png'],
            
            // Back End
            ['title' => 'PHP', 'url' => 'https://www.php.net/docs.php', 'category' => 'Back End', 'icon' => '/images/icons/php-original.svg'],
            ['title' => 'SQL', 'url' => 'https://docs.microsoft.com/en-us/sql/', 'category' => 'Back End', 'icon' => '/images/icons/microsoftsqlserver-plain.svg'],
            ['title' => 'MySQL', 'url' => 'https://dev.mysql.com/doc/', 'category' => 'Back End', 'icon' => '/images/icons/mysql-original.svg'],
            ['title' => 'API', 'url' => 'https://developer.mozilla.org/en-US/docs/Web/API', 'category' => 'Back End', 'icon' => ''],
            
            // Framework
            ['title' => 'React', 'url' => 'https://react.dev/reference/react', 'category' => 'Framework', 'icon' => '/images/icons/react-original.svg'],
            ['title' => 'Node.js', 'url' => 'https://nodejs.org/docs/', 'category' => 'Framework', 'icon' => '/images/icons/nodejs-original.svg'],
            ['title' => 'Laravel', 'url' => 'https://laravel.com/docs', 'category' => 'Framework', 'icon' => '/images/icons/laravel.png'],
            ['title' => 'Tailwind', 'url' => 'https://tailwindcss.com/docs', 'category' => 'Framework', 'icon' => '/images/icons/icons8-tailwind-css-48.png'],
        ];

        // Project-specific technologies (no category)
        $projectTechnologies = [
            ['title' => 'Artisan CLI', 'url' => 'https://laravel.com/docs/5.0/artisan'],
            ['title' => 'Eloquent', 'url' => 'https://laravel.com/docs/5.0/eloquent'],
            ['title' => 'Laravel 12', 'url' => 'https://laravel.com/docs/12.x'],
            ['title' => 'Ebay API', 'url' => 'https://developer.ebay.com/api-docs/buy/feed/overview.html'],
            ['title' => 'Zxing Barcode Scanner', 'url' => 'https://github.com/zxing/zxing'],
            ['title' => 'Open Trivia Db API', 'url' => 'https://opentdb.com/api_config.php'],
        ];

        // Insert experience skills
        foreach ($experienceSkills as $tech) {
            Technology::firstOrCreate(
                ['title' => $tech['title']],
                [
                    'url' => $tech['url'],
                    'category' => $tech['category'],
                    'icon' => $tech['icon']
                ]
            );
        }

        // Insert project-specific technologies
        foreach ($projectTechnologies as $tech) {
            Technology::firstOrCreate(
                ['title' => $tech['title']],
                ['url' => $tech['url']]
            );
        }
    }
}
