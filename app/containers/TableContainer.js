import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PageCaption from '../components/page/PageCaption';
import Table from '../components/table/Table';
import ApiError from '../components/indicators/ApiError';
import Api from '../../lib/core-api-client/ApiV1';

import Message from '../components/messages/Message';
import _date from '../components/date/_date';

export default class TableContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api).isRequired,
    auth: PropTypes.bool,
    onRefresh: PropTypes.func,
    pre: PropTypes.number.isRequired
  }

  static defaultProps = {
    auth: false,
    onRefresh: () => { }
  }

  state = {
    hasData: false,
    events: [],
    locale: {},
    refs: {},
    gates: [],
    defaultRange: _date.getThreeDaysRange(),
    range: _date.getThreeDaysRange()
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    console.log(this.state);
    Promise.all([
      this.props.api.fetchReferenceData(),
      this.props.api.fetchTranslations(),
      this.apiGetEventInRange(this.state.range),
      this.props.api.fetchGates()
    ])
      .then(data => this.setState(
        { hasData: true, refs: data[0], locale: data[1].en, events: data[2], gates: data[3] })
      )
      .catch(error => ApiError(error));
  }

  handleCreate = (formData) => {
    this.props.api
      .createEvent(formData)
      .then(result => Message.show(`Event has been created [${result.id}].`))
      .then(() => this.table.suggestNext(this.props.pre))
      .then(() => this.handleRefresh())
      .catch(error => ApiError(error));
  }

  handleEdit = (formData) => {
    this.props.api
      .updateEvent(formData)
      .then(result => Message.show(`Event has been updated [${result.id}].`))
      .then(() => this.handleRefresh())
      .catch(error => ApiError(error));
  }

  handleDelete = (id) => {
    this.props.api
      .deleteEvent(id)
      .then((result) => Message.show(`Deleted ${result.deleted}.`))
      .then(() => this.handleRefresh())
      .catch(error => ApiError(error));
  }

  handleRefresh = () => {
    this.getData();
    this.props.onRefresh();
  }

  handleDateChange = (range_) => {
    this.apiGetEventInRange(range_)
      .then(data => this.setState({ events: data, range: range_ }))
      .catch(error => ApiError(error));
  }

  handleDateClear = () => {
    this.handleDateChange(this.state.defaultRange);
  }

  apiGetEventInRange = (range) =>
    this.props.api.get(`/timetable?date=${range[0] ? _date.toYmd(range[0]) : ''}&date2=${range[1] ? _date.toYmd(range[1]) : ''}`)

  render() {
    if (!this.state.hasData) {
      return <span>Loading...</span>;
    }

    const { events, refs, locale, gates, range } = this.state;

    return (
      <div>
        <PageCaption text="03 Timetable" />
        <Table
          ref={table => { this.table = table; }}
          events={events}
          refs={refs}
          locale={locale}
          gates={gates}
          range={range}
          onDateRangeChange={this.handleDateChange}
          onDateRangeClear={this.handleDateClear}
          defaultRange={this.state.defaultRange}
          onCreate={this.handleCreate}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
          onRefresh={this.handleRefresh}
          auth={this.props.auth}
        />
      </div>
    );
  }
}
