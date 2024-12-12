//Certificates section

//components
import CertCard from "./certCard";
import {
  certCouseraSpecializationList,
  certCouseraCoursesList,
  certRecognitionList,
} from "./certsList";

function Certificates() {
  return (
    <section id="certificates" className="section">
      <div className="container">
        <h2 className="headline-2 reveal-up">Certificates</h2>

        {/* <p className="text-zinc-400 mt-3 mb-8 max-w-[50ch] reveal-up">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p> */}

        <h3 className="col-span-full text-xl font-semibold mt-6 mb-2">
          Recognitions
        </h3>
        {certRecognitionList.map(
          ({ imgSrc, label, desc, href, figureClassName, imgStyle }, key) => (
            <CertCard
              key={key}
              imcSrc={imgSrc}
              label={label}
              desc={desc}
              href={href}
              figureClassName={figureClassName}
              imgStyle={imgStyle}
              classes="reveal-up"
            />
          )
        )}
        <h3 className="col-span-full text-xl font-semibold mt-6 mb-2">
          Coursera Specialization
        </h3>
        <div className="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
          {certCouseraSpecializationList.map(
            ({ imgSrc, label, desc, href, figureClassName, imgStyle }, key) => (
              <CertCard
                key={key}
                imcSrc={imgSrc}
                label={label}
                desc={desc}
                href={href}
                figureClassName={figureClassName}
                imgStyle={imgStyle}
                classes="reveal-up"
              />
            )
          )}
          <h3 className="col-span-full text-xl font-semibold mt-6 mb-2">
            Coursera Courses
          </h3>
          {certCouseraCoursesList.map(
            ({ imgSrc, label, desc, href, figureClassName, imgStyle }, key) => (
              <CertCard
                key={key}
                imcSrc={imgSrc}
                label={label}
                desc={desc}
                href={href}
                figureClassName={figureClassName}
                imgStyle={imgStyle}
                classes="reveal-up"
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default Certificates;
