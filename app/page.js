'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// NOTE ON STYLING: The original design relies on custom box-shadow and text-shadow 
// for the "glow" effect, which are not available as default Tailwind utilities.
// We must use inline style objects for these two specific effects to maintain
// the visual fidelity requested by the original HTML's custom CSS block.

// The glow effects, translated from the original <style> block
const glowShadowStyle = {
  boxShadow: '0 0 10px #00FF8844',
};

const glowTextStyle = {
  textShadow: '0 0 8px #00FF8880',
};

export default function Login() {
  // Removed authMode state as we are only using the 'Login' option now.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simplified log since the mode is fixed
    console.log(`Attempting Login:`, { email, password });
    // Add your actual authentication logic here
    const result = await verify(email, password);
    
    if (result.success) {
      console.log(result.message);

      // Store studentID in sessionStorage
      sessionStorage.setItem('studentID', result.studentID);

      switchToDashboard();
    } else {
      alert(result.message);
    }

    
  };

  function switchToDashboard() {
    console.log("Switching to Dashboard mode (function retained for potential future use).");
    // This function is currently not used since we only have the Login mode.
    router.push('/dashboard'); // Example navigation to a sign-up page
  }

  return (
    // Use custom hex code for background dark: #0D1117
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 font-[Lexend] bg-[#0D1117]"
    >
      <div className="layout-container flex h-full w-full max-w-md grow flex-col items-center justify-center">
        
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <h1
            // Use custom hex code for primary text: #00ff88
            className="text-[#00ff88] tracking-light text-[40px] font-bold leading-tight"
            style={glowTextStyle}
          >
            AttendX
          </h1>
        </div>
        
        {/* Form Card */}
        <div
          // Use custom hex code for card dark: #161B22
          className="flex w-full flex-col rounded-xl p-8 bg-[#161B22]"
          style={glowShadowStyle}
        >
          <h2 className="text-white tracking-light text-center text-[28px] font-bold leading-tight pb-4">
            Welcome Back
          </h2>
          
          {/* Segmented Buttons (Removed) */}
          
          {/* Form */}
          <form className="flex flex-col gap-4 pt-4" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex min-w-40 flex-1 flex-col">
                <p className="pb-2 text-base font-medium leading-normal text-white/90">Email</p>
                <input
                  // Use custom hex codes for input background, and focus border/ring/offset
                  className="form-input flex h-14 min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-2 border-transparent p-4 text-base font-normal leading-normal text-white placeholder:text-gray-400 focus:outline-0 focus:ring-0
                    bg-[#1F2937]  focus:ring-2 focus:ring-[#00ff88] focus:ring-offset-2 focus:ring-offset-[#0D1117]"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>
            
            {/* Password Field */}
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex min-w-40 flex-1 flex-col">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-base font-medium leading-normal text-white/90">Password</p>
                  {/* Use custom hex code for primary text: #00ff88 */}
                  <a className="text-sm font-medium hover:underline text-[#00ff88]" href="#">
                    Forgot Password?
                  </a>
                </div>
                <div className="flex w-full flex-1 items-stretch rounded-lg">
                  <input
                    // Use custom hex codes for input background, and focus border/ring/offset
                    className="form-input flex h-14 min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-2 border-transparent p-4 text-base font-normal leading-normal text-white placeholder:text-gray-400 focus:outline-0 focus:ring-0
                    bg-[#1F2937] focus:ring-2 focus:ring-[#00ff88] focus:ring-offset-2 focus:ring-offset-[#0D1117]"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </label>
            </div>
            
            {/* Login Button */}
            <button
              // Use custom hex codes for primary bg (#00ff88), button text dark (#0D1117), and ring/offset colors
              className="mt-4 flex h-14 w-full items-center justify-center rounded-lg text-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
              bg-[#00ff88] text-[#0D1117] hover:bg-green-400 focus:ring-[#00ff88] focus:ring-offset-[#0D1117]"
              type="submit"
              onClick={() => {
                console.log("Log In button clicked.");
              }}
            >
              Log In
            </button>
          </form>
          
          {/* OR Separator and Social Login (Removed) */}
          
          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?
              <a 
                // Use custom hex code for primary text: #00ff88
                className="font-medium hover:underline ml-1 text-[#00ff88]" 
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    console.log("Navigating to Sign Up page (placeholder link).");
                    // Add actual navigation logic here if needed
                }}
              >
                Contact Admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

async function verify(email, password) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendx/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend returned error (wrong email or password)
      throw new Error(data.message || "Authentication failed");
    }

    // Success: return studentID and message
    return {
      success: true,
      studentID: data.studentID,
      message: data.message
    };


  } catch (error) {
    console.error("Verification error:", error.message);
    return {
      success: false,
      message: error.message
    };
  }
}
