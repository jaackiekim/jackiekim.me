import React from 'react';

export default function BlueGradient() {
  return (
    <div className="absolute inset-0">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0039D7]/5 to-transparent" />
      
      {/* Blue dots pattern */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-8 flex items-center"
            style={{
              top: `${(i * 8) + Math.sin(i) * 4}%`,
              opacity: 1 - (i * 0.08)
            }}
          >
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="w-1.5 h-1.5 rounded-full bg-[#0039D7]"
                style={{
                  marginLeft: `${(j * 25) + Math.cos(i + j) * 10}%`,
                  opacity: 0.2 + Math.random() * 0.3
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}