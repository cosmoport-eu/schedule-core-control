import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

import EventPropType from '../../props/EventPropType';
import RefsPropType from '../../props/RefsPropType';

import _date from '../date/_date';
import L18n from '../l18n/L18n';
import Sound from 'react-sound';

/*
 * The class for rendering event table row.
 *
 * @since 0.1.0
 */
export default class EventTableRow extends PureComponent {
  /**
   * Passes on click event the row id to the parent using its callback.
   */
  handleRemoveClick = () => this.props.callback(this.props.event.id);

  handleEditClick = () => this.props.editCallback(this.props.event);

  renderL18nCell = (id, translations, custom) => {
    const l18nRecords = translations || [];
    const l18nId = l18nRecords.find((record) => record.id === id);

    if (l18nId) {
      return custom(l18nId, this.props.l18n);
    }

    return id > 0 ? id : '';
  };

  /**
   * Renders the type column.
   *
   * @param {number} id
   * @param {Array} types @see EventTypePropType
   */
  renderTypeCol = (id, types) =>
    this.renderL18nCell(
      id,
      types,
      (l18nId, l18n) =>
        `${l18n.findTranslationById(
          l18nId,
          'i18nEventTypeName',
        )} / ${l18n.findTranslationById(l18nId, 'i18nEventTypeSubname')}`,
    );

  /**
   * Renders the destination column.
   *
   * @param {number} id
   * @param {Array} destinations @see EventDestinationPropType
   */
  renderDestCol = (id, destinations) =>
    this.renderL18nCell(id, destinations, (l18nId, l18n) =>
      l18n.findTranslationById(l18nId, 'i18nEventDestinationName'),
    );

  /**
   * Renders the status column.
   *
   * @param {number} id
   * @param {Array} statuses
   */
  renderStatusCol = (id, statuses) =>
    this.renderL18nCell(id, statuses, (l18nId, l18n) =>
      l18n.findTranslationById(l18nId, 'i18nStatus'),
    );

  renderState = (state) =>
    state === 2 && (
      <span
        className="bp5-icon-lock"
        style={{ fontSize: '.8em', color: '#5c7080' }}
      />
    );

  render() {
    const { auth, event, refs } = this.props;

    if (event === undefined || refs === undefined) {
      return null;
    }

    const name = event.status === 'inactive' ? 'canceled' : '';
    const gate1 =
      `${event.gateId}`.length === 1 ? `0${event.gateId}` : event.gateId;
    const gate2 =
      `${event.gate2Id}`.length === 1 ? `0${event.gate2Id}` : event.gate2Id;

    return (
      <tr className={name}>
        <td>{event.id}</td>
        <td>
          <div style={{ fontSize: '80%', marginBottom: '0.3em' }}>
            {_date.format(event.eventDate, 'D MMMM')}
          </div>
          {_date.minutesToHm(event.startTime)}
        </td>
        <td>{_date.minutesToHm(event.durationTime)}</td>
        <td>
          <span className="type-name">
            {this.renderTypeCol(event.eventTypeId, refs.types)}
          </span>
          {event.type}
        </td>
        <td>
          {gate1}
          {gate1 !== gate2 && `→${gate2}`}
        </td>
        <td>
          {this.renderDestCol(event.eventDestinationId, refs.destinations)}
        </td>
        <td>{`${event.cost} €`}</td>
        <td>{this.renderStatusCol(event.eventStatusId, refs.statuses)}</td>
        <td>
          {`${event.contestants}/${event.peopleLimit} `}
          {this.renderState(event.eventStateId)}
        </td>
        <td>
          <Button minimal icon={'edit'} onClick={this.handleEditClick} />
          {auth && (
            <Button minimal icon={'remove'} onClick={this.handleRemoveClick} />
          )}
        </td>
      </tr>
    );
  }
}

EventTableRow.propTypes = {
  auth: PropTypes.bool,
  callback: PropTypes.func,
  editCallback: PropTypes.func,
  event: EventPropType,
  refs: RefsPropType.isRequired,
  l18n: PropTypes.instanceOf(L18n),
};

EventTableRow.defaultProps = {
  auth: false,
  callback: () => {},
  editCallback: () => {},
  event: {},
  l18n: {},
};
