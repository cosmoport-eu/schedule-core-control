import React, { Component } from 'react';

import TextFieldGroup from '../group/TextFieldGroup';
import NumberFieldGroup from '../group/NumberFieldGroup';

export default class EventTypeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      subname: '',
      description: '',
      default_duration: 0,
      default_repeat_interval: 0
    };

    this.validators = {
      notEmpty: (field) => (this.state[field] === '' ? "Field shouldn't be empty." : '')
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
   * Returns all form validators' call result.
   * It will return false on a first validation with a negative result (which has a message).
   *
   * @return {boolean} The result of validation.
   * @since 0.1.0
   */
  isValid = () => !Object.keys(this.validators).some(key => this.validators[key]() !== '')

  /**
   * Handles a component's value change.
   *
   * @since 0.1.0
   */
  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }

  render() {
    const { notEmpty } = this.validators;

    return (
      <div>
        <TextFieldGroup name="name" value={this.state.name} validator={notEmpty('name')} onChange={this.handleChange} inline />
        <TextFieldGroup name="subname" value={this.state.subname} validator={notEmpty('subname')} onChange={this.handleChange} inline />
        <TextFieldGroup name="description" value={this.state.description} validator={notEmpty('description')} onChange={this.handleChange} inline />
        <NumberFieldGroup name="default_duration" caption="Duration" number={this.state.default_duration} onChange={this.handleChange} inline />
        <NumberFieldGroup name="default_repeat_interval" caption="Repeat" number={this.state.default_repeat_interval} onChange={this.handleChange} inline />
      </div>
    );
  }
}
