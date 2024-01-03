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

  handleEditModalOpen = () => {
    this.eventTypeEditDialog.toggleDialog();
  };

  handleDeleteButtonClick = (type) => {
    this.eventDeleteAlert.open(type.currentTarget.dataset);
  };

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

  handleNewCategory = (name) => {
    this.props.onCreateCategory(name);
  };

  render() {
    const { locale, refs, types } = this.props;

    const et = EventType({
      categories: refs.type_categories,
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

    return (
      <div style={{ marginTop: '2em' }}>
        <EventTypeAddDialog
          categories={refs.type_categories}
          etDisplay={et}
          isOpen={this.state.eventTypeAddDialogIsOpen}
          toggle={this.onEventTypeAddDialogToggle}
          callback={this.handleCreate}
          categoryCreateCallback={this.handleNewCategory}
        />
        {/* <EventTypeEditDialog
          ref={(dialog) => {
            this.eventEditDialog = dialog;
          }}
          callback={this.handleEditApply}
          refs={refs}
          locale={locale}
        /> */}
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
          <HTMLTable compact striped className={tableStyles.eventTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Type</th>
                <th>Subtype</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Type</th>
                <th>Subtype</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </tfoot>
            <tbody>
              {
                types.map((type) => {
                  const category = et.getCategories(type);
                  const subtype_name = et.getName(type);
                  const description = et.getDescription(type);
                  const category_name = category[0];
                  const type_name = category[1] ?? '-';
            
                  return (
                    <tr key={type.id}>
                      <td>{type.id}</td>
                      <td>{category_name}</td>
                      <td>{type_name}</td>
                      <td>{subtype_name}</td>
                      <td>{description}</td>
                      <td>
                        <Button
                          minimal
                          icon={'remove'}
                          data-id={type.id}
                          data-name={subtype_name}
                          onClick={this.handleDeleteButtonClick}
                        />
                        {/* <Button
                          minimal
                          data-id={type.id}
                          data-subtype_name={subtype_name}
                          icon={'edit'}
                          onClick={this.handleEditModalOpen}
                        /> */}
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </HTMLTable>
        </div>
      </div>
    );
  }
}
