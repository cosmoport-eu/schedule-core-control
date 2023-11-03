import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EventPropType from '../../props/EventPropType';
import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';
import GatePropType from '../../props/GatePropType';
import L18n from '../l18n/L18n';
import DateFiledGroup from './group/DateFieldGroup';
import TimeFieldGroup from './group/TimeFieldGroup';
import ListFieldGroup from './group/ListFieldGroup';
import NumberFieldGroup from './group/NumberFieldGroup';
import LabelFieldGroup from './group/LabelFieldGroup';
import _date from '../date/_date';

import styles from './EventForm.css';

/**
 * The class for event properties form.
 *
 * @since 0.1.0
 */
export default class EventForm extends Component {
  static propTypes = {
    forCreate: PropTypes.bool,
    event: EventPropType,
    refs: RefsPropType.isRequired,
    locale: LocalePropType.isRequired,
    gates: PropTypes.arrayOf(GatePropType).isRequired,
    date: PropTypes.string
  }

  static defaultProps = {
    forCreate: false,
    event: null,
    refs: { destinations: [], statuses: [], states: [], types: [] },
    locale: {},
    gates: [],
    date: null
  }

  constructor(props) {
    super(props);

    this.state = {
      // The day of the event
      date: _date.toYmd(new Date()),
      // Start minute of the event (in minutes)
      time: 0,
      // Duration of the event (in minutes)
      duration: 0,
      limit: 1,
      bought: 0,
      type: 0,
      destination: 0,
      gate: 0,
      gate2: 0,
      status: 0,
      state: 1,
      cost: 1,
      repeat_interval: 0,
      default_duration: 0,
      default_repeat_interval: 0
    };

    // Overrides initial data with passed in parameters
    if (props.event) {
      this.fillState(props.event);
    }

    if (props.date) {
      this.state.date = props.date;
    }

    this.validators = {
      time: () => (this.state.time + this.state.duration + this.state.repeat_interval >= 24 * 60 ?
        'The total event\'s duration time should be less than 24 h.' : ''),
      type: () => (this.state.type === 0 ? 'Type is not selected.' : ''),
      gate: () => (this.state.gate === 0 ? 'Gate for departion is not selected.' : ''),
      gate2: () => (this.state.gate2 === 0 ? 'Gate for return is not selected.' : ''),
      destination: () => (this.state.destination === 0 ? 'Destination is not selected.' : ''),
      bought: () => (this.state.bought > this.state.limit ? 'Beyond the tickets limit.' : '')
    };

    this.warnings = {
      duration: () => (this.state.duration !== this.state.default_duration ? 'You have selected not default duration value.' : ''),
      repeat_interval: () => (this.state.repeat_interval !== this.state.default_repeat_interval ? 'You have selected not default repeat interval value.' : '')
    };
  }

  /**
   * Returns all form's field mapped values.
   *
   * @return {Object} The form field values.
   * @since 0.1.0
   */
  getFormData = () => Object.assign(
    this.state, { date: _date.toYmd(this.state.date), valid: this.isValid() });

  /**
   * Converts an event object into form understandable state.
   *
   * @since 0.1.0
   */
  fillState = (event) => {
    if (event) {
      const eventTypeData = this.findEventTypeData(event.eventTypeId);

      this.state = {
        id: event.id,
        date: _date.fromYmd(event.eventDate),
        time: event.startTime,
        duration: event.durationTime,
        limit: event.peopleLimit,
        bought: event.contestants,
        type: event.eventTypeId,
        destination: event.eventDestinationId,
        gate: event.gateId,
        gate2: event.gate2Id,
        status: event.eventStatusId,
        state: event.eventStateId,
        cost: event.cost,
        repeat_interval: event.repeatInterval,
        default_duration: eventTypeData.defaultDuration,
        default_repeat_interval: eventTypeData.defaultRepeatInterval
      };
    }
  }

  /**
   * Handles a change event on an input component.
   *
   * @since 0.1.0
   */
  handleChangeEvent = (event) => {
    this.handleChange(event.target.name, event.target.value);
  }

