import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditableText } from '@blueprintjs/core';

export default class TextValueEditor extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  onConfirm = (val) => {
    this.props.onConfirm(this.props.id, val, this.props.text);
  };

  onChange = (val) => {
    this.setState({ value: val });
  };

  render() {
    const { className, text } = this.props;

    return (
      <EditableText
        className={className}
        placeholder=""
        selectAllOnFocus
        defaultValue={text}
        onConfirm={this.onConfirm}
      />
    );
  }
}
