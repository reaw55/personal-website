//about section

//node modules
import PropTypes from "prop-types";

// Inline link with an optional round/square logo in front of the text.
// Colours are passed as CSS variables so hover *and* keyboard focus are
// handled in CSS instead of JS mouse handlers.
const InlineLink = ({ href, color, hoverColor, logo, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline items-center mx-1 transition-colors text-[color:var(--link)] hover:text-[color:var(--link-hover)] focus-visible:text-[color:var(--link-hover)]"
    style={{ "--link": color, "--link-hover": hoverColor }}
  >
    {logo && (
      <span
        className={`inline-block relative h-[1em] w-[1em] overflow-hidden align-baseline mx-1 bg-gray-200 ${logo.wrapperClassName}`}
      >
        <img
          src={logo.src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 ${logo.imgClassName}`}
        />
      </span>
    )}
    {children}
  </a>
);

InlineLink.propTypes = {
  href: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  hoverColor: PropTypes.string.isRequired,
  logo: PropTypes.shape({
    src: PropTypes.string.isRequired,
    wrapperClassName: PropTypes.string,
    imgClassName: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
};

const About = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="bg-zinc-800/50 p-7 rounded-2xl md:p-12 reveal-up">
          <p className="text-zinc-300 mb-4 md:mb-8 md:text-xl ">
            Hi! I’m Reaw, a recent graduate majoring in
            <InlineLink
              href="http://www.ise.eng.chula.ac.th/academics/ice/info"
              color="#38BFE9"
              hoverColor="#25809C"
              logo={{
                src: "/images/logo/univ/icon-ICE.png",
                wrapperClassName: "rounded-full translate-y-[15%]",
                imgClassName:
                  "object-cover object-[55%_50%] w-[140%] h-[140%] translate-y-[4%]",
              }}
            >
              Information and Communication Engineering
            </InlineLink>
            at the
            <InlineLink
              href="http://www.ise.eng.chula.ac.th/"
              color="#cc2c32"
              hoverColor="#972126"
              logo={{
                src: "/images/logo/univ/ISE_Logo.svg",
                wrapperClassName: "rounded-full translate-y-[15%]",
                imgClassName: "w-full h-full object-cover object-top",
              }}
            >
              International School of Engineering
            </InlineLink>
            ,
            <InlineLink
              href="https://www.chula.ac.th/en/"
              color="#ff6c94"
              hoverColor="#af4a6c"
              logo={{
                src: "/images/logo/univ/Logo_of_Chulalongkorn_University.svg",
                wrapperClassName: "rounded-full translate-y-[15%]",
                imgClassName: "w-full h-full p-[10%]",
              }}
            >
              Chulalongkorn University
            </InlineLink>
            . I have done an Exchange semester at
            <InlineLink
              href="https://www.titech.ac.jp/english"
              color="#0080e1"
              hoverColor="#005595"
              logo={{
                src: "/images/logo/univ/Tokyo_Institute_of_Technology_symbol.svg",
                wrapperClassName: "rounded-sm translate-y-[20%]",
                imgClassName: "w-full h-full p-[10%]",
              }}
            >
              Tokyo Institute of Technology
            </InlineLink>
            (now known as
            <InlineLink
              href="https://www.isct.ac.jp/en"
              color="#2665e8"
              hoverColor="#143476"
              logo={{
                src: "/images/logo/univ/Institute_of_Science_Tokyo_logo_basic.svg",
                wrapperClassName: "rounded-sm translate-y-[10%]",
                imgClassName:
                  "object-cover object-[-7%_60%] w-[80%] h-[80%] translate-y-[15%]",
              }}
            >
              Institute of Science Tokyo
            </InlineLink>
            ) under the
            <InlineLink
              href="https://www.titech.ac.jp/english/international-student-exchange/prospective-students/non-degree/acap"
              color="#e0af0a"
              hoverColor="#947407"
            >
              ACAP program
            </InlineLink>
            . I am interested in fields relating to management, AI, IoT and
            other emerging technologies. I am eager to learn more about those
            topics and would appreciate any opportunity to gain a deeper
            understanding of them.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
