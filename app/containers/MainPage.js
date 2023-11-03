import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Calendar from '../components/calendar/Calendar';
import Api from '../../lib/core-api-client/ApiV1';
import ApiError from '../components/indicators/ApiError';
import PageCaption from '../components/page/PageCaption';
import EventMenu from '../components/calendar/EventMenu';
import EventTicketBuyDialog from '../components/dialog/EventTicketBuyDialog';
import L18n from '../components/l18n/L18n';
import Message from '../components/messages/Message';
import EventAddDialog from '../components/dialog/EventAddDialog';
import _date from '../components/date/_date';

import styles from './App.css';

export default class MainPage extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api).isRequired,
    onRefresh: PropTypes.func,
    pre: PropTypes.number
  }

  static defaultProps = {
    onRefresh: () => { },
    pre: 10
  }

  state = {
    hasData: false,
    isItOpen: false,
    events: [],
    locale: {},
    refs: {},
    gates: [],
    start: _date.current(),
    end: _date.current()
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    this.onViewChange = () => { };
  }

  getData = () => {
    Promise.all([
      this.props.api.fetchReferenceData(),
      this.props.api.fetchTranslations(),
      // Fetch all the events between the current calendar view range
      this.props.api.fetchEventsInRange(this.state.start, this.state.end),
      this.props.api.fetchGates()
    ])
      .then(([r, l, e, g]) =>
        this.setState({ hasData: true, refs: r, locale: l.en, events: e, gates: g }))
      .catch(error => ApiError(error));
  }

  refreshEventsData = () => {
    this.props.api.fetchEventsInRange(this.state.start, this.state.end)
      .then(result => this.setState({ events: result }))
      .catch(error => ApiError(error));
  }

  handleMenu = (event, data, type) => {
    this.eventMenu.getInstance().show(event, data, type);
  }

  handleEventTickets = (id) => {
    this.props.api
      .fetchEventsByIdForGate(id)
      .then(data => this.eventTicketsDialog.toggle(data[0]))
      .catch(error => ApiError(error));
  }

  handleTickets = (eventId, tickets_, force) => {
    this.props.api.post('/timetable/tickets', {
      id: eventId,
      tickets: tickets_,
      force_open: force
    })
      .then(response => {
        if (response.result) {
          this.eventTicketsDialog.close();
          Message.show('Ticket data have been updated.');
        }

        return 1;
      })
      .catch(error => ApiError(error));
  }

  handleEventCreate = (date) => {
    this.eventMenu.getInstance().close();
    this.eventAddDialog.openWith(date);
  }

  handleCreate = (formData, valid) => {
    if (!valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.api
      .createEvent(formData)
      .then(result => Message.show(`Event has been created [${result.id}].`))
      .then(() => this.eventAddDialog.suggestNext(this.props.pre))
      .then(() => this.handleRefresh())
      .catch(error => ApiError(error));
  }

  handleRefresh = () => {
    this.getData();
    this.props.onRefresh();
  }

  handleCalendarViewChange = (dates) => {
    this.setState({ start: dates.start.format('YYYY-MM-DD'), end: dates.end.format('YYYY-MM-DD') },
      () => {
        this.refreshEventsData();
      });
  }

  /**
   * Handles time suggestions for creation forms.
   *
   * @param {number} gate The id number of required gate.
   * @param {string} date A date value for which a suggestion is being looked for.
   * @param {Function} callback A callback function to pass suggestion back to form.
   * @since 0.1.3
   * @deprecated
   */
  handleSuggestion = (date, gate, callback) => {
    this.setState({ sug_date: date, sug_gate: gate });
    this.props.api
      .get(`/timetable/suggest/next?date=${date}&gate=${gate}`)
      .then(result => {
        callback(result.time >= 0 ? result.time + this.props.pre + 1 : 0);

        return 1;
      })
      .catch(error => ApiError(error));
  }

  render() {
    if (!this.state.hasData) {
      return <span>Loading...</span>;
    }

    const { events, locale, refs, gates } = this.state;
    const l18n = new L18n(locale, refs);

    return (
      <div>
        <PageCaption text="01 Calendar" />
        <EventTicketBuyDialog
          ref={(dialog) => { this.eventTicketsDialog = dialog; }}
          l18n={l18n}
          onTicketUpdate={this.handleTickets}
        />
        <EventAddDialog
          ref={(dialog) => { this.eventAddDialog = dialog; }}
          callback={this.handleCreate}
          refs={refs}
          locale={locale}
          gates={gates}
        />
        <EventMenu
          ref={(em) => { this.eventMenu = em; }}
          onEventTickets={this.handleEventTickets}
          onEventCreate={this.handleEventCreate}
        />
        <Calendar
          events={events}
          l18n={l18n}
          onMenu={this.handleMenu}
          onViewChange={this.handleCalendarViewChange}
        />
        <p />
      </div>
    );
  }
}
