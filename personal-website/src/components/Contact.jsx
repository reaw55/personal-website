//contact section
//import ContactForm from "./Contactform";

const socialLinks = [
  {
    href: "https://github.com/reaw55",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48603 2 2 6.48604 2 12C2 17.514 6.48603 22 12 22C17.514 22 22 17.514 22 12C22 6.48604 17.514 2 12 2ZM12 3.5C16.7033 3.5 20.5 7.2967 20.5 12C20.5 15.8327 17.9785 19.0613 14.5 20.126V17.5684C14.5 16.6133 13.9497 15.7943 13.1543 15.3867C13.9276 15.2388 14.6457 14.9454 15.249 14.5309C15.8522 14.1165 16.3232 13.5929 16.6228 13.0037C16.9224 12.4145 17.0421 11.7765 16.9718 11.1429C16.9015 10.5093 16.6434 9.89818 16.2188 9.36035C16.4405 8.67771 16.6883 7.48034 16.0996 6.53809C14.9647 6.53809 14.2323 7.31604 13.8828 7.7998C13.2853 7.60352 12.6459 7.5017 12 7.5C11.3537 7.50057 10.7136 7.60139 10.1152 7.79688C9.76487 7.31289 9.03311 6.53809 7.90039 6.53809C7.22486 7.61941 7.64246 8.78228 7.86621 9.25684C7.41288 9.79235 7.12862 10.4078 7.03781 11.0505C6.94699 11.6931 7.05233 12.3438 7.34478 12.9468C7.63723 13.5498 8.10809 14.087 8.71698 14.5124C9.32587 14.9379 10.0546 15.2389 10.8408 15.3896C10.1877 15.7262 9.69864 16.337 9.54883 17.0781H8.8916C8.2431 17.0781 7.99112 16.8146 7.64062 16.3701C7.29463 15.9256 6.92259 15.6269 6.47559 15.5029C6.23459 15.4774 6.07223 15.6607 6.28223 15.8232C6.99173 16.3062 7.0407 17.0968 7.3252 17.6143C7.5842 18.0803 8.11484 18.5 8.71484 18.5H9.5V20.126C6.02153 19.0613 3.5 15.8327 3.5 12C3.5 7.2967 7.29669 3.5 12 3.5Z"
          fill="currentColor"
        />
      </svg>
    ),
    alt: "GitHub",
  },
  {
    href: "https://www.facebook.com/reaw.kritchavit",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="scale(0.9) translate(1, 1)">
          <path
            d="M12 0C5.37258 0 0 5.37258 0 12C0 17.9893 4.4757 22.7374 10.3438 23.8333V15.6875H7.8125V12H10.3438V9.46875C10.3438 6.99374 11.8748 5.5 14.0312 5.5C15.4062 5.5 16.75 5.6875 16.75 5.6875V8.25H15.3438C14.0188 8.25 13.6562 9.15625 13.6562 10V12H16.625L16.1875 15H13.6562V23.8333C19.5243 22.7374 24 17.9893 24 12C24 5.37258 18.6274 0 12 0Z"
            fill="currentColor"
          />
        </g>
      </svg>
    ),
    alt: "Facebook",
  },

  {
    href: "https://www.instagram.com/reaw5555",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.75 2.5C5.58319 2.5 3 5.08319 3 8.25V15.75C3 18.9164 5.5831 21.5 8.75 21.5H16.25C19.4165 21.5 22 18.9165 22 15.75V8.25C22 5.0831 19.4164 2.5 16.25 2.5H8.75ZM8.75 4H16.25C18.6056 4 20.5 5.8939 20.5 8.25V15.75C20.5 18.1055 18.6055 20 16.25 20H8.75C6.3939 20 4.5 18.1056 4.5 15.75V8.25C4.5 5.89381 6.39381 4 8.75 4ZM17.5 6C16.9475 6 16.5 6.4475 16.5 7C16.5 7.5525 16.9475 8 17.5 8C18.0525 8 18.5 7.5525 18.5 7C18.5 6.4475 18.0525 6 17.5 6ZM12.5 7C9.74759 7 7.5 9.24759 7.5 12C7.5 14.7524 9.74759 17 12.5 17C15.2524 17 17.5 14.7524 17.5 12C17.5 9.24759 15.2524 7 12.5 7ZM12.5 8.5C14.4416 8.5 16 10.0584 16 12C16 13.9416 14.4416 15.5 12.5 15.5C10.5584 15.5 9 13.9416 9 12C9 10.0584 10.5584 8.5 12.5 8.5Z"
          fill="currentColor"
        />
      </svg>
    ),
    alt: "Instagram",
  },
  {
    href: "https://www.linkedin.com/in/kritchavit-thippayajindakul",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.75 3C4.24011 3 3 4.24011 3 5.75V18.25C3 19.7599 4.24011 21 5.75 21H18.25C19.7599 21 21 19.7599 21 18.25V5.75C21 4.24011 19.7599 3 18.25 3H5.75ZM5.75 4.5H18.25C18.9491 4.5 19.5 5.05089 19.5 5.75V18.25C19.5 18.9491 18.9491 19.5 18.25 19.5H5.75C5.05089 19.5 4.5 18.9491 4.5 18.25V5.75C4.5 5.05089 5.05089 4.5 5.75 4.5ZM7.75 6.5C7.41848 6.5 7.10054 6.6317 6.86612 6.86612C6.6317 7.10054 6.5 7.41848 6.5 7.75C6.5 8.08152 6.6317 8.39946 6.86612 8.63388C7.10054 8.8683 7.41848 9 7.75 9C8.08152 9 8.39946 8.8683 8.63388 8.63388C8.8683 8.39946 9 8.08152 9 7.75C9 7.41848 8.8683 7.10054 8.63388 6.86612C8.39946 6.6317 8.08152 6.5 7.75 6.5ZM7 10C6.7235 10 6.5 10.2235 6.5 10.5V17C6.5 17.2765 6.7235 17.5 7 17.5H8.5C8.7765 17.5 9 17.2765 9 17V10.5C9 10.2235 8.7765 10 8.5 10H7ZM10.5 10C10.2235 10 10 10.2235 10 10.5V17C10 17.2765 10.2235 17.5 10.5 17.5H12C12.2765 17.5 12.5 17.2765 12.5 17V13.25C12.5 12.5605 13.0605 12 13.75 12C14.4395 12 15 12.5605 15 13.25V17C15 17.2765 15.2235 17.5 15.5 17.5H17C17.2765 17.5 17.5 17.2765 17.5 17V13C17.5 11.3455 16.1545 10 14.5 10C13.731 10 13.0315 10.293 12.5 10.7705V10.5C12.5 10.2235 12.2765 10 12 10H10.5Z"
          fill="currentColor"
        />
      </svg>
    ),
    alt: "LinkedIn",
  },
  {
    href: "https://www.researchgate.net/profile/Kritchavit-Thippayajindakul",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="scale(0.75) translate(40, 10)">
          <path
            d="M160.2.25c14.25 0 23.75 7.65 28.1 18.2l-11.5 4.7c-2.75-7.2-8.45-11.35-16.6-11.35a16.757 16.757 0 0 0-12.3 5.25c-4.05 4.5-5.05 9.3-5.05 26.25s.95 21.85 5.05 26.35a16.565 16.565 0 0 0 12.3 5.1 17.637 17.637 0 0 0 13.6-5.95c3.05-3.55 4.2-7.85 4.2-13.3v-4.75h-16.2V39.8h28.9v12.95c0 10.9-2 17.9-7.5 23.9-6.35 6.75-14.2 9.6-23 9.6a30.15 30.15 0 0 1-21.9-9.05c-8.102-8.2-8.101-17.426-8.1-33.368v-1.164c-.001-15.943-.002-25.217 8.1-33.418a29.476 29.476 0 0 1 21.9-9Z"
            fill="currentColor"
          />
          <path
            d="M58 136a367.779 367.779 0 0 0 37.05 56.45 42.095 42.095 0 0 0 14.767 10.758 42.091 42.091 0 0 0 17.933 3.492 31.635 31.635 0 0 0 11.4-1.95v-6.4A36.222 36.222 0 0 1 115 185.3 294.636 294.636 0 0 1 78 133a45.286 45.286 0 0 0 34.7-42.1c0-27.65-21.75-40.45-49.55-40.45-8.04 0-15.433.226-22.104.43-5.484.167-10.48.32-14.946.32H.15v7.2l9.25 1.65c6.45 1.2 10.15 3.9 10.45 19.55v97.6c0 15.3-3.7 18.25-10.1 19.45L.5 198.4v7.15c6.65-.3 18.65-.75 29.8-.75 6.41 0 13.876.248 20.225.459 4.697.155 8.781.291 11.375.291v-7.15l-12.8-1.75c-6.7-.95-10.2-4.15-10.2-19.45V136H58Zm.6-74.25c20.75 0 33.05 10.85 33.05 30.55 0 19.45-13.35 32.6-35.25 32.15-8.237 0-11.787-.278-17.177-.701l-.623-.049V61.75h20Z"
            fill="currentColor"
          />
        </g>
      </svg>
    ),
    alt: "ResearchGate",
  },
];

