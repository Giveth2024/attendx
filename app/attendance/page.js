'use client';

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function MyAttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const USER_NAME = "Giveth"; // Could also fetch dynamically
  const PRIMARY_COLOR = "#00FF88";
  const CARD_DARK = "#0D1117";

  useEffect(() => {
    const studentID = sessionStorage.getItem("studentID");
    if (!studentID) return;

    fetch(`http://localhost:5000/attendx/my-attendance/${studentID}`)
      .then((res) => res.json())
      .then((data) => setAttendanceData(data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className={`flex flex-col w-full font-[Lexend] bg-[${CARD_DARK}] min-h-screen p-4 sm:p-8 text-white`}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center sm:text-left">My Attendance</h1>

        {/* Responsive wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-center border border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-[#161B22]">
              <tr>
                {["Course", "Date", "Status"].map((h) => (
                  <th
                    key={h}
                    className={`px-4 sm:px-6 py-3 sm:py-4 text-[${PRIMARY_COLOR}] uppercase text-sm sm:text-base`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((row) => (
                  <tr key={row.id} className="hover:bg-[#11151C] transition">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base">{row.course_name}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base">{new Date(row.date).toISOString().split("T")[0]}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base">{row.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-10 text-gray-400 text-sm sm:text-base">No attendance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>

  );
}
