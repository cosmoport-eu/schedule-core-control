import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

export default function TableBody({ rows, onRemoveClick, onEditClick }) {
    const handleRemoveClick = (row_id) => {
        onRemoveClick(row_id)
    }

    const handleEditClick = (row) => {
        onEditClick(row)
    }

    return (
        <tbody>
        {
            rows.map(row => (
                <tr key={row.id}>
                    {
                    Object.keys(row).map((keyName, i) => (
                        <td>{row[keyName]}</td>
                    ))
                    }

                    <td>
                    <Button
                        minimal
                        icon={'remove'}
                        data-id={row.id}
                        data-name={row.name ? row.name : '-'}
                        onClick={() => handleRemoveClick(row.id)}
                    />
                    <Button
                        minimal
                        icon={'edit'}
                        data-id={row.id}
                        data-name={row.name ? row.name : '-'}
                        onClick={() => handleEditClick(row)}
                    />
                    </td>
                </tr>
            ))
        }
        </tbody>
    )
}

TableBody.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired
}

TableBody.defaultProps = {
    rows: [],
    onRemoveClick: () => {},
    onEditClick: () => {}
};