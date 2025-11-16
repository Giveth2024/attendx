'use client';

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const [studentID, setStudentID] = useState("");
  const [courseID, setCourseID] = useState("");
  const [message, setMessage] = useState("Waiting for scan...");
  const [scanning, setScanning] = useState(false);
  const [sending, setSending] = useState(false);

  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  const startScanner = async () => {
    if (!scannerRef.current) return;
    if (scanning) return; // prevent double initialization

    setScanning(true);

    html5QrcodeScannerRef.current = new Html5Qrcode(scannerRef.current.id);

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setMessage("❌ No cameras found. Enable camera permissions.");
        setScanning(false);
        return;
      }

      const backCamera =
        cameras.find((cam) => cam.label.toLowerCase().includes("back")) ||
        cameras[0];

      await html5QrcodeScannerRef.current.start(
        backCamera.id,
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          try {
            const url = new URL(decodedText);
            const id = url.searchParams.get("studentID");

            if (!id) {
              setMessage("❌ Invalid QR (missing studentID)");
              return;
            }

            setStudentID(id);
            setMessage(`✅ QR Code has been scanned Successfully:)`);
            html5QrcodeScannerRef.current.stop();
            setScanning(false);
          } catch {
            setMessage("❌ Invalid QR format");
          }
        },
        () => {}
      );
    } catch (err) {
      console.error(err);
      setMessage("❌ Unable to start camera. Check permissions.");
      setScanning(false);
    }
  };

  const handleScanAgain = async () => {
    if (sending) return;

    setStudentID("");
    setMessage("Waiting for scan...");

    await startScanner();
  };

  const handleSend = async () => {
    if (!studentID || !courseID) {
      setMessage("❌ Scan a QR and enter course ID.");
      return;
    }

    setSending(true);
    setMessage("⏳ Sending...");

    try {
      const payload = {
        studentID,
        course_id: courseID,
        date: new Date().toISOString(),
        status: "present",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/attendx/scan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Invalid server response" };
      }

      if (res.ok) {
        setMessage(`✅ Attendance has been marked successfully!`);
      } else {
        setMessage(`❌ Failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }

    setSending(false);
  };

  useEffect(() => {
    startScanner();

    return () => {
      html5QrcodeScannerRef.current?.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-[#0D1117] text-white font-[Lexend] p-4">
      <h1
        className="text-[#00ff88] text-[36px] font-bold mb-6"
        style={{ textShadow: "0 0 8px #00FF8880" }}
      >
        Scan Student QR
      </h1>

      <div
        id="scanner"
        ref={scannerRef}
        className="w-[300px] min-h-[300px] h-auto rounded-lg mb-6 bg-[#161B22]"
        style={{ boxShadow: "0 0 10px #00FF8844" }}
      ></div>

      <input
        type="text"
        placeholder="Enter Course ID"
        value={courseID}
        onChange={(e) => setCourseID(e.target.value)}
        className="mb-4 p-3 rounded-lg w-[300px] bg-[#1F2937] text-white placeholder:text-gray-400 
          focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:ring-offset-2 focus:ring-offset-[#0D1117]"
      />

      {studentID && (
        // <p className="text-[#00ff88] mb-2">Student ID: {studentID}</p>
      <p className="text-[#00ff88] text-center mb-4">{message}</p>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleSend}
          disabled={!studentID || !courseID || sending}
          className={`flex h-12 p-2 items-center justify-center rounded-lg font-bold transition-all
            ${
              studentID && courseID && !sending
                ? "bg-[#00ff88] text-[#0D1117] hover:bg-[#2bff99]"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
        >
          {sending ? "Sending..." : "Send to Server"}
        </button>

        <button
          onClick={handleScanAgain}
          disabled={sending}
          className={`flex h-12  p-2 items-center justify-center rounded-lg border-2 font-bold transition-all
            ${
              sending
                ? "border-gray-700 text-gray-600 cursor-not-allowed"
                : "border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0D1117]"
            }`}
        >
          Scan Again
        </button>
      </div>
    </div>
  );
}
