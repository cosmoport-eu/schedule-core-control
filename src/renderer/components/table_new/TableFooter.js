import React from 'react';
import PropTypes from 'prop-types';

function TableFooter(props) {
  return (
    <tfoot>
      <tr>
        {
          props.footers.map((footer) => {
            return <th>{footer}</th>
          })
        }
      </tr>
    </tfoot>
  );
}

TableFooter.propTypes = {
  footers: PropTypes.array.isRequired
};

export default TableFooter