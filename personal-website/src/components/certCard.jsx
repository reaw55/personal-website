import { useState, useRef } from "react";
import PropTypes from "prop-types";

const CertCard = ({ imcSrc, label, desc, href, classes, figureClassName, imgStyle }) => {
  const [showFullText, setShowFullText] = useState(false);
  const longPressTimeout = useRef(null); // Use ref to store the timeout

  const handleTouchStart = () => {
    longPressTimeout.current = setTimeout(() => {
      setShowFullText(true);
    }, 500); // 500ms long-press threshold
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimeout.current); // Clear the timeout
    setShowFullText(false); // Reset expanded state
  };

  const CardContent = (
    <div
      className={
        "flex items-center gap-3 ring-2 ring-inset ring-zinc-50/10 rounded-2xl p-3 hover:bg-zinc-800 transition-colors group " +
        classes
      }
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <figure
        className={
          figureClassName ||
          "bg-zinc-800/50 rounded-lg overflow-hidden w-12 h-12 p-2 group-hover:bg-zinc-900 transition-colors flex-shrink-0"
        }
      >
        <img src={imcSrc} alt={label} style={imgStyle} />
      </figure>
      <div className="flex-grow">
        <h3
          className={`text-white ${
            showFullText ? "line-clamp-none" : "544:line-clamp-2 group-hover:line-clamp-none"
          } transition-all`}
        >
          {label}
        </h3>
        <p
          className={`text-zinc-400 text-sm ${
            showFullText ? "line-clamp-none" : "544:line-clamp-1 group-hover:line-clamp-none"
          } transition-all`}
        >
          {desc}
        </p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
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
