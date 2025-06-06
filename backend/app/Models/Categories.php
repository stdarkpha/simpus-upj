<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $fillable = ['name', 'slug'];

    public function books()
    {
        return $this->hasMany(Books::class, 'category_id')->latest();
    }
}
