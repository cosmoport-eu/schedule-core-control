import React, { Component, PropTypes } from 'react';

import EventTypePropType from '../../props/EventTypePropType';
import EventDestinationPropType from '../../props/EventDestinationPropType';
import EventStatusPropType from '../../props/EventStatusPropType';
import LocalePropType from '../../props/LocalePropType';
import L18n from '../l18n/L18n';
import DateFiledGroup from './group/DateFieldGroup';
import TimeFieldGroup from './group/TimeFieldGroup';
import ListFieldGroup from './group/ListFieldGroup';
import NumberFieldGroup from './group/NumberFieldGroup';
import LabelFieldGroup from './group/LabelFieldGroup';
import _date from '../date/_date';

import styles from './EventForm.css';

// TODO Make sure the props are changing (componentWill...)
// TODO Add label and client-side time overlap

/**
 * The class for event properties form.
 *
 * @since 0.1.0
 */
export default class EventForm extends Component {
  static propTypes = {
    refs: PropTypes.shape({
      destinations: PropTypes.arrayOf(EventDestinationPropType),
      statuses: PropTypes.arrayOf(EventStatusPropType),
      types: PropTypes.arrayOf(EventTypePropType)
    }).isRequired,
    locale: LocalePropType.isRequired
  }

  static defaultProps = { refs: { destinations: [], statuses: [], types: [] }, locale: {} }

  constructor(props) {
    super(props);

    this.l18n = new L18n(this.props.locale, this.props.refs);

    this.state = {
      // The day of the event
      date: new Date(),
      // Start minute of the event (in minutes)
      time: 0,
      // Duration of the event (in minutes)
      duration: 30,
      limit: 1,
      bought: 0,
      type: 0,
      destination: 0,
      gate: 0,
      status: 1,
      cost: 1,
      repeat_interval: 0
    };

    this.validators = {
      time: () => (this.state.time + this.state.duration + this.state.repeat_interval >= 24 * 60 ?
        'The event\'s duration time should be less than 24h in total.' : ''),
      type: () => (this.state.type === 0 ? 'Type is not selected.' : ''),
      status: () => (this.state.status === 0 ? 'Status is not selected.' : ''),
      gate: () => (this.state.gate === 0 ? 'Gate is not selected.' : ''),
      destination: () => (this.state.destination === 0 ? 'Destination is not selected.' : ''),
      bought: () => (this.state.bought > this.state.limit ? 'Beyond the tickets limit.' : '')
    };
  }

  /**
   * Returns all form's field mapped values.
   *
   * @return {Object} The form field values.
   * @since 0.1.0
   */
  getFormData = () => Object.assign(this.state, { valid: this.isValid() });

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

  /**
   * Handles a type selection with additional BS logic.
   *
   * @since 0.1.0
   */
  handleTypeChange = (name, value) => {
    this.handleChange(name, value);

    // get type's data from a repository
    const eventTypeData = this.props.refs.types.find((type) => type.id === value);

    // fill fields with default values
    this.setState({
      duration: eventTypeData.defaultDuration,
      repeat_interval: eventTypeData.defaultRepeatInterval
    });
  }

  handleWarningChange = (name, value) => {
    this.handleChange(name, value);
  }

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
      this.setState({ date: day });
    }
  }

  /**
   * Returns all form validators' call result.
   * It will return false on a first validation with a negative result (which has a message).
   *
   * @return {boolean} The result of validation.
   * @since 0.1.0
   */
  isValid = () => !Object.keys(this.validators).some(key => this.validators[key]() !== '')

  render() {
    const { destinations, types, statuses } = this.props.refs;
    const { time, type, status, destination, gate, bought } = this.validators;

    const statusOptions = statuses.map(op =>
      <option key={op.id} value={op.id}>
        {this.l18n.findTranslationById(op, 'i18nStatus')}
      </option>
    );
    const destinationOptions = destinations.map(op =>
      <option key={op.id} value={op.id}>
        {this.l18n.findTranslationById(op, 'i18nEventDestinationName')}
      </option>
    );
    const typeOptions = types.map(op =>
      <option key={op.id} value={op.id}>
        {this.l18n.findTranslationById(op, 'i18nEventTypeName')}&nbsp;/&nbsp;{this.l18n.findTranslationById(op, 'i18nEventTypeSubname')}
      </option>
    );

    const timeRange = this.state.time + this.state.duration;
    const invalidTimeRange = time() !== '';
    const invalidTimeRangeMaybeClass = invalidTimeRange ? ' pt-intent-danger' : '';
    const totalTime = _date.minutesToHm(timeRange);

    return (
      <div>
        <DateFiledGroup name="date" caption="day" date={this.state.date} onChange={this.handleChange} />

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
            <NumberFieldGroup name="repeat_interval" className={styles.repeat} caption="Repeat" number={this.state.repeat_interval} onChange={this.handleWarningChange} />
            <LabelFieldGroup className={styles.totalTime} value={totalTime} />
            {invalidTimeRange && <div className="pt-form-helper-text">{time()}</div>}
          </div>
        </div>

        <ListFieldGroup name="status" index={this.state.status} validator={status()} onChange={this.handleChange}>
          {statusOptions}
        </ListFieldGroup>

        <ListFieldGroup name="gate" index={this.state.gate} validator={gate()} onChange={this.handleChange}>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
          <option value="4">Four</option>
        </ListFieldGroup>

        <ListFieldGroup name="destination" index={this.state.destination} validator={destination()} onChange={this.handleChange}>
          {destinationOptions}
        </ListFieldGroup>

        <NumberFieldGroup name="cost" number={this.state.cost} icon={'euro'} onChange={this.handleChange} inline />

        <NumberFieldGroup name="limit" number={this.state.limit} onChange={this.handleChange} inline />

        <NumberFieldGroup name="bought" number={this.state.bought} validator={bought()} onChange={this.handleChange} inline />
      </div>
    );
  }
}