  /**
   * Handles a component's value change.
   *
   * @since 0.1.0
   */
  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }

  suggestNext = (pre) => {
    if (this.props.forCreate && this.state.repeat_interval > 0) {
      this.setState({ time: this.state.time + this.state.repeat_interval + pre });
    }
  }

  /**
   * Handles a type selection with additional BS logic.
   *
   * @since 0.1.0
   */
  handleTypeChange = (name, value) => {
    this.handleChange(name, value);

    // get type's data from a repository
    const eventTypeData = this.findEventTypeData(value);

    // fill fields with default values
    this.setState({
      duration: eventTypeData.defaultDuration,
      repeat_interval: eventTypeData.defaultRepeatInterval,
      default_duration: eventTypeData.defaultDuration,
      default_repeat_interval: eventTypeData.defaultRepeatInterval,
    });
  }

  findEventTypeData = (value) => this.props.refs.types.find((type) => type.id === value)

  /**
   * Handles the change event on an input field of <day> type.
   *
   * @param {Date} day The date value.
   *
   * @since 0.1.0
   */
  handleDayChange = (day) => {
    // It can be null if user selects same date - skip the state change in that case
    if (day) {
      this.setState({ date: _date.toYmd(day) });
    }
  }

  /**
   * Returns all form validators' call result.
   * It will return false on a first validation rule violation (which has a message).
   *
   * @return {boolean} The result of validation.
   * @since 0.1.0
   */
  isValid = () => !Object.keys(this.validators).some(key => this.validators[key]() !== '')

  renderWarnings = () => {
    const warnings = [];

    Object.keys(this.warnings).forEach((warning) => {
      const check = this.warnings[warning]();
      if (check !== '') {
        warnings.push({ name: warning, message: check });
      }
    });

    if (warnings.length === 0) {
      return null;
    }

    return (
      <div className={styles.warningBlock}>
        {warnings.map((warning) => (<div key={warning.name}>
          <span className="pt-icon-standard pt-icon-warning-sign" />
          <span>{warning.message}</span></div>)
        )}
      </div>
    );
  }

  render() {
    const { destinations, types, statuses, states } = this.props.refs;

    if (!destinations || !types || !statuses) {
      return <div>:(</div>;
    }

    const { time, type, destination, gate, gate2, bought } = this.validators;
    const l18n = new L18n(this.props.locale, this.props.refs);

    const statusOptions = statuses.map(op =>
      (<option key={op.id} value={op.id}>
        {l18n.findTranslationById(op, 'i18nStatus')}
      </option>)
    );
    const stateOptions = states.map(op =>
      (<option key={op.id} value={op.id}>
        {l18n.findTranslationById(op, 'i18nState')}
      </option>)
    );
    const destinationOptions = destinations.map(op =>
      (<option key={op.id} value={op.id}>
        {l18n.findTranslationById(op, 'i18nEventDestinationName')}
      </option>)
    );
    const typeOptions = types.map(op =>
      (<option key={op.id} value={op.id}>
        {l18n.findTranslationById(op, 'i18nEventTypeName')}&nbsp;/&nbsp;{l18n.findTranslationById(op, 'i18nEventTypeSubname')}
      </option>)
    );
    const gateOptions = this.props.gates.map(gate_ =>
      (<option key={gate_.id} value={gate_.id}>
        {gate_.id} - {gate_.number} {gate_.gateName}
      </option>)
    );

    const date = _date.fromYmd(this.state.date);
    const timeRange = this.state.time + this.state.duration;
    const invalidTimeRange = time() !== '';
    const invalidTimeRangeMaybeClass = invalidTimeRange ? ' pt-intent-danger' : '';
    const totalTime = _date.minutesToHm(timeRange);
    const warnings = this.renderWarnings();

    return (
      <div>
        <DateFiledGroup name="date" caption="day" date={date} onChange={this.handleChange} />

        <ListFieldGroup name="type" index={this.state.type} validator={type()} onChange={this.handleTypeChange}>
          {typeOptions}
        </ListFieldGroup>

        <div className={`pt-form-group ${styles.formTimeRangeContainer}${invalidTimeRangeMaybeClass}`}>
          <label htmlFor="time-range" className={`pt-label pt-inline ${styles.label_text} ${styles.timeLabel}`}>
            <span>Time</span>
          </label>
          <div className={`pt-form-content ${styles.formTimeRange}${invalidTimeRangeMaybeClass}`}>
            <TimeFieldGroup name="time" caption="Start" minutes={this.state.time} onChange={this.handleChange} />
            <TimeFieldGroup name="duration" caption="Duration" minutes={this.state.duration} onChange={this.handleChange} />
            {this.state.default_repeat_interval > 0 && <NumberFieldGroup name="repeat_interval" className={styles.repeat} caption="Repeat" number={this.state.repeat_interval} onChange={this.handleChange} />}
            <LabelFieldGroup className={styles.totalTime} value={totalTime} />
            {invalidTimeRange && <div className="pt-form-helper-text">{time()}</div>}
            {warnings && warnings}
          </div>
        </div>

        <ListFieldGroup name="status" index={this.state.status} onChange={this.handleChange}>
          {statusOptions}
        </ListFieldGroup>

        <div className={`pt-form-group ${styles.formGatesContainer}`}>
          <label htmlFor="time-range" className={`pt-label pt-inline ${styles.label_text} ${styles.timeLabel}`}>
            <span>Gates</span>
          </label>
          <div className={styles.formGates}>
            <ListFieldGroup name="gate" caption="Departion" index={this.state.gate} validator={gate()} onChange={this.handleChange}>
              {gateOptions}
            </ListFieldGroup>

            <ListFieldGroup name="gate2" caption="Return" index={this.state.gate2} validator={gate2()} onChange={this.handleChange}>
              {gateOptions}
            </ListFieldGroup>
          </div>
        </div>

        <ListFieldGroup name="destination" index={this.state.destination} validator={destination()} onChange={this.handleChange}>
          {destinationOptions}
        </ListFieldGroup>

        <NumberFieldGroup name="cost" number={this.state.cost} icon={'euro'} onChange={this.handleChange} inline />

        <NumberFieldGroup name="limit" number={this.state.limit} onChange={this.handleChange} inline />

        <NumberFieldGroup name="bought" number={this.state.bought} validator={bought()} onChange={this.handleChange} inline />

        {!this.props.forCreate && <ListFieldGroup name="state" index={this.state.state} onChange={this.handleChange}>
          {stateOptions}
        </ListFieldGroup>}
      </div>
    );
  }
}
