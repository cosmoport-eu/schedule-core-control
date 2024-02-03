import React from 'react';
import PropTypes from 'prop-types';

function TableHeader({ headers }) {
  return (
    <tfoot>
      <tr>
        {headers.map((header, index) => (
          <th key={index}>{header}</th>
        ))}
      </tr>
    </tfoot>
  );
}

TableHeader.propTypes = {
  headers: PropTypes.array.isRequired,
};

export default TableHeader;
