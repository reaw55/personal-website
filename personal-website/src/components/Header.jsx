// Desc: Header component for the website

//nodes modules
import { useState } from 'react';

// components
import Navbar from './Navbar';

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <header
      className="fixed top-0 left-0 w-full h-20 flex items-center 
        z-40 bg-gradient-to-b from-zinc-900 to-zinc-900/0"
    >
      <div className="max-w-screen-2xl w-full mx-auto px-4 
      flex justify-between items-center lg:px-6 lg:grid lg:grid-cols-[1fr,3fr,1fr]">
        <h1>
          <a href="/" className="logo">
            <img src="images/logo/logo-v1.svg" width={40} height={40} alt="logo" />
          </a>
        </h1>
        <div className="relative lg:justify-self-center">
          <button className="menu-btn lg:hidden" onClick={() => setNavOpen((prev) => !prev)}>
            <span className="material-symbols-rounded">
              {navOpen ? 'close' : 'menu'}
            </span>
          </button>
          <Navbar navOpen={navOpen} />
        </div>

        <a href="#contact" className="btn btn-secondary max-lg:hidden lg:justify-self-end">
          Contact Me
        </a>
      </div>
    </header>
  );
};

export default Header;
