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
  fieldNames = [],
  apiUrl = '',
  pageCaption = 'Unknown Table',
  onRefresh = (apiUrl) => {},
  onTextChange = (apiUrl) => {},
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

  const handleTextChange = (id, value, oldValue, locale) => {
    if (value === oldValue) {
      return;
    }
    
    onTextChange(apiUrl, id, value, oldValue, locale);
  };

  const records = data.map((record) => (
    <tr key={record.id}>
      {/* <td>{record.id}</td> */}
      <td>{record.field_name}</td>
      <td>
        <TextEditor
          id={record.id}
          text={record.en}
          locale={1}
          onConfirm={handleTextChange}
        />
      </td>
      <td>
        <TextEditor
          id={record.id}
          text={record.ru}
          locale={2}
          onConfirm={handleTextChange}
        />
      </td>
      <td>
        <TextEditor
          id={record.id}
          text={record.el}
          locale={3}
          onConfirm={handleTextChange}
        />
      </td>
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

            // todo: сделать редактируемые поля
            // <Table
            //   headers={headers}
            //   fieldNames={fieldNames}
            //   rows={data}
            //   editable_rows={true}
            //   has_actions={false}
            //   onTextChange={handleTextChange}
            // />
          }
        </div>
    </>
  );
}