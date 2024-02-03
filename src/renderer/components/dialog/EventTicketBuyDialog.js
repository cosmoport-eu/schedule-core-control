import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Switch,
} from '@blueprintjs/core';

import _date from '../../components/date/_date';

import styles from './EventTicketBuyDialog.module.css';
import L18n_new from '../l18n/L18n_new';
import RefsData from '../references/RefsData';

export default class EventTicketBuyDialog extends Component {
  static propTypes = {
    l18n: PropTypes.instanceOf(L18n_new).isRequired,
    refsData: PropTypes.instanceOf(RefsData).isRequired,
    onTicketUpdate: PropTypes.func,
  };

  static defaultProps = {
    onTicketUpdate: () => {},
  };

  state = {
    isOpen: false,
    event: null,
    tickets: 0,
    forceReopen: false,
  };

  toggle = (event_) => {
    this.setState({
      event: event_,
      isOpen: !this.state.isOpen,
      tickets: event_.contestants,
    });
  };

  close = () => {
    this.setState({
      isOpen: false,
      event: null,
      tickets: 0,
      forceReopen: false,
    });
  };

  passState = () => {
    if (this.state.tickets !== this.state.event.contestants) {
      this.props.onTicketUpdate(
        this.state.event.id,
        this.state.tickets,
        this.state.forceReopen,
      );
    }
  };

  renderEventInfo = (event, l18n, refsData, et) => {
    const typeRef = refsData.findTypeById(event.eventTypeId);
    const stateRef = refsData.findStateById(event.eventStateId);
    const statusRef = refsData.findStatusById(event.eventStatusId);
    const state_name = l18n.findByCode(stateRef.code);
    const status_name = l18n.findByCode(statusRef.code);

    return (
      <div className={styles.eventInfo}>
        <div className={styles.eventTitle}>{et.getFullName(typeRef)}</div>
        <div className={styles.eventProperty}>
          <span>Date</span>
          <span>{_date.format(event.eventDate, 'D MMMM YYYY')}</span>
        </div>
        <div className={styles.eventProperty}>
          <span>Time</span>
          <span>{`${_date.minutesToHm(event.startTime)} - ${_date.minutesToHm(
            event.startTime + event.durationTime,
          )}`}</span>
        </div>
        <div className={styles.eventProperty}>
          <span>State</span>
          <span>{state_name + (status_name ? ` / ${status_name}` : '')}</span>
        </div>
        <div className={styles.eventProperty}>
          <span>Gates</span>
          <span>{`${event.gateId} → ${event.gate2Id}`}</span>
        </div>
        <div className={styles.eventTickets}>
          The number of tickets have been sold {this.renderTicketValue()} of{' '}
          {event.peopleLimit} so far.
        </div>
      </div>
    );
  };

  renderTicketValue = () => {
    const elements = [];

    if (this.state.tickets !== this.state.event.contestants) {
      elements.push(
        <span key={0} className={styles.strike}>
          {this.state.event.contestants}
        </span>,
      );
    }
    elements.push(
      <span key={1} className={styles.tickets}>
        {this.state.tickets}
      </span>,
    );

    return elements;
  };

  inc = () => {
    const value = this.state.tickets + 1;

    if (value <= this.state.event.peopleLimit) {
      this.setState({ tickets: value });
    }
  };

  dec = () => {
    const value = this.state.tickets - 1;

    if (value >= 0) {
      this.setState({ tickets: value });
    }
  };

  handleReopenChange = () => {
    this.setState({ forceReopen: !this.state.forceReopen });
  };

  render() {
    const { isOpen, event } = this.state;
    const { l18n, refsData, et } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Dialog
        isOpen={isOpen}
        icon={'dollar'}
        onClose={this.toggle}
        canOutsideClickClose={false}
        title="Sell tickets"
      >
        <DialogBody>
          <div className={styles.notice}>
            Here you can update tickets selling information.
          </div>
          {this.renderEventInfo(event, l18n, refsData, et)}
        </DialogBody>
        <DialogFooter
          actions={
            <>
              <Switch
                className={styles.switch}
                checked={this.state.forceReopen}
                labelElement={<strong>Reopen</strong>}
                onChange={this.handleReopenChange}
              />
              <Button onClick={this.inc} icon={'plus'} />
              <Button onClick={this.dec} icon={'minus'} />
              <Button onClick={this.passState} text="Save" />
            </>
          }
        ></DialogFooter>
      </Dialog>
    );
  }
}
