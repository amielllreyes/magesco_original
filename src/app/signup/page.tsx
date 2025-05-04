"use client";

import { useState } from "react";
import { auth, db } from "@/config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🛠 Create Firestore user document
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        role: "user", // default role
        createdAt: new Date(),
      });

      console.log("Signup successful and user profile created!");
      router.push("/account"); // ✅ Redirect to account dashboard
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="p-8 flex flex-col max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      <input
        className="border p-2 mb-3 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 mb-3 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button onClick={handleSignup} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Create Account
      </button>
    </div>
  );
}
