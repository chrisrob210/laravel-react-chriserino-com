<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Project extends Model
{
    protected $table = 'projects';

    protected $fillable = [
        'title',
        'category',
        'description',
        'uri',
        'image',
        'github',
        'show_in_portfolio'
    ];

    /**
     * The technologies that belong to the project.
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'project_technologies');
    }
}
