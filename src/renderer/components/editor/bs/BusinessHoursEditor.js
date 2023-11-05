import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

import BusinessDayEditor from './BusinessDayEditor';
import _date from '../../../components/date/_date';

export default class BusinessHours extends Component {
  static propTypes = {
    setting: PropTypes.shape({
      id: PropTypes.number,
      param: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
    onSet: PropTypes.func,
  };

  static defaultProps = {
    onSet: () => {},
  };

  constructor(props) {
    super(props);

    this.state = this.unMarshal(props.setting.value);
  }

  unMarshal = (text) => JSON.parse(text);

  marshal = (json) => JSON.stringify(json);

  handleChange = (day, value, what) => {
    const state = this.state;

    const el = this.state.hours.findIndex((e) => e.day === day.day);
    const old = state.hours[el][what];
    const new_ = _date.toMinutes(value);

    if (old !== new_) {
      state.hours[el][what] = new_;
    }
  };

  handleSwitch = (day) => {
    const state = this.state;

    const el = this.state.hours.findIndex((e) => e.day === day.day);
    state.hours[el].non = !state.hours[el].non;

    this.setState({ hours: state.hours });
  };

  handleClick = () => {
    this.props.onSet(this.props.setting.id, this.marshal(this.state));
  };

  render() {
    const { hours: days } = this.state;

    return (
      <>
        {days.map((day_) => (
          <BusinessDayEditor
            key={day_.day}
            day={day_}
            onChange={this.handleChange}
            onSwitch={this.handleSwitch}
          />
        ))}
        <Button
          style={{ marginLeft: '15em', marginTop: '1em', width: '7em' }}
          text="Set"
          onClick={this.handleClick}
        />
      </>
    );
  }
}
