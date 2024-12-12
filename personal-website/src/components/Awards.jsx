//Work component

//components
import AwardCard from "./AwardCard";

const awards = [
  {
    imgSrc: "/images/awards/iot_fund.jpg",
    title: "first place of the scholarship fund",
    description: "XD project team with the topic of \"IoT-Driven Energy Optimization in Building Management\", under the supervision of Asst. Prof. Dr. Tawan Paphapote as advisor, won the first place and received the 20,000 Thai baht scholarship fund in support of the engineering senior project sponsored by Magotteaux corporation.",
    tags: ["1st Place", "Scholarship Fund", "IoT"],
    awardLink1: "http://www.ise.eng.chula.ac.th/news/detail?id=1674&gid=1-008-008",
    //linkText1: "Read more",
    //linkIcon1: <span></span>,
    // awardLink2: "https://nc.reaw.me/s/SHoLTsR75mTGzsb",
    // linkText2: "View Paper",
    // linkIcon2: <span></span>,
  },
  {
    imgSrc: "/images/awards/SFTF.jpg",
    title: "Selected as Thailand representatives",
    description: "got selected as a one in five Thailand representatives to participate in the Huawei Seeds for the Future APAC program, a global CSR flagship program that aims to develop local ICT talent, enhance knowledge transfer, promote a greater understanding of and interest in the telecommunications sector, and improve and encourage regional building and participation in the digital community.",
    tags: ["Finalist", "Seeds for the Future"],
    awardLink1: "https://www.huawei.com/minisite/seeds-for-the-future/program.html",
  },
  {
    imgSrc: "/images/awards/robocup.jpg",
    title: "Second Place ROBOCUP@Home 2022",
    description: "manager of the team that won the second place in the RoboCup@Home 2022 competition, a part of the RoboCup international robotics competition.",
    tags: ["2nd Place", "RoboCup@Home"],
    awardLink1: "https://nc.reaw.me/s/HmMnN7525GHL6ng",
  },
];

const Awards = () => {
  return (
    <section id="awards" className="section">
      <div className="container">
        <h2 className="headline-2 mb-8 reveal-up">Awards and Regonitions</h2>

        <div className="grid gap-x-4 gap-y-5 grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))]">
          {awards.map(
            (
              {
                imgSrc,
                title,
                description,
                tags,
                awardLink1,
                awardLink2,
                linkText1,
                linkText2,
                linkIcon1,
                linkIcon2,
              },
              key
            ) => (
              <AwardCard
                key={key}
                imgSrc={imgSrc}
                title={title}
                description={description}
                tags={tags}
                awardLink1={awardLink1}
                awardLink2={awardLink2}
                linkText1={linkText1}
                linkText2={linkText2}
                linkIcon1={linkIcon1}
                linkIcon2={linkIcon2}
                classes="reveal-up"
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Awards;
