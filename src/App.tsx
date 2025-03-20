import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Github, ExternalLink, Linkedin, Mail, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatBot from './components/ChatBot';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import RoleFlip from './components/RoleFlip';
import LocationFlip from './components/LocationFlip';
import LocationFlip2 from './components/LocationFlip2';
import { useTheme } from './components/ThemeProvider';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen relative ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-[#FFFDE7]'}`}>
        {/* Fixed Header */}
        <header className={`fixed top-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#FFFDE7]'} z-50 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#0039D7]/10'}`}>
          <div className="max-w-7xl mx-auto py-4 px-8 flex justify-between items-center">
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} transition-colors`}
              >
                <Github size={16} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} transition-colors`}
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="mailto:contact@example.com" 
                className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} transition-colors`}
              >
                <Mail size={16} />
              </a>
            </div>
            <nav>
              <ul className="flex space-x-8 items-center">
                <li>
                  <button
                    onClick={toggleTheme}
                    className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} transition-colors text-lg flex items-center`}
                  >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                </li>
                <li>
                  <Link 
                    to="/" 
                    className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} transition-colors text-lg`}
                  >
                    home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog" 
                    className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} transition-colors text-lg`}
                  >
                    blog
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="pt-24">
          <Routes>
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/" element={
              <div className="max-w-7xl mx-auto px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Left Column with Photo - Hidden on Mobile */}
                  <div className="hidden lg:block lg:w-32">
                    <div className="w-32 h-32 bg-[#0039D7]/5 rounded-2xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1517849845537-4d257902454a" 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Right Column with Content */}
                  <div className="lg:flex-1">
                    {/* About Me Section */}
                    <div className="mb-16">
                      <h2 className={`text-5xl mb-6 ${theme === 'dark' ? 'text-white' : ''}`}>About Me</h2>
                      <div className="space-y-4 text-lg leading-relaxed">
                        <p className={theme === 'dark' ? 'text-gray-300' : ''}>
                          <RoleFlip /> focused on building a career that blends innovation, data-driven decision-making, and human connection. My work involves analyzing complex datasets, deriving actionable insights, and crafting compelling narratives to drive impactful product decisions. I specialize in data science techniques, statistical modeling, and effective visualization to communicate findings clearly and influence key stakeholders. I'm interested in data, sustainability, and urban planning, amongst other things.
                        </p>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-[#1a1a1a]/80'}>
                          Currently based in <LocationFlip />, but dreaming of being in <LocationFlip2 />.
                        </p>
                      </div>
                    </div>

                    {/* Notable Projects Section */}
                    <div>
                      <h2 className={`text-5xl mb-8 ${theme === 'dark' ? 'text-white' : ''}`}>Notable Projects</h2>
                      <div className="grid gap-6">
                        <motion.div 
                          whileHover={{ x: 4 }}
                          transition={{ type: "tween" }}
                          className={`project-card ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-white'}`}
                        >
                          <h3 className={`text-xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>NYC Transit Analysis (2024)</h3>
                          <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                            A comprehensive analysis of NYC's public transportation patterns using Python and machine learning to increase resilience during heat waves.
                          </p>
                          <div className="mt-2">
                            <a href="#" className={`inline-flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} text-sm`}>
                              View Project (coming soon) <ExternalLink size={14} className="ml-1" />
                            </a>
                          </div>
                        </motion.div>

                        <motion.div 
                          whileHover={{ x: 4 }}
                          transition={{ type: "tween" }}
                          className={`project-card ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-white'}`}
                        >
                          <h3 className={`text-xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Siri Research Project, Data Science Intern (2024)</h3>
                          <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                            Data science intern for a Siri research project. Reduced operational costs by ~15%.
                          </p>
                          <div className="mt-2">
                            <a href="#" className={`inline-flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} text-sm`}>
                              View Project (unavailable for NDA) <ExternalLink size={14} className="ml-1" />
                            </a>
                          </div>
                        </motion.div>

                        <motion.div 
                          whileHover={{ x: 4 }}
                          transition={{ type: "tween" }}
                          className={`project-card ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-white'}`}
                        >
                          <h3 className={`text-xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>AI-detected Speech Detector (2024)</h3>
                          <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                            ML model on detecting AI-produced text.
                          </p>
                          <div className="mt-2">
                            <a href="#" className={`inline-flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} text-sm`}>
                              View Project (coming soon) <ExternalLink size={14} className="ml-1" />
                            </a>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-16 mb-6">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#1a1a1a]/60'} text-center`}>
                    made with <span className={theme === 'dark' ? 'text-blue-400' : 'text-[#0039D7]'}>❤</span> in nyc
                  </p>
                </div>
              </div>
            } />
          </Routes>
        </div>

        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
