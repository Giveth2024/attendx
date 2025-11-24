'use client';

import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import Navbar from "../components/Navbar";
import CryptoJS from "crypto-js";

export default function QRCodePage() {
  const [studentID, setStudentID] = useState("");
  const [tokenURL, setTokenURL] = useState("");
  const [expiresIn, setExpiresIn] = useState(15);
  const qrRef = useRef();

  // 1. Load studentID from sessionStorage and generate initial QR
  useEffect(() => {
    const id = sessionStorage.getItem("studentID");
    if (id) {
      setStudentID(id);
      generateQRCode(id);
    }
  }, []);

  // 2. Countdown timer
  useEffect(() => {
    if (expiresIn === 0) return;
    const timer = setTimeout(() => setExpiresIn(expiresIn - 1), 1000);
    return () => clearTimeout(timer);
  }, [expiresIn]);

  // 3. Generate device hash
  function getDeviceHash() {
    const info = [
      navigator.userAgent,
      navigator.platform,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      navigator.hardwareConcurrency
    ].join("||");
    return CryptoJS.SHA256(info).toString();
  }

  // 4. Generate new QR code token from backend
  async function generateQRCode(id) {
    try {
      const device_hash = getDeviceHash();
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tokens/generate`, {
        student_id: id,
        device_hash
      });

      const token = res.data.token;
      setTokenURL(`${process.env.NEXT_PUBLIC_API_URL}/scan?token=${token}&student_device_hash=${device_hash}`);
      setExpiresIn(15); // reset countdown
    } catch (err) {
      console.error("Error generating token:", err);
    }
  }

  if (!studentID) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D1117] text-white font-[Lexend]">
      Loading student info...
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full items-center justify-center min-h-screen bg-[#0D1117] p-4">
        <h1 className="text-[#00ff88] text-3xl font-bold mb-4">Your Dynamic QR Code</h1>

        {/* Countdown / Expired */}
        <p className="text-gray-400 mb-2 text-sm">
          {expiresIn > 0 ? (
            <>Expires in <span className="text-[#00ff88] font-bold">{expiresIn}s</span></>
          ) : (
            <span className="text-red-500 font-bold">Expired</span>
          )}
        </p>

        {/* QR Code Container */}
        <div
          ref={qrRef}
          className={`p-6 rounded-xl mb-6 transition-all duration-500 ${
            expiresIn === 0 ? "blur-[5px] opacity-20 scale-110 rotate-3" : ""
          }`}
          style={{
            backgroundColor: "#161B22",
            boxShadow: expiresIn > 0 ? "0 0 10px #00FF8844" : "none",
            pointerEvents: expiresIn > 0 ? "auto" : "none"
          }}
        >
          {tokenURL ? (
            <QRCodeCanvas
              value={tokenURL}
              size={250}
              bgColor="#161B22"
              fgColor={expiresIn > 0 ? "#00FF88" : "#888888"}
            />
          ) : (
            <p className="text-gray-400">Generating secure QR...</p>
          )}
        </div>

        {/* Regenerate Button */}
        <button
          onClick={() => generateQRCode(studentID)}
          className="bg-[#00ff88] text-[#0D1117] font-bold px-6 py-3 rounded-lg hover:bg-green-400"
        >
          Generate New QR Code
        </button>
      </div>
    </>
  );
}
