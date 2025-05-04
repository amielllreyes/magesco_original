"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { db } from "@/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";


interface Product {
  id: string;
  title: string;
  image: string;
  price: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productsList);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col items-center min-h-screen p-12 bg-lightblue bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="p-4">
              
              </CardHeader>
              <CardContent className="p-4 space-y-2">
              
                
              </CardContent>
              <CardFooter className="p-4 flex justify-between">
                
              </CardFooter>
            </Card>
          ))}
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-12 bg-lightblue bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover">
        <div className="bg-white/90 p-8 rounded-xl shadow-lg max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-12 bg-lightblue bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover">
      {products.length === 0 ? (
        <div className="bg-white/90 p-8 rounded-xl shadow-lg max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Products Available</h2>
          <p className="text-gray-700">Check back later for new products.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="flex flex-col transform duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md rounded-lg 
              bg-white/95 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-slate-400/10 transition-all h-full"
            >
              <CardHeader className="p-4 pb-0">
                {product.image ? (
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-t-lg">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold mb-2 line-clamp-2" title={product.title}>
                  {product.title}
                </CardTitle>
                <p className="text-gray-600 text-sm line-clamp-3" title={product.description}>
                  {product.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center border-t border-gray-100">
                <span className="font-bold text-blue-600">₱{product.price}</span>
                <Link href={`/products/${product.id}`} className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition whitespace-nowrap">
                    View Details
                  </button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}