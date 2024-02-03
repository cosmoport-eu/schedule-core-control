import React from 'react';
import PropTypes from 'prop-types';
import { HTMLTable } from '@blueprintjs/core';
import TableBody from './TableBody';
import TableSection from './TableSection';
import styles from '../eventTable/EventTable.module.css';

export default function Table({
    headers = [],
    rows = {},
    fieldNames = [],
    onRemoveClick = () => {},
    onEditClick = () => {}
}) {
    const handleRemoveClick = (row_id) => {
        onRemoveClick(row_id)
    }

    const handleEditClick = (row) => {
        onEditClick(row)
    }

    return (
        <HTMLTable compact striped className={styles.eventTable}>
            <TableSection
                data={headers}
                isHeader={true}
            />
            <TableSection
                data={headers}
                isHeader={false}
            />
            <TableBody
                rows={rows}
                fieldNames={fieldNames}
                onRemoveClick={handleRemoveClick}
                onEditClick={handleEditClick}
            />
        </HTMLTable>
    )
}

Table.propTypes = {
    headers: PropTypes.array.isRequired,
    // rows: PropTypes.arrayOf(PropTypes.array).isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired
}