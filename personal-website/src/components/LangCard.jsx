// Desc: LangCard component

//node modules
import PropTypes from 'prop-types';

function LangCard({
    imcSrc,
    label,
    desc,
    classes
}) {
  return (
    <div className={"flex items-center gap-3 ring-2 ring-inset ring-zinc-50/10 rounded-2xl p-3 hover:bg-zinc-800 transition-colors group " + classes}>
        <figure className="rounded-full overflow-hidden w-12 h-12 p-2 group-hover:scale-110 transition-transform">
            <img src={imcSrc} alt={label} width={60} height={60} />
        </figure>
        <div>
            <h3>{label}</h3>

            <p className="text-zinc-400 text-sm">{desc}</p>
        </div>
    </div>
  )
}

LangCard.propTypes = {
  imcSrc: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  classes: PropTypes.string
}

export default LangCard