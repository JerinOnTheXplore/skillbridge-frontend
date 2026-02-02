"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function NavItems({
  session,
  onClick,
}: {
  session: unknown;
  onClick?: () => void;
}) {
  const baseClass =
    "text-gray-700 hover:text-gray-600 transition";

  return (
    <>
      <Link href="/" onClick={onClick} className={baseClass}>
        Home
      </Link>
      <Link href="/tutors" onClick={onClick} className={baseClass}>
        Tutor
      </Link>

      {!session && (
        <>
          <Link href="/login" onClick={onClick} className={baseClass}>
            Login
          </Link>
          <Link href="/register" onClick={onClick} className={baseClass}>
            Register
          </Link>
        </>
      )}

      {session && (
        <>
          <Link href="/dashboard" onClick={onClick} className={baseClass}>
            Dashboard
          </Link>
          <button
            onClick={() => {
              signOut();
              onClick?.();
            }}
            className={`${baseClass} text-left`}
          >
            Logout
          </button>
        </>
      )}
    </>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">

        {/* Logo */}
        <Link href="/" className="font-bold text-xl sm:text-2xl text-gray-600">
          🎓Sk!lL<span className="text-yellow-400">BR!DGE</span>
        </Link>

        {/* Center Menu (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center gap-8 font-medium">
          <NavItems session={session} />
        </div>

        {/* Right Button (Desktop) */}
        <div className="hidden md:block">
          <Link
            href="/tutors"
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            Book a Session
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="ml-auto md:hidden p-2 rounded-md bg-yellow-400 text-white"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transition ${
          open ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-64 bg-yellow-400 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-yellow-300">
            <span className="font-bold text-lg">Menu</span>
            <button onClick={() => setOpen(false)}>
              <X size={22} />
            </button>
          </div>

          <div className="flex flex-col gap-4 px-4 py-6 font-medium">
            <NavItems session={session} onClick={() => setOpen(false)} />

            {/* Book Session (Mobile) */}
            <Link
              href="/book-session"
              onClick={() => setOpen(false)}
              className="mt-4 bg-white text-yellow-400 text-center py-2 rounded-md font-semibold"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
