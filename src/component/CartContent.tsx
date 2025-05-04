"use client";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function CartContent() {
  const { cart, removeFromCart } = useCart();
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="p-4 flex flex-col h-full">
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 flex-grow overflow-auto">
  {cart.map((item, index) => (
    <li key={item.id || `fallback-${index}`} className="flex items-center justify-between border-b pb-2">
      <div className="flex items-center gap-3">
        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
        <div>
          <p className="font-normal">{item.title}</p>
          <p className="text-gray-600">₱{item.price} each</p>
          <p className="text-gray-600">Quantity: {item.quantity}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold">₱{(Number(item.price) * item.quantity).toFixed(2)}</span>
        <button
          onClick={() => {
            removeFromCart(item.id);
            toast.success(`${item.title} removed from cart!`);
          }}
          className="text-black px-2 py-1 rounded hover:bg-red-600 transition"
        >
          Remove
        </button>
      </div>
    </li>
  ))}
</ul>


          <div className="mt-4 p-4">
            <h1 className="text-lg font-semibold">Subtotal: ₱{subtotal.toFixed(2)}</h1>
          </div>

          <div className="mt-4 p-4 flex justify-center">
            <button
              onClick={() => window.location.href = '/checkout'}
              className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg w-full max-w-xs hover:bg-blue-700 transition"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
