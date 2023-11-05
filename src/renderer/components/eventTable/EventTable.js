import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { HTMLTable, NonIdealState } from '@blueprintjs/core';

import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';
import EventPropType from '../../props/EventPropType';
import EventTableRow from './EventTableRow';
import L18n from '../l18n/L18n';

import styles from './EventTable.module.css';

export default class EventTable extends PureComponent {
  handleEdit = (event) => this.props.editCallback(event);
  handleRemove = (id) => this.props.callback(id);

  render() {
    const { locale, refs, events: events_ } = this.props;
    const l18n = new L18n(locale, refs);

    if (!events_ || events_.length === 0) {
      return (
        <NonIdealState
          title={'Nothing here'}
          icon={'offline'}
          description={
            'Create new event / select different range / reload data from the server.'
          }
        />
      );
    }

    return (
      <HTMLTable compact striped className={styles.eventTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Departure</th>
            <th>Duration</th>
            <th>Type</th>
            <th>Gates</th>
            <th>Destination</th>
            <th>Cost</th>
            <th>Status</th>
            <th>Tickets</th>
            <th title="It is `operations`">Ops</th>
          </tr>
        </thead>
        <tbody>
          {events_.map((event) => (
            <EventTableRow
              key={event.id}
              event={event}
              refs={this.props.refs}
              l18n={l18n}
              editCallback={this.handleEdit}
              callback={this.handleRemove}
              auth={this.props.auth}
            />
          ))}
        </tbody>
      </HTMLTable>
    );
  }
}

EventTable.propTypes = {
  editCallback: PropTypes.func,
  callback: PropTypes.func,
  auth: PropTypes.bool,
  refs: RefsPropType.isRequired,
  locale: LocalePropType.isRequired,
  events: PropTypes.arrayOf(EventPropType),
};

EventTable.defaultProps = {
  editCallback: () => {},
  callback: () => {},
  auth: false,
  events: [],
};
