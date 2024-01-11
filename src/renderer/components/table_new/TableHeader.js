import React from 'react';
import PropTypes from 'prop-types';

function TableHeader(props) {
  return (
    <thead>
      <tr>
        {
          props.headers.map(header => {
            return <th>{header}</th>
          })
        }
      </tr>
    </thead>
  );
}

TableHeader.propTypes = {
  headers: PropTypes.array.isRequired
};

export default TableHeader