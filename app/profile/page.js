"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const CARD_DARK = "#0D1117";
  const BACKGROUND_DARK = "#0A0D11";
  const PRIMARY_COLOR = "#00FF88";
  const BUTTON_TEXT_DARK = "#0D1117";

  const [student, setStudent] = useState(null);

  useEffect(() => {
    const studentID = sessionStorage.getItem("studentID");
    if (studentID) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/attendx/profile?studentID=${studentID}`)
        .then((res) => setStudent(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  if (!student) {
    return (
      <div className="flex w-full items-center justify-center min-h-screen bg-[linear-gradient(180deg,#0A0D11,#0D1117)] text-white font-[Lexend]">
        Loading Profile...
      </div>
    );
  }

  const initials = student.full_name
    ? student.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "ST";

  return (
    <>
        <Navbar />
        <div className={`min-h-screen w-full p-4 sm:p-8 bg-[linear-gradient(180deg,#0A0D11,#0D1117)] font-[Lexend] text-white`}>
        
        {/* Profile Header with Background Glow */}
        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
            {/* Glowing Background Circle */}
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(0,255,136,0.2),transparent)] blur-3xl pointer-events-none"></div>

            {/* Profile Card */}
            <div className={`flex flex-col items-center p-8 rounded-2xl bg-[${CARD_DARK}] w-full lg:w-1/3 shadow-[0_0_30px_#00FF8840] backdrop-blur-md border border-[#00FF8840] relative z-10`}>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00FFA0] flex items-center justify-center text-4xl font-black text-[${CARD_DARK}] mb-4 shadow-lg">
                {initials}
            </div>
            <h2 className="text-3xl font-extrabold mb-1 text-white">{student.full_name || "Unknown Name"}</h2>
            <p className="text-gray-400 mb-6">{student.student_id || "Unknown ID"}</p>

            <div className="flex flex-col gap-3 w-full">
                {[
                { label: "Age", value: student.age },
                { label: "Date of Birth", value: student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : "-" },
                { label: "Gender", value: student.gender },
                { label: "Nationality", value: student.nationality },
                { label: "Faculty", value: student.faculty },
                { label: "Course", value: student.course },
                ].map((item) => (
                <div key={item.label} className="flex justify-between text-gray-300">
                    <span>{item.label}:</span>
                    <span className="font-medium">{item.value || "-"}</span>
                </div>
                ))}
            </div>

            <div className="flex flex-col gap-3 mt-6 w-full">
                <a
                href={`mailto:${student.email || ""}`}
                className={`text-center w-full py-3 rounded-xl font-bold bg-[${PRIMARY_COLOR}] text-[${BUTTON_TEXT_DARK}] hover:brightness-110 transition-all`}
                >
                Email
                </a>
                <a
                href={`tel:${student.phone_number || ""}`}
                className={`text-center w-full py-3 rounded-xl font-bold border border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}] hover:bg-[${PRIMARY_COLOR}] transition-all`}
                >
                Call
                </a>
            </div>
            </div>

            {/* Account Details / Stats */}
            <div className={`flex-1 flex flex-col gap-6 relative z-10`}>
            <h3 className="text-2xl font-bold mb-4">Account Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                { label: "Campus", value: student.campus },
                { label: "Phone", value: student.phone_number },
                { label: "Email", value: student.email },
                { label: "Member Since", value: student.created_at ? new Date(student.created_at).toLocaleDateString() : "-" },
                ].map((item) => (
                <div key={item.label} className="p-5 bg-[rgba(0,255,136,0.05)] border border-[#00FF8840] rounded-2xl backdrop-blur-sm flex flex-col gap-1 hover:shadow-[0_0_25px_#00FF8855] transition">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-bold">{item.value || "-"}</span>
                </div>
                ))}
            </div>

            {/* Optional Additional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="p-5 bg-[rgba(0,255,136,0.05)] border border-[#00FF8840] rounded-2xl backdrop-blur-sm flex flex-col gap-1 hover:shadow-[0_0_25px_#00FF8855] transition">
                <span className="text-gray-400">Nationality</span>
                <span className="text-white font-bold">{student.nationality || "-"}</span>
                </div>
                <div className="p-5 bg-[rgba(0,255,136,0.05)] border border-[#00FF8840] rounded-2xl backdrop-blur-sm flex flex-col gap-1 hover:shadow-[0_0_25px_#00FF8855] transition">
                <span className="text-gray-400">Gender</span>
                <span className="text-white font-bold">{student.gender || "-"}</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    </>
  );
}
