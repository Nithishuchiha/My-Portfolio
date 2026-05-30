import { motion } from 'framer-motion';

const SKILLS = {
  Languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'SQL'],
  Frameworks: ['React', 'Next.js', 'Node.js', 'FastAPI', 'TensorFlow', 'Tailwind CSS'],
  Tools: ['Git', 'Docker', 'AWS', 'Figma', 'PostgreSQL', 'Redis'],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
};

export default function About() {
  return (
    <section id="about" className="section" style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          About <span className="gradient-text">Me</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'var(--text-dim)',
            marginBottom: '3rem',
            maxWidth: '700px',
          }}
        >
          I'm a passionate developer and designer who loves building things that live on the internet.
          I specialize in creating exceptional digital experiences with clean code and thoughtful design.
          When I'm not coding, you'll find me exploring new technologies, contributing to open-source,
          or crafting pixel-perfect interfaces.
        </motion.p>

        {Object.entries(SKILLS).map(([category, skills], catIndex) => (
          <div key={category} style={{ marginBottom: '2rem' }}>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: catIndex * 0.1 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '0.75rem',
              }}
            >
              {category}
            </motion.h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              {skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.08,
                    boxShadow: '0 0 20px var(--accent-glow)',
                    borderColor: 'var(--accent)',
                  }}
                  className="glass"
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--text)',
                    cursor: 'default',
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
