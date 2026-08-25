import logging
import os

from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client

from app.models.order import Order

logger = logging.getLogger(__name__)


# Twilio WhatsApp Sandbox sender. The recipient must have joined the sandbox.
DEFAULT_TWILIO_WHATSAPP_FROM = "whatsapp:+14155238886"


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
    """Send a best-effort WhatsApp notification for a newly created order.

    This uses the Twilio WhatsApp Sandbox. WhatsApp delivery problems are
    intentionally swallowed so a successful customer order is never rolled
    back because of a notification failure.
    """
    account_sid = _setting("TWILIO_ACCOUNT_SID")
    auth_token = _setting("TWILIO_AUTH_TOKEN")
    admin_number = _setting("WHATSAPP_ADMIN_NUMBER")
    whatsapp_from = _setting(
        "TWILIO_WHATSAPP_FROM",
        DEFAULT_TWILIO_WHATSAPP_FROM,
    )

    if not account_sid or not auth_token or not admin_number:
        logger.warning(
            "WhatsApp notification skipped; missing Twilio settings. "
            "Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, WHATSAPP_ADMIN_NUMBER"
        )
        return False

    recipient = admin_number
    if not recipient.startswith("whatsapp:"):
        recipient = f"whatsapp:{recipient}"

    sender = whatsapp_from
    if not sender.startswith("whatsapp:"):
        sender = f"whatsapp:{sender}"

    try:
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            body=_format_order_message(order),
            from_=sender,
            to=recipient,
        )
        logger.info(
            "WhatsApp order notification sent for order #%s (SID: %s)",
            order.id,
            message.sid,
        )
        return True
    except TwilioRestException as exc:
        logger.error(
            "Twilio WhatsApp notification failed for order #%s: %s",
            order.id,
            exc,
        )
        return False
    except Exception as exc:
        logger.exception(
            "Unexpected WhatsApp notification error for order #%s: %s",
            order.id,
            exc,
        )
        return False
