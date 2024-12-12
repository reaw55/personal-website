//Work component

//components
import PaperCard from "./PaperCard";

const papers = [
  {
    title: "Designing a Digital Trip Planning Platform to Spotlight Thailand's Lesser-Known Travel Destinations and Foster Local Businesses: A Software Engineering Perspective",
    tags: ["Conference Paper", "NIC-NIDA Proceeding 2023"],
    paperLink: "https://www.researchgate.net/publication/377217795_Designing_a_Digital_Trip_Planning_Platform_to_Spotlight_Thailand's_Lesser-Known_Travel_Destinations_and_Foster_Local_Businesses_A_Software_Engineering_Perspective",
  },
];

const Papers = () => {
  return (
    <section id="publication" className="section">
      <div className="container">
        <h2 className="headline-2 mb-8 reveal-up">Publications</h2>

        <div className="grid gap-x-4 gap-y-5">
          {papers.map(({ imgSrc, title, description, tags, paperLink }, key) => (
            <PaperCard
              key={key}
              imgSrc={imgSrc}
              title={title}
              description={description}
              tags={tags}
              paperLink={paperLink}
              classes="reveal-up"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Papers;
