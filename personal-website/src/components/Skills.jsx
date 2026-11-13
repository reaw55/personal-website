//skills section

//components
import LangCard from './LangCard';

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

            
            <h3 className="text-xl font-semibold mt-6 mb-4 reveal-up">
            Languages 
            </h3>
            
            <div className ="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(min(250px,_100%),_1fr))]">
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