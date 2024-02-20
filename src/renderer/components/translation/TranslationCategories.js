import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

export default class TranslationCategories extends Component {
  static propTypes = {
    category: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }).isRequired,
    onCategorySelect: PropTypes.func
  }

  static defaultProps = {
    onCategorySelect: () => { }
  }

  handleSelect = () => {
    this.props.onCategorySelect(this.props.category);
  }

  render() {
    const { category } = this.props;

    return (
      <div>
        <Button
          key={category.id}
          className="bp5-minimal"
          text={category.name}
          onClick={this.handleSelect}
        />
      </div>
    );
  }
}
