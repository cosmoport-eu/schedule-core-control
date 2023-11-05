import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import EventPropType from '../../../props/EventPropType';

import styles from './GateSchedule.module.css';

const groupByGate = (events, prop) =>
  events.reduce((acc, val) => {
    const day = val[prop];
    acc[day] = acc[day] || [];
    acc[day].push(val);

    return acc;
  }, Object.create(null));

export default class GateSchedule extends PureComponent {
  static propTypes = {
    events: PropTypes.arrayOf(EventPropType),
  };

  static defaultProps = {
    events: [],
  };

  draw1440 = (lines) => {
    const rez = [];

    for (let i = 0; i < 1441; i += 1) {
      const set = lines.find(
        (e) => i >= e.startTime && i <= e.startTime + e.durationTime,
      );
      rez.push(
        set ? <span key={i} className={styles.set} /> : <span key={i} />,
      );
    }

    return rez;
  };

  render() {
    const { events } = this.props;
    const mapping = Object.assign(
      {},
      groupByGate(events, 'gateId') /* , groupByGate(events, 'gate2Id')*/,
    );
    const gates = Object.keys(mapping).map((key) => (
      <div
        key={key}
        className={styles.container}
        style={{ marginBottom: '1em' }}
      >
        <div>{key}</div>
        <div className={styles.container}>{this.draw1440(mapping[key])}</div>
      </div>
    ));

    return (
      <div>
        <div>
          A duration of the events across all the gates (the second gates are
          not included).
        </div>
        <div className={styles.container}>{gates}</div>
      </div>
    );
  }
}
