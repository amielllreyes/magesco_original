"use client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc, collection, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
    message: ""
  });

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserData(userData);

          const nameParts = userData.name?.split(' ') || [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          setFormData({
            firstName,
            lastName,
            address: userData.address || "",
            city: userData.city || "",
            zip: userData.zip || "",
            phone: userData.phone || "",
            message: ""
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createOrder = (data: any, actions: any) => {
    if (!formData.firstName || !formData.lastName || !formData.address ||
      !formData.city || !formData.zip || !formData.phone) {
      throw new Error("Please fill in all required shipping information");
    }

    return actions.order.create({
      purchase_units: [{
        amount: {
          value: subtotal.toFixed(2),
          currency_code: "PHP"
        },
        description: `Order from ${formData.firstName} ${formData.lastName}`,
        shipping: {
          name: {
            full_name: `${formData.firstName} ${formData.lastName}`
          },
          address: {
            address_line_1: formData.address,
            admin_area_2: formData.city,
            postal_code: formData.zip,
            country_code: "PH"
          }
        }
      }]
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      
      if (!auth.currentUser) throw new Error("User not logged in");

      const orderRef = doc(collection(db, "orders"));
      await setDoc(orderRef, {
        userId: auth.currentUser.uid,
        items: cart,
        total: subtotal,
        shippingInfo: formData,
        status: "Processing",
        paymentMethod: "PayPal",
        paypalTransactionId: details.id,
        createdAt: new Date()
      });

      clearCart();
      router.push("/payment-success");
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("❌ Payment processing failed. Please try again.");
    }
  };

  const onError = (err: any) => {
    console.error("PayPal error:", err);
    alert("❌ Payment failed. Please try again or use another payment method.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-12 bg-lightblue bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover">
      <h1 className="text-6xl sm:text-8xl font-bold from-blue-500 to-slate-400 bg-gradient-to-br text-transparent bg-clip-text mb-10">
        ORDER CONFIRMATION
      </h1>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 w-full max-w-6xl">
        <div className="bg-white bg-opacity-40 backdrop-blur-md p-8 rounded-xl shadow-lg w-full">
          <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <label className="flex flex-col w-1/2">
                <span className="text-sm font-medium text-gray-700">First Name *</span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="p-2 border border-gray-300 rounded-md"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="flex flex-col w-1/2">
                <span className="text-sm font-medium text-gray-700">Last Name *</span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="p-2 border border-gray-300 rounded-md"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Address *</span>
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="p-2 border border-gray-300 rounded-md"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <div className="flex space-x-4">
              <label className="flex flex-col w-1/2">
                <span className="text-sm font-medium text-gray-700">City *</span>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="p-2 border border-gray-300 rounded-md"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="flex flex-col w-1/4">
                <span className="text-sm font-medium text-gray-700">Zip Code *</span>
                <input
                  type="text"
                  name="zip"
                  placeholder="Zip"
                  className="p-2 border border-gray-300 rounded-md"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Phone Number *</span>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="p-2 border border-gray-300 rounded-md"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Special Instructions</span>
              <textarea
                name="message"
                className="w-full h-32 px-4 py-3 mt-2 rounded-lg bg-white bg-opacity-60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Type your message here"
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </label>
          </div>
        </div>

        <div className="bg-white bg-opacity-40 backdrop-blur-md p-8 rounded-xl shadow-lg w-full">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">No items in cart.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p className="text-lg font-medium">{item.title}</p>
                      <p className="text-gray-600">₱{item.price} x {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold">₱{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">₱0.00</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-4">
              <span>Total:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 w-full">
            {cart.length > 0 && (
              <PayPalScriptProvider 
                options={{ 
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb", 
                  currency: "PHP",
                  intent: "capture"
                }}
              >
                <PayPalButtons 
                  style={{ 
                    layout: "vertical",
                    color: "blue",
                    shape: "rect",
                    label: "paypal"
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}