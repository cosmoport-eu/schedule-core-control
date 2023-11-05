import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from '../EventForm.module.css';

export default class ListFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string,
    index: PropTypes.number,
    onChange: PropTypes.func,
    validator: PropTypes.string,
    children: PropTypes.node,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    caption: '',
    index: 0,
    onChange: () => { },
    validator: '',
    children: null,
    disabled: false
  }

  handleSelectChange = (event) => {
    this.props.onChange(this.props.name, parseInt(event.target.value, 10));
  }

  render() {
    const invalid = this.props.validator !== '';
    const caption = this.props.caption !== '' ? this.props.caption : this.props.name;
    const invalidMaybeClass = invalid ? ' bp5-intent-danger' : '';
    const opts = {};
    if (this.props.disabled) {
      opts.disabled = 'disabled';
    }

    return (
      <div className={`bp5-form-group bp5-inline${invalidMaybeClass}`}>
        <label htmlFor={this.props.name} className={`bp5-label bp5-inline ${styles.label_text}`}>
          {caption}
        </label>
        <div className={`bp5-form-content ${styles.fullWidth}${invalidMaybeClass}`}>
          <div className="bp5-select bp5-fill">
            <select
              id={this.props.name}
              name={this.props.name}
              value={this.props.index}
              onChange={this.handleSelectChange}
              {...opts}
            >
              <option key={0} value={0}>{`Select a ${caption.toLowerCase()}...`}</option>
              {this.props.children}
            </select>
          </div>
          {invalid && <div className="bp5-form-helper-text">{this.props.validator}</div>}
        </div>
      </div>
    );
  }
}
