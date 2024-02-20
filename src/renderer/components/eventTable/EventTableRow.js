import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

import EventPropType from '../../props/EventPropType';
import RefsPropType from '../../props/RefsPropType';

import _date from '../date/_date';
import RefsData from '../references/RefsData';
import L18n from '../l18n/L18n';

/*
 * The class for rendering event table row.
 *
 * @since 0.1.0
 */
export default function EventTableRow({
  event,
  callback,
  editCallback,
  locale,
  auth,
  refs,
  et,
}) {
  const handleRemoveClick = () => callback(event.id);

  const handleEditClick = () => editCallback(event);

  const renderTypeCol = (id) => {
    const typeData = refsData.findTypeById(id);
    return et.getFullName(typeData);
  };

  const renderState = (state) =>
    state === 2 && (
      <span
        className="bp5-icon-lock"
        style={{ fontSize: '.8em', color: '#5c7080' }}
      />
    );

  const getTranslation = (id, category) => {
    const refData = refsData.findById(id, category);
    const codeField = typeof refData.code !== 'undefined' ? refData.code : refData.nameCode;
    const text = translation.findByCode(codeField);
    
    return text;
  };

  if (event === undefined || locale === undefined) {
    return null;
  }
  const refsData = new RefsData(refs);
  const translation = new L18n(locale);

  const className = event.status === 'inactive' ? 'canceled' : '';

  const gate1 = event.gateId;
  const gate2 = event.gate2Id;
  const gatesText = gate1 + (gate1 !== gate2 && `→${gate2}`);

  const state = getTranslation(event.eventStateId, 'states');
  const status = getTranslation(event.eventStatusId, 'statuses');
  const statusText = state + (typeof status === 'undefined' ? '' : ` / ${status}`);

  return (
    <tr className={className}>
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
          {renderTypeCol(event.eventTypeId)}
        </span>
      </td>
      <td>{gatesText}</td>
      <td>{`${event.cost} €`}</td>
      <td>{statusText}</td>
      <td>
        {`${event.contestants}/${event.peopleLimit} `}
        {renderState(event.eventStateId)}
      </td>
      <td>
        <Button minimal icon={'edit'} onClick={handleEditClick} />
        {auth && <Button minimal icon={'remove'} onClick={handleRemoveClick} />}
      </td>
    </tr>
  );
}

EventTableRow.propTypes = {
  auth: PropTypes.bool,
  callback: PropTypes.func,
  editCallback: PropTypes.func,
  event: EventPropType,
  refs: RefsPropType.isRequired,
};

EventTableRow.defaultProps = {
  auth: false,
  callback: () => {},
  editCallback: () => {},
  event: {},
};
