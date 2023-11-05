import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Colors } from '@blueprintjs/core';

import EventTypePropType from '../../props/EventTypePropType';
import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';
import L18n from '../../components/l18n/L18n';

/**
 * The class for event type add dialog.
 *
 * @since 0.1.0
 */
export default class EventTypeDelDialog extends Component {
  static propTypes = {
    types: PropTypes.arrayOf(EventTypePropType),
    refs: RefsPropType.isRequired,
    trans: LocalePropType.isRequired,
    callback: PropTypes.func.isRequired,
  };

  static defaultProps = {
    types: [],
    callback: () => {},
  };

  constructor(props) {
    super(props);

    this.state = { isOpen: false };
  }

  toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  onDelete = (id) => {
    this.props.callback(id, this.onSuccess);
  };

  onSuccess = () => {
    this.toggleDialog();
  };

  render() {
    const { refs, trans } = this.props;
    const { isOpen } = this.state;

    if (!refs.types) {
      return null;
    }

    const l18n = new L18n(trans, refs);
    const eventTypes = refs.types.map((op) => (
      <div key={op.id}>
        {l18n.findTranslationById(op, 'i18nEventTypeName')}&nbsp;/&nbsp;
        {l18n.findTranslationById(op, 'i18nEventTypeSubname')}
        <button
          type="button"
          className="bp5-button bp5-minimal bp5-icon-remove bp5-intent-danger"
          onClick={this.onDelete.bind(this, op.id)}
        />
      </div>
    ));

    return (
      <Dialog
        isOpen={isOpen}
        onClose={this.toggleDialog}
        canOutsideClickClose={false}
        title="Delete an event type"
      >
        <div className="bp5-dialog-body">
          <div className="bp5-callout">
            Click on the button (<span className="bp5-icon-remove" />) bellow to
            delete right away an event type.
            <div style={{ color: Colors.RED1 }}>
              The application does not allow to delete event types which are
              used in existing events.
            </div>
          </div>
          <p>&nbsp;</p>
          {eventTypes}
        </div>
      </Dialog>
    );
  }
}
