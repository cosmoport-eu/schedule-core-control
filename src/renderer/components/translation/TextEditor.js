import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditableText } from '@blueprintjs/core';

export default class TextEditor extends Component {
  static propTypes = {
    id: PropTypes.number,
    text: PropTypes.string,
    onConfirm: PropTypes.func,
    locale:PropTypes.number,
  }

  static defaultProps = {
    id: 0,
    text: '',
    locale: 0,
    onConfirm: () => { }
  }

  onConfirm = (value) => {
    this.props.onConfirm(this.props.id, value, this.props.text, this.props.locale);
  }

  render() {
    return (
      <EditableText
        multiline
        minLines={3}
        maxLines={12}
        defaultValue={this.props.text}
        onConfirm={this.onConfirm}
      />
    );
  }
}
