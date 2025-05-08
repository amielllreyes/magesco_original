"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { FiBox, FiShoppingBag, FiLogOut, FiUser, FiShield } from "react-icons/fi";

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightblue bg-[url('/layeredwaves.svg')]">
        <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md text-center animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg mt-6"></div>
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
    <div className="min-h-screen flex items-center justify-center bg-[url('/layeredwaves.svg')] bg-no-repeat bg-bottom bg-cover px-4 py-12">
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden w-full max-w-md">

        <div className="bg-blue-600 text-white p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <FiUser className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-blue-100 mt-1">Welcome back, <span className="font-medium">{user?.email}</span></p>
        </div>


        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => router.push("/productmanager")}
              className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all text-blue-700 px-6 py-4 rounded-lg font-medium"
            >
              <div className="flex items-center">
                <FiBox className="w-5 h-5 mr-3" />
                <span>Manage Products</span>
              </div>
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => router.push("/view-orders")}
              className="flex items-center justify-between bg-green-50 hover:bg-green-100 border border-green-200 transition-all text-green-700 px-6 py-4 rounded-lg font-medium"
            >
              <div className="flex items-center">
                <FiShoppingBag className="w-5 h-5 mr-3" />
                <span>View Orders</span>
              </div>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => router.push("/adminmessages")}
              className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all text-blue-700 px-6 py-4 rounded-lg font-medium"
            >
              <div className="flex items-center">
                <FiBox className="w-5 h-5 mr-3" />
                <span>Admin Messages</span>
              </div>
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => router.push("/manageuser")}
              className="flex items-center justify-between bg-green-50 hover:bg-green-100 border border-green-200 transition-all text-green-700 px-6 py-4 rounded-lg font-medium"
            >
              <div className="flex items-center">
                <FiShoppingBag className="w-5 h-5 mr-3" />
                <span>Manage Users</span>
              </div>
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button
            onClick={async () => {
              await auth.signOut();
              router.push("/adminlogin");
            }}
            className="flex items-center justify-center w-full mt-8 bg-red-50 hover:bg-red-100 border border-red-200 transition-all text-red-600 px-6 py-3 rounded-lg font-medium"
          >
            <FiLogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;