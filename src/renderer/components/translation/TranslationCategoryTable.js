import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Table from '../tableStructure/Table';
import { H1, HTMLTable, NonIdealState } from '@blueprintjs/core';
import PageCaption from '../page/PageCaption';
import Caption from '../page/Caption';
import TableSection from '../tableStructure/TableSection';
import styles from '../eventTable/EventTable.module.css';
import TextEditor from '../translation/TextEditor';

export default function TranslationCategoryTable ({
  data = {},
  headers = [],
  apiUrl = '',
  pageCaption = 'Unknown Table',
  onRefresh = (apiUrl) => {},
  onTextChange = () => {},
}) {
  const [
    {name},
    setState,
  ] = useState({
    name: '',
  });
  
  const validators = {
    name: () => (name === '' ? "It shouldn't be empty" : ''),
  };

  const handleTextChange = (id, value, oldValue) => {
    if (value === oldValue) {
      return;
    }
    
    onTextChange(id, value);
  };

  const records = data.map((record) => (
    <tr key={record.id}>
      <td>{record.field_name}</td>

      {record.translations.map(translation => (
        <td key={translation.id}>
          <TextEditor
            id={translation.id}
            text={translation.text}
            onConfirm={handleTextChange}
          />
        </td>
      ))}
    </tr>
  ));

  return (
    <>
        <Caption text={pageCaption} />

        <div>
          {
            !data || data.length === 0 ?
            <NonIdealState
              title="Nothing here"
              icon="offline"
              description={
                'Reload data from the server.'
              }
            />
            :
            <HTMLTable compact striped className={styles.eventTable}>
              <TableSection
                  data={headers}
                  isHeader={true}
              />
              <TableSection
                  data={headers}
                  isHeader={false}
              />
              <tbody>{records}</tbody>
            </HTMLTable>
          }
        </div>
    </>
  );
}