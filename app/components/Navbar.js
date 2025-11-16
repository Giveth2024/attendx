"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

// Glow effects (same as your Login page)
const glowShadowStyle = {
  boxShadow: "0 0 10px #00FF8844",
};

const glowTextStyle = {
  textShadow: "0 0 8px #00FF8880",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="w-full bg-[#0D1117] text-white border-b border-gray-800 sticky top-0 z-50"
      style={glowShadowStyle}
    >
      {/* Wrapper */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/dashboard" className="text-[28px] font-bold text-[#00ff88]" style={glowTextStyle}>
          AttendX
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-lg">
          <Link href="/dashboard" className="p-2 border border-transparent rounded-sm  hover:text-[#00ff88] hover:border hover:border-[#00ff88] transition">Dashboard</Link>
          <Link href="/courses" className="p-2 border border-transparent rounded-sm hover:text-[#00ff88] hover:border hover:border-[#00ff88] transition">Courses</Link>
          <Link href="/qrcode" className="p-2 border border-transparent rounded-sm hover:text-[#00ff88] hover:border hover:border-[#00ff88] transition">QR Code</Link>
          <Link href="/attendance" className="p-2 border border-transparent rounded-sm hover:text-[#00ff88] hover:border hover:border-[#00ff88] transition">Attendance</Link>
          <Link href="/profile" className="p-2 border border-transparent rounded-sm hover:text-[#00ff88] hover:border hover:border-[#00ff88] transition">Profile</Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#00ff88]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col bg-[#161B22] px-4 pb-4 space-y-4 border-t border-gray-700" style={glowShadowStyle}>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="p-2 border border-transparent rounded-sm hover:border hover:border-[#00ff88] hover:text-[#00ff88] mt-2.5 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/courses"
            onClick={() => setOpen(false)}
            className="p-2 border border-transparent rounded-sm hover:border hover:border-[#00ff88] hover:text-[#00ff88] mt-2.5 transition"
          >
            Courses
          </Link>
          <Link
            href="/qrcode"
            onClick={() => setOpen(false)}
            className="p-2 border border-transparent rounded-sm hover:border hover:border-[#00ff88] hover:text-[#00ff88] mt-2.5 transition"
          >
            Qr Code
          </Link>
          <Link
            href="/attendance"
            onClick={() => setOpen(false)}
            className="p-2 border border-transparent rounded-sm hover:border hover:border-[#00ff88] hover:text-[#00ff88] mt-2.5 transition"
          >
            Attendance
          </Link>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="p-2 border border-transparent rounded-sm hover:border hover:border-[#00ff88] hover:text-[#00ff88] mt-2.5 transition"
          >
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
}
