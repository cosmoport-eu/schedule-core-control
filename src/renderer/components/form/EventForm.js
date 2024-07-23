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
import FacilityPropType from '../../props/FacilityPropType';
import MaterialPropType from '../../props/MaterialPropType';
import MultipleListFieldGroup from './group/MultipleListFieldGroup';
import CheckListFieldGroup from './group/CheckListFieldGroup';
import { Callout } from '@blueprintjs/core';

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
      description: '',
      facilityIds: [],
      materialIds: [],
      qty: [],
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
      // если событие старое, то будет ошибка ?
      // добавить проверку на дату создания ?
      facilities: () =>
        this.state.facilityIds.length === 0
          ? "Choose at least one facility" : '',
      gate: () =>
        this.state.gate === 0 ? 'Gate is not selected.' : '',
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
    const typeData = this.findEventTypeData(value);

    const eventTypeData = typeData || {
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
      gate2: this.state.gate,
      valid: this.isValid(),
    });

    if (this.state.subtype) {
      data.type = this.state.subtype;
    }
    // console.log('EventForm->getFormData()', data)
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
      description: event.description,
      facilityIds: event.facilityIds,
      materialIds: event.materialIds,
      qty: event.qty,
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
      has_subtypes = opts[0].dataset.has_subtypes === "true";
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

  handleAdditionalSelectChange = (elem_name, options) => {
    // console.log('EventForm->handleAdditionalSelectChange->qty', {elem_name, options},);
    if(elem_name === 'materialIds') {
      const qty = options?.map(m => ({timetable_id: this.props.event?.id, material_id: m.value, qty: m.qty }))
      this.handleChange('qty', qty);
      // console.log('EventForm->handleAdditionalSelectChange->qty', {qty},);
    }
    const selectedValues = Array.from(options, option => option.value);
    this.handleChange(elem_name, selectedValues);
  };

  findEventTypeData = (value) =>
    this.props.refs.types.find((type) => type.id === value);

  findEventTypeCategory = (value) =>
    this.props.refs.typeCategories.find((category) => category.id === value);

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
      bought,
      facilities,
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
      .filter((t) => t.isDisabled === false)
      .map((op) => (
        <option key={op.id} value={op.id}>
          {l18n.findByCode(op.code)}
        </option>
      ));

    let typeOptions = [];
    if (this.state.category) {
      const currentCategoryData = this.findEventTypeCategory(this.state.category);
      if (currentCategoryData.isDisabled) {
        categoryOptions.push(
          <option key={currentCategoryData.id} value={currentCategoryData.id}>
            {`${l18n.findByCode(currentCategoryData.code)} | archived`}
          </option>
        );
      }

      typeOptions = types
        .filter((t) =>t.categoryId === this.state.category && t.parentId === null && t.isDisabled === false)
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

    if (this.state.category && this.state.type) {
      const currentTypeData = this.findEventTypeData(this.state.type);
      if (currentTypeData.isDisabled) {
        typeOptions.push(
          <option
            key={currentTypeData.id}
            value={currentTypeData.id}
            data-has_subtypes={types.some((t) => t.parentId === currentTypeData.id)}
          >
            {`${l18n.findByCode(currentTypeData.nameCode)} | archived`}
          </option>
        );
      }
    }

    let subTypeOptions = [];
    if (this.state.category && this.state.type) {
      subTypeOptions = types
        .filter((t) => t.parentId === this.state.type && t.isDisabled === false)
        .map((op) => (
          <option key={op.id} value={op.id}>
            {l18n.findByCode(op.nameCode)}
          </option>
        ));

      if (this.state.subtype !== 0) {
        const currentSubTypeData = this.findEventTypeData(this.state.subtype);
        if (currentSubTypeData.isDisabled) {
          subTypeOptions.push(
            <option key={currentSubTypeData.id} value={currentSubTypeData.id} >
              {`${l18n.findByCode(currentSubTypeData.nameCode)} | archived`}
            </option>
          );
        }
      }
    }

    const getTypeDescriptionById = (id) => {
      const desc = types
        .filter((t) => t.id === id && t.isDisabled === false)
        .map((op) => l18n.findByCode(op.descCode));

      return desc.length > 0 ? desc[0] : '';
    };

    let typeDescription = '';
    let facilitiesOptions = [];
    let materialsOptions = [];

    const getTypeData = (type) => {
      if (type) {
        typeDescription = getTypeDescriptionById(type);
        const typeData = this.findEventTypeData(type);

        return typeData;
      }

      return null;
    };
    function calcDefaultIds(options = [], ids = []) {
      return (options.length === 1 && ids.length === 0)
      ? [options[0].value]
      : ids
    }
    const updateOptions = (typeData) => {
      let facilitiesForType = [];
      let materialsForType = [];

      if (typeData.facilityIds.length > 0) {
        facilitiesForType = this.props.facilities
          .filter((f) => typeData && typeData.facilityIds.includes(f.id));
      } else {
        // для старых типов
        facilitiesForType = this.props.facilities;
      }

      if (typeData.materialIds.length > 0) {
        materialsForType = this.props.materials
          .filter((m) => typeData && typeData.materialIds.includes(m.id));
      } else {
        // для старых типов
        materialsForType = this.props.materials;
      }

      facilitiesOptions = facilitiesForType.map((f) => ({ value: f.id, label: f.name }));

      materialsOptions = materialsForType.map((m) => ({ value: m.id, label: m.name, qty: m.qty }));

      if(facilitiesOptions.length === 1 && this.state.facilityIds.length === 0) {
        this.setState(prevState => ({...prevState, ...{ facilityIds: [facilitiesOptions[0].value] }}))
      }
      if(materialsOptions.length === 1 && this.state.materialIds.length === 0) {
        this.setState(prevState => ({...prevState, ...{ materialIds: [materialsOptions[0].value] }}))
      }
    };

    if (this.state.type) {
      const typeData = getTypeData(this.state.type);
      updateOptions(typeData);
    }

    if (this.state.subtype) {
      const typeData = getTypeData(this.state.subtype);
      updateOptions(typeData);
    }

    const departionGateOptions = this.props.gates
      .filter((g) => g.isDisabled === false)
      .map((gate_) => (
        <option key={gate_.id} value={gate_.id}>
          {l18n.findByCode(gate_.code)}
        </option>
      ));

    const departionGateData = this.props.gates
      .filter((g) => g.id === this.state.gate)[0];

    if (departionGateData && departionGateData.isDisabled) {
      departionGateOptions.push(
        <option key={departionGateData.id} value={departionGateData.id}>
          {`${l18n.findByCode(departionGateData.code)} | archived`}
        </option>
      );
    }

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
        {typeDescription !== '' && (
          <TextAreaGroup
            name="type_description"
            caption="Type Description"
            value={typeDescription}
            inline
            disabled
          />
        )}
        {/*
        {typeDescription !== '' && (
          <MultipleListFieldGroup
            styles={{
              menu: base => ({
                ...base,
                position: 'absolute',
                zIndex: 9999,
              }),
            }}
            name="facilityIds"
            // defaultValue={this.state.facilityIds}
            defaultValue={ calcDefaultIds(facilitiesOptions, this.state.facilityIds) }
            caption="Facilities"
            validator={facilities()}
            onChange={this.handleAdditionalSelectChange}
          >
            {facilitiesOptions}
          </MultipleListFieldGroup>
        )}

        {typeDescription !== '' && (
          <MultipleListFieldGroup
            styles={{
              menu: base => ({
                ...base,
                position: 'absolute',
                zIndex: 9999,
              }),
            }}
            name="materialIds"
            // defaultValue={this.state.materialIds}
            defaultValue={ calcDefaultIds(materialsOptions, this.state.materialIds) }
            caption="Materials"
            onChange={this.handleAdditionalSelectChange}
          >
            {materialsOptions}
          </MultipleListFieldGroup>
        )}
        */}
        {/* <p>
        this.state.facilityIds=<code>{JSON.stringify(this.state.facilityIds)}</code><br/>
        this.state.materialIds=<code>{JSON.stringify(this.state.materialIds)}</code><br/>
        </p> */}
        {typeDescription !== '' && (
          <div style={{display: 'flex'}}>
            <div style={{width: '40%'}}>
              <CheckListFieldGroup
                options={facilitiesOptions}
                name="facilityIds"
                defaultValue={ calcDefaultIds(facilitiesOptions, this.state.facilityIds) }
                // defaultValue={ this.state.facilityIds }
                caption="Facilities"
                onChange={this.handleAdditionalSelectChange}
              />
            </div>
            <div style={{width: '60%'}}>
              <CheckListFieldGroup
                options={materialsOptions.map((m) => {
                  const q = this.state.qty.find(q => q.material_id === m.value);
                  if(q) return {...m, ...{qty: q.qty}}
                  else return m
                })}
                name="materialIds"
                defaultValue={ calcDefaultIds(materialsOptions, this.state.materialIds) }
                // defaultValue={ this.state.materialIds }
                caption="Materials"
                onChange={this.handleAdditionalSelectChange}
              />
            </div>
          </div>
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
            <NumberFieldGroup
              name="repeat_interval"
              className={styles.repeat}
              caption="Repeat"
              number={this.state.repeat_interval}
              onChange={this.handleChange}
            />
            <LabelFieldGroup className={styles.totalTime} value={totalTime} />
            {invalidTimeRange && (
              <div className="bp5-form-helper-text">{time()}</div>
            )}
            {warnings && warnings}
          </div>
        </div>
        <ListFieldGroup
          name="gate"
          caption="Gate"
          index={this.state.gate}
          validator={gate()}
          onChange={this.handleChange}
        >
          {departionGateOptions}
        </ListFieldGroup>

        <Callout className={styles.smaller}>
          For Birthday enter the name and age of the birthday person, i. e. "Georgos 7 years".
          This information will be displayed on the Gate.
        </Callout>
        <TextAreaGroup
          name="description"
          value={this.state.description}
          onChange={this.handleChange}
          inline
        />
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
        {!this.props.forCreate && (
          <ListFieldGroup
            name="status"
            index={this.state.status}
            onChange={this.handleChange}
          >
            {statusOptions}
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
  facilities: PropTypes.arrayOf(FacilityPropType).isRequired,
  materials: PropTypes.arrayOf(MaterialPropType).isRequired,
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
  facilities: [],
  materials: [],
  date: '',
};
