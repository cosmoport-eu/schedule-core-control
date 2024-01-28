import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Table from '../tableStructure/Table';
import { NonIdealState } from '@blueprintjs/core';
import PageCaption from '../page/PageCaption';
import TextFieldGroup from '../form/group/TextFieldGroup';

export default function TranslationCategoryTable({
  data = {},
  headers = [],
  fieldNames = [],
  apiUrl = '',
  pageCaption = 'Unknown Table',
  onRefresh = (apiUrl) => {},
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

  // const handleChange = (name_, value) => {
  //   setState((prevState) => ({ ...prevState, [name_]: value }));
  // };

  console.log(data);
  return (
    <>
        <PageCaption text={pageCaption} />

        <div>
          {/* {
            !data || data.length === 0 ?
            <NonIdealState
              title="Nothing here"
              icon="offline"
              description={
                'Reload data from the server.'
              }
            />
            : */}
            <Table
              headers={headers}
              fieldNames={fieldNames}
              rows={data}
              has_actions={false}
              // onRemoveClick={}
              // onEditClick={}
            />
          {/* // } */}
        </div>
    </>
  );
}