function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container lg:grid lg:grid-cols-2 lg:items-stretch">
        <div className="mb-12 lg:mb-0 lg:flex lg:flex-col">
          <h2 className="headline-2 lg:max-w-[12ch] reveal-up">
            Let&apos;s Connect
          </h2>
          <p className="text-zinc-400 mt-3 mb-8 max-w-[50ch] lg:max-w-[30ch] reveal-up">
            I am passionate about utilizing technology to create practical and
            sustainable solutions to modern challenges. My research explores
            energy optimization and the integration of IoT and AI to drive
            innovation in energy management. If you are interested in discussing
            my work, collaborating on research, or sharing ideas, please don’t
            hesitate to reach out. I look forward to meaningful discussions and
            partnerships
          </p>

          <div className="flex items-center gap-2 mt-auto">
            {socialLinks.map(({ href, icon }, key) => (
              <a
                href={href}
                key={key}
                target="_blank"
                className="w-12 h-12 grid place-items-center ring-inset ring-2 ring-zinc-50/5 rounded-lg transition-[background-color,color] hover:bg-zinc-50 hover:text-zinc-950 active:bg-zinc-50/80 reveal-up"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
        {/* <ContactForm /> */}
        <form
          action="https://getform.io/f/allleooa"
          method="POST"
          className="xl:pl-10 2xl:pl-20"
        >
          <div className="md:grid md:items-center md:grid-cols-2 md:gap-2">
            <div className="mb-4">
              <label htmlFor="name" className="label reveal-up">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                required
                placeholder="John Doe"
                className="text-field reveal-up"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="label reveal-up">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                placeholder="contact@example.dev"
                className="text-field reveal-up"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="label reveal-up">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              required
              placeholder="Hi!"
              className="text-field resize-y min-h-32 max-h-80 reveal-up"
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary [&]:max-w-full w-full justify-center reveal-up"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
