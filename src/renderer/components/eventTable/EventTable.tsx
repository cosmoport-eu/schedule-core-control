import { Button, HTMLTable, NonIdealState, Icon } from '@blueprintjs/core';

import EventType from '../eventType/EventType';
import L18n from '../l18n/L18n';
import {
  EventDestinationType,
  EventI18nRecordType,
  EventStatusType,
  EventType as EvType,
  LocaleType,
  RefsType,
} from '../../types/Types';
import _date from '../date/_date';

import styles from './EventTable.module.css';

type Props = {
  auth?: boolean;
  callback?: (id: number) => void;
  editCallback?: (event: EvType) => void;
  events?: EvType[];
  locale: LocaleType;
  refs: RefsType;
};

export default function EventTable({
  auth = false,
  callback = () => {},
  editCallback = () => {},
  events = [],
  locale,
  refs,
}: Props) {
  const l18n = new L18n(locale, refs);

  const et = EventType({
    categories: refs.type_categories,
    translation: locale,
  });

  if (!events || events.length === 0) {
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
          <th>Cost&nbsp;(€)</th>
          <th>Status</th>
          <th>Tickets</th>
          <th title="It is `operations`">Ops</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <EventTableRow
            key={event.id}
            event={event}
            refs={refs}
            l18n={l18n}
            et={et}
            editCallback={editCallback}
            callback={callback}
            auth={auth}
          />
        ))}
      </tbody>
    </HTMLTable>
  );
}

type RowProps = {
  auth?: boolean;
  callback?: (id: number) => void;
  editCallback?: (event: EvType) => void;
  et: ReturnType<typeof EventType>;
  event: EvType;
  refs: RefsType;
  l18n: L18n;
};

function EventTableRow({
  auth = false,
  callback = () => {},
  editCallback = () => {},
  et,
  event,
  refs,
  l18n,
}: RowProps) {
  const handleRemoveClick = () => callback(event.id);
  const handleEditClick = () => editCallback(event);

  const renderL18nCell = (
    id: number,
    translations: EventI18nRecordType[],
    custom: (ref: EventI18nRecordType, l18n: L18n) => string,
  ) => {
    const l18nRecords = translations || [];
    const l18nId = l18nRecords.find((record) => record.id === id);

    if (l18nId) {
      return custom(l18nId, l18n);
    }

    return id > 0 ? id : '';
  };

  const renderTypeCol = (
    id: number,
    refs: RefsType,
    et: ReturnType<typeof EventType>,
  ) => {
    const type = refs.types.find((t) => t.id === id);
    return type ? et.getFullName(type) : '???';
  };

  const renderDestCol = (id: number, destinations: EventDestinationType[]) =>
    renderL18nCell(id, destinations, (l18nId, l18n) =>
      l18n.findTranslationById(l18nId, 'i18nEventDestinationName'),
    );

  const renderStatusCol = (id: number, statuses: EventStatusType[]) =>
    renderL18nCell(id, statuses, (l18nId, l18n) =>
      l18n.findTranslationById(l18nId, 'i18nStatus'),
    );

  const renderState = (state: number) =>
    state === 2 && <Icon icon="lock" size={16} style={{ color: '#5c7080' }} />;

  if (event === undefined || refs === undefined) {
    return null;
  }

  const gate1 = `${event.gateId}`.padStart(2, '0');
  const gate2 = `${event.gate2Id}`.padStart(2, '0');

  return (
    <tr>
      <td>{event.id}</td>
      <td>
        <div className={styles.dateCol}>
          {_date.format(event.eventDate, 'D MMM')}
        </div>
        {_date.minutesToHm(event.startTime)}
      </td>
      <td>{_date.minutesToHm(event.durationTime)}</td>
      <td>{renderTypeCol(event.eventTypeId, refs, et)}</td>
      <td>{`${gate1}${event.gateId !== event.gate2Id ? `→${gate2}` : ''}`}</td>
      <td>{renderDestCol(event.eventDestinationId, refs.destinations)}</td>
      <td>{event.cost}</td>
      <td>{renderStatusCol(event.eventStatusId, refs.statuses)}</td>
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
