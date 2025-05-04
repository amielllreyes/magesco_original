"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { FiEdit2, FiTrash2, FiSave, FiPlus, FiX, FiCheck } from "react-icons/fi";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ title: "", price: "", image: "", description: "" });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  async function addProduct() {
    if (!newProduct.title || !newProduct.price || !newProduct.image) return;
    
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "products"), {
        title: newProduct.title,
        price: Number(newProduct.price),
        image: newProduct.image,
        description: newProduct.description,
      });

      setProducts([
        ...products,
        {
          id: docRef.id,
          ...newProduct,
          price: Number(newProduct.price),
        },
      ]);
      setNewProduct({ title: "", price: "", image: "", description: "" });
      setIsAdding(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: string) {
    setLoading(true);
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, editedProduct);
      setProducts(products.map(p => (p.id === id ? { ...p, ...editedProduct } : p)));
      setEditIndex(null);
      setEditedProduct({});
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter(p => p.id !== id));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Product Manager</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          {isAdding ? <FiX size={18} /> : <FiPlus size={18} />}
          {isAdding ? "Cancel" : "Add Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {isAdding && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">New Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Product title"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Product price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Product description"
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={addProduct}
            disabled={loading || !newProduct.title || !newProduct.price || !newProduct.image}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiCheck size={18} />
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      )}

      {/* Products List */}
      {loading && products.length === 0 ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border p-4 rounded-lg bg-white shadow animate-pulse h-32"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found. Add your first product!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {products.map((product, index) => (
            <li key={product.id} className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border border-gray-200" 
                  />
                </div>
                
                <div className="flex-grow">
                  {editIndex === index ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Title</label>
                        <input
                          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                          value={editedProduct.title || product.title}
                          onChange={(e) => setEditedProduct({ ...editedProduct, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Price</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                          value={editedProduct.price || product.price}
                          onChange={(e) => setEditedProduct({ ...editedProduct, price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Image URL</label>
                        <input
                          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                          value={editedProduct.image || product.image}
                          onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Description</label>
                        <textarea
                          className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                          rows={2}
                          value={editedProduct.description || product.description}
                          onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
                      <p className="text-blue-600 font-medium">₱{Number(product.price).toFixed(2)}</p>
                      {product.description && (
                        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-end">
                  {editIndex === index ? (
                    <button
                      onClick={() => handleUpdate(product.id)}
                      disabled={loading}
                      className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition disabled:opacity-50"
                    >
                      <FiSave size={14} />
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditIndex(index);
                        setEditedProduct(product);
                      }}
                      className="flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm transition"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteProduct(product.id)}
                    disabled={loading}
                    className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition disabled:opacity-50"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}