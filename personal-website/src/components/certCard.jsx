import PropTypes from "prop-types";

// Certificate card. Titles are shown in full: truncating them made several
// courses (e.g. the "Architecting with Google Kubernetes Engine" series)
// look identical, and hover-to-expand doesn't exist on touch screens.
const CertCard = ({ imcSrc, label, desc, href, classes = "", figureClassName, imgStyle }) => {
  const CardContent = (
    <div
      className={
        "h-full flex items-center gap-3 ring-2 ring-inset ring-zinc-50/10 rounded-2xl p-3 hover:bg-zinc-800 transition-colors group " +
        classes
      }
    >
      <figure
        className={
          figureClassName ||
          "bg-zinc-800/50 rounded-lg overflow-hidden w-12 h-12 p-2 group-hover:bg-zinc-900 transition-colors flex-shrink-0"
        }
      >
        <img src={imcSrc} alt="" loading="lazy" decoding="async" style={imgStyle} />
      </figure>
      <div className="flex-grow min-w-0">
        <h4 className="text-white break-words">{label}</h4>
        <p className="text-zinc-400 text-sm break-words">{desc}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block rounded-2xl">
      {CardContent}
    </a>
  ) : (
    CardContent
  );
};

CertCard.propTypes = {
  imcSrc: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  href: PropTypes.string,
  classes: PropTypes.string,
  figureClassName: PropTypes.string,
  imgStyle: PropTypes.object,
};

export default CertCard;
