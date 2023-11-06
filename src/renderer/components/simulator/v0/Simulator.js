import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EventPropType from '../../../props/EventPropType';
import Action from '../action/Action';
import { eventStatus } from 'cosmoport-core-api-client/ApiV1';
import _date from '../../date/_date';

/**
 * A client-side Cosmoport activity simulation.
 *
 * Uses internal timer and React eco-system.
 *
 * @version 0.0.0
 */
export default class Simulator extends Component {
  static propTypes = {
    events: PropTypes.arrayOf(EventPropType),
    // A number of minutes for action calculations before the events
    business: PropTypes.shape({
      start: PropTypes.number,
      end: PropTypes.number,
      non: PropTypes.bool
    }),
    boarding: PropTypes.number.isRequired,
    onStatusChange: PropTypes.func,
    onAnnouncement: PropTypes.func,
    onTurnGateOn: PropTypes.func,
    onArchive: PropTypes.func,
    onReturn: PropTypes.func,
    onSimulationTick: PropTypes.func,
    onActionsUpdate: PropTypes.func,
    onNewDay: PropTypes.func
  }

  static defaultProps = {
    events: [],
    active: false,
    business: {
      start: 0,
      end: 0,
      non: false
    },
    onStatusChange: () => { },
    onAnnouncement: () => { },
    onTurnGateOn: () => { },
    onArchive: () => { },
    onReturn: () => { },
    onSimulationTick: () => { },
    onActionsUpdate: () => { },
    onNewDay: () => { }
  }

  constructor(props) {
    super(props);

    this.state = {
      active: this.inBusiness(props.business),
      actions: [],
      ticks: 0,
      archiveTime: 10
    };

    // An internal timer
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(() => this.update(), 1000);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.events !== nextProps.events || this.props.boarding !== nextProps.boarding) {
      const newActions =
        this.scheduleActions(nextProps.events, nextProps.boarding, this.state.archiveTime);
      this.setState({ actions: newActions });
      this.props.onActionsUpdate(newActions);
    }

    if (this.props.business !== nextProps.business) {
      this.setState({ active: this.inBusiness(nextProps.business) }, () => {
        this.props.onSimulationTick(this.state);
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
  }

  update = () => {
    const date = new Date();

    if (date.getSeconds() === 0) {
      this.tick(_date.toMinutes(date));
      if (this.isNewDay(date)) {
        this.props.onNewDay();
      }
    }
  }

  isNewDay = (date) => date.getMinutes() === 0 && date.getSeconds() === 0

  tick = (minutes) => {
    this.calculateBusiness();
    this.doActionsForMinute(minutes);
    this.setState({ ticks: this.state.ticks + 1 }, () => {
      // Push the state upwards
      this.props.onSimulationTick(this.state);
    });
  }

  calculateBusiness = () => {
    const works = this.inBusiness(this.props.business);

    if (this.state.active !== works) {
      this.setState({ active: works }, () => { this.props.onSimulationTick(this.state); });
    }
  }

  scheduleActions = (events, boarding, archiveTime) => events
    // Not a canceled event
    .filter(event => event.eventStatusId !== eventStatus.CANCELED)
    // Generate actions from the events
    .map(event => this.eventsToActions(event, boarding, archiveTime))
    // flatten all actions into one dimensional array
    .reduce((acc, cur) => acc.concat(cur), [])
    // sort it by start time and action weight (time following order)
    .sort((a, b) => a.time - b.time || a.weight - b.weight)

  eventsToActions = (event, pre, archive) => {
    const boardingTime = event.startTime - pre > 0 ? event.startTime - pre : 0;
    const eventTime = event.startTime;
    const returningTime = event.startTime + event.durationTime;
    const beforeReturnTime = returningTime - pre > 0 ? returningTime - pre : 0;
    const archiveTime = eventTime + archive;

    return [
      // set the event status to boarding
      new Action(event, boardingTime, 'set_status_boarding', 1),
      // Gate? show the number
      // Play sound
      new Action(event, boardingTime, 'play_boarding_sound', 2),
      // Turn on the gate display
      new Action(event, boardingTime, 'turn_on_gate', 3),
      // Set event status to departed
      new Action(event, eventTime, 'set_status_departed', 4),
      // Play sound
      new Action(event, eventTime, 'play_departed_sound', 5),
      // Archive the event
      new Action(event, archiveTime, 'archive', 6),
      new Action(event, beforeReturnTime, 'show_return', 7),
      new Action(event, returningTime, 'set_status_returned', 8)
    ];
  }

  mapActionToReaction = (action) => ({
    set_status_boarding: 'handleSetStatus',
    play_boarding_sound: 'handleAnnouncement',
    turn_on_gate: 'handleGateTurning',
    set_status_departed: 'handleSetStatus',
    play_departed_sound: 'handleAnnouncement',
    archive: 'handleArchive',
    show_return: 'handleReturn',
    set_status_returned: 'handleSetStatus'
  }[action.do])

  mapAnnouncement = (action) => (
    { play_boarding_sound: 'boarding', play_departed_sound: 'departure' }[action.do])

  doActionsForMinute = (minute) => {
    if (!this.state.active) {
      return;
    }

    this.state.actions
      .filter(a => a.time === minute)
      .forEach(a => { this.doIt(a); });
  }

  doIt = (action) => this[this.mapActionToReaction(action)](action)

  handleSetStatus = (action) => this.props.onStatusChange(action)

  handleAnnouncement = (action) => this.props.onAnnouncement({
    id: action.event.id, time: new Date().getTime(), type: this.mapAnnouncement(action)
  })

  handleGateTurning = (action) => this.props.onTurnGateOn(action)

  handleArchive = (action) => this.props.onArchive(action)

  handleReturn = (action) => this.props.onReturn(action)

  render = () => <span />
}
