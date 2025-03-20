import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const posts = {
  'about-me': {
    title: 'About Me',
    date: 'October 28, 2024',
    content: `
      I'm a data scientist and graduate student based in New York City, passionate about using data to understand and improve urban environments. My journey in data science began during my undergraduate years when I discovered the power of data in revealing patterns and insights about how cities function and how people interact with urban spaces.

      Currently, I'm pursuing my Master's in Data Science at Columbia University, where I focus on urban analytics and machine learning applications in city planning. My research interests lie at the intersection of data science and urban studies, particularly in areas such as:

      - Public transportation optimization
      - Housing affordability analysis
      - Social segregation patterns
      - Urban mobility patterns

      Through my work, I aim to contribute to making cities more equitable, efficient, and livable for all residents. I believe that data-driven insights can help us better understand urban challenges and develop more effective solutions.
    `
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
  const { slug } = useParams();
  const post = posts[slug as keyof typeof posts];

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl mb-8">Post not found</h1>
        <Link to="/blog" className="text-[#0039D7] hover:text-[#002BB4]">← Back to blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <Link 
        to="/blog" 
        className="inline-flex items-center space-x-2 text-[#0039D7] hover:text-[#002BB4] mb-8"
      >
        <ArrowLeft size={18} />
        <span>Back to blog</span>
      </Link>
      
      <article className="prose prose-lg">
        <div className="mb-2">
          <span className="text-sm text-[#0039D7]">{post.date}</span>
        </div>
        <h1 className="text-5xl font-normal mb-8 text-[#1a1a1a]">{post.title}</h1>
        <div className="text-lg text-[#1a1a1a] whitespace-pre-line blog-content">
          {post.content}
        </div>
      </article>
    </div>
  );
}