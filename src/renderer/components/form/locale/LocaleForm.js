import React, { Component } from 'react';

export default class LocaleForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      description: ''
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  getFormData = () => this.state

  render() {
    return (
      <div>
        <label htmlFor="code" className="bp5-label bp5-inline">
          <span>Code</span>
          <input
            id="code"
            name="code"
            className="bp5-input"
            type="text"
            placeholder="The locale code (two letters)"
            dir="auto"
            value={this.state.code}
            onChange={this.handleInputChange}
          />
        </label>
        <label htmlFor="desc" className="bp5-label bp5-inline">
          <span>Description</span>
          <input
            id="desc"
            name="description"
            className="bp5-input bp5-inline"
            type="text"
            placeholder="Locale description"
            dir="auto"
            value={this.state.description}
            onChange={this.handleInputChange}
          />
        </label>
      </div>
    );
  }
}
