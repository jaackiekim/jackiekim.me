import React from 'react';

export default function BackgroundElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Squiggle in top left */}
      <svg className="absolute top-20 left-20 w-32 h-32 text-[#5EBAB0]/20" viewBox="0 0 100 100">
        <path
          d="M10,50 C30,30 70,30 90,50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Circles in top right */}
      <svg className="absolute top-10 right-20 w-24 h-24 text-[#FFB156]/20" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Zigzag lines in middle right */}
      <svg className="absolute top-1/3 right-40 w-32 h-32 text-[#FFB156]/20" viewBox="0 0 100 100">
        <path
          d="M20,20 L40,40 L20,60 L40,80"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Scribble in bottom left */}
      <svg className="absolute bottom-40 left-20 w-40 h-40 text-[#5EBAB0]/20" viewBox="0 0 100 100">
        <path
          d="M20,50 C40,20 60,80 80,50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Circles in bottom right */}
      <svg className="absolute bottom-20 right-20 w-32 h-32 text-[#FFB156]/20" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}