import React from 'react';
import PropTypes from 'prop-types';

function TableFooter({ footers }) {
  const SectionTag = 'tfoot';

  return (
    <SectionTag>
      <tr>
        {footers.map((footer, index) => (
          <th key={index}>{footer}</th>
        ))}
      </tr>
    </SectionTag>
  );
}

TableFooter.propTypes = {
  footers: PropTypes.array.isRequired,
};

export default TableFooter;
