import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Table from '../tableStructure/Table';
import {Button, Classes, H1, HTMLTable, Popover, NonIdealState } from '@blueprintjs/core';
import PageCaption from '../page/PageCaption';
import Caption from '../page/Caption';
import TableSection from '../tableStructure/TableSection';
import styles from '../eventTable/EventTable.module.css';
import TextEditor from '../translation/TextEditor';
import TextFieldGroup from '../form/group/TextFieldGroup';

export default function TranslationCategoryTable ({
  data = {},
  headers = [],
  is_deletable = true,
  is_creatable = true,
  apiUrl = {
    get: 'unknown',
    create: 'unknown',
    delete: 'unknown',
  },
  pageCaption = 'Unknown Table',
  onRefresh = () => {},
  onTextChange = () => {},
  onCreate = (apiUrlCreate, data) => {},
  onDelete = (apiUrlDelete, data) => {}
}) {
  const [
    {name, color},
    setState,
  ] = useState({
    name: '',
    color: '#808080', // for Category
  });
  
  const validators = {
    name: () => (name === '' ? "Category name shouldn't be empty" : ''),
    color: () => {
      if (color === '') {
        return "Category color shouldn't be empty";
      }

      const hexColorPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$|^#(?:[0-9a-fA-F]{4}){1,2}$/;
      
      if (!hexColorPattern.test(color)) {
        return 'Invalid color format. Color should be in hex format (#RRGGBB, #RGB, #RRGGBBAA, or #RGBA)';
      }

      return '';
    },
  };

  const handleTextChange = (id, value, oldValue, locale, code) => {
    if (value === oldValue) {
      return;
    }
    
    onTextChange(id, value, apiUrl.get, code);
  };

  const handleCreate = () => {
    let dataValue;

    // todo: проверка так себе, конечно
    if (pageCaption === 'Categories') {
      dataValue = {
        name: name,
        color: color,
      }
    } else {
      dataValue = name;
    }

    onCreate(apiUrl.create, dataValue);
  };

  const onRemoveClick = (record) => {
    onDelete(apiUrl.delete, {
      id: record.id,
      name: record.field_name
    });
  };

  const handleChange = (name_, value) => {
    setState((prevState) => ({ ...prevState, [name_]: value }));
  };

  const records = data.map((record) => (
    <tr key={record.id}>
      <td>{record.field_name}</td>

      {record.translations.map(translation => (
        <td key={translation.id}>
          <TextEditor
            id={translation.id}
            text={translation.text}
            code={record.field_name}
            onConfirm={handleTextChange}
          />
        </td>
      ))}

      <td>
        {
          is_deletable ?
          <Button
              minimal
              icon="remove"
              data-id={record.id}
              data-name={record.field_name || '-'}
              onClick={() => onRemoveClick(record)}
          />
          :
          <></>
        }
      </td>
    </tr>
  ));

  return (
    <>
        <Caption text={pageCaption} />

        <div>
          {
            is_creatable ?
            <Popover
              interactionKind="click"
              popoverClassName={Classes.POPOVER_CONTENT_SIZING}
              placement="left-start"
              content={
                <>
                  <div style={{ fontWeight: 'bold' }}>Create new record for {pageCaption}</div>
                  <br />
                  <TextFieldGroup
                    name="name"
                    caption="Name"
                    value={name}
                    validator={validators.name()}
                    onChange={handleChange}
                    inline
                    fill
                  />
                  {
                    pageCaption === 'Categories' ? 
                    <TextFieldGroup
                      name="color"
                      caption="Color"
                      value={color}
                      validator={validators.color()}
                      onChange={handleChange}
                      inline
                      fill
                    />
                    : <></>
                  }
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      gap: '10px',
                    }}
                  >
                    <Button
                      text="Create"
                      onClick={handleCreate}
                      disabled={validators.name() !== ''}
                    />
                    <Button
                      className={Classes.POPOVER_DISMISS}
                      text="Cancel"
                    />
                  </div>
                </>
                }
              renderTarget={({ isOpen, ...targetProps }) => (
                <Button {...targetProps} icon="add" minimal />
              )}
            />
            :
            <></>
          }
          <Button
            style={{ marginLeft: '2em' }}
            minimal
            icon="refresh"
            onClick={() => onRefresh()}
          />
        </div>
        <div>
          {
            !data || data.length === 0 ?
            <NonIdealState
              title="Nothing here"
              icon="offline"
              description={
                'Reload data from the server or create new record.'
              }
            />
            :
            <div style={{ marginTop: '1em' }}>
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
            </div>
          }
        </div>
    </>
  );
}