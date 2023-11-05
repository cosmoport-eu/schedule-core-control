import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class LabelFieldGroup extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string
  }

  static defaultProps = {
    className: '',
    value: ''
  }

  render() {
    return (<div className={this.props.className}><span>{this.props.value}</span></div>);
  }
}
