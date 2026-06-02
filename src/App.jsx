import HeroCanvas from './components/HeroCanvas';
import Navbar from './components/Navbar';
import About from './components/About';
import Projects from './components/Projects';
import Footer from './components/Footer';
import AccentSwitcher from './components/AccentSwitcher';
import PageTransition from './components/PageTransition';
import CustomCursor from './components/CustomCursor';
import { asset } from './lib/basepath';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <CustomCursor />
      <PageTransition />
      {/* Global background image (for About/Projects/Contact) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${asset('/hero/background.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(1.05) contrast(1.02)',
          }}
        />

        {/* Light veil so content stays readable over image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(246,250,255,0.12) 0%, rgba(246,250,255,0.28) 55%, rgba(246,250,255,0.50) 100%)',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <AccentSwitcher />
        <main>
          <HeroCanvas />
          <About />
          <Projects />
          <Footer />
        </main>
      </div>
    </div>
  );
}
