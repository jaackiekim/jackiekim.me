import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const posts = {
  'about-me': {
    title: 'About Me',
    date: 'October 28, 2024',
    content: `Coming soon...`
  },
  'nyc-transit-analysis': {
    title: 'Analyzing NYC Transit Patterns',
    date: 'October 25, 2024',
    content: 'Coming soon...'
  },
  'machine-learning-cities': {
    title: 'Machine Learning for Urban Planning',
    date: 'October 20, 2024',
    content: 'Coming soon...'
  }
};

export default function BlogPost() {
  const { theme } = useTheme();
  const { slug } = useParams();
  const post = posts[slug as keyof typeof posts];

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-4xl mb-8 ${theme === 'dark' ? 'text-white' : ''}`}>Post not found</h1>
        <Link to="/blog" className={`${theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-[#0039D7] hover:text-[#002BB4]'}`}>
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <Link 
        to="/blog" 
        className={`inline-flex items-center space-x-2 ${
          theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-[#0039D7] hover:text-[#002BB4]'
        } mb-8`}
      >
        <ArrowLeft size={18} />
        <span>Back to blog</span>
      </Link>
      
      <article className="prose prose-lg">
        <div className="mb-2">
          <span className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-[#0039D7]'}`}>
            {post.date}
          </span>
        </div>
        <h1 className={`text-5xl font-normal mb-8 ${theme === 'dark' ? 'text-white' : 'text-[#1a1a1a]'}`}>
          {post.title}
        </h1>
        <div className={`text-lg whitespace-pre-line blog-content ${theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}`}>
          {post.content}
        </div>
      </article>
    </div>
  );
}
