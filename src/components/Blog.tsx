import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from './ThemeProvider';

type Category = 'Personal' | 'Career' | 'Academic' | 'Misc' | 'Fun';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  categories: Category[];
}

const posts: Post[] = [
  {
    slug: 'medication-extraction-llm-evaluation',
    title: 'When Your Medication Extraction Model Gets an A and Still Fails the Patient',
    date: 'January 14, 2026',
    excerpt: 'Aggregate F1 scores look fine. Stratified results tell a different story. I compared GPT-4o, BioMistral, and a regex baseline on clinical notes and found that all three systems collapse on oncology drug classes, for different reasons.',
    categories: ['Academic', 'Career']
  },
  {
    slug: 'nyc-transit-analysis',
    title: 'Does Heat Change How New Yorkers Take the Subway?',
    date: 'October 25, 2024',
    excerpt: 'An in-depth look at New York City\'s public transportation data and what it reveals about urban mobility.',
    categories: ['Academic', 'Career']
  },
  {
    slug: 'machine-learning-cities',
    title: 'Machine Learning for Urban Planning',
    date: 'October 20, 2024',
    excerpt: 'Exploring how machine learning can help us better understand and plan our cities.',
    categories: ['Academic', 'Career']
  },
  {
];

const allCategories: Category[] = ['Personal', 'Career', 'Academic', 'Misc', 'Fun'];

export default function Blog() {
  const { theme } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const clearCategories = () => {
    setSelectedCategories(new Set());
  };

  const filteredPosts = posts.filter(post => 
    selectedCategories.size === 0 || 
    post.categories.some(category => selectedCategories.has(category))
  );

  return (
    <div className="max-w-5xl mx-auto px-8">
      <h1 className={`text-5xl mb-8 ${theme === 'dark' ? 'text-white' : ''}`}>Posts</h1>
      
      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 items-center">
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategories.has(category)
                  ? theme === 'dark'
                    ? 'bg-[#cc2222] text-white'
                    : 'bg-[#cc2222] text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-[#2a1a1c]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
          {selectedCategories.size > 0 && (
            <button
              onClick={clearCategories}
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-[#2a1a1c]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <X size={14} className="mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <motion.article
            key={post.slug}
            whileHover={{ x: 4 }}
            transition={{ type: "tween" }}
            className={`blog-card ${theme === 'dark' ? 'hover:bg-[#2a1a1c]' : 'hover:bg-white'}`}
          >
            <Link to={`/blog/${post.slug}`} className="block group">
              <div className="mb-2 flex items-center gap-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-[#e05555]' : 'text-[#cc2222]/70'}`}>
                  {post.date}
                </span>
                <div className="flex gap-2">
                  {post.categories.map(category => (
                    <span
                      key={category}
                      className={`text-xs px-2 py-1 rounded-full ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <h2 className={`text-2xl mb-2 ${
                theme === 'dark' 
                  ? 'text-[#e05555] group-hover:text-[#cc2222]' 
                  : 'group-hover:text-[#aa1111]'
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
