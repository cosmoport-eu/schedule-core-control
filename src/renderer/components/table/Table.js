import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@blueprintjs/core';
import { DateRangeInput3 } from '@blueprintjs/datetime2';

import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';
import EventPropType from '../../props/EventPropType';
import GatePropType from '../../props/GatePropType';
import Message from '../messages/Message';
import EventAddDialog from '../dialog/EventAddDialog';
import EventEditDialog from '../dialog/EventEditDialog';
import EventDeleteAlert from '../dialog/EventDeleteAlert';
import EventTable from '../eventTable/EventTable';

import styles from './Table.module.css';

export default class Table extends PureComponent {
  static propTypes = {
    onCreate: PropTypes.func,
    onRefresh: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onDateRangeChange: PropTypes.func,
    onDateRangeClear: PropTypes.func,
    refs: RefsPropType.isRequired,
    locale: LocalePropType.isRequired,
    events: PropTypes.arrayOf(EventPropType),
    gates: PropTypes.arrayOf(GatePropType),
    auth: PropTypes.bool,
    range: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  };

  static defaultProps = {
    onCreate: () => {},
    onRefresh: () => {},
    onEdit: () => {},
    onDelete: () => {},
    onDateRangeChange: () => {},
    onDateRangeClear: () => {},
    events: [],
    gates: [],
    auth: false,
    defaultRange: [null, null],
  };

  handleCreate = (formData, valid) => {
    if (!valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.onCreate(formData);
  };

  handleAddClick = () => {
    this.eventAddDialog.toggleDialog();
  };

  handleRefresh = () => this.props.onRefresh();
  handlePreDelete = (id) => this.deleteAlert.open(id);
  handleEdit = (event) => this.eventEditDialog.edit(event);

  handleEditApply = (formData, valid) => {
    if (!valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.onEdit(formData);
  };

  handleDelete = (id) => this.props.onDelete(id);
  handleChange = (range_) => this.props.onDateRangeChange(range_);
  handleClearRange = () => this.props.onDateRangeClear();
  suggestNext = (pre) => this.eventAddDialog.suggestNext(pre);

  render() {
    const { refs, locale, events, gates, range, auth } = this.props;

    return (
      <div>
        <EventDeleteAlert
          ref={(alert) => {
            this.deleteAlert = alert;
          }}
          onConfirm={this.handleDelete}
        />
        <EventAddDialog
          ref={(dialog) => {
            this.eventAddDialog = dialog;
          }}
          callback={this.handleCreate}
          refs={refs}
          locale={locale}
          gates={gates}
        />
        <EventEditDialog
          ref={(dialog) => {
            this.eventEditDialog = dialog;
          }}
          callback={this.handleEditApply}
          refs={refs}
          locale={locale}
          gates={gates}
        />
        <div className={styles.controls}>
          <Button minimal icon="add" onClick={this.handleAddClick} />
          <Button minimal icon="refresh" onClick={this.handleRefresh} />
          <DateRangeInput3 value={range} onChange={this.handleChange} />
          <Button minimal icon="remove" onClick={this.handleClearRange} />
        </div>
        <EventTable
          editCallback={this.handleEdit}
          callback={this.handlePreDelete}
          refs={refs}
          locale={locale}
          events={events}
          auth={auth}
        />
      </div>
    );
  }
}
