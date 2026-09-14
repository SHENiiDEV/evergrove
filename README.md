# EverGrove 🌲

Earth-First Sustainable Apparel & Accessories for Women & Men.
Made with Hemp, Organic Cotton, Recycled Polyester & Tencel. Every Item Plants 10 Trees.

## Tech Stack
- **Backend:** Laravel 13 (PHP 8.4)
- **Frontend:** React 19 + Inertia.js + Tailwind CSS + Lucide Icons
- **Database:** SQLite
- **Deployment:** Nginx + PHP 8.4-FPM + Certbot SSL for [ever-grove.co.uk](https://ever-grove.co.uk)

## Features
- Full catalog of 750+ eco-friendly products & 2,900+ variants
- Dynamic filtering by Category, Gender, Size, Color, Price & Eco-friendly Materials
- Sliding interactive Cart Drawer & Coupons (`EVER10`, `FOREST20`, `PLANT10`, `FREESHIP`)
- Streamlined 1-page Guest Checkout with EU Standard Shipping (3-7 days)
- Automatic tree planting impact calculations & certificates
- Responsive HTML Email notifications (Order Confirmation & Shipping)
- Automated deployment scripts in `deploy/`

## Local Development
```bash
composer install
npm install
php artisan migrate --seed
npm run dev
php artisan serve
```

## Production Deployment
See [deploy/ever-grove.co.uk.conf](deploy/ever-grove.co.uk.conf) and [deploy/deploy.sh](deploy/deploy.sh).
