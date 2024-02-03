import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Table from '../tableStructure/Table';
import { Button, Classes, Popover, NonIdealState, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import PageCaption from '../page/PageCaption';
import tableStyles from '../eventTable/EventTable.module.css';
import TextFieldGroup from '../form/group/TextFieldGroup';
import styles from './eventAddons.module.css';

export default function EventAddonTable({
  data = {},
  apiUrl = '',
  pageCaption = 'Unknown Table',
  onRefresh = (apiUrl) => {},
  onCreateCallback = (apiUrl, name) => {},
  onDeleteCallback = (apiUrl, id, name) => {}
}) {
  const [
    {name},
    setState,
  ] = useState({
    name: '',
  });

  const headers = [
    'ID',
    'Name',
    'Actions'
  ];
  
  const validators = {
    name: () => (name === '' ? "It shouldn't be empty" : ''),
  };

  const handleDeleteClick = (id) => {
    onDeleteCallback(apiUrl, id, name);
  };
  
  const handleEditClick = (item) => {
    console.log(item);
  };

  const handleCreate = () => {
    onCreateCallback(apiUrl, name);
  };

  const handleChange = (name_, value) => {
    setState((prevState) => ({ ...prevState, [name_]: value }));
  };

  return (
    <>
      <div className={styles.halfPageBlock}>
        <PageCaption text={pageCaption} />

        <div>
          <Popover
              interactionKind="click"
              popoverClassName={Classes.POPOVER_CONTENT_SIZING}
              placement="left-start"
              content={
                  <>
                    <div style={{ fontWeight: 'bold' }}>Create new {pageCaption}</div>
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
                  'Create new record / reload data from the server.'
                }
              />
              :
              <Table
                headers={headers}
                fieldNames={['id','name']}
                rows={data}
                onRemoveClick={handleDeleteClick}
                onEditClick={handleEditClick}
              />
          }
        </div>
      </div>
    </>
  );
}
