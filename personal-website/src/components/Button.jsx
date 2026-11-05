// button component

//node modules
import PropTypes from "prop-types";

const Icon = ({ name }) =>
  name ? (
    <span className="material-symbols-rounded" aria-hidden="true">
      {name}
    </span>
  ) : null;

Icon.propTypes = {
  name: PropTypes.string,
};

// Shared renderer: an <a> when there is an href, otherwise a <button>.
// target must be a real browsing-context keyword ("_self", "_blank"...);
// a bare word such as "self" makes the browser open a new tab with that name.
const BaseButton = ({ variant, href, target = "_self", label, icon, classes = "" }) => {
  const className = `btn ${variant} ${classes}`.trim();

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={className}
      >
        {label}
        <Icon name={icon} />
      </a>
    );
  }

  return (
    <button type="button" className={className}>
      {label}
      <Icon name={icon} />
    </button>
  );
};

const buttonPropTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  target: PropTypes.string,
  icon: PropTypes.string,
  classes: PropTypes.string,
};

BaseButton.propTypes = {
  ...buttonPropTypes,
  variant: PropTypes.string.isRequired,
};

const ButtonPrimary = (props) => <BaseButton variant="btn-primary" {...props} />;
ButtonPrimary.propTypes = buttonPropTypes;

const ButtonOutline = (props) => <BaseButton variant="btn-outline" {...props} />;
ButtonOutline.propTypes = buttonPropTypes;

export { ButtonPrimary, ButtonOutline };
