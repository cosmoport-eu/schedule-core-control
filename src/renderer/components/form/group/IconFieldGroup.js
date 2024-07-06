import { Icon, Intent } from "@blueprintjs/core";
import { IconSize } from "@blueprintjs/icons";
import { Example } from "@blueprintjs/docs-theme";

import { IconSelect } from "./IconSelect";
import PropTypes from 'prop-types';
import styles from '../EventForm.module.css';

export function IconFieldGroup({
  id,
  name,
  validator,
  onChange,
  onConfirm,
  caption,
  className,
  inline,
  noLabel,
  value,
  fill,
  placeholder,
}) {

  const handleChange = value => onChange(value)
  const handleConfirm = icon => onConfirm(id, icon.value, value,);
  const invalid = validator !== '';
  const invalidMaybeClass = invalid ? ' bp5-intent-danger' : '';

  return (
    <div
      className={`bp5-form-group ${ inline ? 'bp5-inline' : ''}${invalidMaybeClass} ${className}`}
    >
      {!noLabel && (
        <label
          htmlFor={id}
          className={`bp5-label bp5-inline ${styles.label_text}`}
        >
          {caption}
        </label>
      )}
      <div
        className={`bp5-form-content ${styles.fullWidth}${invalidMaybeClass}`}
      >
        <IconSelect
          id={id}
          className={`bp5-input ${ fill ? styles.fill : '' } ${invalidMaybeClass}`}
          value={value}
          onChange={handleChange}
          onConfirm={handleConfirm}
          placeholder={placeholder}
        />
        {invalid && <div className="bp5-form-helper-text">{validator}</div>}
      </div>
    </div>
  );
}

IconFieldGroup.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
  caption: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onConfirm: PropTypes.func,
  validator: PropTypes.string,
  inline: PropTypes.bool,
  className: PropTypes.string,
  fill: PropTypes.bool,
  noLabel: PropTypes.bool,
  placeholder: PropTypes.string,
};

IconFieldGroup.defaultProps = {
  id: null,
  caption: '',
  value: '',
  onChange: () => {},
  onConfirm: () => {},
  validator: '',
  inline: false,
  className: '',
  fill: false,
  noLabel: false,
  placeholder: '',
};
