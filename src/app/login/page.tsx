"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; 
import { getToken, setToken } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }

      setToken(data.token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err:any) {
      toast.error(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 overflow-hidden">
      <div className="relative w-full max-w-md mt-40">

        {/* paper tear background with jagged edge effect */}
        <div className="absolute -inset-4 bg-yellow-400 shadow-2xl transform -rotate-2 rounded-tl-[60%] rounded-tr-[50%] rounded-bl-[5%] rounded-br-[1%]"></div>

        {/*form*/}
        <div className="relative bg-white p-8 rounded-xl shadow-2xl z-10">

          {/*logo*/}
          <div className="absolute -top-6 -left-6">
            <div className="flex items-start gap-1 transform rotate-[-5deg]">
              <span className="text-3xl font-extrabold text-yellow-400 leading-none">Skill</span>
              <span className="relative inline-block">
                <span className="absolute -top-2 left-0 bg-yellow-200 text-yellow-900 text-[10px] sm:text-xs px-2 py-1 rounded-md rotate-[-6deg] tracking-widest shadow-lg">
                  BR!DGE
                </span>
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400 mt-12">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-800 mb-1">Email</label>
              <input
                type="email"
                className="input input-bordered w-full bg-white border-yellow-700 focus:border-yellow-900 focus:ring-yellow-300 text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 mb-1">Password</label>
              <input
                type="password"
                className="input input-bordered w-full bg-white border-yellow-700 focus:border-yellow-900 focus:ring-yellow-300 text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn w-full bg-yellow-600 text-white hover:bg-yellow-700 ${loading ? "loading" : ""}`}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}