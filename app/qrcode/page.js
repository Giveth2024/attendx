"use client";

import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react"; // <-- named export
import Navbar from "../components/Navbar";

export default function QRCodePage() {
  const [studentID, setStudentID] = useState("");
  const qrRef = useRef();

  useEffect(() => {
    const id = sessionStorage.getItem("studentID");
    if (id) setStudentID(id);
  }, []);

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `AttendX_${studentID}.png`;
    link.click();
  };

  const qrURL = `${process.env.NEXT_PUBLIC_API_URL}/?studentID=${studentID}`;

  if (!studentID)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0D1117] text-white font-[Lexend]">
        <p>Loading student info...</p>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full items-center justify-center min-h-screen bg-[#0D1117] font-[Lexend] p-4">
        <h1
          className="text-[#00ff88] text-[36px] font-bold mb-6"
          style={{ textShadow: "0 0 8px #00FF8880" }}
        >
          Your QR Code
        </h1>

        <div
          ref={qrRef}
          className="p-6 bg-[#161B22] rounded-xl mb-6"
          style={{ boxShadow: "0 0 10px #00FF8844" }}
        >
          <QRCodeCanvas value={qrURL} size={250} bgColor="#161B22" fgColor="#00FF88" />
        </div>

        <button
          onClick={downloadQRCode}
          className="bg-[#00ff88] text-[#0D1117] font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:ring-offset-2 focus:ring-offset-[#0D1117]"
        >
          Download QR Code
        </button>

        {/* <p className="text-gray-400 mt-4 text-sm">
          QR contains URL: <span className="text-[#00ff88]">{qrURL}</span>
        </p> */}
      </div>
    </>
  );
}
