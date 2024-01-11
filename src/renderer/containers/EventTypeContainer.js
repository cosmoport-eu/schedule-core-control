import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PageCaption from '../components/page/PageCaption';
import ApiError from '../components/indicators/ApiError';
import { Api } from 'cosmoport-core-api-client';
import Message from '../components/messages/Message';
import _date from '../components/date/_date';
import styles from '../components/eventTable/EventTable.module.css';
import EventTypeTable from '../components/eventType/EventTypeTable';

const mapEvent = (data) => ({
  category_id: data.category_id,
  default_duration: data.default_duration,
  default_repeat_interval: data.default_repeat_interval,
  default_cost: data.default_cost,
  description: data.description,
  name: data.name,
  subtypes: data.subtypes,
});

export default class EventTypeContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api).isRequired,
    auth: PropTypes.bool,
    onRefresh: PropTypes.func,
    pre: PropTypes.number.isRequired,
  };

  static defaultProps = {
    auth: false,
    onRefresh: () => {},
  };

  state = {
    hasData: false,
    locale: {},
    refs: {}
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([
      this.props.api.fetchReferenceData(),
      this.props.api.fetchTranslations()
    ])
      .then((data) =>
        this.setState({
          hasData: true,
          refs: data[0],
          locale: data[1].en
        }),
      )
      .catch((error) => ApiError(error));
  };

  handleCreate = (formData) => {
    if (!formData.valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.api
      .createEventType(mapEvent(formData))
      .then((result) => {
        const id = result.eventTypes[0].id;
        Message.show(`Event type has been created [${id}].`);
        this.getData();

        return 1;
      })
      .then(() => this.handleRefresh())
      .catch((error) => ApiError(error));
  };

  handleCreateCategory = (name, color) => {
    if (name === '') {
      Message.show('Fill the Category name field.', 'error');
      return;
    }

    if (color === '') {
      Message.show('Fill the Category color field.', 'error');
      return;
    }

    this.props.api
      .createEventTypeCategory({
        name: name,
        color: color
      })
      .then((result) => {
        Message.show(`Event type category has been created [${result.id}].`);
        this.getData();
      })
      .catch((error) => ApiError(error));
  };

  // api ещё нет
  handleEdit = (formData) => {
    console.log('EDIT');
  };

  handleDelete = (data) => {
    this.props.api
      .deleteEventType(data.id)
      .then((result) => {
        Message.show(`Subtype ${data.name} has been deleted [:${result.deleted}]`);
        this.getData();
        return 1;
      })
      .catch((error) => ApiError(error));
  };

  handleRefresh = () => {
    this.getData();
    this.props.onRefresh();
  };

  render() {
    if (!this.state.hasData) {
      return <span>Loading...</span>;
    }

    const { refs, locale } = this.state;

    return (
      <div>
        <PageCaption text="04 Types" />

        <EventTypeTable
          ref={(table) => {
            this.table = table;
          }}
          refs={refs}
          locale={locale}
          types={refs.types}
          onCreate={this.handleCreate}
          onCreateCategory={this.handleCreateCategory}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
          onRefresh={this.handleRefresh}
          auth={this.props.auth}
        />
      </div>
    );
  }
}