import PropTypes from "prop-types";

const AwardCard = ({ imgSrc, title, description, tags = [], awardLink1, awardLink2, linkText1, linkText2, linkIcon1, linkIcon2, classes }) => {
  return (
    <div className={"relative p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700/60 ring-1 ring-inset ring-zinc-50/5 transition-colors " + classes}>
      <figure className="img-box aspect-square rounded-lg mb-4">
        <img src={imgSrc} alt={title} loading='lazy' className="img-cover" />
      </figure>
      <div>
        <h3 className="title-1">{title}</h3>
        <p className="text-sm text-zinc-400 mb-2">{description}</p>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-center gap-2 flex-grow">
            {tags.map((label, key) => (
              <span key={key} className="h-8 text-sm text-zinc-400 bg-zinc-50/5 grid items-center px-3 rounded-lg">
                {label}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-2 ml-auto">
            {awardLink1 && (
              <a href={awardLink1} target="_blank" rel="noopener noreferrer" className="flex flex-auto gap-2 p-2 rounded-lg bg-amber-400 text-zinc-950 shrink-0">
                {linkText1 && <span className="text-xs">{linkText1}</span>}
                {linkIcon1 || <span className="material-symbols-rounded" aria-hidden="true">arrow_outward</span>}
              </a>
            )}
            {awardLink2 && (
              <a href={awardLink2} target="_blank" rel="noopener noreferrer" className="flex gap-2 p-2 rounded-lg bg-amber-400 text-zinc-950 shrink-0">
                {linkText2 && <span className="text-xs align-middle">{linkText2}</span>}
                {linkIcon2 || <span className="material-symbols-rounded" aria-hidden="true">arrow_outward</span>}
              </a>
            )}
          </div>
        </div>
      </div>
      {awardLink1 && <a href={awardLink1} target='_blank' className="absolute inset-0"></a>}
    </div>
  );
};

AwardCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  awardLink1: PropTypes.string,
  awardLink2: PropTypes.string,
  linkText1: PropTypes.string,
  linkText2: PropTypes.string,
  linkIcon1: PropTypes.node,
  linkIcon2: PropTypes.node,
  classes: PropTypes.string,
};

export default AwardCard;