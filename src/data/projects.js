const projects = [
  // ── Web Dev ──
  {
    id: 1,
    title: 'College Travel Booking',
    description:
      'A full-stack web application for booking college travel trips. Students can browse available trips, register, and manage their bookings through a clean, responsive interface.',
    category: 'webdev',
    tech: ['JavaScript', 'Node.js', 'MySQL', 'HTML/CSS'],
    image: '/hero/hero-1.jpeg',
    link: 'https://github.com/Nithishuchiha/College_Travel_Booking',
    github: 'https://github.com/Nithishuchiha/College_Travel_Booking',
  },
  {
    id: 2,
    title: 'TK Overseas Portfolio',
    description:
      'A professional portfolio website built for a client in the overseas recruitment industry. Features service showcases, contact forms, and a modern responsive design tailored to the brand.',
    category: 'webdev',
    tech: ['JavaScript', 'React', 'CSS', 'Vite'],
    image: '/hero/hero-2.png',
    link: 'https://github.com/Nithishuchiha/clients_portfolio_project',
    github: 'https://github.com/Nithishuchiha/clients_portfolio_project',
  },
  {
    id: 3,
    title: 'Pharma Web App',
    description:
      'A pharmacy management web application that streamlines drug inventory, prescription handling, and sales tracking for small-to-medium pharmacy businesses.',
    category: 'webdev',
    tech: ['JavaScript', 'React', 'Node.js', 'MySQL'],
    image: '/hero/hero-3.png',
    link: 'https://github.com/Nithishuchiha',
    github: 'https://github.com/Nithishuchiha',
  },
  {
    id: 4,
    title: 'Railmadad Clone',
    description:
      'A feature-rich clone of the Indian Railways complaint management portal (Railmadad). Users can raise, track, and resolve railway-related complaints with a streamlined UI.',
    category: 'webdev',
    tech: ['JavaScript', 'React', 'Node.js', 'CSS'],
    image: '/hero/hero-4.jpeg',
    link: 'https://github.com/Nithishuchiha',
    github: 'https://github.com/Nithishuchiha',
  },

  // ── Automation ──
  {
    id: 5,
    title: 'Habit Tracker Generator',
    description:
      'A Google Apps Script that auto-generates a fully formatted habit tracker spreadsheet in Google Sheets. Includes color-coded days, streak tracking, and weekly summaries — all from a single script run.',
    category: 'automation',
    tech: ['Google Apps Script', 'Google Sheets', 'JavaScript'],
    image: '/hero/hero-1.jpeg',
    link: 'https://github.com/Nithishuchiha/Habit_tracker',
    github: 'https://github.com/Nithishuchiha/Habit_tracker',
  },

  // ── Design ──
  {
    id: 6,
    title: 'My Portfolio V2',
    description:
      'A cinematic, animation-rich developer portfolio built with React, Framer Motion, and GSAP. Features a frame-by-frame flipbook background, 3D card carousels, and glassmorphism UI.',
    category: 'design',
    tech: ['React', 'Framer Motion', 'GSAP', 'Vite'],
    image: '/hero/hero-2.png',
    link: 'https://github.com/Nithishuchiha/My-Portfolio',
    github: 'https://github.com/Nithishuchiha/My-Portfolio',
  },
  {
    id: 7,
    title: 'Muthu Ganesh Animated Portfolio',
    description:
      'A creative animated portfolio built for a client, featuring smooth entrance animations, interactive sections, and a visually striking design that showcases the client\'s personality and work.',
    category: 'design',
    tech: ['JavaScript', 'CSS Animations', 'HTML', 'GSAP'],
    image: '/hero/hero-3.png',
    link: 'https://github.com/Nithishuchiha/Application_Development_Project',
    github: 'https://github.com/Nithishuchiha/Application_Development_Project',
  },

  // ── Learning & Practice ──
  {
    id: 8,
    title: 'DSA Problem Solving',
    description:
      'A curated repository of Data Structures & Algorithms solutions written in Java and C++. Covers arrays, linked lists, trees, graphs, dynamic programming, and more — solved on LeetCode.',
    category: 'learning',
    tech: ['Java', 'C++', 'LeetCode', 'Algorithms'],
    image: '/hero/hero-4.jpeg',
    link: 'https://github.com/Nithishuchiha/DSA_Problem_Solving',
    github: 'https://github.com/Nithishuchiha/DSA_Problem_Solving',
  },
  {
    id: 9,
    title: 'Cognizant Java FSE Training',
    description:
      'A comprehensive collection of Java Full Stack Engineering exercises and projects completed during Cognizant Digital Nurture training. Covers Spring Boot, REST APIs, JPA, and front-end integration.',
    category: 'learning',
    tech: ['Java', 'Spring Boot', 'JPA', 'JavaScript'],
    image: '/hero/hero-1.jpeg',
    link: 'https://github.com/Nithishuchiha/Cognizant_Digital_Nature_java_fse',
    github: 'https://github.com/Nithishuchiha/Cognizant_Digital_Nature_java_fse',
  },
  {
    id: 10,
    title: 'Antigravity — AI Coding Assistant',
    description:
      "Google DeepMind's agentic AI pair programmer. I use Antigravity daily to plan, build, and refine full-stack projects — from writing clean component code to debugging complex logic, all in natural language.",
    category: 'learning',
    tech: ['AI', 'Google DeepMind', 'Prompt Engineering', 'Agentic Coding'],
    image: '/hero/hero-2.png',
    link: 'https://deepmind.google',
    github: 'https://github.com/Nithishuchiha',
  },
  {
    id: 11,
    title: 'OpenCode — AI Terminal IDE',
    description:
      'An open-source, AI-native coding environment by SST. I run OpenCode locally for LLM-assisted completions, refactors, and context-aware suggestions right inside the terminal.',
    category: 'learning',
    tech: ['OpenCode', 'LLM', 'Terminal', 'Open Source'],
    image: '/hero/hero-3.png',
    link: 'https://opencode.ai',
    github: 'https://github.com/sst/opencode',
  },
];

export default projects;

export const categories = [
  { key: 'webdev',    label: 'Web Dev',           color: '#39FF14', iconColor: '#39FF14', icon: 'webdev' },
  { key: 'learning',  label: 'Learning & Practice', color: '#60A5FA', iconColor: '#60A5FA', icon: 'ai' },
  { key: 'automation', label: 'Automation',        color: '#FBBF24', iconColor: '#FBBF24', icon: 'automation' },
  { key: 'design',    label: 'Design',             color: '#A855F7', iconColor: '#A855F7', icon: 'design' },
];
