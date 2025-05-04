"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/config/firebaseConfig";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  totalCartItems: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (!user) {
       
        setCart([]);
        localStorage.removeItem("cart");
      } else {
        
        const storedCart = localStorage.getItem(`cart_${user.uid}`);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      }
    });

    return () => unsubscribe();
  }, []);

 
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`cart_${currentUser.uid}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (item: CartItem) => {
    if (!currentUser) {
      router.push(`/userlogin?redirect=${window.location.pathname}`);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, { ...item }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        totalCartItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}