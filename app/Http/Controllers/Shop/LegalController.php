<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function terms(): Response
    {
        return Inertia::render('Legal/Terms');
    }

    public function privacy(): Response
    {
        return Inertia::render('Legal/Privacy');
    }

    public function shipping(): Response
    {
        return Inertia::render('Legal/Shipping');
    }

    public function returns(): Response
    {
        return Inertia::render('Legal/Returns');
    }

    public function refund(): Response
    {
        return Inertia::render('Legal/Refund');
    }

    public function legalNotice(): Response
    {
        return Inertia::render('Legal/Notice');
    }

    public function contact(): Response
    {
        return Inertia::render('Legal/Contact');
    }

    public function about(): Response
    {
        return Inertia::render('Legal/About');
    }

    public function materials(): Response
    {
        return Inertia::render('Legal/Materials');
    }

    public function sizeGuide(): Response
    {
        return Inertia::render('Legal/SizeGuide');
    }
}
