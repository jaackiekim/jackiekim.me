import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const posts = [
  {
    slug: 'about-me',
    title: 'About Me',
    date: 'October 28, 2024',
    excerpt: 'A brief introduction to who I am and my journey in data science.',
  },
  {
    slug: 'nyc-transit-analysis',
    title: 'Analyzing NYC Transit Patterns',
    date: 'October 25, 2024',
    excerpt: 'An in-depth look at New York City\'s public transportation data and what it reveals about urban mobility.',
  },
  {
    slug: 'machine-learning-cities',
    title: 'Machine Learning for Urban Planning',
    date: 'October 20, 2024',
    excerpt: 'Exploring how machine learning can help us better understand and plan our cities.',
  }
];

export default function Blog() {
  const { theme } = useTheme();

  return (
    <div className="max-w-5xl mx-auto px-8">
      <h1 className={`text-5xl mb-12 ${theme === 'dark' ? 'text-white' : ''}`}>Publications</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <motion.article
            key={post.slug}
            whileHover={{ x: 4 }}
            transition={{ type: "tween" }}
            className={`blog-card ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-white'}`}
          >
            <Link to={`/blog/${post.slug}`} className="block group">
              <div className="mb-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-[#0039D7]/70'}`}>
                  {post.date}
                </span>
              </div>
              <h2 className={`text-2xl mb-2 ${
                theme === 'dark' 
                  ? 'text-blue-300 group-hover:text-blue-200' 
                  : 'group-hover:text-[#002BB4]'
              } transition-colors`}>
                {post.title}
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}`}>
                {post.excerpt}
              </p>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
