//footer

import { ButtonPrimary } from "./Button";

const sitemap = [
  {
    label: 'Home',
    href: '#home'
  },
  {
    label: 'About',
    href: '#about'
  },
  {
    label: 'Publication',
    href: '#publication'
  },
  {
    label: 'Awards',
    href: '#awards'
  },
  {
    label: 'Skills',
    href: '#skills'
  },
  {
    label: 'Certificates',
    href: '#certificates'
  },
  {
    label: 'Contact me',
    href: '#contact'
  }
];

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kritchavit-thippayajindakul'
  },
  {
    label: 'ResearchGate',
    href: 'https://www.researchgate.net/profile/Kritchavit-Thippayajindakul'
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/reaw5555'
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/reaw.kritchavit'
  },
  {
    label: 'GitHub',
    href: 'https://github.com/reaw55'
  }
];

const Footer = () => {
  return (
    <footer className="section">
      <div className = "container">
        <div className = "lg:grid lg:grid-cols-2" >
          <div className = "mb-10" >
            <h2 className = "headline-1 mb-8 lg:max-w-[12ch] reveal-up" >
            Questions? Reach Out Here
            </h2>
            <ButtonPrimary href="mailto:contact@reaw.dev" label="For Inquiries" icon="chevron_right" classes="reveal-up"/>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:pl-20">
            <div>
              <p className="mb-2 reveal-up">
                Sitemap
              </p>
              <ul className="">
                {sitemap.map(({ label, href }, key) => (
                  <li key={key}>
                    <a href={href} className="block text-sm text-zinc-400 py-1 transistion-colors hover:text-zinc-200 reveal-up">{label}</a>
                  </li>
                ))}
              </ul>

            </div>

            <div>
            <p className="mb-2 reveal-up">
              Socials
            </p>
            <ul className="">
              {socials.map(({ label, href }, key) => (
                <li key={key}>
                  <a href={href} target="_blank" className="block text-sm text-zinc-400 py-1 transistion-colors hover:text-zinc-200 reveal-up">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          </div>

          
        </div>

        <div className="flex items-center justify-between pt-10 mb-8">
          <a href="/" className="logo reveal-up">
            <img src="images/logo/logo-v1.svg" alt="logo" width={40} height={40} className="" />
          </a>

          <p className="text-zinc-500 text-sm reveal-up">
            &copy; 2024 <span className="text-zinc-200 ">Reaw </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer