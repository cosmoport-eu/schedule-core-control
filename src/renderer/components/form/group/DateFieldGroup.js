import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateInput3 } from '@blueprintjs/datetime2';

import styles from '../EventForm.module.css';

export default class DateFieldGroup extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    date: PropTypes.string,
    onChange: PropTypes.func,
    validator: PropTypes.string
  }

  static defaultProps = {
    date: '',
    message: '',
    onChange: () => { },
    validator: ''
  }

  handleDateChange = (date) => {
    this.props.onChange(this.props.name, date);
  }

  render() {
    const {caption, date, name, validator} = this.props;
    const invalid = validator !== '';
    const invalidMaybeClass = invalid ? ' bp5-intent-danger' : '';

    return (
      <div className={`bp5-form-group bp5-inline${invalidMaybeClass}`}>
        <label htmlFor={name} className={`bp5-label bp5-inline ${styles.label_text_short}`}>
          <span>{caption}</span>
        </label>
        <div className={`bp5-form-content${invalidMaybeClass}`}>
          <DateInput3
            id={name}
            className={styles.fullWidth}
            dateFnsFormat={'yyyy-MM-dd'}
            value={date}
            showActionsBar
            onChange={this.handleDateChange}
          />
          {invalid && <div className="bp5-form-helper-text">{validator}</div>}
        </div>
      </div>
    );
  }
}
