import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface Message {
  text: string;
  isBot: boolean;
}

interface QuestionResponse {
  question: string;
  response: string;
  keywords: string[];
}

const predefinedQA: QuestionResponse[] = [
  {
    question: "What's your background in data science?",
    response: "I have a Bachelor's in Data Science from UC Berkeley and a Master's in Information Science from Cornell Tech, both with concentrations in urban science. My experience spans various industries, including NASA JPL, a small urban analytics startup, and Apple, with a focus on using data science to improve quality of life.",
    keywords: ['background', 'education', 'data science', 'experience', 'Cornell', 'UC Berkeley', 'urban science', 'NASA', 'Apple']
  },
  {
    question: "What projects are you working on?",
    response: "I'm working on a data science project that connects renewable energy centers with data centers to meet energy demand sustainably. This involves using pvlib, an open-source Python library, to forecast energy production from various renewable sources. I'm collaborating with a team with MBA, electrical engineering, and public policy backgrounds to develop a scalable solution.",
    keywords: ['projects', 'current', 'work', 'renewable energy', 'data science', 'pvlib', 'forecasting', 'team']
  },
  {
    question: "What tools do you use?",
    response: "I primarily work with Python and SQL, using libraries like scikit-learn, matplotlib, and PyTorch. I also use Jupyter and Tableau for analysis and visualization. My work involves A/B testing, hypothesis testing, and forecasting to drive data-driven insights.",
    keywords: ['tools', 'Python', 'SQL', 'scikit-learn', 'PyTorch', 'Jupyter', 'Tableau', 'A/B testing', 'forecasting']
  },
  {
    question: "What are your research interests?",
    response: "I'm particularly interested in renewable energy, cleantech, and urban planning, focusing on how data can inform public policy and improve infrastructure. My work also explores bike lanes, social dynamics, and sustainable city development.",
    keywords: ['research', 'interests', 'renewable energy', 'cleantech', 'urban planning', 'public policy', 'bike lanes', 'social dynamics']
  },
  {
    question: "Tell me about your approach to data ethics.",
    response: "I believe in considering and consulting diverse perspectives to ensure ethical and responsible data use. My approach focuses on connecting data insights with real-world dynamics to create meaningful and fair outcomes.",
    keywords: ['ethics', 'perspectives', 'responsibility', 'real-world impact', 'fairness']
  },
  {
    question: "Tell me more about yourself.",
    response: "I was born in Los Angeles, CA, and have a passion for adventure - I have backpacked the Tour du Mont Blanc, hiking 11 days across France, Italy, and Switzerland! I love bikeable cities that prioritize sustainable and accessible transportation.",
    keywords: ['background', 'Los Angeles', 'travel', 'Tour du Mont Blanc', 'hiking', 'sparkling water', 'bikeable cities']
  },
  {
    question: "What are your work values?",
    response: "I value clear and frequent communication, as well as an open feedback culture where ideas can be shared and refined. I thrive in collaborative problem-solving environments, working with others to identify issues early and develop effective solutions.",
    keywords: ['values', 'communication', 'feedback', 'collaboration', 'problem-solving', 'teamwork']
  }
];

export default function ChatBot() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "I'm JackieBot. What would you like to know more about her?", isBot: true }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState(predefinedQA);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const filtered = predefinedQA.filter(qa => {
      const searchLower = searchQuery.toLowerCase();
      return qa.question.toLowerCase().includes(searchLower) ||
             qa.keywords.some(keyword => keyword.toLowerCase().includes(searchLower));
    });
    setFilteredQuestions(filtered);
  }, [searchQuery]);

  const handleQuestionClick = (qa: QuestionResponse) => {
    setMessages(prev => [
      ...prev,
      { text: qa.question, isBot: false },
      { text: qa.response, isBot: true }
    ]);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredQuestions.length > 0) {
      handleQuestionClick(filteredQuestions[0]);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-[#0039D7] hover:bg-[#002BB4]'} text-white px-6 py-3 rounded-full shadow-lg transition-colors duration-200 flex items-center space-x-3`}
      >
        <MessageCircle size={20} />
        <span className="font-normal">JackieBot: Learn More!</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.25 }}
              className={`fixed bottom-0 left-0 right-0 mx-4 md:bottom-8 md:right-8 md:left-auto md:w-96 max-h-[80vh] ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#FFFDE7]'} rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden flex flex-col`}
            >
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#0039D7]/10'} flex justify-between items-center`}>
                <h3 className={`${theme === 'dark' ? 'text-blue-400' : 'text-[#0039D7]'} font-normal text-lg`}>JackieBot v0</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.isBot 
                          ? theme === 'dark' 
                            ? 'bg-gray-800 text-gray-200'
                            : 'bg-[#F8F9FA] text-[#1a1a1a]'
                          : theme === 'dark'
                            ? 'bg-blue-500 text-white'
                            : 'bg-[#0039D7] text-white'
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-[#0039D7]/10 bg-[#FFFDE7]'}`}>
                <form onSubmit={handleSearchSubmit} className="mb-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Input keywords..."
                      className={`w-full p-3 pr-10 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-200 placeholder-gray-400 focus:ring-blue-500'
                          : 'bg-[#F8F9FA] text-[#1a1a1a] placeholder-[#1a1a1a]/60 focus:ring-[#0039D7]'
                      } focus:outline-none focus:ring-2`}
                    />
                    <button
                      type="submit"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                        theme === 'dark'
                          ? 'text-blue-400 hover:text-blue-300'
                          : 'text-[#0039D7] hover:text-[#002BB4]'
                      } transition-colors`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {filteredQuestions.map((qa, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(qa)}
                      className={`w-full text-left p-3 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-200 hover:bg-blue-500 hover:text-white'
                          : 'bg-[#F8F9FA] text-[#1a1a1a] hover:bg-[#0039D7] hover:text-white'
                      } transition-colors duration-200 text-sm`}
                    >
                      {qa.question}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
