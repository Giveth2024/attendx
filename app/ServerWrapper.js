"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ServerWrapper({ children }) {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // Function to fetch data
    const fetchData = () => {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/`)
        .then(response => {
          setMessage(response.data.message);
        })
        .catch(() => {
          setMessage("Error!!! Could not Fetch Data from the Server.");
        });
    };

    // Fetch immediately on mount
    fetchData();

    // Fetch every 60 seconds
    const interval = setInterval(fetchData, 60000); // 60000ms = 60s

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, []); // <- Empty dependency to avoid repeated intervals

  return (
    <div className="">
      <div className="p-4 bg-white rounded shadow text-center">
        <h1 className="text-lg font-bold">{message}</h1>
      </div>
      <div>{children}</div>
    </div>
  );
}
