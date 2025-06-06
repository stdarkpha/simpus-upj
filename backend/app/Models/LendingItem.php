<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LendingItem extends Model
{
    protected $fillable = [
        'lending_id',
        'book_id',
        'amount',
    ];

    public function lending()
    {
        return $this->belongsTo(Lending::class);
    }

    public function book()
    {
        return $this->belongsTo(Books::class);
    }
}
