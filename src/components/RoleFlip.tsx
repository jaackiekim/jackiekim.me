import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const roles = [
  "data scientist",
  "urban enthusiast",
  "photographer",
  "baker",
  "researcher",
  "engineer",
  "artist"
];

const startsWithVowel = (word: string) => {
  return /^[aeiou]/i.test(word);
};

export default function RoleFlip() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(roles[0]);
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
      <span className={theme === 'dark' ? 'text-gray-300' : ''}>
        I'm {startsWithVowel(selectedRole) ? 'an' : 'a'}{' '}
      </span>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center space-x-1 ${
          theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'
        } transition-colors`}
      >
        <span>{selectedRole}</span>
        <ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute left-0 mt-1 rounded-lg shadow-lg border py-1 min-w-[160px] z-50 ${
              theme === 'dark'
                ? 'bg-gray-800 border-[#3a2022]'
                : 'bg-white border-[#cc2222]/10'
            }`}
          >
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setSelectedRole(role);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  theme === 'dark'
                    ? `${role === selectedRole ? 'text-[#e05555]' : 'text-gray-300'} hover:bg-[#2a1a1c] hover:text-white`
                    : `${role === selectedRole ? 'text-[#cc2222]' : 'text-[#1a1a1a]'} hover:bg-[#cc2222] hover:text-white`
                } transition-colors`}
              >
                {role}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}