"use client";

import Link from "next/link";
import { getToken } from "../lib/auth";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const token = getToken();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* main row */}
        <div className="flex items-center justify-between py-4 md:py-6">

          {/* brand */}
          <Link href="/" className="flex items-start gap-1">
            <span className="text-5xl sm:text-3xl font-extrabold text-gray-800 relative leading-none">
             🎓Sk!lL
            </span>
            <span className="relative inline-block">
              <span className="absolute -top-3 left-0 bg-yellow-400 text-gray-800 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-md rotate-[-6deg] tracking-widest shadow">
                BR!DGE
              </span>
            </span>
          </Link>

          {/*medium+ device */}

          <div className="hidden md:flex flex-1 justify-center items-center gap-8 text-lg font-medium">
            <Link href="/" className="text-gray-800 hover:text-yellow-400">
              Home
            </Link>
            <Link href="/tutors" className="text-gray-800 hover:text-yellow-400">
              Tutor
            </Link>

            {!token && (
              <>
                <Link href="/login" className="text-gray-800 hover:text-yellow-400">
                  Login
                </Link>
                <Link href="/register" className="text-gray-800 hover:text-yellow-400">
                  Register
                </Link>
              </>
            )}

            {token && (
              <>
                <Link href="/dashboard" className="text-gray-800 hover:text-yellow-400">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-gray-800 hover:text-yellow-400">
                  My Profile
                </Link>
              </>
            )}
          </div>

          {/* Book a Session button*/}
          <div className="hidden md:flex">
            <Link
              href="/book-session"
              className="bg-yellow-400 text-gray-800 px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              Book a Session
            </Link>
          </div>

          {/*small devices */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-gray-800 focus:outline-none animate-bounce"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

        </div>

        {/* drawer menu .. small devices */}
        <div
          className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex flex-col mt-20 space-y-6 px-6 text-lg font-medium">
            <Link href="/" className="text-gray-800 hover:text-yellow-400" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/tutors" className="text-gray-800 hover:text-yellow-400" onClick={() => setMenuOpen(false)}>
              Tutor
            </Link>

            {!token && (
              <>
                <Link href="/login" className="text-gray-800 hover:text-yellow-400" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="text-gray-800 hover:text-yellow-400" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}

            {token && (
              <>
                <Link href="/dashboard" className="text-gray-800 hover:text-yellow-400" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/profile" className="text-gray-800 hover:text-yellow-400" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}