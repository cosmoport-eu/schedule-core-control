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
  categoryId: data.category_id,
  defaultDuration: data.default_duration,
  defaultRepeatInterval: data.default_repeat_interval,
  defaultCost: data.default_cost,
  description: data.description,
  name: data.name,
  subTypes: data.subTypes,
  parentId: data.parentId,
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
    facilities: {},
    materials: {},
    refs: {}
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([
      this.props.api.get('/t_events/types?isActive=true'),
      this.props.api.get('/category?localeId=1&isActive=true'),
      this.props.api.get('/t_events/statuses'),
      this.props.api.get('/t_events/states'),
      this.props.api.fetchTranslations()
    ])
      .then((data) =>
        this.setState({
          hasData: true,
          refs: {
            types: data[0],
            typeCategories: data[1],
            statuses: data[2],
            states: data[3],
          },
          locale: data[4].en
        }),
      )
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
      .post('/category', {
        name: name,
        color: color
      })
      .then((result) => {
        Message.show(`Event type category has been created.`);
        this.getData();
      })
      .catch((error) => ApiError(error));
  };

  // name & desciption fields for Type / Subtypes
  handleTextChange = (id, data) => {
    this.props.api.post(`/t_events/type/text/${id}`, data)
      .then(() => {})
      .catch((error) => {
        ApiError(error);
      });
  };

  handleCreate = (formData) => {
    if (!formData.valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }
  
    this.postEventData('/t_events/type', formData, 'Event type has been created.')
      .then(() => {
        this.getData();
        this.handleRefresh();
      })
      .catch((error) => ApiError(error));
  };

  handleEdit = async (formData) => {
    const subtypes = formData.subTypes;
  
    try {
      await this.postEventData(`/t_events/type/${formData.id}`, formData, 'Record changed successfully');
  
      for (const s of subtypes) {
        const updatedData = {
          ...formData,
          name: s.name,
          description: s.description,
          parentId: formData.id,
          subTypes: [],
          valid: true,
        };
  
        if (s.id === 0) {
          await this.handleCreate(updatedData);
        } else {
          await this.postEventData(`/t_events/type/${s.id}`, updatedData);
        }
      }
  
      this.getData();
    } catch (error) {
      ApiError(error);
    }
  };

  postEventData = (url, formData, successMessage) => {
    return this.props.api
      .post(url, mapEvent(formData))
      .then((result) => {
        Message.show(successMessage);
        return result;
      });
  };

  handleDelete = (id) => {
    this.props.api
      .delete(`/t_events/type/${id}`)
      .then((result) => {
        Message.show('record deleted successfully');
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

    const { refs, locale, facilities, materials } = this.state;

    const types = refs.types
      .filter((t) => t.parentId === 0 || t.parentId === null);

    const subtypes = refs.types
      .filter((t) => t.parentId !== 0 && t.parentId !== null);

    return (
      <div>
        <PageCaption text="Types" />

        <EventTypeTable
          ref={(table) => {
            this.table = table;
          }}
          locale={locale}
          categories={refs.typeCategories}
          types={types}
          subtypes={subtypestypes}
          facilities={facilities}
          materials={materials}
          onCreate={this.handleCreate}
          onCreateCategory={this.handleCreateCategory}
          onTextChange={this.handleTextChange}
          onUpdate={this.handleEdit}
          onDelete={this.handleDelete}
          onRefresh={this.handleRefresh}
          auth={this.props.auth}
        />
      </div>
    );
  }
}