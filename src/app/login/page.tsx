"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Login successful!");
    router.replace("/");
  };

  
  const handleGoogleLogin = async () => {
    setLoading(true);
    signIn("google",{
    callbackUrl: "/", 
  });
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 overflow-hidden">
      <Toaster position="top-right" />
      <div className="relative w-full max-w-md mt-24 sm:mt-32 md:mt-40 lg:mt-40">

        {/* Paper tear background */}
        <div className="absolute -inset-4 bg-yellow-400 shadow-2xl transform -rotate-6 rounded-tl-[40%] rounded-tr-[50%] rounded-bl-[1%] rounded-br-[1%]"></div>

        {/* Form container */}
        <div className="relative bg-white p-8 rounded-xl shadow-2xl z-10">
            
          <h2 className="text-2xl font-bold mb-6  text-center text-yellow-400 mt-3">
            LogIn to <span className="text-gray-600">continue !!</span>
          </h2>
          
          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-white border-yellow-700 focus:border-yellow-900 focus:ring-yellow-300 text-gray-800"
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white border-yellow-700 focus:border-yellow-900 focus:ring-yellow-300 text-gray-800"
              required
            />
            <button
              type="submit"
              className={`btn w-full bg-yellow-400 text-white hover:bg-yellow-500 ${loading ? "loading" : ""}`}
            >
              Login
            </button>
          </form>
            {/* Register link */}
        <p className="text-sm text-center mt-4 text-gray-700">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-yellow-400 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
         {/* Divider */}
        <div className="flex items-center my-5">
          <hr className="flex-grow  border-gray-600" />
          <span className="px-3 text-gray-600 text-sm">
            OR
          </span>
          <hr className="flex-grow border-gray-600 " />
        </div>
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="btn w-full mt-4 bg-gray-600 text-white"
            disabled={loading}
          >
            Login with Google
          </button>

          
        </div>
      </div>
    </div>
  );
}
