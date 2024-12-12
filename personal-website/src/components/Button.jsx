// button component

//node modules
import PropTypes from "prop-types";

const ButtonPrimary = ({ href, target = "self", label, icon, classes }) => {
  if (href) {
    return (
      <a href={href} target={target} className={"btn btn-primary " + classes}>
        {label}

        {icon ?
          <span className="material-symbols-rounded" aria-hidden="true">
            {icon}
          </span>
         : null}
      </a>
    );
  } else {
    return <button className={"btn btn-primary " + classes}>{label}</button>;
  }
};

ButtonPrimary.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  target: PropTypes.string,
  icon: PropTypes.string,
  classes: PropTypes.string,
};

const ButtonOutline = ({ href, target = "self", label, icon, classes }) => {
  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={"btn btn-outline " + classes}
      > 
        {label}
        {icon ?
          <span className="material-symbols-rounded" aria-hidden="true">
            {icon}
          </span>
         : null}
      </a>
    );
  }
  return (
    <button className={"btn btn-outline " + classes}>
      {label}
      {icon ?
        <span className="material-symbols-rounded" aria-hidden="true">
          {icon}
        </span>
       : null}
    </button>
  );
}

ButtonOutline.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  target: PropTypes.string,
  icon: PropTypes.string,
  classes: PropTypes.string,
};

export {
  ButtonPrimary,
  ButtonOutline
}
