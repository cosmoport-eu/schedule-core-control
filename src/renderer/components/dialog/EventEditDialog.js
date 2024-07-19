import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogBody, DialogFooter, Button } from '@blueprintjs/core';

import RefsPropType from '../../props/RefsPropType';
import GatePropType from '../../props/GatePropType';
import EventForm from '../form/EventForm';
import EventMapper from '../../components/mapper/EventMapper';
import _date  from '../date/_date';
import FacilityPropType from '../../props/FacilityPropType';
import MaterialPropType from '../../props/MaterialPropType';

/**
 * The class for event edit dialog.
 *
 * @since 0.1.1
 */
export default class EventEditDialog extends PureComponent {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    refs: RefsPropType.isRequired,
    locale: PropTypes.objectOf(PropTypes.string).isRequired,
    gates: PropTypes.arrayOf(GatePropType),
    facilities: PropTypes.arrayOf(FacilityPropType).isRequired,
    materials: PropTypes.arrayOf(MaterialPropType).isRequired,
  };

  static defaultProps = {
    event: null,
    callback: () => {},
    gates: [],
    facilities: [],
    materials: [],
  };

  constructor(props) {
    super(props);

    this.state = { isOpen: false, event: null };
  }

  passState = () => {
    const data = this.form.getFormData();
    console.log('EventEditDialog->passState', data)
    this.props.callback(EventMapper.fromForm(data), data.valid);
  };

  toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  edit = (ev) => {
    this.setState({ event: ev }, () => this.toggleDialog());
  };

  render() {
    const { locale, refs, gates, facilities, materials } = this.props;
    const { isOpen, event } = this.state;

    if (!event) return;

    const timeRange = event.startTime + event.durationTime;
    const endTime = _date.minutesToHm(timeRange);
    const eventEndDateTime = new Date(`${event.eventDate} ${endTime}`);
    const is_past = eventEndDateTime.getTime() < new Date().getTime();

    return (
      <Dialog
        isOpen={isOpen}
        onClose={this.toggleDialog}
        canOutsideClickClose={false}
        title="Edit event"
      >
        <DialogBody>
          <EventForm
            event={event}
            ref={(c) => {
              this.form = c;
            }}
            locale={locale}
            refs={refs}
            gates={gates}
            facilities={facilities}
            materials={materials}
          />
        </DialogBody>
        <DialogFooter
          actions={
            <Button
            onClick={is_past ? this.toggleDialog : this.passState}
            text={is_past ? 'Close modal' : 'Update'}
            />
          }
        />
      </Dialog>
    );
  }
}
