"use client"; 

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/config/firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  title: string;
  image: string;
  price: string;
  description: string;
  quantity?: number;
}

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.error("No such product found!");
        }
      } catch (error) {
        console.error("Error loading product:", error);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <main className="flex justify-center items-center min-h-screen p-6 bg-lightblue bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden max-w-5xl w-full p-6 shadow-xl">
        {/* Product Image */}
        <div className="relative w-full md:w-1/2 p-6 flex items-center">
          <img src={product.image} alt={product.title} className="w-full h-auto object-cover rounded-lg" />
        </div>

        {/* Product Details */}
        {/* Product Details */}
<div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
  <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
  <p className="text-2xl font-semibold text-blue-600 mt-2">
    ₱{Number(product.price).toFixed(2)}
  </p>

  {/* Product Description */}
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-gray-700 text-sm">
    {product.description}
  </div>

  {/* Quantity Selector */}
  <div className="flex items-center my-4">
    <span className="mr-3 font-semibold">Quantity</span>
    <div className="flex items-center border rounded-lg">
      <button
        onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-l-lg"
      >
        -
      </button>
      <span className="px-4">{quantity}</span>
      <button
        onClick={() => setQuantity(quantity < 10 ? quantity + 1 : 10)}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-r-lg"
      >
        +
      </button>
    </div>
  </div>

  {/* Add to Cart Button */}
  <button
  onClick={() => {
    if (!product?.id) {
      console.error("Cannot add product without an ID!");
      return;
    }

    addToCart({
      id: product.id,  
      title: product.title,
      image: product.image,
      price: Number(product.price),
      description: product.description,
      quantity,
    });
  }}
  className="mt-6 flex items-center justify-center w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition hover:scale-105"
>
  <FaShoppingCart className="mr-2" /> Add to cart
</button>

</div>

      </div>
    </main>
  );
}
