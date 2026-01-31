"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";

type ApiError = {
  message?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name,
            email,
            password,
            role: "USER",
          }),
        }
      );

      const data: ApiError = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Account created successfully!");
      router.replace("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 overflow-hidden">
      <Toaster position="top-right" />

      <div className="relative w-full max-w-md mt-24 sm:mt-32 md:mt-40">
        {/* Paper background */}
        <div className="absolute -inset-4 bg-yellow-400 shadow-2xl transform -rotate-6 rounded-tl-[40%] rounded-tr-[50%] rounded-bl-[1%] rounded-br-[1%]" />

        {/* Form */}
        <div className="relative bg-white p-8 rounded-xl shadow-2xl z-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400 mt-3">
            Create <span className="text-gray-600">Account </span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full bg-white border-yellow-700 focus:border-yellow-900 focus:ring-yellow-300 text-gray-800"
              required
            />

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white border-yellow-700 focus:border-yellow-900 focus:ring-yellow-300 text-gray-800"
              required
            />

            <button
              type="submit"
              className={`btn w-full bg-yellow-400 text-white hover:bg-yellow-500 ${
                loading ? "loading" : ""
              }`}
            >
              Register
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-gray-400">OR</div>

          {/* Google Auth */}
          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/",
              })
            }
            disabled={loading}
            className="btn w-full bg-gray-700 text-white hover:bg-gray-800"
          >
            Continue with Google
          </button>

          {/* Login link */}
          <p className="text-sm text-center mt-4 text-gray-700">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-yellow-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
