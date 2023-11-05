import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import onClickOutside from 'react-onclickoutside';

import styles from './EventMenu.module.css';

class EventMenu extends PureComponent {
  static propTypes = {
    onEventTickets: PropTypes.func,
    onEventCreate: PropTypes.func,
  };

  static defaultProps = {
    onEventTickets: () => {},
    onEventCreate: () => {},
  };

  state = {
    isOpen: false,
    x: 0,
    y: 0,
    type: 'day',
    data: {},
  };

  show = (event, data_, type_) => {
    this.setState({
      isOpen: true,
      x: event.pageX,
      y: event.pageY,
      type: type_,
      data: data_,
    });
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  handleClick = () => {
    const { onEventCreate } = this.props;
    const { type, data } = this.state;

    const value =
      type === 'day' ? data.format() : type === 'event' ? data.start.format() : '';

    onEventCreate(value);
  };

  handleEventClick = () => {
    // Just for close
    this.handleClickOutside();
    this.props.onEventTickets(this.state.data.id);
  };

  handleClickOutside = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const style = {
      left: this.state.x,
      top: this.state.y,
    };

    const isEvent = this.state.type === 'event';

    return (
      <div
        className={`${styles.menu} ${
          this.state.isOpen ? styles.active : styles.hidden
        }`}
        style={style}
      >
        <div
          className={`bp5-icon-standard bp5-icon-chevron-left ${styles.mark}`}
        />
        <Menu>
          {isEvent && (
            <MenuDivider
              title={`${this.state.data.start.format('HH:mm')} ${
                this.state.data.title
              }`}
            />
          )}
          <MenuItem icon="add" onClick={this.handleClick} text="New event" />
          {isEvent && (
            <MenuItem
              icon="dollar"
              onClick={this.handleEventClick}
              text="Sell tickets"
            />
          )}
        </Menu>
      </div>
    );
  }
}

export default onClickOutside(EventMenu);
