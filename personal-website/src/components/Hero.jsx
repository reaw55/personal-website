// Desc: Home page hero section

//components
import { ButtonPrimary, ButtonOutline } from "./Button";

const Hero = () => {
  return (
    <section id="home" className="pt-28 lg:pt-36">
      <div className="container lg:grid lg:grid-cols-2 lg:gap-10 max-lg:flex-row max-lg:items-center max-lg:justify-center">
        <div className="flex flex-col justify-center h-full">
          {/* <div className="flex items-center gap-3">
            <figure className="img-box w-9 h-9 rounded-lg">
              <img
                src="images/avatar-1.jpg"
                alt="protrait"
                width={40}
                height={40}
                className="img-cover"
              />
            </figure>
            <div className="flex items-center gap-1.5 text-zinc-400 text-sm tracking-wide">
              <span className="relative w-2 h-2 rounded-full bg-emerald-400">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span>
              </span>
              Available for work
            </div>
          </div> */}
          <h2 className="headline-1 max-w-[15ch] sm:max-w-20ch lg:max-w-[15ch] mt-5 mb-8 lg:mb-10 break-words"
          style={{ lineHeight: '1.2', paddingBottom: '0.1em' }}
          >
            Kritchavit Thippayajindakul
          </h2>

          <div className="flex items-center gap-3">
            <ButtonPrimary label="Download CV" icon="download" href="https://nc.reaw.me/s/eBrBqkQebgQjJGk" />
            <ButtonOutline label="Scroll down" icon="arrow_downward" href="#about" />
          </div>
        </div>
        
        <div className="sm:hidden h-20"></div>
        <div className=" lg:block justify-center sm:ml-2 max-lg:flex-row max-lg:items-center max-lg:justify-center">
          <figure className="w-full max-w-[480px] ml-auto bg-gradient-to-t from-amber-400 via-25% via-amber-400/40 to-65% rounded-[60px] overflow-hidden  aspect-[4/5] ">
            <img
              src="images/protait/h-p-c-2.png"
              alt="protrait banner"
              width={656}
              height={800}
              className="w-full"
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Hero;
