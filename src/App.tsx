import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Github, ExternalLink, Linkedin, Mail, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import DSML from './components/DSML';
import { useTheme } from './components/ThemeProvider';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen relative ${theme === 'dark' ? 'dark bg-[#1a1012]' : 'bg-[#fdf6f6]'}`}>
        {/* Fixed Header */}
        <header className={`fixed top-0 left-0 right-0 ${theme === 'dark' ? 'bg-[#1a1012]' : 'bg-[#fdf6f6]'} z-50 border-b ${theme === 'dark' ? 'border-[#3a2022]' : 'border-[#cc2222]/10'}`}>
          <div className="max-w-7xl mx-auto py-4 px-8 flex justify-between items-center">
            <div className="flex space-x-4">
              <a 
                href="https://github.com/jaackiekim" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} transition-colors`}
              >
                <Github size={16} />
              </a>
              <a 
                href="https://linkedin.com/in/jaackiekim" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} transition-colors`}
              >
                <Linkedin size={16} />
              </a>
              <div className="relative group">
                <button
                  className={`${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} transition-colors`}
                >
                  <Mail size={16} />
                </button>
                <div className={`absolute right-0 top-6 px-3 py-1.5 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ${theme === 'dark' ? 'bg-[#2a1a1c] text-gray-200 border border-[#3a2022]' : 'bg-white text-[#1a1a1a] border border-gray-200'} shadow-md`}>
                  jaackiekim@gmail.com
                </div>
              </div>
            </div>
            <nav>
              <ul className="flex space-x-8 items-center">
                <li>
                  <button
                    onClick={toggleTheme}
                    className={`${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} transition-colors text-lg flex items-center`}
                  >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                </li>
                <li>
                  <Link 
                    to="/" 
                    className={`${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} transition-colors text-lg`}
                  >
                    home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dsml" 
                    className={`${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} transition-colors text-lg`}
                  >
                    ds/ml
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog" 
                    className={`${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} transition-colors text-lg`}
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
            <Route path="/dsml" element={<DSML />} />
            <Route path="/" element={
              <div className="max-w-3xl mx-auto px-8">
                {/* About */}
                <div className="mb-16">
                  <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src="/profile.jpg"
                        alt="Jackie Kim"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <h1 className={`text-5xl mb-3 ${theme === 'dark' ? 'text-white' : ''}`}>Jackie Kim</h1>
                      <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}`}>
                        Data scientist. Cornell, Apple, NASA. Based in New York.
                      </p>
                      <p className={`text-base mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#1a1a1a]/60'}`}>
                        I work on problems where better measurement leads to more humane outcomes, in health, cities, and infrastructure.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h2 className={`text-3xl mb-8 ${theme === 'dark' ? 'text-white' : ''}`}>Projects</h2>
                  <div className="grid gap-6">

                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "tween" }}
                      className={`project-card ${theme === 'dark' ? 'hover:bg-[#2a1a1c]' : 'hover:bg-white'}`}
                    >
                      <h3 className={`text-xl mb-1 ${theme === 'dark' ? 'text-white' : ''}`}>Project Solstice</h3>
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#1a1a1a]/60'}`}>Co-founder · U.S. Dept. of Energy Prize Winner · 2025</p>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                        Introducing the grid's backlog to something more renewable.
                      </p>
                      <div className="mt-2">
                        <a href="https://www.energy.gov/technologycommercialization/articles/energytech-university-prize-2025-student-winners-announced" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center ${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} text-sm`}>
                          DOE announcement <ExternalLink size={12} className="ml-1" />
                        </a>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "tween" }}
                      className={`project-card ${theme === 'dark' ? 'hover:bg-[#2a1a1c]' : 'hover:bg-white'}`}
                    >
                      <h3 className={`text-xl mb-1 ${theme === 'dark' ? 'text-white' : ''}`}>Clinical Medication Extraction</h3>
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#1a1a1a]/60'}`}>LLM evaluation · 2025</p>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                        A stratified evaluation of GPT-4o, BioMistral, and a regex baseline on clinical medication extraction.
                      </p>
                      <div className="mt-2 flex gap-4">
                        <a href="https://github.com/jaackiekim/clinical-med-extraction" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center ${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} text-sm`}>
                          GitHub <ExternalLink size={12} className="ml-1" />
                        </a>
                        <a href="/blog/medication-extraction-llm-evaluation" className={`inline-flex items-center ${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} text-sm`}>
                          Blog post <ExternalLink size={12} className="ml-1" />
                        </a>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "tween" }}
                      className={`project-card ${theme === 'dark' ? 'hover:bg-[#2a1a1c]' : 'hover:bg-white'}`}
                    >
                      <h3 className={`text-xl mb-1 ${theme === 'dark' ? 'text-white' : ''}`}>Siri Annotation Quality Framework</h3>
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#1a1a1a]/60'}`}>Apple · 2024 · NDA</p>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                        Saved $90K and 5,000 QA hours by finding the data that wasn't worth labeling.
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "tween" }}
                      className={`project-card ${theme === 'dark' ? 'hover:bg-[#2a1a1c]' : 'hover:bg-white'}`}
                    >
                      <h3 className={`text-xl mb-1 ${theme === 'dark' ? 'text-white' : ''}`}>NYC Transit Resilience Analysis</h3>
                      <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#1a1a1a]/60'}`}>2024</p>
                      <p className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}`}>
                        How heat waves change who takes the subway, and who doesn't have a choice.
                      </p>
                      <div className="mt-2 flex gap-4">
                        <a href="/blog/nyc-transit-analysis" className={`inline-flex items-center ${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'} text-sm`}>
                          Blog post <ExternalLink size={12} className="ml-1" />
                        </a>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="mt-16 mb-6">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#1a1a1a]/60'} text-center`}>
                    made with <span className={theme === 'dark' ? 'text-[#e05555]' : 'text-[#cc2222]'}>❤</span> in nyc
                  </p>
                </div>
              </div>
            } />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;
