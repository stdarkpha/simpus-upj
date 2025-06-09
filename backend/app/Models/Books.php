<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Books extends Model
{
    protected $fillable = [
        'img',
        'title',
        'release_date',
        'total_page',
        'slug',
        'author',
        'category_id',
        'stock',
        'description',
        'status',
    ];

    public function category()
    {
        return $this->belongsTo(Categories::class);
    }
}
