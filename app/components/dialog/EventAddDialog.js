import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Button, Intent } from '@blueprintjs/core';

import RefsPropType from '../../props/RefsPropType';
import LocalePropType from '../../props/LocalePropType';
import GatePropType from '../../props/GatePropType';
import EventForm from '../form/EventForm';
import EventMapper from '../../components/mapper/EventMapper';

/**
 * The class for event add dialog.
 *
 * @since 0.1.0
 */
export default class EventAddDialog extends Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    refs: RefsPropType.isRequired,
    locale: LocalePropType.isRequired,
    gates: PropTypes.arrayOf(GatePropType).isRequired
  }

  static defaultProps = {
    callback: () => { },
    gates: []
  }

  state = { isOpen: false, date: null, suggestion: 0 }

  passState = () => {
    const data = this.form.getFormData();

    this.props.callback(EventMapper.fromForm(data), data.valid);
  }

  toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  /**
   * Passes a date value into new event creation dialog form.
   */
  openWith = (date_) => {
    this.setState({ isOpen: true, date: date_ });
  }

  suggestNext = (pre) => {
    this.form.suggestNext(pre);
  }

  render() {
    const { isOpen, date } = this.state;

    return (
      <Dialog isOpen={isOpen} onClose={this.toggleDialog} canOutsideClickClose={false} title="Create event">
        <div className="pt-dialog-body">
          <EventForm
            ref={(c) => {
              this.form = c;
            }}
            locale={this.props.locale}
            refs={this.props.refs}
            gates={this.props.gates}
            date={date}
            forCreate
          />
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Button intent={Intent.PRIMARY} onClick={this.passState} text="Create" />
          </div>
        </div>
      </Dialog>
    );
  }
}
