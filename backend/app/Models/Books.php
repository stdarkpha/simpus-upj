<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Books extends Model
{
    protected $fillable = [
        'img',
        'title',
        'slug',
        'author',
        'category_id',
        'stock',
        'description',
    ];

    public function category()
    {
        return $this->belongsTo(Categories::class);
    }
}
