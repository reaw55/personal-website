// node modules
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

//register plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

//component
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Awards from './components/Awards';
import Papers from './components/Papers';

// Respect the OS "reduce motion" setting (vestibular disorders, motion sickness).
// Read once at load: switching the smooth-scroll wrapper mid-visit would
// remount the whole page. The GSAP animations below still react live.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const App = () => {
  useGSAP(() => {
    // Scroll-reveal only when motion is OK; otherwise CSS shows content as-is.
    // gsap.matchMedia reverts the animations if the setting changes.
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.reveal-up').forEach((element) => {
        gsap.to(element, {
          scrollTrigger: {
            trigger: element,
            start: '-200 bottom',
            end: 'bottom 80%',
            scrub: true,
          },
          y: 0,
          opacity: 1,
          ease: 'power2.out',
        });
      });
    });
    return () => mm.revert();
  });

  const content = (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Papers />
        <Awards />
        <Skills />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );

  // Lenis smooth scrolling is skipped entirely for reduced-motion users.
  return prefersReducedMotion ? content : <ReactLenis root>{content}</ReactLenis>;
};

export default App;
