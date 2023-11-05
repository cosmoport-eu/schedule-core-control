import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NumericInput, Checkbox } from '@blueprintjs/core';

import styles from './LocaleInput.module.css';

export default class LocaleInput extends Component {
  static propTypes = {
    locale: PropTypes.shape({
      code: PropTypes.string,
      default: PropTypes.bool,
      id: PropTypes.number,
      localeDescription: PropTypes.string,
      show: PropTypes.bool,
      showTime: PropTypes.number
    }).isRequired,
    onChange: PropTypes.func,
    onCheck: PropTypes.func
  }

  static defaultProps = {
    onChange: () => { },
    onCheck: () => { }
  }

  handleValueChange = (value) => {
    this.props.onChange(this.props.locale, value);
  }

  handleCheck = () => {
    const value = !this.props.locale.show;

    this.props.onCheck(this.props.locale, value);
  }

  render() {
    const { locale } = this.props;
    const checkBox = locale.default ?
      (<Checkbox
        key={1}
        className={styles.locale}
        checked={locale.show}
        label={locale.code}
        disabled
      />) :
      (<Checkbox
        key={1}
        className={styles.locale}
        checked={locale.show}
        label={locale.code}
        onChange={this.handleCheck}
      />);

    return (
      <div className={styles.container}>
        {checkBox}
        <NumericInput
          id={locale.id}
          className={styles.input}
          allowNumericCharactersOnly
          buttonPosition={'none'}
          min={0}
          value={locale.showTime}
          onValueChange={this.handleValueChange}
        />
        <span>s</span>
      </div>
    );
  }
}
