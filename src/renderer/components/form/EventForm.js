import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EventPropType from '../../props/EventPropType';
import RefsPropType from '../../props/RefsPropType';
import GatePropType from '../../props/GatePropType';
import L18n from '../l18n/L18n';
import DateFiledGroup from './group/DateFieldGroup';
import TimeFieldGroup from './group/TimeFieldGroup';
import ListFieldGroup from './group/ListFieldGroup';
import NumberFieldGroup from './group/NumberFieldGroup';
import LabelFieldGroup from './group/LabelFieldGroup';
import _date from '../date/_date';

import styles from './EventForm.module.css';
import TextAreaGroup from './group/TextAreaGroup';

/**
 * The class for event properties form.
 *
 * @since 0.1.0
 */
export default class EventForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // The day of the event
      date: _date.toYmd(new Date()),
      // Start minute of the event (in minutes)
      time: 0,
      // Duration of the event (in minutes)
      duration: 0,
      limit: 0,
      bought: 0,
      category: 0,
      subtype: 0,
      has_subtypes: false,
      type: 0,
      gate: 0,
      gate2: 0,
      status: 0,
      state: 1,
      cost: 0,
      repeat_interval: 0,
      default_duration: 0,
      default_repeat_interval: 0,
      default_cost: 0,
    };

    // Overrides initial data with passed in parameters
    if (props.event) {
      this.fillState(props.event);
    }

    if (props.date) {
      this.state.date = props.date;
    }

    this.validators = {
      time: () =>
        this.state.time + this.state.duration + this.state.repeat_interval >=
        24 * 60
          ? "The total event's duration time should be less than 24 h."
          : '',
      type: () => (this.state.type === 0 ? 'Type is not selected.' : ''),
      category: () =>
        this.state.category === 0 ? 'Category is not selected.' : '',
      subtype: () =>
        this.state.has_subtypes && this.state.subtype === 0
          ? 'Subtype (Lesson) is not selected.'
          : '',
      gate: () =>
        this.state.gate === 0 ? 'Gate for departion is not selected.' : '',
      gate2: () =>
        this.state.gate2 === 0 ? 'Gate for return is not selected.' : '',
      bought: () =>
        this.state.bought > this.state.limit ? 'Beyond the tickets limit.' : '',
    };

    this.warnings = {
      duration: () =>
        this.state.duration !== this.state.default_duration
          ? 'You have selected not default duration value.'
          : '',
      repeat_interval: () =>
        this.state.repeat_interval !== this.state.default_repeat_interval
          ? 'You have selected not default repeat interval value.'
          : '',
    };
  }

  // fill fields with default values
  defaults_set = (data) =>
    this.setState({
      cost: data.defaultCost,
      duration: data.defaultDuration,
      repeat_interval: data.defaultRepeatInterval,
      default_duration: data.defaultDuration,
      default_repeat_interval: data.defaultRepeatInterval,
      default_cost: data.defaultCost,
    });

  // get type's data from a repository
  defaults_fill = (value) => {
    const eventTypeData = this.findEventTypeData(value) || {
      defaultDuration: 0,
      defaultRepeatInterval: 0,
      defaultCost: 0,
    };

    this.defaults_set(eventTypeData);
  };

  defaults_reset = () =>
    this.defaults_set({
      defaultDuration: 0,
      defaultRepeatInterval: 0,
      defaultCost: 0,
    });

  /**
   * Returns all form's field mapped values.
   *
   * @return {Object} The form field values.
   * @since 0.1.0
   */
  getFormData = () => {
    const data = Object.assign(this.state, {
      date: _date.toYmd(this.state.date),
      valid: this.isValid(),
    });

    if (this.state.subtype) {
      data.type = this.state.subtype;
    }

    return data;
  };

  /**
   * Converts an event object into form understandable state.
   *
   * @since 0.1.0
   */
  fillState = (event) => {
    if (!event) return;

    const { categoryId, defaultDuration, defaultRepeatInterval, defaultCost, parentId } =
      this.findEventTypeData(event.eventTypeId);
    
    let [type, subtype, has_subtypes] = [event.eventTypeId, 0, false];

    if (parentId !== null && parentId !== 0) {
      subtype = type;
      type = parentId;
      has_subtypes = true;
    }

    this.state = {
      id: event.id,
      date: _date.fromYmd(event.eventDate),
      time: event.startTime,
      duration: event.durationTime,
      limit: event.peopleLimit,
      bought: event.contestants,
      category: categoryId,
      subtype: subtype,
      has_subtypes: has_subtypes,
      type: type,
      gate: event.gateId,
      gate2: event.gate2Id,
      status: event.eventStatusId,
      state: event.eventStateId,
      cost: event.cost,
      repeat_interval: event.repeatInterval,
      default_duration: defaultDuration,
      default_repeat_interval: defaultRepeatInterval,
      default_cost: defaultCost,
    };
  };

  /**
   * Handles a change event on an input component.
   *
   * @since 0.1.0
   */
  handleChangeEvent = (event) => {
    this.handleChange(event.target.name, event.target.value);
  };

  /**
   * Handles a component's value change.
   *
   * @since 0.1.0
   */
  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  suggestNext = (pre) => {
    if (this.props.forCreate && this.state.repeat_interval > 0) {
      this.setState({
        time: this.state.time + this.state.repeat_interval + pre,
      });
    }
  };

  /**
   * Handles a type selection with additional BS logic.
   *
   * @since 0.1.0
   */
  handleTypeChange = (name, value, event) => {
    let has_subtypes = false;
    const opts = event.currentTarget.selectedOptions || [];
    if (opts.length > 0) {
      has_subtypes = opts[0].dataset.has_subtypes || false;
    }

    this.setState({ subtype: 0, has_subtypes: has_subtypes });
    this.handleChange(name, value);

    this.defaults_fill(value);
  };

  handleCategoryChange = (name, value) => {
    this.setState({ type: 0, subtype: 0, has_subtypes: false });
    this.handleChange(name, value);
    this.defaults_reset();
  };

  handleSubTypeChange = (name, value) => {
    this.handleChange(name, value);
    this.defaults_fill(value);
  };

  findEventTypeData = (value) =>
    this.props.refs.types.find((type) => type.id === value);

  findEventTypeCategory = (value) =>
    this.props.refs.typeCategories.find((type) => type.id === value);

  /**
   * Handles the change event on an input field of <day> type.
   *
   * @param {Date} day The date value.
   *
   * @since 0.1.0
   */
  handleDayChange = (day) => {
    // It can be null if user selects same date - skip the state change in that case
    day && this.setState({ date: _date.toYmd(day) });
  };

  /**
   * Returns all form validators' call result.
   * It will return false on a first validation rule violation (which has a message).
   *
   * @return {boolean} The result of validation.
   * @since 0.1.0
   */
  isValid = () =>
    !Object.keys(this.validators).some((key) => this.validators[key]() !== '');

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
        {warnings.map((warning) => (
          <div key={warning.name}>
            <span className="bp5-icon-standard bp5-icon-warning-sign" />
            <span>{warning.message}</span>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { states, statuses, typeCategories, types } =
      this.props.refs;

    if (!typeCategories || !types || !statuses) {
      return <div>Data not found</div>;
    }

    const {
      time,
      type,
      category,
      subtype,
      gate,
      gate2,
      bought,
    } = this.validators;
    const l18n = new L18n(this.props.locale);

    const statusOptions = statuses.map((op) => (
      <option key={op.id} value={op.id}>
        {l18n.findByCode(op.code)}
      </option>
    ));
    const stateOptions = states.map((op) => (
      <option key={op.id} value={op.id}>
        {l18n.findByCode(op.code)}
      </option>
    ));
    const categoryOptions = typeCategories
      .map((op) => (
        <option key={op.id} value={op.id}>
          {l18n.findByCode(op.code)}
        </option>
      ));

    let typeOptions = [];
    if (this.state.category) {
      typeOptions = types
        .filter((t) => t.categoryId === this.state.category && t.parentId === null)
        .map((op) => ({
          ...op,
          has_subtypes: types.some((t) => t.parentId === op.id),
        }))
        .map((op) => (
          <option key={op.id} value={op.id} data-has_subtypes={op.has_subtypes}>
            {l18n.findByCode(op.nameCode)}
          </option>
        ));
    }

    let subTypeOptions = [];
    if (this.state.category && this.state.type) {
      subTypeOptions = types
        .filter((t) => t.parentId === this.state.type)
        .map((op) => (
          <option key={op.id} value={op.id}>
            {l18n.findByCode(op.nameCode)}
          </option>
        ));
    }

    const getDescriptionById = (id) => {
      const desc = types
        .filter((t) => t.id === id)
        .map((op) => l18n.findByCode(op.descCode));
    
      return desc.length > 0 ? desc[0] : '';
    };
    
    let description = '';
    
    if (this.state.type) {
      description = getDescriptionById(this.state.type);
    }
    
    if (this.state.subtype) {
      description = getDescriptionById(this.state.subtype);
    }

    const gateOptions = this.props.gates.map((gate_) => (
      <option key={gate_.id} value={gate_.id}>
        {l18n.findByCode(gate_.code)}
      </option>
    ));

    const { date } = this.state;
    const timeRange = this.state.time + this.state.duration;
    const invalidTimeRange = time() !== '';
    const invalidTimeRangeMaybeClass = invalidTimeRange
      ? ' bp5-intent-danger'
      : '';
    const totalTime = _date.minutesToHm(timeRange);
    const warnings = this.renderWarnings();

    const ymd = _date.toYmd(date);

    return (
      <>
        <DateFiledGroup
          name="date"
          caption="day"
          date={ymd}
          onChange={this.handleChange}
        />
        <ListFieldGroup
          name="category"
          index={this.state.category}
          validator={category()}
          onChange={this.handleCategoryChange}
        >
          {categoryOptions}
        </ListFieldGroup>
        <ListFieldGroup
          name="type"
          index={this.state.type}
          validator={type()}
          onChange={this.handleTypeChange}
        >
          {typeOptions}
        </ListFieldGroup>
        {subTypeOptions.length > 0 && (
          <ListFieldGroup
            name="subtype"
            caption="Subtype"
            index={this.state.subtype}
            validator={subtype()}
            onChange={this.handleSubTypeChange}
          >
            {subTypeOptions}
          </ListFieldGroup>
        )}
        {description !== '' && (
          <TextAreaGroup
            name="description"
            value={description}
            inline
            disabled
          />
        )}
        <div
          className={`bp5-form-group ${styles.formTimeRangeContainer}${invalidTimeRangeMaybeClass}`}
        >
          <label
            htmlFor="time-range"
            className={`bp5-label bp5-inline ${styles.label_text} ${styles.timeLabel}`}
          >
            <span>Time</span>
          </label>
          <div
            className={`bp5-form-content ${styles.formTimeRange}${invalidTimeRangeMaybeClass}`}
          >
            <TimeFieldGroup
              name="time"
              caption="Start"
              minutes={this.state.time}
              onChange={this.handleChange}
            />
            <TimeFieldGroup
              name="duration"
              caption="Duration"
              minutes={this.state.duration}
              onChange={this.handleChange}
            />
            {this.state.default_repeat_interval > 0 && (
              <NumberFieldGroup
                name="repeat_interval"
                className={styles.repeat}
                caption="Repeat"
                number={this.state.repeat_interval}
                onChange={this.handleChange}
              />
            )}
            <LabelFieldGroup className={styles.totalTime} value={totalTime} />
            {invalidTimeRange && (
              <div className="bp5-form-helper-text">{time()}</div>
            )}
            {warnings && warnings}
          </div>
        </div>
        <div className={`bp5-form-group ${styles.formGatesContainer}`}>
          <label
            htmlFor="time-range"
            className={`bp5-label bp5-inline ${styles.label_text} ${styles.timeLabel}`}
          >
            <span>Gates</span>
          </label>
          <div className={styles.formGates}>
            <ListFieldGroup
              name="gate"
              caption="Departion"
              index={this.state.gate}
              validator={gate()}
              onChange={this.handleChange}
            >
              {gateOptions}
            </ListFieldGroup>

            <ListFieldGroup
              name="gate2"
              caption="Return"
              index={this.state.gate2}
              validator={gate2()}
              onChange={this.handleChange}
            >
              {gateOptions}
            </ListFieldGroup>
          </div>
        </div>
        <NumberFieldGroup
          name="cost"
          caption="Cost"
          number={this.state.cost}
          icon="euro"
          onChange={this.handleChange}
          inline
        />
        <NumberFieldGroup
          name="limit"
          caption="Quantity"
          number={this.state.limit}
          onChange={this.handleChange}
          inline
        />
        <NumberFieldGroup
          name="bought"
          caption="Bought"
          number={this.state.bought}
          validator={bought()}
          onChange={this.handleChange}
          inline
        />
        {!this.props.forCreate && (
          <ListFieldGroup
            name="state"
            index={this.state.state}
            onChange={this.handleChange}
          >
            {stateOptions}
          </ListFieldGroup>
        )}
      </>
    );
  }
}

EventForm.propTypes = {
  forCreate: PropTypes.bool,
  event: EventPropType,
  refs: RefsPropType.isRequired,
  locale: PropTypes.objectOf(PropTypes.string).isRequired,
  gates: PropTypes.arrayOf(GatePropType).isRequired,
  date: PropTypes.string,
};

EventForm.defaultProps = {
  forCreate: false,
  event: null,
  refs: {
    states: [],
    statuses: [],
    typeCategories: [],
    types: [],
  },
  locale: {},
  gates: [],
  date: '',
};
