import { useState, useEffect } from 'react';

export default function useScrollSpy(ids, offset = 100) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      const currentActive = ids.reduce((current, id) => {
        const el = document.getElementById(id);
        if (!el) return current;
        return el.offsetTop <= scrollPosition ? id : current;
      }, ids[0]);

      if (currentActive !== activeId) {
        setActiveId(currentActive);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ids, offset, activeId]);

  return activeId;
}
