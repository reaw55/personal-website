import PropTypes from "prop-types";

const PaperCard = ({ imgSrc, title, description, tags = [], paperLink, classes }) => {
  return (
    <div className={"flex p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700/60 ring-1 ring-inset ring-zinc-50/5 transition-colors " + classes}>
      {imgSrc && (
        <figure className="img-box w-1/3 rounded-lg mb-4 flex-shrink-0">
          <img src={imgSrc} alt={title} loading='lazy' className="img-cover rounded-lg" />
        </figure>
      )}
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h3 className="title-1">{title}</h3>
          {description && <p className="text-sm text-zinc-400 mb-2">{description}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((label, key) => (
              <span key={key} className="h-8 text-sm text-zinc-400 bg-zinc-50/5 grid items-center px-3 rounded-lg">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <a href={paperLink} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 w-11 h-11 rounded-lg grid place-items-center bg-amber-400 text-zinc-950">
        <span className="material-symbols-rounded" aria-hidden="true">
          arrow_outward
        </span>
      </a>
      <a href={paperLink} target='_blank' className="absolute inset-0"></a>
    </div>
  );
};

PaperCard.propTypes = {
  imgSrc: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  paperLink: PropTypes.string,
  classes: PropTypes.string,
};

export default PaperCard;