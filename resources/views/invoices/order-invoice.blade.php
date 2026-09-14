<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $order->order_number }}</title>
    <style>
        @page {
            margin: 28px 32px;
        }
        body {
            font-family: Helvetica, Arial, sans-serif;
            color: #191919;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        .header-table {
            width: 100%;
            border-bottom: 2px solid #191919;
            padding-bottom: 16px;
            margin-bottom: 20px;
        }
        .brand-title {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0;
            color: #191919;
        }
        .brand-sub {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #2F4636;
            font-weight: bold;
            margin: 4px 0 0 0;
        }
        .company-info {
            font-size: 10px;
            color: #555550;
            text-align: right;
            line-height: 1.35;
        }
        .invoice-banner {
            background-color: #F7F7F5;
            border: 1px solid #E5E5E0;
            padding: 12px 16px;
            margin-bottom: 20px;
        }
        .invoice-title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0;
            color: #191919;
        }
        .meta-table {
            width: 100%;
            margin-top: 6px;
        }
        .meta-table td {
            font-size: 11px;
        }
        .address-table {
            width: 100%;
            margin-bottom: 22px;
        }
        .address-box {
            width: 48%;
            vertical-align: top;
            background-color: #FAFAF8;
            border: 1px solid #ECECE8;
            padding: 12px 14px;
        }
        .box-title {
            font-size: 10px;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 0.8px;
            color: #666660;
            margin: 0 0 6px 0;
            border-bottom: 1px solid #E5E5E0;
            padding-bottom: 4px;
        }
        .box-content {
            font-size: 11px;
            color: #222220;
            line-height: 1.45;
            margin: 0;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table th {
            background-color: #191919;
            color: #FFFFFF;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 8px 10px;
            text-align: left;
        }
        .items-table td {
            padding: 10px 10px;
            border-bottom: 1px solid #E5E5E0;
            font-size: 11px;
            vertical-align: middle;
        }
        .item-title {
            font-weight: bold;
            color: #191919;
            margin: 0 0 2px 0;
        }
        .item-meta {
            font-size: 10px;
            color: #777770;
            margin: 0;
        }
        .totals-table {
            width: 100%;
            margin-bottom: 24px;
        }
        .totals-table td {
            padding: 4px 0;
            font-size: 11px;
        }
        .grand-total {
            border-top: 2px solid #191919;
            padding-top: 8px !important;
            font-size: 14px !important;
            font-weight: bold;
        }
        .tree-badge {
            background-color: #2F4636;
            color: #FFFFFF;
            padding: 10px 16px;
            text-align: center;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
        }
        .footer-note {
            text-align: center;
            font-size: 9px;
            color: #888880;
            border-top: 1px solid #E5E5E0;
            padding-top: 14px;
            line-height: 1.5;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <table class="header-table">
        <tr>
            <td style="vertical-align: top; width: 50%;">
                <h1 class="brand-title">EVERGROVE</h1>
                <p class="brand-sub">Earth-First Sustainable Apparel</p>
            </td>
            <td style="vertical-align: top; width: 50%;" class="company-info">
                <strong>{{ config('shop.company.name', 'EverGrove Retail Ltd') }}</strong><br>
                Company No: {{ config('shop.company.number', '14892341') }}<br>
                {{ config('shop.company.address', '71-75 Shelton Street, London, WC2H 9JQ, UK') }}<br>
                Email: {{ config('shop.company.email', 'info@ever-grove.co.uk') }}<br>
                Web: https://ever-grove.co.uk
            </td>
        </tr>
    </table>

    <!-- Invoice Details Banner -->
    <div class="invoice-banner">
        <table style="width: 100%;">
            <tr>
                <td>
                    <h2 class="invoice-title">Official Tax Invoice</h2>
                </td>
                <td style="text-align: right;">
                    <span style="display: inline-block; background-color: #2F4636; color: #FFFFFF; font-size: 10px; font-weight: bold; padding: 4px 8px; text-transform: uppercase;">
                        Payment Status: {{ strtoupper($order->payment_status ?? 'PAID') }}
                    </span>
                </td>
            </tr>
        </table>

        <table class="meta-table">
            <tr>
                <td style="width: 25%;">Invoice / Order #:</td>
                <td style="width: 25%;"><strong>{{ $order->order_number }}</strong></td>
                <td style="width: 25%;">Payment Method:</td>
                <td style="width: 25%;"><strong>Credit / Debit Card (Online)</strong></td>
            </tr>
            <tr>
                <td>Date of Issue:</td>
                <td><strong>{{ ($order->created_at ?? now())->format('d F Y') }}</strong></td>
                <td>Currency:</td>
                <td><strong>EUR (€)</strong></td>
            </tr>
        </table>
    </div>

    <!-- Bill To / Ship To Addresses -->
    <table class="address-table">
        <tr>
            <td class="address-box">
                <p class="box-title">Bill &amp; Ship To Customer</p>
                <p class="box-content">
                    <strong>{{ $order->full_name }}</strong><br>
                    {{ $order->shipping_address_line1 }}
                    @if($order->shipping_address_line2)<br>{{ $order->shipping_address_line2 }}@endif
                    <br>{{ $order->city }}, {{ $order->postal_code }}
                    <br>{{ $order->country_name }}
                    <br>Email: {{ $order->email }}
                    @if($order->phone)<br>Phone: {{ $order->phone }}@endif
                </p>
            </td>
            <td style="width: 4%;"></td>
            <td class="address-box">
                <p class="box-title">Fulfillment &amp; Delivery Method</p>
                <p class="box-content">
                    <strong>{{ $order->shipping_method_name }}</strong><br>
                    Carrier: Standard EU Tracked Parcel Post<br>
                    Transit Time: 3–7 Business Days<br>
                    Carbon Neutral Delivery • 100% Recycled Packaging
                </p>
            </td>
        </tr>
    </table>

    <!-- Line Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 50%;">Description</th>
                <th style="width: 15%; text-align: center;">SKU</th>
                <th style="width: 10%; text-align: center;">Qty</th>
                <th style="width: 12%; text-align: right;">Unit Price</th>
                <th style="width: 13%; text-align: right;">Total (EUR)</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->items as $item)
            <tr>
                <td>
                    <p class="item-title">{{ $item->title }}</p>
                    <p class="item-meta">
                        @if($item->color_name) Colour: {{ $item->color_name }} • @endif
                        Size: {{ $item->size }}
                    </p>
                </td>
                <td style="text-align: center; color: #666660; font-family: monospace; font-size: 10px;">
                    {{ $item->sku ?? 'EVG-SKU' }}
                </td>
                <td style="text-align: center; font-weight: bold;">
                    {{ $item->quantity }}
                </td>
                <td style="text-align: right;">
                    €{{ number_format($item->price, 2) }}
                </td>
                <td style="text-align: right; font-weight: bold;">
                    €{{ number_format($item->total, 2) }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totals Table -->
    <table class="totals-table">
        <tr>
            <td style="width: 60%;"></td>
            <td style="width: 25%; color: #666660;">Subtotal:</td>
            <td style="width: 15%; text-align: right; font-weight: bold;">€{{ number_format($order->subtotal, 2) }}</td>
        </tr>
        @if ($order->discount_amount > 0)
        <tr>
            <td></td>
            <td style="color: #7E3B2B;">Discount ({{ $order->coupon_code }}):</td>
            <td style="text-align: right; color: #7E3B2B; font-weight: bold;">-€{{ number_format($order->discount_amount, 2) }}</td>
        </tr>
        @endif
        <tr>
            <td></td>
            <td style="color: #666660;">Standard EU Delivery:</td>
            <td style="text-align: right; font-weight: bold;">
                @if ($order->shipping_cost == 0)
                    <span style="color: #2F4636;">FREE</span>
                @else
                    €{{ number_format($order->shipping_cost, 2) }}
                @endif
            </td>
        </tr>
        <tr>
            <td></td>
            <td style="color: #666660; font-size: 10px;">VAT Included:</td>
            <td style="text-align: right; font-size: 10px; color: #666660;">€{{ number_format($order->total * 0.20 / 1.20, 2) }}</td>
        </tr>
        <tr class="grand-total">
            <td></td>
            <td style="text-transform: uppercase;">Total Paid:</td>
            <td style="text-align: right; color: #191919;">€{{ number_format($order->total, 2) }}</td>
        </tr>
    </table>

    <!-- Reforestation Badge -->
    <div class="tree-badge">
        🌲 Official Impact Certificate: This order funded the planting of {{ $order->trees_planted }} Trees.
    </div>

    <!-- Footer -->
    <div class="footer-note">
        Thank you for choosing EverGrove and supporting sustainable fashion and global reforestation.<br>
        For inquiries or customer support, please contact <strong>{{ config('shop.company.email', 'info@ever-grove.co.uk') }}</strong>.<br>
        {{ config('shop.company.name', 'EverGrove Retail Ltd') }} • Registered in the United Kingdom • Company No. {{ config('shop.company.number', '14892341') }}
    </div>

</body>
</html>
