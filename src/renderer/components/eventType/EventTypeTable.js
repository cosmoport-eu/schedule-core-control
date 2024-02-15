import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button, HTMLTable, NonIdealState } from '@blueprintjs/core';

import RefsPropType from '../../props/RefsPropType';
import EventPropType from '../../props/EventPropType';

import EventTypePropType from '../../props/EventTypePropType';
import EventTypeAddDialog from '../dialog/EventTypeAddDialog';
import EventTypeDelDialog from '../dialog/EventTypeDelDialog';
import EventType from './EventType';
import EventDeleteAlert from '../dialog/EventDeleteAlert';

import tableStyles from '../eventTable/EventTable.module.css';
import Table from '../tableStructure/Table';
import EventTypeEditDialog from '../dialog/EventTypeEditDialog';
import FacilityPropType from '../../props/FacilityPropType';
import MaterialPropType from '../../props/MaterialPropType';

export default class EventTypeTable extends PureComponent {
  static propTypes = {
    editCallback: PropTypes.func,
    callback: PropTypes.func,
    auth: PropTypes.bool,
    refs: RefsPropType.isRequired,
    locale: PropTypes.objectOf(PropTypes.string).isRequired,
    types: PropTypes.arrayOf(EventTypePropType),
    facilities: PropTypes.arrayOf(FacilityPropType),
    materials: PropTypes.arrayOf(MaterialPropType)
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
      eventTypeEditDialogIsOpen: false,
      types: [],
      facilities: [],
      materials: [],
    };
  }

  handleEdit = (type) => this.props.editCallback(type);
  handleRefresh = () => this.props.onRefresh();

  onEventTypeAddDialogToggle = () =>
    this.setState({
      eventTypeAddDialogIsOpen: !this.state.eventTypeAddDialogIsOpen,
    });

  onEventTypeEditDialogToggle = (row) => {
    console.log(row);
    this.setState({
      eventTypeEditDialogIsOpen: !this.state.eventTypeEditDialogIsOpen,
      eventType: row
    });
  }

  handleAddModalOpen = () => {
    this.onEventTypeAddDialogToggle();
  };

  handleEditModalOpen = (row) => {
    this.onEventTypeEditDialogToggle(row.typeData);
  };
  
  // todo
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

  handleUpdate = (typeData) => {
    console.log('handleUpdate');
    console.log(typeData);
  }

  handleDelete = (id) => {
    this.props.onDelete(id);
  };

  handleNewCategory = (name, color) => {
    this.props.onCreateCategory(name, color);
  };

  render() {
    const { locale, refs, types, facilities, materials } = this.props;

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
      'Description',
      'Actions'
    ];

    const rows_data = types.map((type) => {
      const category = et.getCategories(type);

      return {
        id: type.id,
        category_name: category[0],
        type_name: category[1] ?? '-',
        description: et.getDescription(type),
        typeData: type
      }
    });
    
    return (
      <div style={{ marginTop: '2em' }}>
        <EventTypeAddDialog
          categories={refs.typeCategories}
          facilities={facilities}
          materials={materials}
          etDisplay={et}
          isOpen={this.state.eventTypeAddDialogIsOpen}
          toggle={this.onEventTypeAddDialogToggle}
          callback={this.handleCreate}
          categoryCreateCallback={this.handleNewCategory}
        />
        <EventTypeEditDialog
          categories={refs.typeCategories}
          facilities={facilities}
          materials={materials}
          eventType={this.state.eventType}
          etDisplay={et}
          isOpen={this.state.eventTypeEditDialogIsOpen}
          toggle={this.onEventTypeEditDialogToggle}
          callback={this.handleUpdate}
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
            fieldNames={['id', 'category_name', 'type_name', 'description']}
            is_editable={false} // todo: пока не доделано редактирование
            onRemoveClick={this.handleRemoveClick}
            onEditClick={this.handleEditModalOpen}
          />
        </div>
      </div>
    );
  }
}
