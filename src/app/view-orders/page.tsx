"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { FiArrowLeft, FiShoppingBag, FiClock, FiUser, FiDollarSign, FiMapPin, FiShield } from "react-icons/fi";

const AdminOrdersPage = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
          // Fetch all orders
          fetchOrders();
        } else {
          router.push("/");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const ordersQuery = query(collection(db, "orders"));
      const querySnapshot = await getDocs(ordersQuery);
      const allOrders: any[] = [];
      
      querySnapshot.forEach((doc) => {
        allOrders.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Sort orders by date (newest first)
      allOrders.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightblue bg-[url('/layeredwaves.svg')]">
        <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md text-center animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightblue bg-[url('/layeredwaves.svg')]">
        <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md text-center">
          <div className="text-red-500 mb-4">
            <FiShield className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 hover:bg-blue-600 transition text-white px-6 py-2 rounded-lg font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightblue bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
            <button 
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded-lg transition"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FiShoppingBag className="w-6 h-6" />
              All Orders
            </h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          {/* Orders List */}
          <div className="p-6">
            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No orders found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {order.createdAt.toDate().toLocaleDateString()} at {order.createdAt.toDate().toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {order.status || "Processing"}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                          <FiUser className="w-3 h-3" />
                          {order.userId.substring(0, 6)}...
                        </span>
                      </div>
                    </div>
                    
                    {/* Shipping Info */}
                    <div className="p-4 bg-white border-b border-gray-100">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <FiMapPin className="text-blue-500" />
                        Shipping Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p><span className="text-gray-500">Name:</span> {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}</p>
                        <p><span className="text-gray-500">Phone:</span> {order.shippingInfo?.phone}</p>
                        <p><span className="text-gray-500">Address:</span> {order.shippingInfo?.address}</p>
                        <p><span className="text-gray-500">City/Zip:</span> {order.shippingInfo?.city}, {order.shippingInfo?.zip}</p>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="bg-gray-50 p-4">
                      <h3 className="font-medium mb-3">Items</h3>
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-12 h-12 object-cover rounded" 
                            />
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-600">₱{item.price} x {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-semibold">₱{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Summary */}
                    <div className="bg-white p-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Payment Method:</p>
                          <p className="font-medium">{order.paymentMethod || "Credit Card"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="font-semibold text-lg">₱{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;