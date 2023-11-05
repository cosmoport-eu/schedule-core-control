import React from 'react';
import PropTypes from 'prop-types';

import { NumericInput, Intent, FormGroup } from '@blueprintjs/core';

import styles from '../EventForm.module.css';

export default class NumberFieldGroup extends React.PureComponent {
  handleValueChange = (value) => this.props.onChange(this.props.name, value);

  render() {
    const { caption, className, icon, inline, name, number, validator } =
      this.props;
    const intent = validator !== '' ? Intent.DANGER : Intent.NONE;

    return (
      <FormGroup
        className={`${className} ${styles.label_lpad}`}
        contentClassName={styles.fill}
        inline={inline}
        labelFor={name}
        label={caption || name}
        helperText={validator}
        intent={intent}
      >
        <NumericInput
          id={name}
          allowNumericCharactersOnly
          intent={intent}
          buttonPosition={'none'}
          leftIcon={icon}
          min={0}
          fill
          value={number}
          onValueChange={this.handleValueChange}
        />
      </FormGroup>
    );
  }
}

NumberFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  caption: PropTypes.string,
  number: PropTypes.number,
  onChange: PropTypes.func,
  validator: PropTypes.string,
  icon: PropTypes.string,
  inline: PropTypes.bool,
  className: PropTypes.string,
};

NumberFieldGroup.defaultProps = {
  caption: '',
  number: 0,
  onChange: () => {},
  validator: '',
  icon: null,
  inline: false,
  className: '',
};
