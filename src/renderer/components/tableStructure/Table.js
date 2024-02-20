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
    is_editable = true,
    is_deletable = true,
    has_actions = true,
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
                is_editable={is_editable}
                is_deletable={is_deletable}
                has_actions={has_actions}
                onRemoveClick={handleRemoveClick}
                onEditClick={handleEditClick}
            />
        </HTMLTable>
    )
}

Table.propTypes = {
    headers: PropTypes.array.isRequired,
    // rows: PropTypes.arrayOf(PropTypes.array).isRequired,
    onRemoveClick: PropTypes.func,
    onEditClick: PropTypes.func
}