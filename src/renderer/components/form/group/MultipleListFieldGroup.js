import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'

import styles from '../EventForm.module.css';

export default class MultipleListFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string,
    index: PropTypes.number,
    onChange: PropTypes.func,
    validator: PropTypes.string,
    children: PropTypes.array,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.array,
  };

  static defaultProps = {
    caption: '',
    index: 0,
    onChange: () => {},
    validator: '',
    children: null,
    disabled: false,
    defaultValue: [],
  };

  handleSelectChange = (event) => {
    this.props.onChange(
      this.props.name,
      event,
      this.props.id,
    );
  };

  render() {
    const invalid = this.props.validator !== '';
    const caption =
      this.props.caption !== '' ? this.props.caption : this.props.name;
    const invalidMaybeClass = invalid ? ' bp5-intent-danger' : '';
    const opts = {};
    if (this.props.disabled) {
      opts.disabled = 'disabled';
    }

    const defaultValue = this.props.children
      .filter((t) => this.props.defaultValue.includes(t.value));

    return (
      <div style={{ marginTop: '1em' }} className={`bp5-form-group bp5-inline${invalidMaybeClass}`}>
        <label
          htmlFor={this.props.name}
          className={`bp5-label bp5-inline ${styles.label_text}`}
        >
          {caption}
        </label>
        <div
          className={`bp5-form-content ${styles.fullWidth}${invalidMaybeClass}`}
        >
          <div style={{ display: 'flex' }}>
            <div className="bp5-select bp5-fill">
              <Select
                id={this.props.name}
                name={this.props.name}
                defaultValue={defaultValue}
                isMulti
                closeMenuOnSelect={false}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={this.props.style}
                options={this.props.children}
                onChange={this.handleSelectChange}
              />
            </div>
          </div>
          {invalid && (
            <div className="bp5-form-helper-text">{this.props.validator}</div>
          )}
        </div>
      </div>
    );
  }
}
