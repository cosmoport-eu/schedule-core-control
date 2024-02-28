import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button, HTMLTable, NonIdealState } from '@blueprintjs/core';

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
import EventTypeCategoryPropType from '../../props/EventTypeCategoryPropType';

export default class EventTypeTable extends PureComponent {
  static propTypes = {
    onTextChange: PropTypes.func,
    categoryCreateCallback: PropTypes.func,
    onDelete: PropTypes.func,
    editCallback: PropTypes.func,
    callback: PropTypes.func,
    auth: PropTypes.bool,
    locale: PropTypes.objectOf(PropTypes.string).isRequired,
    categories: PropTypes.arrayOf(EventTypeCategoryPropType),
    types: PropTypes.arrayOf(EventTypePropType),
    facilities: PropTypes.arrayOf(FacilityPropType),
    materials: PropTypes.arrayOf(MaterialPropType)
    subtypes: PropTypes.arrayOf(EventTypePropType),
  };
  
  static defaultProps = {
    editCallback: () => {},
    onDelete: () => {},
    callback: () => {},
    auth: false,
    categories: [],
    types: [],
    subtypes: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      eventTypeAddDialogIsOpen: false,
      eventTypeEditDialogIsOpen: false,
      categories: [],
      types: [],
      facilities: [],
      materials: [],,
      subtypes: [],
    };
  }

  handleEdit = (type) => this.props.editCallback(type);
  handleRefresh = () => this.props.onRefresh();

  // name & desciption fields for Type / Subtypes
  handleTextChange = (id, data) => {
    this.props.onTextChange(id, data);
  };

  onEventTypeAddDialogToggle = () =>
    this.setState({
      eventTypeAddDialogIsOpen: !this.state.eventTypeAddDialogIsOpen,
    });

  onEventTypeEditDialogToggle = (row) => {
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

  handleCreate = (formData, valid) => {
    if (!valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.onCreate(formData);
  };

  handleUpdate = (formData) => {
    this.props.onUpdate(formData);
  }

  handleDelete = (id) => {
    this.props.onDelete(id);
  };

  handleNewCategory = (name, color) => {
    this.props.onCreateCategory(name, color);
  };

  render() {
    const { locale, categories, types, facilities, materials, subtypes } = this.props;

    const et = EventType({
      categories: categories,
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
      const category = et.getCategoryById(type);

      return {
        id: type.id,
        category_name: category.name,
        type_name: et.getName(type),
        description: et.getDescription(type),
        typeData: type
      }
    });
    
    return (
      <div style={{ marginTop: '2em' }}>
        <EventTypeAddDialog
          categories={categories}
          facilities={facilities}
          materials={materials}
          types={types}
          subtypes={subtypes}
          etDisplay={et}
          isOpen={this.state.eventTypeAddDialogIsOpen}
          toggle={this.onEventTypeAddDialogToggle}
          callback={this.handleCreate}
          categoryCreateCallback={this.handleNewCategory}
        />
        <EventTypeEditDialog
          categories={categories}
          facilities={facilities}
          materials={materials}
          types={types}
          subtypes={subtypes}
          eventType={this.state.eventType}
          etDisplay={et}
          isOpen={this.state.eventTypeEditDialogIsOpen}
          toggle={this.onEventTypeEditDialogToggle}
          onTextChange={this.handleTextChange}
          callback={this.handleUpdate}
          categoryCreateCallback={this.handleNewCategory}
          onDelete={this.handleDelete}
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
            onRemoveClick={this.handleRemoveClick}
            onEditClick={this.handleEditModalOpen}
            onRemoveClick={this.handleDelete}
          />
        </div>
      </div>
    );
  }
}
