<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $fillable = [
        'user_id',
        'contract_number',
        'start_date',
        'status'
    ];

    protected $casts = [
        'start_date' => 'date',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function services(){
        return $this->hasMany(Service::class);
    }
}
