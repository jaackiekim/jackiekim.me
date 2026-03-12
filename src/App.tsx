import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Github, ExternalLink, Linkedin, Mail, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatBot from './components/ChatBot';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import DSML from './components/DSML';
import RoleFlip from './components/RoleFlip';
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
                    to="/dsml" 
                    className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} transition-colors text-lg`}
                  >
                    ds/ml
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
            <Route path="/dsml" element={<DSML />} />
            <Route path="/" element={
              <div className="max-w-3xl mx-auto px-8">
                {/* About */}
                <div className="mb-16">
                  <h1 className={`text-5xl mb-8 ${theme === 'dark' ? 'text-white' : ''}`}>Jackie Kim</h1>
                  <div className="space-y-4 text-lg leading-relaxed">
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                      <RoleFlip /> based in New York. I build ML systems and care about the gap between
                      benchmark performance and whether a model is actually fit for purpose.
                    </p>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                      Most recently: data science at Apple (Siri Research) and NASA JPL. Cornell MS in Information Science.
                      Currently building a clinical NLP evaluation framework comparing LLMs on medication extraction
                      from medical text, focused on where and why they fail on oncology drug classes.
                    </p>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-[#1a1a1a]/70'}>
                      Outside of work: urban planning, photography, making things with my hands.
                    </p>
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h2 className={`text-3xl mb-8 ${theme === 'dark' ? 'text-white' : ''}`}>Projects</h2>
                  <div className="grid gap-6">
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "tween" }}
                      className={`project-card ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-white'}`}
                    >
                      <h3 className={`text-xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Clinical Medication Extraction: LLM Evaluation (2025)</h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                        Stratified evaluation of GPT-4o, BioMistral, and a regex+RxNorm baseline on clinical notes.
                        Aggregate F1 looks fine. Oncology drug class F1 is 0.14–0.35 — a failure mode that matters
                        for any downstream cohort study.
                      </p>
                      <div className="mt-2 flex gap-4">
                        <a href="https://github.com/jaackiekim/clinical-med-extraction" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} text-sm`}>
                          GitHub <ExternalLink size={12} className="ml-1" />
                        </a>
                        <a href="/blog/medication-extraction-llm-evaluation" className={`inline-flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-[#0039D7] hover:text-[#002BB4]'} text-sm`}>
                          Blog post <ExternalLink size={12} className="ml-1" />
                        </a>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "tween" }}
                      className={`project-card ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-white'}`}
                    >
                      <h3 className={`text-xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Siri Annotation Quality Framework, Apple (2024)</h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                        Inter-annotator agreement framework for voice assistant evaluation. Identified a bimodal
                        IAA distribution, set a data-driven quality threshold, reduced annotation costs by ~15%.
                        NDA — not publicly available.
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "tween" }}
                      className={`project-card ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-white'}`}
                    >
                      <h3 className={`text-xl mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>NYC Transit Resilience Analysis (2024)</h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}>
                        Analysis of NYC public transportation vulnerability during heat events using MTA ridership,
                        NOAA temperature, and census data.
                      </p>
                    </motion.div>
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
