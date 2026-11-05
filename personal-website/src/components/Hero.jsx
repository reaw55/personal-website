// Desc: Home page hero section

//components
import { ButtonPrimary, ButtonOutline } from "./Button";

// Layout by viewport:
// - portrait phones/tablets: single column, portrait centred under the text
// - landscape phones/small windows (max-lg + landscape): text and portrait side
//   by side, portrait sized to the viewport height so the hero fits one screen
// - lg and up: two columns; portrait also capped by viewport height (see
//   .hero-portrait in index.css) so short laptop screens don't crop it
const Hero = () => {
  return (
    <section id="home" className="pt-28 lg:pt-36 max-lg:landscape:pt-20">
      <div className="container lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center max-lg:landscape:grid max-lg:landscape:grid-cols-[minmax(0,1fr)_auto] max-lg:landscape:items-center max-lg:landscape:gap-8">
        <div className="flex flex-col justify-center">
          <h1
            className="headline-1 max-w-[15ch] sm:max-w-[20ch] lg:max-w-[15ch] mt-5 mb-8 lg:mb-10 break-words max-sm:text-44 max-xs:text-[clamp(1.75rem,10.5vw,2.5rem)] max-lg:landscape:!text-4xl max-lg:landscape:mb-6"
            style={{ lineHeight: "1.2", paddingBottom: "0.1em" }}
          >
            Kritchavit Thippayajindakul
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <ButtonPrimary label="Download CV" icon="download" href="https://nc.reaw.me/s/eBrBqkQebgQjJGk" target="_blank" />
            <ButtonOutline label="Scroll down" icon="arrow_downward" href="#about" />
          </div>
        </div>

        <div className="flex justify-center mt-16 lg:mt-0 lg:justify-end max-lg:landscape:mt-0">
          <figure className="hero-portrait bg-gradient-to-t from-amber-400 via-25% via-amber-400/40 to-65% rounded-[60px] max-lg:landscape:rounded-[36px] overflow-hidden">
            <img
              src="/images/protait/h-p-c-2.webp"
              alt="Portrait of Kritchavit Thippayajindakul"
              width={565}
              height={844}
              // React 18 only passes this through in lowercase (React 19: fetchPriority)
              // eslint-disable-next-line react/no-unknown-property
              fetchpriority="high"
              className="w-full"
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Hero;
