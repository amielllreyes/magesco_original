import emailjs from 'emailjs-com';
import twilio from 'twilio';

// EmailJS configuration (sign up at https://www.emailjs.com/)
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_USER_ID = 'your_user_id';

// Twilio client-side (using REST API directly)
const TWILIO_ACCOUNT_SID = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER;

type OrderDetails = {
  orderId: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  total: string;
  shipping: {
    address: string;
    city: string;
    name: string;
  };
};

export async function sendEmailReceipt(email: string, order: OrderDetails) {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: email,
        order_id: order.orderId,
        customer_name: order.shipping.name,
        order_total: order.total,
        order_items: order.items.map(item => 
          `${item.title} (x${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}`
        ).join('\n'),
        shipping_address: `${order.shipping.address}, ${order.shipping.city}`
      },
      EMAILJS_USER_ID
    );
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email receipt');
  }
}

export async function sendSMSReceipt(mobile: string, order: OrderDetails) {
  try {
    // Note: This exposes your Twilio auth token to the client!
    // Only use this for development or with limited-scope tokens
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`
        },
        body: new URLSearchParams({
          To: `+63${mobile.substring(1)}`,
          From: TWILIO_PHONE_NUMBER!,
          Body: `Thanks for your order #${order.orderId}! Total: ₱${order.total}`
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw new Error('Failed to send SMS receipt');
  }
}