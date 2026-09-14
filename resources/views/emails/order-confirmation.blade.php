<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation #{{ $order->order_number }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #F7F7F5;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #191919;
            line-height: 1.5;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #F7F7F5;
            padding: 40px 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #E5E5E0;
        }
        .header {
            background-color: #191919;
            color: #FFFFFF;
            padding: 32px 24px;
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin: 0;
            color: #FFFFFF;
        }
        .tree-badge {
            background-color: #2F4636;
            color: #FFFFFF;
            padding: 16px 24px;
            text-align: center;
            font-size: 15px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 32px 24px;
        }
        .order-title {
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .order-meta {
            color: #666660;
            font-size: 14px;
            margin-bottom: 24px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }
        .items-table th {
            text-align: left;
            padding: 12px 0;
            border-bottom: 2px solid #191919;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666660;
        }
        .items-table td {
            padding: 16px 0;
            border-bottom: 1px solid #E5E5E0;
            vertical-align: middle;
        }
        .product-img {
            width: 64px;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
            background-color: #F0F0EC;
            margin-right: 16px;
            display: inline-block;
            vertical-align: middle;
        }
        .product-info {
            display: inline-block;
            vertical-align: middle;
            max-width: 260px;
        }
        .product-title {
            font-size: 14px;
            font-weight: 600;
            margin: 0 0 4px 0;
        }
        .product-variant {
            font-size: 13px;
            color: #666660;
            margin: 0;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 32px;
        }
        .summary-table td {
            padding: 6px 0;
            font-size: 14px;
        }
        .summary-total {
            font-size: 18px;
            font-weight: 700;
            border-top: 2px solid #191919;
            padding-top: 12px !important;
        }
        .address-box {
            background-color: #F7F7F5;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .address-title {
            font-size: 13px;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 1px;
            margin-top: 0;
            margin-bottom: 12px;
            color: #191919;
        }
        .address-text {
            font-size: 14px;
            color: #4A4A45;
            margin: 0;
            line-height: 1.6;
        }
        .footer {
            background-color: #F7F7F5;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #888880;
            border-top: 1px solid #E5E5E0;
        }
        .footer a {
            color: #191919;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1 class="logo">EverGrove</h1>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #A0A09A; letter-spacing: 1px;">EARTH-FIRST APPAREL & ACCESSORIES</p>
            </div>

            <!-- Tree Planting Badge -->
            <div class="tree-badge">
                🌲 Thank you! This order planted <strong>{{ $order->trees_planted }} Trees</strong>.
            </div>

            <!-- Main Content -->
            <div class="content">
                <h2 class="order-title">Thank you for your order, {{ $order->first_name }}!</h2>
                <p class="order-meta">
                    Order <strong>#{{ $order->order_number }}</strong> • {{ ($order->created_at ?? now())->format('M d, Y') }} • Payment Status: <strong>{{ ucfirst($order->payment_status) }}</strong>
                </p>

                <!-- Items Table -->
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($order->items as $item)
                        <tr>
                            <td>
                                @if ($item->image_src)
                                    <img src="{{ $item->image_src }}" alt="{{ $item->title }}" class="product-img">
                                @endif
                                <div class="product-info">
                                    <p class="product-title">{{ $item->title }}</p>
                                    <p class="product-variant">
                                        @if ($item->color_name) {{ $item->color_name }} • @endif
                                        Size: {{ $item->size }}
                                    </p>
                                </div>
                            </td>
                            <td style="text-align: center; font-size: 14px; font-weight: 500;">
                                {{ $item->quantity }}
                            </td>
                            <td style="text-align: right; font-size: 14px; font-weight: 600;">
                                €{{ number_format($item->total, 2) }}
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>

                <!-- Summary Breakdown -->
                <table class="summary-table">
                    <tr>
                        <td style="color: #666660;">Subtotal</td>
                        <td style="text-align: right; font-weight: 500;">€{{ number_format($order->subtotal, 2) }}</td>
                    </tr>
                    @if ($order->discount_amount > 0)
                    <tr>
                        <td style="color: #7E3B2B;">Discount ({{ $order->coupon_code }})</td>
                        <td style="text-align: right; color: #7E3B2B; font-weight: 600;">-€{{ number_format($order->discount_amount, 2) }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td style="color: #666660;">Standard Shipping (EU 3–7 days)</td>
                        <td style="text-align: right; font-weight: 500;">
                            @if ($order->shipping_cost == 0)
                                <span style="color: #2F4636; font-weight: 600;">FREE</span>
                            @else
                                €{{ number_format($order->shipping_cost, 2) }}
                            @endif
                        </td>
                    </tr>
                    <tr class="summary-total">
                        <td>Total (EUR)</td>
                        <td style="text-align: right;">€{{ number_format($order->total, 2) }}</td>
                    </tr>
                </table>

                <!-- Shipping Address -->
                <div class="address-box">
                    <h3 class="address-title">📦 Delivery Address</h3>
                    <p class="address-text">
                        <strong>{{ $order->full_name }}</strong><br>
                        {{ $order->shipping_address_line1 }}
                        @if ($order->shipping_address_line2) <br>{{ $order->shipping_address_line2 }} @endif
                        <br>{{ $order->city }}, {{ $order->postal_code }}
                        <br>{{ $order->country_name }}
                        @if ($order->phone) <br>Phone: {{ $order->phone }} @endif
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 13px; color: #666660;">
                        🚚 Estimated Delivery: <strong>3–7 Business Days</strong> (EU Standard Tracked)
                    </p>
                </div>

                <p style="font-size: 14px; color: #666660; margin: 0; text-align: center;">
                    Questions about your order? Contact us anytime at <a href="mailto:support@evergrove.com" style="color: #191919;">support@evergrove.com</a>.
                </p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p style="margin: 0 0 8px 0;">© {{ date('Y') }} EverGrove Apparel. Crafted with Hemp, Organic Cotton & Tencel.</p>
                <p style="margin: 0;">Together, we've planted over 120 million trees worldwide.</p>
            </div>
        </div>
    </div>
</body>
</html>
