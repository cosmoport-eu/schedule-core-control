import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Classes, Icon, Popover, Tag } from '@blueprintjs/core';

import PageCaption from '../components/page/PageCaption';
import GateSchedule from '../components/simulator/GateSchedule';
import EventPropType from '../props/EventPropType';
import SimulationPropType from '../props/SimulationPropType';
import AnnouncementPropType from '../props/AnnouncementPropType';
import _date from '../components/date/_date';

import styles from '../components/simulator/Simulator.module.css';

const groupBy = (values, prop) =>
  values.reduce((a, b) => {
    const key = typeof prop === 'function' ? prop(b) : b[prop];
    a[key] = !a[key] ? [b] : [...a[key], b];
    return a;
  }, {});

export default class SimulationContainer extends PureComponent {
  state = {
    showSchedule: false,
  };

  handleShowScheduleClick = () => {
    this.setState((prev) => ({
      ...prev,
      showSchedule: !prev.showSchedule,
    }));
  };

  handleActionClick = (action) =>
    this.props.auth && this.props.onActionClick(action);

  render() {
    const {
      auth,
      simulation,
      announcements: ann,
      events,
      onStopAnnounce,
    } = this.props;
    const { showSchedule } = this.state;

    const minutes = _date.toMinutes(new Date());
    const hasAnnouncements = ann.length > 0;

    let c = 0;
    const grouped = [];
    ann.forEach((a) => {
      const last = grouped[grouped.length - 1];
      if (!grouped.length || a.id !== last.id || a.type !== last.type) {
        a.c = c;
        c = 0;
        grouped.push(a);
      } else {
        grouped[grouped.length - 1].c++;
      }
    });

    const announcementList = hasAnnouncements ? (
      grouped.map((a, i) => (
        <Tag minimal key={i}>{`#${a.id} ${a.type}${
          a.c ? ' x' + (a.c + 1) : ''
        }`}</Tag>
      ))
    ) : (
      <div>...</div>
    );

    const groupById = groupBy(simulation.actions, ({ event }) => event.id);

    const actionInfo = [];

    Object.keys(groupById).forEach((id, j) => {
      const line = [];
      line.push(<div key={`h${j}`}>#{id}</div>);
      const actions = groupById[id];

      line.push(
        <div key={j} className={styles.actionList}>
          {actions.map((action, i) => {
            let destination = '';
            if (action.do === 'turn_on_gate') {
              destination = `(G${action.event.gateId}) `;
            } else if (action.do === 'show_return') {
              destination = `(G${action.event.gate2Id}) `;
            }

            const time = _date.minutesToHm(action.time);
            const doneMaybe = action.time < minutes ? styles.done : '';

            return (
              <Tag
                minimal
                {...(auth && { interactive: true })}
                className={`${styles.noSelect} ${doneMaybe}`}
                key={`${j}${i}`}
                {...(auth && {
                  onClick: () => this.handleActionClick(action),
                })}
              >
                {`${time} ${action.do} ${destination}`}
              </Tag>
            );
          })}
        </div>,
      );
      actionInfo.push(
        <div key={`l${j}`} className={styles.actionListRecord}>
          {line}
        </div>,
      );
    });

    return (
      <>
        <div className={styles.cap}>
          <PageCaption text="02 Simulation" />
          <Popover
            interactionKind="hover"
            popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            placement="left-start"
            content={`Here you can control the system simulation somewhat. Be aware it
              will change statuses of events. After you enter the password,
              you can use all the actions.`}
            renderTarget={({ isOpen, ...targetProps }) => (
              <span {...targetProps}>
                <Icon icon="help" style={{ color: '#97a4b7' }} size={20} />
              </span>
            )}
          />
        </div>
        <p />
        <span className={styles.strong}>Announcements</span>
        <Button
          minimal
          small
          rightIcon="cross"
          text="stop all"
          onClick={onStopAnnounce}
        />
        <div className={styles.announcementInfo}>{announcementList}</div>
        <p />
        <div>
          <span className={styles.strong}>Simulation ticks</span>
          <div className={styles.simulationInfo}>
            <span>
              <Icon
                className={simulation.active ? styles.heart : ''}
                icon="heart"
              />
              {simulation.ticks > 0 && simulation.ticks}
            </span>
            <span>{minutes}/1440</span>
            <div>
              <Button
                minimal
                small
                icon={showSchedule ? 'caret-down' : 'caret-right'}
                text="Show schedule infographic"
                onClick={this.handleShowScheduleClick}
              />
            </div>
          </div>
          {showSchedule && <GateSchedule events={events} minutes={minutes} />}
          <p />
          <span className={styles.strong}>Event list</span>
          <div>{actionInfo}</div>
        </div>
        <p />
      </>
    );
  }
}

SimulationContainer.propTypes = {
  auth: PropTypes.bool,
  events: PropTypes.arrayOf(EventPropType),
  announcements: PropTypes.arrayOf(AnnouncementPropType),
  simulation: SimulationPropType,
  onActionClick: PropTypes.func,
  onStopAnnounce: PropTypes.func,
};

SimulationContainer.defaultProps = {
  auth: false,
  events: [],
  announcements: [],
  simulation: {
    active: false,
    ticks: 0,
    actions: [],
  },
  onActionClick: () => {},
  onStopAnnounce: () => {},
};
