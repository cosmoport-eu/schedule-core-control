import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableFooter from './TableFooter';
import { HTMLTable } from '@blueprintjs/core';
import TableBody from './TableBody';

export default function Table({ headers, rows, onRemoveClick, onEditClick }) {
    const handleRemoveClick = (row_id) => {
        onRemoveClick(row_id)
    }

    const handleEditClick = (row) => {
        onEditClick(row)
    }

    return (
        <HTMLTable compact striped>
            <TableHeader
                headers={headers}
            />
            <TableFooter
                footers={headers}
            />
            <TableBody
                rows={rows}
                onRemoveClick={handleRemoveClick}
                onEditClick={handleEditClick}
            />
        </HTMLTable>
    )
}

Table.propTypes = {
    headers: PropTypes.array.isRequired,
    rows: PropTypes.arrayOf(PropTypes.array).isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired
}

Table.defaultProps = {
    headers: [],
    rows: {},
    onRemoveClick: () => {},
    onEditClick: () => {}
};