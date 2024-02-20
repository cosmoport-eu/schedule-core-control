import { HTMLTable, NonIdealState } from '@blueprintjs/core';
import {
  EventType as EvType,
  RefsType,
} from '../../types/Types';
import _date from '../date/_date';
import EventType from '../eventType/EventType';

import styles from './EventTable.module.css';
import TableSection from '../tableStructure/TableSection';
import EventTableRow from './EventTableRow';

type Props = {
  auth?: boolean;
  callback?: (id: number) => void;
  editCallback?: (event: EvType) => void;
  events?: EvType[];
  refs: RefsType;
  locale: object;
};

export default function EventTable({
  auth = false,
  callback = () => {},
  editCallback = () => {},
  events = [],
  locale,
  refs,
}: Props) {
  const et = EventType({
    categories: refs.typeCategories,
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

  const headers = [
    '#',
    'Departure',
    'Duration',
    'Type',
    'Gates',
    'Cost',
    'Status',
    'Tickets',
    'Actions'
  ];

  return (
    <div className={styles.eventTableContainer}>
      <HTMLTable compact striped className={styles.eventTable}>
        <TableSection
            data={headers}
            isHeader={true}
        />
        <TableSection
            data={headers}
            isHeader={false}
        />
        <tbody>
          {events.map((event) => (
            <EventTableRow
              key={event.id}
              event={event}
              refs={refs}
              locale={locale}
              et={et}
              editCallback={editCallback}
              callback={callback}
              auth={auth}
            />
          ))}
        </tbody>
      </HTMLTable>
    </div>
  );
}
