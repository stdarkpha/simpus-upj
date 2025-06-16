<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lending extends Model
{
    protected $fillable = [
        'transaction_id',
        'user_id',
        'lend_date',
        'return_date',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Books::class);
    }

    public function items()
    {
        return $this->hasMany(LendingItem::class)->select(['id', 'lending_id', 'book_id'])->with('book')->with('book.category:id,name');
    }

    public function item()
    {
        return $this->hasMany(LendingItem::class);
    }

    public function compact()
    {
        return $this->hasMany(LendingItem::class)
            ->select(['id', 'lending_id', 'book_id'])
            ->with(['book:id,title']);
    }
}
