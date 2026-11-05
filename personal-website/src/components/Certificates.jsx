//Certificates section

//components
import CertCard from "./certCard";
import {
  certCouseraSpecializationList,
  certCouseraCoursesList,
  certRecognitionList,
} from "./certsList";

const groups = [
  {
    title: "Recognitions",
    items: certRecognitionList,
    // long titles: one card per row
    gridClassName: "grid gap-3",
  },
  {
    title: "Coursera Specialization",
    items: certCouseraSpecializationList,
    gridClassName:
      "grid gap-3 grid-cols-[repeat(auto-fill,_minmax(min(250px,_100%),_1fr))]",
  },
  {
    title: "Coursera Courses",
    items: certCouseraCoursesList,
    gridClassName:
      "grid gap-3 grid-cols-[repeat(auto-fill,_minmax(min(250px,_100%),_1fr))]",
  },
];

function Certificates() {
  return (
    <section id="certificates" className="section">
      <div className="container">
        <h2 className="headline-2 reveal-up">Certificates</h2>

        {groups.map(({ title, items, gridClassName }) => (
          <div key={title}>
            <h3 className="text-xl font-semibold mt-8 mb-3">{title}</h3>
            <div className={gridClassName}>
              {items.map(
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
        ))}
      </div>
    </section>
  );
}

export default Certificates;
