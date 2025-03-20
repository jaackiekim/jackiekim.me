import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const locations = [
  "New York City",
  "Los Angeles",
  "elsewhere (traveling)"
];

export default function LocationFlip() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1 text-[#0039D7] hover:text-[#002BB4] transition-colors"
      >
        <span>{selectedLocation}</span>
        <ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#0039D7]/10 py-1 min-w-[160px] z-50"
          >
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => {
                  setSelectedLocation(location);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#0039D7] hover:text-white transition-colors ${
                  location === selectedLocation ? 'text-[#0039D7]' : 'text-[#1a1a1a]'
                }`}
              >
                {location}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}