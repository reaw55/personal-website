// Navbar.jsx

// Node modules
import { useRef, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const Navbar = ({ navOpen }) => {
  const lastActiveLink = useRef();
  const activeBox = useRef();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const LARGE_SCREEN_WIDTH = 1024;
  


  // Define individual refs for each nav item at the top level
  const homeRef = useRef();
  const aboutRef = useRef();
  const publicationRef = useRef();
  const awardsRef = useRef();
  const skillsRef = useRef();
  const certificatesRef = useRef();
  const contactRef = useRef();

  // Memoize navItems to prevent unnecessary re-creations on each render
  const navItems = useMemo(
    () => [
      { label: 'Home', link: '#home', className: 'nav-link', ref: homeRef },
      { label: 'About', link: '#about', className: 'nav-link', ref: aboutRef },
      { label: 'Publication', link: '#publication', className: 'nav-link', ref: publicationRef },
      { label: 'Awards', link: '#awards', className: 'nav-link', ref: awardsRef },
      { label: 'Skills', link: '#skills', className: 'nav-link', ref: skillsRef },
      { label: 'Certificates', link: '#certificates', className: 'nav-link', ref: certificatesRef },
      { label: 'Contact', link: '#contact', className: 'nav-link lg:hidden', ref: contactRef },
    ],
    [] // Empty dependency array ensures this is only created once
  );

  // Initialize active box position based on the initial active link
  const initActiveBox = () => {
    if (lastActiveLink.current && activeBox.current) {
      activeBox.current.style.top = `${lastActiveLink.current.offsetTop}px`;
      activeBox.current.style.left = `${lastActiveLink.current.offsetLeft}px`;
      activeBox.current.style.width = `${lastActiveLink.current.offsetWidth}px`;
      activeBox.current.style.height = `${lastActiveLink.current.offsetHeight}px`;
    }
  };

  useEffect(() => {
    initActiveBox();

    const handleResize = () => {
      initActiveBox();
      setIsLargeScreen(window.innerWidth >= LARGE_SCREEN_WIDTH);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle click on navigation links
  const activeCurrentLink = (event) => {
    if (lastActiveLink.current) {
      lastActiveLink.current.classList.remove('active');
    }
    event.target.classList.add('active');
    lastActiveLink.current = event.target;

    if (activeBox.current) {
      activeBox.current.style.top = `${event.target.offsetTop}px`;
      activeBox.current.style.left = `${event.target.offsetLeft}px`;
      activeBox.current.style.width = `${event.target.offsetWidth}px`;
      activeBox.current.style.height = `${event.target.offsetHeight}px`;
    }
  };

  // Handle scroll to update active link
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Filter out the 'Contact' section if on large screens
      const sections = navItems
        .filter((item) => !(isLargeScreen && item.label === 'Contact'))
        .map((item) => document.querySelector(item.link))
        .filter(Boolean); // Ensure the element exists

      let currentSection = sections[0];

      for (const section of sections) {
        if (section.offsetTop <= scrollPosition) {
          currentSection = section;
        } else {
          break;
        }
      }

      const activeLink = navItems.find((item) => item.link === `#${currentSection.id}`);

      if (activeLink && activeLink.ref.current && lastActiveLink.current !== activeLink.ref.current) {
        // Remove active class from previous
        if (lastActiveLink.current) {
          lastActiveLink.current.classList.remove('active');
        }

        // Add active class to current
        activeLink.ref.current.classList.add('active');
        lastActiveLink.current = activeLink.ref.current;

        // Move the active box
        if (activeBox.current) {
          activeBox.current.style.top = `${activeLink.ref.current.offsetTop}px`;
          activeBox.current.style.left = `${activeLink.ref.current.offsetLeft}px`;
          activeBox.current.style.width = `${activeLink.ref.current.offsetWidth}px`;
          activeBox.current.style.height = `${activeLink.ref.current.offsetHeight}px`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Call handler once to set the initial active link
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLargeScreen, navItems]);

  return (
    <nav className={`navbar ${navOpen ? 'active' : ''}`}>
      {navItems.map(({ label, link, className, ref }, key) => (
        <a
          href={link}
          key={key}
          ref={ref}
          className={className}
          onClick={activeCurrentLink}
        >
          {label}
        </a>
      ))}
      <div className="active-box" ref={activeBox}></div>
    </nav>
  );
};

Navbar.propTypes = {
  navOpen: PropTypes.bool.isRequired,
};

export default Navbar;
