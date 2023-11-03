import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

import PageCaption from '../components/page/PageCaption';
import GateSchedule from '../components/simulator/schedule/GateSchedule';
import EventPropType from '../props/EventPropType';
import SimulationPropType from '../props/SimulationPropType';
import AnnouncementPropType from '../props/AnnouncementPropType';
import _date from '../components/date/_date';

import styles from '../components/simulator/Simulator.css';

export default class SimulationContainer extends Component {
  static propTypes = {
    auth: PropTypes.bool,
    events: PropTypes.arrayOf(EventPropType),
    announcements: PropTypes.arrayOf(AnnouncementPropType),
    simulation: SimulationPropType,
    onActionClick: PropTypes.func
  }

  static defaultProps = {
    auth: false,
    events: [],
    announcements: [],
    simulation: {
      active: false,
      ticks: 0,
      actions: []
    },
    onActionClick: () => { }
  }

  state = {
    showSchedule: false
  }

  handleShowScheduleClick = () => {
    this.setState({ showSchedule: true });
  }

  handleActionClick = (action) => {
    if (this.props.auth) {
      this.props.onActionClick(action);
    }
  }

  render() {
    const { simulation, announcements, events } = this.props;
    const announcementsList = announcements.length > 0 ?
      announcements.map((a, i) => <div key={`${a.id}${a.time}`}>{`${i + 1} - ${a.type} (#${a.id})`}</div>) : <div>Empty</div>;
    const currentMinutes = _date.toMinutes(new Date());
    const actionsList = simulation.actions.map(
      action => {
        let destination = '';
        if (action.do === 'turn_on_gate') {
          destination = `(G${action.event.gateId}) `;
        } else if (action.do === 'show_return') {
          destination = `(G${action.event.gate2Id}) `;
        }

        return (<div style={{ minWidth: '260px' }} className={`pt-minimal ${action.time < currentMinutes ? styles.done : ''}`} key={`${action.event.id}_${action.time}_${action.do}`}>
          {`(#${action.event.id}) `}{_date.minutesToHm(action.time)} → {destination}<Button className={`pt-minimal ${action.time < currentMinutes ? styles.done : ''}`} text={action.do} onClick={this.handleActionClick.bind(this, action)} />
        </div >);
      });

    return (
      <div >
        <PageCaption text="02 Simulation" />
        <div className="pt-callout" style={{ fontSize: '80%' }}>
          Here you can control the system simulation somewhat.
          Be aware it will change statuses of events.
          After you enter the password, you can use all the actions.
        </div>
        <p />
        <div>
          Queue for announcements:
          {announcementsList}
        </div>
        <p />
        <div>
          <span className="pt-icon-heart">{simulation.ticks > 0 && simulation.ticks}</span>
          <div>
            <Button className="pt-minimal" text="Show schedule infographic" onClick={this.handleShowScheduleClick} />
            {this.state.showSchedule && <GateSchedule events={events} />}
          </div>
          <div className="pt-callout">
            The list below reads from left to right, and new line starts from the left ⥅.
        </div>
          <p />
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {actionsList}
          </div>
        </div>
        <p />
      </div>
    );
  }
}
