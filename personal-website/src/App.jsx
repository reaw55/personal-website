
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
//import Work from './components/Work';
import Footer from './components/Footer';
import Awards from './components/Awards';
import Papers from './components/Papers';

const App = () => {
  useGSAP(()=> {
    const elements = gsap.utils.toArray('.reveal-up');
    elements.forEach((element) => {
      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: '-200 bottom',
          end: 'bottom 80%',
          scrub: true
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      });
    });
  })
  return (
    <ReactLenis root>
      <Header />
      <main>
        <Hero />
        <About />
        <Papers />
        <Awards />
        <Skills />
        <Certificates />
        {/* <Work /> */}
        
        <Contact />
      </main>
      <Footer />
    </ReactLenis>
  );
}
export default App;