import logging
import os

import httpx

from app.models.order import Order

logger = logging.getLogger(__name__)


def _setting(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def _format_order_message(order: Order) -> str:
    item_lines = "\n".join(
        f"• {item.coffee_name} × {item.quantity} — ₹{float(item.line_total):.0f}"
        for item in order.items
    )

    return (
        "☕ *New CoffeeHub Order*\n\n"
        f"Order: #{order.id}\n"
        f"Customer: {order.customer_name}\n"
        f"Phone: {order.phone}\n\n"
        f"Items:\n{item_lines}\n\n"
        f"Subtotal: ₹{float(order.subtotal):.0f}\n"
        f"Delivery: ₹{float(order.delivery_fee):.0f}\n"
        f"Total: ₹{float(order.total):.0f}\n"
        f"Payment: {order.payment_method.upper()}\n"
        f"Status: {order.status.upper()}\n\n"
        f"Delivery address:\n{order.address}, {order.city} - {order.pincode}\n\n"
        "Open the CoffeeHub Admin Dashboard to manage this order."
    )


def send_new_order_notification(order: Order) -> bool:
    """Send an admin WhatsApp notification when WhatsApp Cloud API is configured.

    The function intentionally fails soft: WhatsApp delivery problems must never
    make an already-created customer order fail.
    """
    enabled = _setting("WHATSAPP_ENABLED", "false").lower() == "true"
    access_token = _setting("WHATSAPP_ACCESS_TOKEN")
    phone_number_id = _setting("WHATSAPP_PHONE_NUMBER_ID")
    admin_number = _setting("WHATSAPP_ADMIN_NUMBER")
    api_version = _setting("WHATSAPP_API_VERSION", "v21.0")

    if not enabled:
        return False

    missing = [
        name
        for name, value in (
            ("WHATSAPP_ACCESS_TOKEN", access_token),
            ("WHATSAPP_PHONE_NUMBER_ID", phone_number_id),
            ("WHATSAPP_ADMIN_NUMBER", admin_number),
        )
        if not value
    ]
    if missing:
        logger.warning("WhatsApp notification skipped; missing settings: %s", ", ".join(missing))
        return False

    url = f"https://graph.facebook.com/{api_version}/{phone_number_id}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": admin_number,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": _format_order_message(order),
        },
    }

    try:
        response = httpx.post(
            url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=15.0,
        )
        response.raise_for_status()
        logger.info("WhatsApp order notification sent for order #%s", order.id)
        return True
    except httpx.HTTPError as exc:
        logger.error("WhatsApp order notification failed for order #%s: %s", order.id, exc)
        return False
