'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';

// Custom Hex Colors defined in the original Tailwind config/styles
const PRIMARY_COLOR = '#00ff88';
const BUTTON_TEXT_DARK = '#0D1117';
const BACKGROUND_DARK_START = '#0D1117';
const CARD_DARK = '#161B22';

// --- Custom Glow Styles (Mapped from original CSS) ---
const GLOW_SHADOW_COLOR = 'rgba(0, 255, 136, 0.3)';
const GLOW_TEXT_COLOR = 'rgba(0, 255, 136, 0.5)';
const HOVER_GLOW_COLOR = 'rgba(0, 255, 136, 0.35)';

const glowBorderStyle = {
  boxShadow: `0 0 15px 0 ${GLOW_SHADOW_COLOR}`,
};

const glowTextStyle = {
  textShadow: `0 0 8px ${GLOW_TEXT_COLOR}`,
};

// Use this class for hover effects that include the translation and transition
const hoverGlowClass = `transition-all duration-200 ease-in-out hover:transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_2px_${HOVER_GLOW_COLOR}]`;

// Mock Data
const USER_NAME = 'Giveth';
const ATTENDANCE_PERCENT = 85;
const SCHEDULE = [
  {
    id: 1,
    title: 'Introduction to Physics - PHYS101',
    time: '10:00 AM - 11:30 AM',
    location: 'Room 3B',
    status: 'Upcoming',
    icon: 'location_on',
    statusColor: 'text-yellow-400',
  },
  {
    id: 2,
    title: 'Calculus II - MATH203',
    time: '1:00 PM - 2:30 PM',
    location: 'Join Zoom',
    status: 'Upcoming',
    icon: 'videocam',
    statusColor: 'text-yellow-400',
  },
  {
    id: 3,
    title: 'Digital Art & Design - ART210',
    time: '3:00 PM - 5:00 PM',
    location: 'Fine Arts Bld. 101',
    status: 'Upcoming',
    icon: 'location_on',
    statusColor: 'text-yellow-400',
  },
];

export default function Dashboard() {
  const [attendance, setAttendance] = useState(ATTENDANCE_PERCENT); // State could be used to simulate real-time updates

  // Calculate SVG Circle Dash Offset for the progress ring
  const progressOffset = useMemo(() => {
    const CIRCUMFERENCE = 2 * Math.PI * 54; // Radius is 54, stroke is 8
    return CIRCUMFERENCE - (attendance / 100) * CIRCUMFERENCE;
  }, [attendance]);


  return (
    <>
      <Navbar />    
      <div
        className={`relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden font-[Lexend] text-[#E6E6E6] bg-gradient-to-b from-[${BACKGROUND_DARK_START}] to-[${CARD_DARK}]`}
      >
        <div className="layout-container bg-[#0D1117] flex h-full grow flex-col">
          <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">
              

              <main className="mt-8 px-4 md:px-10">
                {/* Page Heading */}
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <p className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] min-w-72">Welcome, {USER_NAME}!</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                  
                  {/* Left Column (Attendance & Quick Links) */}
                  <div className="lg:col-span-1 flex flex-col gap-8">
                    
                    {/* Attendance Progress */}
                    <div className="relative flex items-center justify-center p-8">
                      {/* Background Blur Glow */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-64 h-64 rounded-full blur-3xl`} style={{ backgroundImage: `radial-gradient(transparent, ${PRIMARY_COLOR}1A)` }}></div>
                      </div>
                      
                      <svg className="w-72 h-72 transform -rotate-90" viewBox="0 0 120 120">
                        {/* Background Track */}
                        <circle cx="60" cy="60" fill="none" r="54" stroke={CARD_DARK} strokeWidth="8"></circle>
                        
                        {/* Progress Indicator */}
                        <circle 
                          cx="60" 
                          cy="60" 
                          fill="none" 
                          r="54" 
                          stroke="url(#progressGradient)" 
                          strokeDasharray="339.29" 
                          strokeDashoffset={progressOffset} 
                          strokeLinecap="round" 
                          strokeWidth="8"
                          style={glowBorderStyle}
                        ></circle>
                        
                        {/* Gradient Definition */}
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: PRIMARY_COLOR, stopOpacity: 1 }}></stop>
                            <stop offset="100%" style={{ stopColor: '#00c46a', stopOpacity: 1 }}></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Center Text */}
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-white" style={glowTextStyle}>{attendance}%</span>
                        <span className="text-lg font-medium text-gray-400">Attendance</span>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                      {/* Primary Buttons */}
                      <button className={`flex w-full items-center justify-center gap-3 rounded-xl h-14 px-5 text-lg font-bold leading-normal tracking-[0.015em] bg-[${PRIMARY_COLOR}] text-[${BUTTON_TEXT_DARK}] ${hoverGlowClass}`}>
                        <span className="truncate">Courses</span>
                      </button>
                      <button className={`flex w-full items-center justify-center gap-3 rounded-xl h-14 px-5 text-lg font-bold leading-normal tracking-[0.015em] bg-[${PRIMARY_COLOR}] text-[${BUTTON_TEXT_DARK}] ${hoverGlowClass}`}>
                        <span className="truncate">Reports</span>
                      </button>
                      
                      {/* Secondary Buttons */}
                      <button className={`flex w-full items-center justify-center gap-3 rounded-xl h-14 px-5 text-lg font-bold leading-normal tracking-[0.015em] transition-colors bg-[#00ff8831] text-[${PRIMARY_COLOR}] hover:bg-[#00ff8831]`}>
                        <span className="truncate">Profile</span>
                      </button>
                      <button className={`flex w-full items-center justify-center gap-3 rounded-xl h-14 px-5 text-lg font-bold leading-normal tracking-[0.015em] transition-colors bg-[#00ff8831] text-[${PRIMARY_COLOR}] hover:bg-[#00ff8831]`}>
                        <span className="truncate">Help</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column (Today's Schedule) */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    <h3 className="text-2xl font-bold tracking-tight text-white">Today's Schedule</h3>
                    <div className="flex flex-col gap-4">
                      
                      {/* Class Cards */}
                      {SCHEDULE.map((classItem) => (
                        <div 
                          key={classItem.id} 
                          className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 border border-gray-800 rounded-xl bg-[${CARD_DARK}] ${hoverGlowClass}`}
                        >
                          <div className="flex-1">
                            <p className="text-lg font-bold text-white">{classItem.title}</p>
                            <p className="text-sm text-gray-400 mt-1">{classItem.time}</p>
                          </div>
                          
                          {/* Location/Link */}
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="material-symbols-outlined text-base">{classItem.icon}</span>
                            <span>{classItem.location}</span>
                          </div>
                          
                          {/* Status */}
                          <div className={`flex items-center gap-2 text-sm font-medium ${classItem.statusColor}`}>
                            <div className={`w-2 h-2 rounded-full bg-yellow-400`}></div>
                            {classItem.status}
                          </div>
                        </div>
                      ))}

                      {/* Uncomment below for empty state example */}
                      {/* <div className="flex flex-col items-center justify-center gap-4 p-10 bg-[#161B22] border border-dashed border-gray-700 rounded-xl mt-4">
                        <span className="material-symbols-outlined text-5xl text-gray-500">celebration</span>
                        <p className="text-lg font-medium text-gray-400">No classes today.</p>
                        <p className="text-center text-gray-500">Enjoy your day off!</p>
                      </div> */}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}