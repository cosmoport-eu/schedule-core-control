import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

export default class Translation extends Component {
  static propTypes = {
    locale: PropTypes.shape({
      id: PropTypes.number,
      code: PropTypes.string,
      localeDescription: PropTypes.string
    }).isRequired,
    onLocaleSelect: PropTypes.func
  }

  static defaultProps = {
    onLocaleSelect: () => { }
  }

  handleSelect = () => {
    this.props.onLocaleSelect(this.props.locale.id);
  }

  render() {
    const { locale } = this.props;

    return (
      <div>
        <Button key={locale.id} className="bp5-minimal" text={`${locale.code} (${locale.localeDescription})`} onClick={this.handleSelect} />
      </div>
    );
  }
}
