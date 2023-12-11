import PropTypes from 'prop-types';

import styles from '../EventForm.module.css';

export default function TextAreaGroup({
  caption,
  className,
  name,
  onChange,
  validator,
  inline,
  value,
  noLabel,
  placeholder,
  disabled,
}) {
  const handleChange = (event) => {
    onChange(name, event.target.value);
  };

  const invalid = validator !== '';
  if (caption === '') caption = name;
  const invalidMaybeClass = invalid ? ' bp5-intent-danger' : '';

  return (
    <div
      className={`bp5-form-group ${
        inline ? 'bp5-inline' : ''
      }${invalidMaybeClass} ${className}`}
    >
      {!noLabel && (
        <label
          htmlFor={name}
          className={`bp5-label bp5-inline ${styles.label_text}`}
        >
          {caption}
        </label>
      )}
      <div
        className={`bp5-form-content ${styles.fullWidth}${invalidMaybeClass}`}
      >
        <textarea
          id={name}
          className={`bp5-input ${styles.fill} ${invalidMaybeClass}`}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
        />
        {invalid && <div className="bp5-form-helper-text">{validator}</div>}
      </div>
    </div>
  );
}

TextAreaGroup.propTypes = {
  name: PropTypes.string.isRequired,
  caption: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  validator: PropTypes.string,
  inline: PropTypes.bool,
  className: PropTypes.string,
  noLabel: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

TextAreaGroup.defaultProps = {
  caption: '',
  value: '',
  onChange: () => {},
  validator: '',
  inline: false,
  className: '',
  noLabel: false,
  placeholder: '',
  disabled: false,
};
