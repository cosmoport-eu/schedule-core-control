import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from '../EventForm.module.css';

export default class TextFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    validator: PropTypes.string,
    inline: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    caption: '',
    value: '',
    onChange: () => { },
    validator: '',
    inline: false,
    className: ''
  }

  handleChange = (event) => {
    this.props.onChange(this.props.name, event.target.value);
  }

  render() {
    const invalid = this.props.validator !== '';
    const caption = this.props.caption !== '' ? this.props.caption : this.props.name;
    const invalidMaybeClass = invalid ? ' bp5-intent-danger' : '';

    return (
      <div className={`bp5-form-group ${this.props.inline ? 'bp5-inline' : ''}${invalidMaybeClass} ${this.props.className}`}>
        <label htmlFor={this.props.name} className={`bp5-label bp5-inline ${styles.label_text}`}>
          {caption}
        </label>
        <div className={`bp5-form-content ${styles.fullWidth}${invalidMaybeClass}`}>
          <input
            id={this.props.name}
            className={invalidMaybeClass}
            value={this.props.value}
            onChange={this.handleChange}
          />
          {invalid && <div className="bp5-form-helper-text">{this.props.validator}</div>}
        </div>
      </div>
    );
  }
}
