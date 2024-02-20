import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

export default function TableBody({
    rows = [],
    fieldNames = [],
    is_editable = true,
    is_deletable = true,
    has_actions = true,
    onRemoveClick = () => {},
    onEditClick = () => {}
}) {
    return (
        <tbody>
            {rows.map(row => (
                <tr key={row.id}>
                    {fieldNames.map(fieldName => (
                        <td key={fieldName}>{row[fieldName]}</td>
                    ))}

                    {
                        has_actions ?
                        <td>
                            {
                                is_deletable ?
                                <Button
                                    minimal
                                    icon="remove"
                                    data-id={row.id}
                                    data-name={row.name || '-'}
                                    onClick={() => onRemoveClick(row.id)}
                                />
                                :
                                <></>
                            }
                            {
                                is_editable ?
                                <Button
                                    minimal
                                    icon="edit"
                                    data-id={row.id}
                                    data-name={row.name || '-'}
                                    onClick={() => onEditClick(row)}
                                />
                                :
                                <></>
                            }
                        </td>
                        :
                        <></>
                    }
                </tr>
            ))}
        </tbody>
    )
}

TableBody.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired
}
