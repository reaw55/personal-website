//skills section

//components
import SkillCard from './SkillCard';
import LangCard from './LangCard';

const skillItem = [
    {
      imgSrc: '/images/skills/lang/thailand.png',
      label: 'Thai',
      desc: 'native'
    },
    {
      imgSrc: '/images/skills/lang/uk.png',
      label: 'English',
      desc: 'IELTS 8.0'
    },
    {
      imgSrc: '/images/skills/lang/japan.png',
      label: 'Japanese',
      desc: 'N4'
    },
  ];


const langItem = [
    {
      imgSrc: '/images/skills/lang/thailand.png',
      label: 'Thai',
      desc: 'native'
    },
    {
      imgSrc: '/images/skills/lang/uk.png',
      label: 'English',
      desc: 'IELTS 8.0'
    },
    {
      imgSrc: '/images/skills/lang/japan.png',
      label: 'Japanese',
      desc: 'N4'
    },
  ];
  
  
function Skills() {
  return (

    <section id="skills" className="section">
        <div className="container">
            <h2 className="headline-2 reveal-up">
            Skills 
            </h2>

            {/* <p className="text-zinc-400 mt-3 mb-8 max-w-[50ch] reveal-up">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p> */}
            
            <h3 className="col-span-full text-xl font-semibold mt-6 mb-2 reveal-up">
            Languages 
            </h3>
            <div className = "h-2"></div>
            
            <div className ="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
                {
                    langItem.map(({imgSrc, label, desc}, key) => (
                        <LangCard key={key} imcSrc={imgSrc} label={label} desc={desc} classes="reveal-up" />
                    ))
                }
            </div>
        </div>
    </section>
  )
}

export default Skills