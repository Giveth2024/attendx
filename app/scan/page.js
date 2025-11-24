'use client';

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

export default function ScanPage() {
  const [studentID, setStudentID] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [message, setMessage] = useState("Waiting for scan...");
  const [scanning, setScanning] = useState(false);
  const [sending, setSending] = useState(false);

  const scannerRef = useRef(null);
  const html5Scanner = useRef(null);

  // --------------------- Device Info ---------------------
  const getScannerDeviceInfo = () => {
    const ua = navigator.userAgent;
    let os_name = "Unknown";
    if (/Windows/i.test(ua)) os_name = "Windows";
    else if (/Mac/i.test(ua)) os_name = "MacOS";
    else if (/Linux/i.test(ua)) os_name = "Linux";
    else if (/Android/i.test(ua)) os_name = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os_name = "iOS";

    let browser_name = "Unknown";
    if (/Chrome/i.test(ua)) browser_name = "Chrome";
    else if (/Firefox/i.test(ua)) browser_name = "Firefox";
    else if (/Safari/i.test(ua)) browser_name = "Safari";
    else if (/Edge/i.test(ua)) browser_name = "Edge";

    return {
      scanner_device_hash: crypto.randomUUID(),
      scanner_device_model: navigator.platform || "Unknown",
      scanner_os: os_name,
      scanner_browser: browser_name,
    };
  };

  // --------------------- Start QR Scanner ---------------------
  const startScanner = async () => {
    if (!scannerRef.current || scanning) return;

    setScanning(true);
    setMessage("📷 Initializing camera...");

    html5Scanner.current = new Html5Qrcode(scannerRef.current.id);

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras?.length) {
        setMessage("❌ No cameras detected. Allow camera permissions.");
        setScanning(false);
        return;
      }

      const selectedCamera =
        cameras.find((cam) => cam.label.toLowerCase().includes("back")) ||
        cameras[0];

      await html5Scanner.current.start(
        selectedCamera.id,
        { fps: 10, qrbox: (w, h) => ({ width: Math.min(w, h) * 0.7, height: Math.min(w, h) * 0.7 }) },
        async (decodedText) => {
          try {
            console.log("RAW QR:", decodedText);

            // Parse URL
            let url;
            try { url = new URL(decodedText); } 
            catch { setMessage("❌ QR is not a valid URL"); return; }

            // Extract QR & student info
            const student_id = url.searchParams.get("student_id");
            if (!student_id) { setMessage("❌ QR missing student_id"); return; }

            const qrData = {
              token: url.searchParams.get("token"),
              student_device_hash: url.searchParams.get("student_device_hash"),
              student_device_model: url.searchParams.get("student_device_model"),
              student_os: url.searchParams.get("student_os"),
              student_browser: url.searchParams.get("student_browser"),
              generated_at: url.searchParams.get("generated_at"),
              expires_at: url.searchParams.get("expires_at"),
            };

            // Verify student in backend
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/attendx/verify-student`,
              { student_id }
            );

            if (!res.data.exists) {
              setMessage("❌ Student does not exist in the database");
              return;
            }

            const student = res.data.student;
            setStudentID(student.student_id);

            // Fetch upcoming lecture
            const lectureRes = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/attendx/upcoming-lecture?course_code=${courseCode}`
            );
            const lecture = lectureRes.data.lecture || {};

            // Build full JSON
            const attendanceJSON = {
              student_id: student.student_id,
              course_code: courseCode,
              lesson_id: lecture.id || null,
              scan_time: new Date().toISOString(),
              lecture_start: lecture.start_time || null,
              lecture_end: lecture.end_time || null,
              location: lecture.room || "Unknown",
              student_device_hash: qrData.student_device_hash,
              student_device_model: qrData.student_device_model,
              student_os: qrData.student_os,
              student_browser: qrData.student_browser,
              ...getScannerDeviceInfo(),
              qr_token: qrData.token,
              qr_generated_at: qrData.generated_at,
              qr_expires_at: qrData.expires_at,
              status: "Present",
            };

            // Display JSON first
            alert(JSON.stringify(attendanceJSON, null, 2));
            setMessage(`✅ ${student.full_name} found in database!`);

            // Stop scanner
            try {
              if (html5Scanner.current?.getState() === 2) await html5Scanner.current.stop();
            } catch (err) { console.warn("Could not stop scanner:", err.message); }

            setScanning(false);

          } catch (err) {
            console.error(err);
            setMessage("❌ Invalid QR Data or Server Error");
          }
        },
        () => {}
      );
    } catch (error) {
      console.error(error);
      setMessage("❌ Error starting camera. Check permissions.");
      setScanning(false);
    }
  };

  // --------------------- Scan Again ---------------------
  const handleScanAgain = async () => {
    if (sending) return;
    setStudentID("");
    setMessage("Waiting for scan...");
    await startScanner();
  };

  // --------------------- Submit Attendance ---------------------
  const handleSend = async () => {
    if (!studentID || !courseCode) {
      setMessage("❌ Scan a QR and enter course code.");
      return;
    }

    setSending(true);
    setMessage("⏳ Sending attendance...");

    try {
      const payload = {
        studentID,
        course_code: courseCode,
        date: new Date().toISOString(),
        status: "Present",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/attendx/scan`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );

      const data = await res.json();
      setMessage(res.ok ? "✅ Attendance recorded successfully!" : `❌ Failed: ${data.message || "Unknown error"}`);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }

    setSending(false);
  };

  useEffect(() => {
    startScanner();
    return () => { html5Scanner.current?.stop().catch(() => {}); };
  }, []);

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-[#0D1117] text-white font-[Lexend] p-4">
      <h1 className="text-[#00ff88] text-[36px] font-bold mb-6" style={{ textShadow: "0 0 8px #00FF8880" }}>
        Scan Student QR
      </h1>

      <div
        id="scanner"
        ref={scannerRef}
        className="w-[320px] h-auto rounded-lg mb-6 bg-[#161B22]"
        style={{ boxShadow: "0 0 10px #00FF8844" }}
      ></div>

      <input
        type="text"
        placeholder="Enter Course Code"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
        className="mb-4 p-3 rounded-lg w-[300px] bg-[#1F2937] text-white placeholder:text-gray-400 
        focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
      />

      <p className="text-center mb-4 text-sm text-gray-300">{message}</p>

      <div className="flex gap-4">
        <button
          onClick={handleSend}
          disabled={!studentID || !courseCode || sending}
          className={`h-12 px-6 rounded-lg font-bold transition-all ${
            studentID && courseCode && !sending ? "bg-[#00ff88] text-[#0D1117] hover:bg-[#2bff99]" : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          {sending ? "Sending..." : "Submit"}
        </button>

        <button
          onClick={handleScanAgain}
          disabled={sending}
          className={`h-12 px-6 rounded-lg border-2 font-bold transition-all ${
            sending ? "border-gray-700 text-gray-600 cursor-not-allowed" : "border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0D1117]"
          }`}
        >
          Scan Again
        </button>
      </div>
    </div>
  );
}
