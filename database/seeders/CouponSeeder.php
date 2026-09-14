<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'EVER10',
                'type' => 'percent',
                'value' => 10.00,
                'min_order_amount' => null,
                'is_active' => true,
            ],
            [
                'code' => 'FOREST20',
                'type' => 'percent',
                'value' => 20.00,
                'min_order_amount' => 100.00,
                'is_active' => true,
            ],
            [
                'code' => 'PLANT10',
                'type' => 'fixed',
                'value' => 10.00,
                'min_order_amount' => 50.00,
                'is_active' => true,
            ],
            [
                'code' => 'FREESHIP',
                'type' => 'free_shipping',
                'value' => 0.00,
                'min_order_amount' => null,
                'is_active' => true,
            ],
        ];

        foreach ($coupons as $data) {
            Coupon::updateOrCreate(['code' => $data['code']], $data);
        }
    }
}
