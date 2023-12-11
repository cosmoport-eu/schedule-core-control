import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Callout, Dialog, DialogBody, Colors } from '@blueprintjs/core';
import { Remove } from '@blueprintjs/icons';

import EventTypePropType from '../../props/EventTypePropType';
import EventType from '../eventType/EventType';

/**
 * The class for event type add dialog.
 *
 * @since 0.1.0
 */
export default class EventTypeDelDialog extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
  }

  toggleDialog = () => {
    this.setState((prev) => ({ isOpen: !prev.isOpen }));
  };

  onDelete = (event) => {
    const { callback } = this.props;
    const { id } = event.currentTarget.dataset;
    callback(id, this.onSuccess);
  };

  onSuccess = () => {
    this.toggleDialog();
  };

  render() {
    const { types, etDisplay: et } = this.props;
    const { isOpen: isDialogOpen } = this.state;

    if (!types) {
      return null;
    }

    const eventTypes = types.map((op) => {
      const categories = et.getCategories(op);
      const name = et.getName(op);
      const description = et.getDescription(op);

      return (
        <div key={op.id}>
          <span title={description}>
            {categories.join(' / ')}&nbsp;/&nbsp;{name}
          </span>
          <Button
            minimal
            icon="remove"
            data-id={op.id}
            onClick={this.onDelete}
          />
        </div>
      );
    });

    return (
      <Dialog
        isOpen={isDialogOpen}
        onClose={this.toggleDialog}
        canOutsideClickClose={false}
        title="Delete an event type"
      >
        <DialogBody>
          <Callout>
            Click on the <Remove /> button if you want to delete an event type.
            <div style={{ color: Colors.RED1 }}>
              The application does not allow to delete event types which are
              used in existing events.
            </div>
          </Callout>
          <p>&nbsp;</p>
          {eventTypes}
        </DialogBody>
      </Dialog>
    );
  }
}

EventTypeDelDialog.propTypes = {
  etDisplay: PropTypes.objectOf(EventType).isRequired,
  types: PropTypes.arrayOf(EventTypePropType),
  callback: PropTypes.func,
};

EventTypeDelDialog.defaultProps = {
  types: [],
  callback: () => {},
};
