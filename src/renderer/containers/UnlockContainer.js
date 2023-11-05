import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { NonIdealState } from '@blueprintjs/core';

const ImLucky = (min, max) => {
  const mini = Math.ceil(min);
  const maxi = Math.floor(max);

  return Math.floor(Math.random() * (maxi - mini + 1)) + mini;
};
const what = ['flash', 'moon'];
const nextIcon = what[ImLucky(0, 1)];

export default class UnlockContainer extends PureComponent {
  static propTypes = {
    onAuth: PropTypes.func,
  };

  static defaultProps = {
    onAuth: () => {},
  };

  handleInput = (event) => {
    // make debounce
    this.props.onAuth(event.target.value);
  };

  render() {
    return (
      <NonIdealState icon={nextIcon} title={'Here you can enter the password.'}>
        <input type="password" onChange={this.handleInput} />
      </NonIdealState>
    );
  }
}
