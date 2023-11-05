import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ServerTime extends Component {
  static propTypes = {
    timestamp: PropTypes.number,
  };

  static defaultProps = {
    timestamp: 1,
  };

  constructor(props) {
    super(props);

    this.state = {
      showColon: true,
      date: new Date(this.props.timestamp * 1000),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 999);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
      showColon: !this.state.showColon,
    });
  }

  format00 = (value) => (value < 10 ? `0${value}` : value);

  showHide = () => ({ opacity: this.state.showColon ? '.999' : '0' });

  renderTime = () => (
    <div className="time__number">
      <span>{this.state.date.getHours()}</span>
      <span style={this.showHide()}>:</span>
      <span>{this.format00(this.state.date.getMinutes())}</span>
    </div>
  );

  render() {
    return <span>{this.renderTime()}</span>;
  }
}
