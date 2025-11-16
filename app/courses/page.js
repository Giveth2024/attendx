'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, FlaskConical, Microscope, Code, Palette, BookOpenText, Users, Aperture } from 'lucide-react';
import Navbar from '../components/Navbar';

// Define the primary color palette
const NEON_GREEN = '#00FF85';
const BACKGROUND_PAGE = '#0B1017'; // Slightly adjusted darker background for better contrast
const BACKGROUND_CARD = '#161B22';
const TEXT_LIGHT = '#E6E6E6';
const TEXT_MUTED = '#A0A0A0';
const RING_YELLOW = '#FBBC05'; // For the 72% attendance ring

// Mock Course Data
const COURSES = [
  { id: 1, title: 'Introduction to Quantum Physics', code: 'PHYS-101', instructor: 'Dr. Evelyn Reed', icon: FlaskConical, attendance: 92, isActive: true, color: NEON_GREEN },
  { id: 2, title: 'Advanced Organic Chemistry', code: 'CHEM-301', instructor: 'Dr. Alan Grant', icon: Microscope, attendance: 85, isActive: true, color: NEON_GREEN },
  { id: 3, title: 'Data Structures & Algorithms', code: 'CS-202', instructor: 'Prof. Ada Lovelace', icon: Code, attendance: 98, isActive: true, color: NEON_GREEN },
  { id: 4, title: 'History of Modern Art', code: 'ART-210', instructor: 'Dr. Vincent Van Gogh', icon: Palette, attendance: 100, isActive: true, color: NEON_GREEN },
  { id: 5, title: 'Ancient Civilizations', code: 'HIST-105', instructor: 'Prof. Indiana Jones', icon: BookOpenText, attendance: 72, isActive: true, color: RING_YELLOW },
  { id: 6, title: 'Cognitive Psychology', code: 'PSYC-310', instructor: 'Dr. Sigmund Freud', icon: Users, attendance: 94, isActive: false, color: TEXT_MUTED },
];

// --- Sub-Components ---

// Reusable Progress Ring Component (Circle calculation logic)
const ProgressRing = ({ percentage, color, size = 64 }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  // Calculate offset based on original logic (100 - percentage)
  const visualOffset = 100 - percentage;

  return (
    <div className={`relative flex items-center justify-center`} style={{ width: size, height: size }}>
      <svg className="absolute inset-0 size-full" height="36" viewBox="0 0 36 36" width="36">
        {/* Background Track */}
        <circle className="stroke-gray-700" cx="18" cy="18" fill="none" r={radius} strokeWidth="3" stroke="currentColor" />
        
        {/* Progress Circle with Glow */}
        <circle
          cx="18"
          cy="18"
          fill="none"
          r={radius}
          strokeDasharray="100"
          strokeDashoffset={visualOffset}
          strokeWidth="3"
          stroke={color}
          transform="rotate(-90 18 18)"
          className="transition-all duration-500"
          
        />
      </svg>
      <span className={`text-lg font-extrabold`} style={{ color: TEXT_LIGHT }}>{percentage}%</span>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course }) => {
  const Icon = course.icon;
  const isActive = course.isActive;
  const shadowColor = isActive ? NEON_GREEN : TEXT_MUTED;
  const cardBorderColor = isActive ? NEON_GREEN : TEXT_MUTED;
  
  return (
    <div
      className={`flex flex-col gap-5 rounded-xl p-6 transition-all duration-300 border border-transparent 
        ${isActive ? `bg-[${BACKGROUND_CARD}] hover:border-[${cardBorderColor}]/50 hover:shadow-xl hover:shadow-[${shadowColor}]/20 cursor-pointer` : 'bg-gray-800 opacity-50 cursor-default'}
      `}
      style={ isActive ? {
        '--tw-ring-color': cardBorderColor,
        boxShadow: `0 0 0 1px rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0)`,
      } : {} }
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={`flex items-center justify-center size-12 rounded-lg`} style={{ backgroundColor: BACKGROUND_PAGE }}>
          <Icon className="size-6" style={{ color: isActive ? NEON_GREEN : TEXT_MUTED }} strokeWidth={2.5} />
        </div>
        
        {/* Attendance Ring */}
        <ProgressRing percentage={course.attendance} color={course.color} />
      </div>
      
      <div className="flex flex-col gap-1">
        <p className={`text-xl font-bold leading-snug ${isActive ? `text-[${TEXT_LIGHT}]` : 'text-gray-400'}`}>
          {course.title}
        </p>
        <p className={`text-sm font-medium ${isActive ? `text-[${TEXT_MUTED}]` : 'text-gray-500'}`}>
          {course.code} • {course.instructor}
        </p>
      </div>
      
      {/* Action Button */}
      <button
        className={`flex w-full items-center justify-center rounded-full h-11 px-4 mt-2 text-sm font-extrabold transition-colors duration-200`}
        style={{ backgroundColor: NEON_GREEN, color: BACKGROUND_PAGE, "cursor" : "pointer" }}
      >
        <span className="truncate">View Details</span>
      </button>
    </div>
  );
};

// Main Component
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = useMemo(() => {
    return COURSES.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Dynamic styling for the search input focus glow
  const focusGlowStyle = {
    '--tw-ring-color': NEON_GREEN,
    boxShadow: `0 0 10px 0 ${NEON_GREEN}70`, // subtle neon glow
  };

  return (
    <>

      <Navbar />
      <div className={`min-h-screen w-full p-4 sm:p-10`} style={{ backgroundColor: BACKGROUND_PAGE, color: TEXT_LIGHT, fontFamily: 'Inter, sans-serif' }}>
        <div className="max-w-4xl mx-auto flex flex-col gap-10">

          {/* Page Heading */}
          <div className="flex flex-col gap-2">
            <p className="text-4xl font-extrabold tracking-tight" style={{ color: TEXT_LIGHT }}>My Courses</p>
            <p className="text-base" style={{ color: TEXT_MUTED }}>Welcome back, here's a list of your enrolled courses.</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="flex h-12 rounded-xl border-2 transition-all duration-300 focus-within:border-transparent" 
                  style={{ 
                      borderColor: BACKGROUND_CARD, 
                      backgroundColor: BACKGROUND_CARD,
                      // Apply glow on focus
                  }}
              >
                <div className="flex items-center justify-center pl-4">
                  <Search className="size-5" style={{ color: TEXT_MUTED }} />
                </div>
                <input
                  id="course-search"
                  className={`flex-1 w-full min-w-0 bg-transparent rounded-r-xl text-base placeholder-text-[${TEXT_MUTED}] focus:outline-none focus:ring-0 px-4`}
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2">
              {['All Semesters', 'Active'].map((label) => (
                <button key={label} className={`flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-xl px-4 font-medium transition-colors`} style={{ backgroundColor: BACKGROUND_CARD, color: TEXT_LIGHT, border: `1px solid ${NEON_GREEN}50` }}>
                  <p className="text-sm">{label}</p>
                  <ChevronDown className="size-4" style={{ color: TEXT_MUTED }} />
                </button>
              ))}
            </div>
          </div>

          {/* Course Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}

            {/* No Results Message */}
            {filteredCourses.length === 0 && (
              <div className={`col-span-full flex flex-col items-center justify-center gap-4 p-10 border border-dashed rounded-xl`} style={{ borderColor: TEXT_MUTED, backgroundColor: BACKGROUND_CARD }}>
                  <Search className="size-8" style={{ color: TEXT_MUTED }} />
                  <p className="text-lg font-medium" style={{ color: TEXT_MUTED }}>No courses match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    
    </>
  );
}