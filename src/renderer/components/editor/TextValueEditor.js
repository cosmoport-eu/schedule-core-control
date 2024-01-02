import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditableText } from '@blueprintjs/core';
import { Button } from '@blueprintjs/core';

export default class TextValueEditor extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
    onSet: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    onSet: () => {},
  };

  constructor(props) {
    super(props);

    this.value = props.text;
  }

  handleChange = (newValue) => {
    if (this.value !== newValue) {
      this.value = newValue;
    }
  };

  handleClick = () => {
    this.props.onSet(this.props.id, this.value);
  };

  render() {
    const { className, text } = this.props;

    return (
      <div style={{ display: 'flex', margin: '2em 0' }}>
        <EditableText
          className={className}
          style={{ width: '7em' }}
          type="number"
          placeholder=""
          selectAllOnFocus
          defaultValue={text}
          onChange={this.handleChange}
        />
        <Button
          style={{ marginLeft: '5em', width: '7em' }}
          text="Save"
          onClick={this.handleClick}
        />
      </div>
    );
  }
}
