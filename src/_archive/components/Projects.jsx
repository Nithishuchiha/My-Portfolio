import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import projectData, { categories } from '../data/projects';
import ProjectStack from './ProjectStack';
import SkeletonGrid from './SkeletonGrid';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('webdev');
  const [loading, setLoading] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(
    projectData.filter((p) => p.category === 'webdev')
  );

  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setLoading(true);
    setActiveCategory(category);
  };

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setFilteredProjects(projectData.filter((p) => p.category === activeCategory));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [loading, activeCategory]);

  return (
    <section id="projects" className="section">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '2rem',
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          My <span className="gradient-text">Projects</span>
        </motion.h2>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                id={`tab-${cat.key}`}
                onClick={() => handleCategoryChange(cat.key)}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '999px',
                  border: isActive ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  transition: 'all 0.3s ease',
                  background: isActive ? 'rgba(var(--accent-rgb), 0.15)' : 'var(--glass-bg)',
                  color: isActive ? 'var(--accent)' : 'var(--text-dim)',
                  boxShadow: isActive ? '0 0 20px rgba(var(--accent-rgb), 0.1)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.borderColor = 'rgba(var(--accent-rgb), 0.3)';
                    e.target.style.color = 'var(--text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.borderColor = 'var(--glass-border)';
                    e.target.style.color = 'var(--text-dim)';
                  }
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SkeletonGrid />
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ProjectStack projects={filteredProjects} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
