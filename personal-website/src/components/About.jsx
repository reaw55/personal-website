//about section
// const aboutItems = [
//   {
//     label: "Project done",
//     number: 45,
//   },
//   {
//     label: "Years of experience",
//     number: 10,
//   },
// ];

const About = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="bg-zinc-800/50 p-7 rounded-2xl md:p-12 reveal-up">
          <p className="text-zinc-300 mb-4 md:mb-8 md:text-xl ">
            Hi! I’m Reaw, a recent graduate majoring in
            <a
              //href="http://www.ise.eng.chula.ac.th/document/pangpr/ICE_61_BULLETIN_Web.pdf"
              href="http://www.ise.eng.chula.ac.th/academics/ice/info"
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center ml-1 mr-1"
              style={{
                color: "#38BFE9", // Default color
                imageRendering: "auto", // Smooth scaling
                WebkitTransform: "translateZ(0)", // Forces GPU rendering
              }}
              onMouseEnter={(e) => (e.target.style.color = "#25809C")} // Darker hover color
              onMouseLeave={(e) => (e.target.style.color = "#38BFE9")} // Reset color on hover out
            >
              <span className="inline-block relative h-[1em] w-[1em] overflow-hidden rounded-full align-baseline ml-1 bg-gray-200 mr-1 translate-y-[15%]">
                <img
                  src="images/logo/univ/icon-ICE.png"
                  alt="ICE Logo"
                  className="absolute inset-0 object-cover object-[55%_50%] w-[140%] h-[140%] translate-y-[4%]"
                />
              </span>
              Information and Communication Engineering
            </a>
            at the
            <a
              href="http://www.ise.eng.chula.ac.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center ml-1 mr-1"
              style={{
                color: "#cc2c32", // Default color
                imageRendering: "crisp-edges", // Smooth scaling
                WebkitTransform: "translateZ(0)", // Forces GPU rendering
              }}
              onMouseEnter={(e) => (e.target.style.color = "#972126")} // Darker hover color
              onMouseLeave={(e) => (e.target.style.color = "#cc2c32")} // Reset color on hover out
            >
              <span className="inline-block relative h-[1em] w-[1em] overflow-hidden rounded-full align-baseline ml-1 bg-gray-200 mr-1 translate-y-[15%]">
                <img
                  src="images/logo/univ/ISE_Logo.svg"
                  alt="ISE Logo"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </span>
              International School of Engineering
            </a>
            ,
            <a
              href="https://www.chula.ac.th/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center ml-1 mr-1"
              style={{
                color: "#ff6c94", // Default color
                imageRendering: "crisp-edges", // Smooth scaling
                WebkitTransform: "translateZ(0)", // Forces GPU rendering
              }}
              onMouseEnter={(e) => (e.target.style.color = "#af4a6c")} // Darker hover color
              onMouseLeave={(e) => (e.target.style.color = "#ff6c94")} // Reset color on hover out
            >
              <span className="inline-block relative h-[1em] w-[1em] overflow-hidden rounded-full align-baseline ml-1 bg-gray-200 mr-1 translate-y-[15%]">
                <img
                  src="images\logo\univ\Logo_of_Chulalongkorn_University.svg"
                  alt="Organization Logo"
                  className="absolute inset-0 w-full h-full p-[10%]"
                />
              </span>
              Chulalongkorn University
            </a>
            . I have done an Exchange semester at
            <a
              href="https://www.titech.ac.jp/english"
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center ml-1 mr-1"
              style={{
                color: "#0080e1", // Default color
                imageRendering: "crisp-edges", // Smooth scaling
                WebkitTransform: "translateZ(0)", // Forces GPU rendering
              }}
              onMouseEnter={(e) => (e.target.style.color = "#005595")} // Darker hover color
              onMouseLeave={(e) => (e.target.style.color = "#0080e1")} // Reset color on hover out
            >
              <span className="inline-block relative h-[1em] w-[1em] overflow-hidden rounded-sm align-baseline ml-1 bg-gray-200 mr-1 translate-y-[20%]">
                <img
                  src="images\logo\univ\Tokyo_Institute_of_Technology_symbol.svg"
                  alt="Organization Logo"
                  className="absolute inset-0 w-full h-full p-[10%]"
                />
              </span>
              Tokyo Institute of Technology
            </a>
            (now known as
            <a
              href="https://www.isct.ac.jp/en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center ml-1 mr-1"
              style={{
                color: "#2665e8", // Default color
                imageRendering: "crisp-edges", // Smooth scaling
                WebkitTransform: "translateZ(0)", // Forces GPU rendering
              }}
              onMouseEnter={(e) => (e.target.style.color = "#143476")} // Darker hover color
              onMouseLeave={(e) => (e.target.style.color = "#2665e8")} // Reset color on hover out
            >
              <span className="inline-block relative h-[1em] w-[1em] overflow-hidden rounded-sm align-baseline ml-1 bg-gray-200 mr-1 translate-y-[10%]">
                <img
                  src="images\logo\univ\Institute_of_Science_Tokyo_logo_basic.svg"
                  alt="Organization Logo"
                  className="absolute inset-0 object-cover object-[-7%_60%] w-[80%] h-[80%] translate-y-[15%]"
                />
              </span>
              Institute of Science Tokyo
            </a>
            ) under the
            <a
              href="https://www.titech.ac.jp/english/international-student-exchange/prospective-students/non-degree/acap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center ml-1 mr-1"
              style={{
                color: "#e0af0a", // Default color
                imageRendering: "crisp-edges", // Smooth scaling
                WebkitTransform: "translateZ(0)", // Forces GPU rendering
              }}
              onMouseEnter={(e) => (e.target.style.color = "#947407")} // Darker hover color
              onMouseLeave={(e) => (e.target.style.color = "#e0af0a")} // Reset color on hover out
            >
              ACAP program
            </a>
            . I am interested in field relating to management, AI, IoT and other
            emerging technologies. I am eager to learn more about those topics
            and would appreciate any opportunity to gain a deeper understanding
            of those topics.
          </p>

          {/* <div className="flex flex-wrap items-center gap-4 md:gap-7">
            {aboutItems.map(({ label, number }, key) => (
              <div key={key}>
                <div className="flex items-center md:mb-2">
                  <span className="text-2xl font-bold md:text-4xl">
                    {number}
                  </span>
                  <span className="text-amber-400 font-semibold">+</span>
                </div>
                <p className="text-sm text-zinc-400">{label}</p>
              </div>
            ))}
            <img
              src="/images/logo/logo-v1.svg"
              alt="Logo"
              width={30}
              height={30}
              className="ml-auto md:w-[40px] md:h-[40px]"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default About;
