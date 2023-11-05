import React, { Component } from 'react';
import { Switch } from '@blueprintjs/core';
import { TimePicker } from '@blueprintjs/datetime';

import _date from '../../../components/date/_date';

export default class BusinessDayEditor extends Component {
  handleChangeStart = (value) => {
    this.props.onChange(this.props.day, value, 'start');
  };

  handleChangeEnd = (value) => {
    this.props.onChange(this.props.day, value, 'end');
  };

  handleSwitch = (event) => {
    this.props.onSwitch(this.props.day, !(event.target.value === 'on'));
  };

  render() {
    const { day, onChange } = this.props;

    const active = day.non ? { disabled: true } : {};

    return (
      <div key={day.day} style={{ display: 'flex', gap: '.5em' }}>
        <span style={{width: "2.5em"}}>{day.day}</span>
        <TimePicker
          {...active}
          defaultValue={_date.toDate(day.start)}
          selectAllOnFocus
          onChange={this.handleChangeStart}
        />
        <TimePicker
          {...active}
          defaultValue={_date.toDate(day.end)}
          selectAllOnFocus
          onChange={this.handleChangeEnd}
        />
        <Switch
          defaultChecked={!day.non}
          onChange={this.handleSwitch}
          label="Working"
        />
      </div>
    );
  }
}
