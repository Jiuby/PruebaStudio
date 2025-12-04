from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_order_confirmation_email(order):
    subject = f'Confirmación de Orden #{order.id} - Caramel Dye'
    from_email = settings.DEFAULT_FROM_EMAIL
    to = order.customer_email

    items_html = ""
    for item in order.items.all():
        items_html += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #333; color: #e5e5e5;">
                {item.name} <br>
                <span style="font-size: 12px; color: #888;">Talla: {item.size}</span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #333; color: #e5e5e5; text-align: center;">{item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #333; color: #e5e5e5; text-align: right;">${item.price:,.0f}</td>
        </tr>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #111111; }}
            .header {{ background-color: #000000; padding: 40px 20px; text-align: center; border-bottom: 1px solid #333; }}
            .logo {{ font-size: 24px; font-weight: 900; letter-spacing: -1px; color: #ffffff; text-transform: uppercase; font-style: italic; text-decoration: none; }}
            .content {{ padding: 40px 20px; }}
            .order-info {{ margin-bottom: 30px; border: 1px solid #333; padding: 20px; border-radius: 4px; background-color: #1a1a1a; }}
            .table {{ width: 100%; border-collapse: collapse; margin-bottom: 30px; }}
            .footer {{ background-color: #000000; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #333; }}
            .button {{ display: inline-block; padding: 15px 30px; background-color: #ffffff; color: #000000; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; margin-top: 20px; }}
            h1 {{ font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #ffffff; }}
            p {{ line-height: 1.6; color: #cccccc; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <a href="https://carameldye.com" class="logo">Caramel Dye</a>
            </div>
            <div class="content">
                <h1>¡Gracias por tu compra!</h1>
                <p>Hola {order.customer_name},</p>
                <p>Hemos recibido tu pedido y lo estamos procesando. Aquí están los detalles:</p>
                
                <div class="order-info">
                    <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Orden #</p>
                    <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">{order.id}</p>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #555; color: #888; font-size: 12px; text-transform: uppercase;">Producto</th>
                            <th style="text-align: center; padding: 10px; border-bottom: 1px solid #555; color: #888; font-size: 12px; text-transform: uppercase;">Cant.</th>
                            <th style="text-align: right; padding: 10px; border-bottom: 1px solid #555; color: #888; font-size: 12px; text-transform: uppercase;">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: bold; color: #ffffff;">Total</td>
                            <td style="padding: 15px 10px; text-align: right; font-weight: bold; color: #ffffff;">${order.total:,.0f}</td>
                        </tr>
                    </tfoot>
                </table>

                <p>Enviaremos tus productos a:</p>
                <p style="color: #ffffff;">
                    {order.shipping_details.get('address')}<br>
                    {order.shipping_details.get('city')}, {order.shipping_details.get('zip')}<br>
                    Colombia
                </p>

                <div style="text-align: center;">
                    <a href="https://carameldye.com/account/orders" class="button">Ver mi Pedido</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2025 Caramel Dye. Medellín, Colombia.</p>
                <p>¿Necesitas ayuda? Responde a este correo.</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_content = strip_tags(html_content)
    
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
