import React from 'react';
import PropTypes from 'prop-types';

function TableSection({
  data = [],
  isHeader = true
}) {
  const SectionTag = isHeader ? 'thead' : 'tfoot';

  return (
    <SectionTag>
      <tr>
        {data.map((item, index) => (
          <th key={index}>{item}</th>
        ))}
      </tr>
    </SectionTag>
  );
}

TableSection.propTypes = {
  data: PropTypes.array.isRequired,
  isHeader: PropTypes.bool.isRequired,
};

export default TableSection;
