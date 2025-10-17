<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{

    protected $fillable = [
        'contract_id',
        'type',
        'plan_name',
        'price'
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function contract(){
        return $this->belongsTo(Contract::class);
    }
}