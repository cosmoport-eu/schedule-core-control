import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Button, Intent } from '@blueprintjs/core';

import EventTypeForm from '../form/event/EventTypeForm';

/**
 * The class for event type add dialog.
 *
 * @since 0.1.0
 */
export default class EventTypeAddDialog extends Component {
  static propTypes = { callback: PropTypes.func.isRequired }
  static defaultProps = { callback: () => { } }

  constructor(props) {
    super(props);

    this.state = { isOpen: false };
  }

  passState = () => {
    this.props.callback(this.form.getFormData(), this.onSuccess);
  }

  toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  onSuccess = () => {
    this.toggleDialog();
  }

  render() {
    return (
      <Dialog isOpen={this.state.isOpen} onClose={this.toggleDialog} canOutsideClickClose={false} title="Create new event type">
        <div className="bp5-dialog-body">
          <div className="bp5-callout">
            You should fill the fields with a text of default locale.
            After the save the text will be copied to other locales
            and don&apos;t forget to translate it later in the dedicated translation
            interface of the application (<span className="bp5-icon-translate" />).
          </div>
          <p>&nbsp;</p>
          <EventTypeForm ref={(c) => { this.form = c; }} />
        </div>
        <div className="bp5-dialog-footer">
          <div className="bp5-dialog-footer-actions">
            <Button intent={Intent.PRIMARY} onClick={this.passState} text="Create" />
          </div>
        </div>
      </Dialog>
    );
  }
}
