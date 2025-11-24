'use client';

import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import Navbar from "../components/Navbar";
import CryptoJS from "crypto-js";
import { UAParser } from "ua-parser-js";


export default function QRCodePage() {
  const [studentID, setStudentID] = useState("");
  const [tokenURL, setTokenURL] = useState("");
  const [expiresIn, setExpiresIn] = useState(15);
  const qrRef = useRef();

  // -----------------------------
  // 1. DEVICE INFO FUNCTION
  // -----------------------------
  function getDeviceInfo() {
    const parser = new UAParser();
    const result = parser.getResult();

    const deviceData = {
      browser_name: result.browser.name || "Unknown",
      browser_version: result.browser.version || "Unknown",
      os_name: result.os.name || "Unknown",
      os_version: result.os.version || "Unknown",
      device_model: result.device.model || "Unknown",
      device_vendor: result.device.vendor || "Unknown",
      device_type: result.device.type || "desktop",
    };

    const hashInput = [
      navigator.userAgent,
      navigator.platform,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      navigator.hardwareConcurrency,
      deviceData.browser_name,
      deviceData.browser_version,
      deviceData.os_name,
      deviceData.os_version,
      deviceData.device_model,
      deviceData.device_vendor,
    ].join("||");

    const device_hash = CryptoJS.SHA256(hashInput).toString();

    return { device_hash, ...deviceData };
  }

  // -----------------------------
  // 2. Load student ID + initial QR
  // -----------------------------
  useEffect(() => {
    const id = sessionStorage.getItem("studentID");
    if (id) {
      setStudentID(id);
      generateQRCode(id);
    }
  }, []);

  // -----------------------------
  // 3. Countdown
  // -----------------------------
  useEffect(() => {
    if (expiresIn === 0) return;
    const timer = setTimeout(() => setExpiresIn(expiresIn - 1), 1000);
    return () => clearTimeout(timer);
  }, [expiresIn]);

  // -----------------------------
  // 4. Generate QR function
  // -----------------------------
  async function generateQRCode(id) {
    try {
      const deviceInfo = getDeviceInfo(); // full info + hash

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tokens/generate`,
        {
          student_id: id,
          device_hash: deviceInfo.device_hash,
          browser: deviceInfo.browser_name,
          os: deviceInfo.os_name,
          device_model: deviceInfo.device_model,
        }
      );

      const token = res.data.token;

      setTokenURL(
        `${process.env.NEXT_PUBLIC_API_URL}/scan?token=${token}&device_hash=${deviceInfo.device_hash}&student_id=${id}&browser=${deviceInfo.browser_name}&os=${deviceInfo.os_name}&device_model=${deviceInfo.device_model}`
      );

      setExpiresIn(15);
    } catch (err) {
      console.error("Error generating token:", err);
    }
  }

  if (!studentID)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D1117] text-white font-[Lexend]">
        Loading student info...
      </div>
    );

  // -----------------------------
  // PAGE UI
  // -----------------------------
  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full items-center justify-center min-h-screen bg-[#0D1117] p-4">
        <h1 className="text-[#00ff88] text-3xl font-bold mb-4">
          Your Dynamic QR Code
        </h1>

        {/* Countdown */}
        <p className="text-gray-400 mb-2 text-sm">
          {expiresIn > 0 ? (
            <>
              Expires in{" "}
              <span className="text-[#00ff88] font-bold">{expiresIn}s</span>
            </>
          ) : (
            <span className="text-red-500 font-bold">Expired</span>
          )}
        </p>

        {/* QR */}
        <div
          ref={qrRef}
          className={`p-6 rounded-xl mb-6 transition-all duration-500 ${
            expiresIn === 0 ? "blur-[5px] opacity-20 scale-110 rotate-3" : ""
          }`}
          style={{
            backgroundColor: "#161B22",
            boxShadow: expiresIn > 0 ? "0 0 10px #00FF8844" : "none",
            pointerEvents: expiresIn > 0 ? "auto" : "none",
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

        {/* Regenerate */}
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
