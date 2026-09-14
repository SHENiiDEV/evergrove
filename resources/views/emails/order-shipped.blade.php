<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Shipped #{{ $order->order_number }}</title>
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
        .shipped-banner {
            background-color: #2F4636;
            color: #FFFFFF;
            padding: 24px;
            text-align: center;
        }
        .shipped-banner h2 {
            margin: 0 0 6px 0;
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .shipped-banner p {
            margin: 0;
            font-size: 14px;
            color: #E2EFE5;
        }
        .content {
            padding: 32px 24px;
        }
        .tracking-box {
            background-color: #F7F7F5;
            border: 1px dashed #B8B8B0;
            border-radius: 6px;
            padding: 20px;
            text-align: center;
            margin-bottom: 28px;
        }
        .tracking-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666660;
            margin: 0 0 6px 0;
        }
        .tracking-number {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 1px;
            margin: 0;
            color: #191919;
        }
        .btn-track {
            display: inline-block;
            background-color: #191919;
            color: #FFFFFF;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 12px 28px;
            border-radius: 4px;
            margin-top: 14px;
        }
        .footer {
            background-color: #F7F7F5;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #888880;
            border-top: 1px solid #E5E5E0;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1 class="logo">EverGrove</h1>
            </div>

            <div class="shipped-banner">
                <h2>📦 Your order is on the way!</h2>
                <p>Standard EU Tracked Delivery • Estimated 3–7 Business Days</p>
            </div>

            <div class="content">
                <p style="font-size: 16px; margin-top: 0;">Hi {{ $order->first_name }},</p>
                <p style="font-size: 15px; color: #4A4A45; line-height: 1.6;">
                    Great news! Your package for order <strong>#{{ $order->order_number }}</strong> has been carefully packed in plastic-free recycled packaging and handed over to the courier.
                </p>

                <div class="tracking-box">
                    <p class="tracking-label">Tracking Number</p>
                    <p class="tracking-number">{{ $trackingNumber }}</p>
                    <a href="https://www.dhl.com/en/express/tracking.html" class="btn-track" target="_blank">Track Package</a>
                </div>

                <div style="background-color: #F7F7F5; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                    <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin: 0 0 8px 0; color: #666660;">Shipping To:</p>
                    <p style="font-size: 14px; color: #191919; margin: 0; line-height: 1.5;">
                        <strong>{{ $order->full_name }}</strong><br>
                        {{ $order->shipping_address_line1 }}<br>
                        {{ $order->city }}, {{ $order->postal_code }}, {{ $order->country_name }}
                    </p>
                </div>

                <p style="font-size: 14px; color: #666660; margin: 0; text-align: center;">
                    If you have any questions, reply directly to this email or reach us at <a href="mailto:support@evergrove.com" style="color: #191919;">support@evergrove.com</a>.
                </p>
            </div>

            <div class="footer">
                <p style="margin: 0 0 8px 0;">© {{ date('Y') }} EverGrove Apparel. 🌲 10 Trees Planted Per Item.</p>
            </div>
        </div>
    </div>
</body>
</html>
