import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button, HTMLTable, NonIdealState } from '@blueprintjs/core';

import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';
import EventPropType from '../../props/EventPropType';

import EventTypePropType from '../../props/EventTypePropType';
import EventTypeAddDialog from '../dialog/EventTypeAddDialog';
import EventTypeDelDialog from '../dialog/EventTypeDelDialog';
import EventType from './EventType';
import EventDeleteAlert from '../dialog/EventDeleteAlert';

import tableStyles from '../eventTable/EventTable.module.css';
import Table from '../table_new/Table';

export default class EventTypeTable extends PureComponent {
  static propTypes = {
    editCallback: PropTypes.func,
    callback: PropTypes.func,
    auth: PropTypes.bool,
    refs: RefsPropType.isRequired,
    locale: LocalePropType.isRequired,
    types: PropTypes.arrayOf(EventTypePropType),
  };
  
  static defaultProps = {
    editCallback: () => {},
    callback: () => {},
    auth: false,
    types: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      eventTypeAddDialogIsOpen: false,
      types: []
    };
  }

  handleEdit = (type) => this.props.editCallback(type);
  handleRefresh = () => this.props.onRefresh();

  onEventTypeAddDialogToggle = () =>
    this.setState({
      eventTypeAddDialogIsOpen: !this.state.eventTypeAddDialogIsOpen,
    });

  handleAddModalOpen = () => {
    this.onEventTypeAddDialogToggle();
  };


  // обработка клика на кнопку в таблице
  // открыть модальное окно
  handleEditClick = (row) => {
    console.log('handleEditClick');
    console.log(row)
  }
  
  // обработка клика на кнопку в таблице
  // открыть окно с предупреждением
  handleRemoveClick = (row_id) => {
    console.log('handleRemoveClick');
    this.eventDeleteAlert.open(row_id);
  }

  handleCreate = (formData, valid) => {
    if (!valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.onCreate(formData);
  };

  handleDelete = (id, name) => {
    this.props.onDelete(id, name);
  };

  handleNewCategory = (name, color) => {
    this.props.onCreateCategory(name, color);
  };

  render() {
    const { locale, refs, types } = this.props;

    const et = EventType({
      categories: refs.typeCategories,
      translation: locale,
    });

    if (!types || types.length === 0) {
      return (
        <NonIdealState
          title={'Nothing here'}
          icon={'offline'}
          description={
            'Create new event type / reload data from the server.'
          }
        />
      );
    }

    const headers = [
      'ID',
      'Category',
      'Type',
      'Subtype',
      'Description',
      'Actions'
    ];

    const rows_data = types.map((type) => {
      const category = et.getCategories(type);

      return {
        id: type.id,
        subtype_name: et.getName(type),
        description: et.getDescription(type),
        category_name: category[0],
        type_name: category[1] ?? '-'
      }
    });
    
    return (
      <div style={{ marginTop: '2em' }}>
        <EventTypeAddDialog
          categories={refs.typeCategories}
          etDisplay={et}
          isOpen={this.state.eventTypeAddDialogIsOpen}
          toggle={this.onEventTypeAddDialogToggle}
          callback={this.handleCreate}
          categoryCreateCallback={this.handleNewCategory}
        />
        <EventDeleteAlert
          ref={(alert) => {
            this.eventDeleteAlert = alert;
          }}
          object_type='type'
          onConfirm={this.handleDelete}
        />

        <div>
          <Button
            minimal
            icon="add"
            onClick={this.handleAddModalOpen}
          />
          <Button
            style={{ marginLeft: '2em' }}
            minimal
            icon="refresh"
            onClick={this.handleRefresh}
          />
        </div>

        <div className={tableStyles.eventTableContainer}>
          <Table
            headers={headers}
            rows={rows_data}
            onRemoveClick={this.handleRemoveClick}
            onEditClick={this.handleEditClick}
          />
        </div>
      </div>
    );
  }
}
