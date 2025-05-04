"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiEdit, FiSave, FiLogOut, FiUser, FiMapPin, FiPhone, FiMail, FiShoppingBag, FiClock } from "react-icons/fi";

export default function AccountPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [tempData, setTempData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile data
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
          setTempData(userDocSnap.data());
        } else {
          const newUserData = {
            email: user.email,
            name: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            phone: "",
            role: "user",
            createdAt: new Date(),
          };
          await setDoc(userDocRef, newUserData);
          setUserData(newUserData);
          setTempData(newUserData);
        }

        // Fetch user's orders
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(ordersQuery);
        const userOrders: any[] = [];
        
        querySnapshot.forEach((doc) => {
          userOrders.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Sort orders by date (newest first)
        userOrders.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
        setOrders(userOrders);
        setOrdersLoading(false);
      } else {
        router.push("/userlogin");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleEdit = () => {
    setEditing(true);
    setTempData({ ...userData });
  };

  const handleCancel = () => {
    setEditing(false);
    setTempData({ ...userData });
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    try {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDoc, tempData);
      setUserData(tempData);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/userlogin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-8 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FiUser className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{userData?.name || "Your Profile"}</h1>
                  <p className="text-blue-100">{userData?.email}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                {editing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-white rounded-md text-white hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <FiSave className="w-4 h-4" />
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition flex items-center gap-2"
                    >
                    <FiEdit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-white rounded-md text-white hover:bg-white/10 transition flex items-center gap-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">Personal Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={tempData?.name || ""}
                          onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-white rounded-md">{userData?.name || "Not provided"}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md">
                        <FiMail className="text-gray-500" />
                        <span>{userData?.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                      {editing ? (
                        <input
                          type="tel"
                          value={tempData?.phone || ""}
                          onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-white rounded-md flex items-center gap-2">
                          <FiPhone className="text-gray-500" />
                          {userData?.phone || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information Column */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">Address Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                      {editing ? (
                        <input
                          type="text"
                          value={tempData?.address || ""}
                          onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-white rounded-md flex items-center gap-2">
                          <FiMapPin className="text-gray-500" />
                          {userData?.address || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                        {editing ? (
                          <input
                            type="text"
                            value={tempData?.city || ""}
                            onChange={(e) => setTempData({ ...tempData, city: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-white rounded-md">{userData?.city || "Not provided"}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">State/Region</label>
                        {editing ? (
                          <input
                            type="text"
                            value={tempData?.state || ""}
                            onChange={(e) => setTempData({ ...tempData, state: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="px-3 py-2 bg-white rounded-md">{userData?.state || "Not provided"}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">ZIP Code</label>
                      {editing ? (
                        <input
                          type="text"
                          value={tempData?.zip || ""}
                          onChange={(e) => setTempData({ ...tempData, zip: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-white rounded-md">{userData?.zip || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History Column */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <FiShoppingBag className="text-blue-500" />
                    Order History
                  </h2>

                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                            <div>
                              <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                {order.createdAt.toDate().toLocaleDateString()} at {order.createdAt.toDate().toLocaleTimeString()}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {order.status || "Completed"}
                            </span>
                          </div>
                          
                          <div className="bg-gray-50 p-4">
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
                          
                          <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center">
                            <p className="text-sm text-gray-600">Payment Method: {order.paymentMethod || "Credit Card"}</p>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Total</p>
                              <p className="font-semibold text-lg">₱{order.total.toFixed(2)}</p>
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
        </div>
      </div>
    </div>
  );
}