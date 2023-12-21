import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EventPropType from '../../props/EventPropType';
import { eventStatus } from 'cosmoport-core-api-client';
import _date from '../date/_date';

/**
 * A client-side Cosmoport activity simulation.
 *
 * Uses internal timer and React eco-system.
 *
 * @version 0.0.0
 */
export default class Simulator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: this.inBusiness(props.business),
      actions: [],
      ticks: 0,
      archiveTime: 10,
    };

    // An internal timer
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(() => this.update(), 1000);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { boarding, business, events, onActionsUpdate, onSimulationTick } =
      this.props;
    const { archiveTime } = this.state;

    if (events !== nextProps.events || boarding !== nextProps.boarding) {
      const newActions = this.scheduleActions(
        nextProps.events,
        nextProps.boarding,
        archiveTime,
      );
      this.setState({ actions: newActions });
      onActionsUpdate(newActions);
    }

    if (business !== nextProps.business) {
      this.setState({ active: this.inBusiness(nextProps.business) }, () => {
        onSimulationTick(this.state);
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  inBusiness = (props) => {
    if (props.non) {
      return false;
    }

    if (props.start === 0 && props.end === 0) {
      return true;
    }

    const current = _date.toMinutes(new Date());

    return current >= props.start && current <= props.end;
  };

  update = () => {
    const date = new Date();

    if (date.getSeconds() === 0) {
      this.tick(_date.toMinutes(date));
      if (this.isNewDay(date)) {
        this.props.onNewDay();
      }
    }
  };

  isNewDay = (date) => date.getMinutes() === 0 && date.getSeconds() === 0;

  tick = (minutes) => {
    this.calculateBusiness();
    this.doActionsForMinute(minutes);
    this.setState({ ticks: this.state.ticks + 1 }, () => {
      // Push the state upwards
      this.props.onSimulationTick(this.state);
    });
  };

  calculateBusiness = () => {
    const { business, onSimulationTick } = this.props;
    const { active } = this.state;
    const works = this.inBusiness(business);

    if (active !== works) {
      this.setState({ active: works }, () => {
        onSimulationTick(this.state);
      });
    }
  };

  scheduleActions = (events, boarding, archiveTime) =>
    events
      // Not a canceled event
      .filter((event) => event.eventStatusId !== eventStatus.CANCELED)
      // Generate actions from the events
      .map((event) => this.eventsToActions(event, boarding, archiveTime))
      // flatten all actions into one dimensional array
      .reduce((acc, cur) => acc.concat(cur), [])
      // sort it by start time and action weight (time following order)
      .sort((a, b) => a.time - b.time || a.weight - b.weight);

  eventsToActions = (event, pre, archive) => {
    const boardingTime = event.startTime - pre > 0 ? event.startTime - pre : 0;
    const eventTime = event.startTime;
    const timeOfReturn = event.startTime + event.durationTime;
    const beforeReturnTime = timeOfReturn - pre > 0 ? timeOfReturn - pre : 0;
    const archiveTime = eventTime + archive;

    return [
      // set the event status to boarding
      { event, time: boardingTime, do: 'set_status_boarding', weight: 1 },
      // Gate? show the number
      // Play sound
      { event, time: boardingTime, do: 'play_boarding_sound', weight: 2 },
      // Turn on the gate display
      { event, time: boardingTime, do: 'turn_on_gate', weight: 3 },
      // Set event status to departed
      { event, time: eventTime, do: 'set_status_departed', weight: 4 },
      // Play sound
      { event, time: eventTime, do: 'play_departed_sound', weight: 5 },
      // Archive the event
      { event, time: archiveTime, do: 'archive', weight: 6 },
      { event, time: beforeReturnTime, do: 'show_return', weight: 7 },
      { event, time: timeOfReturn, do: 'set_status_returned', weight: 8 },
    ];
  };

  action_reaction = {
    set_status_boarding: 'handleSetStatus',
    play_boarding_sound: 'handleAnnouncement',
    turn_on_gate: 'handleGateTurning',
    set_status_departed: 'handleSetStatus',
    play_departed_sound: 'handleAnnouncement',
    archive: 'handleArchive',
    show_return: 'handleReturn',
    set_status_returned: 'handleSetStatus',
  };

  action_sound_reaction = {
    play_boarding_sound: 'boarding',
    play_departed_sound: 'departure',
  };

  doActionsForMinute = (minute) => {
    const { active, actions } = this.state;
    active && actions.filter((a) => a.time === minute).forEach(this.doIt);
  };

  doIt = (action) => this[this.action_reaction[action.do]](action);

  handleSetStatus = (action) => this.props.onStatusChange(action);

  handleAnnouncement = (action) =>
    this.props.onAnnouncement({
      id: action.event.id,
      time: new Date().getTime(),
      type: this.action_sound_reaction[action.do],
    });

  handleGateTurning = (action) => this.props.onTurnGateOn(action);

  handleArchive = (action) => this.props.onArchive(action);

  handleReturn = (action) => this.props.onReturn(action);

  render = () => <span />;
}

Simulator.propTypes = {
  events: PropTypes.arrayOf(EventPropType),
  // A number of minutes for action calculations before the events
  business: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
    non: PropTypes.bool,
  }),
  boarding: PropTypes.number.isRequired,
  onStatusChange: PropTypes.func,
  onAnnouncement: PropTypes.func,
  onTurnGateOn: PropTypes.func,
  onArchive: PropTypes.func,
  onReturn: PropTypes.func,
  onSimulationTick: PropTypes.func,
  onActionsUpdate: PropTypes.func,
  onNewDay: PropTypes.func,
};

Simulator.defaultProps = {
  events: [],
  active: false,
  business: {
    start: 0,
    end: 0,
    non: false,
  },
  onStatusChange: () => {},
  onAnnouncement: () => {},
  onTurnGateOn: () => {},
  onArchive: () => {},
  onReturn: () => {},
  onSimulationTick: () => {},
  onActionsUpdate: () => {},
  onNewDay: () => {},
};
