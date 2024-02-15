import { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
} from '@blueprintjs/core';

import EventTypeForm from '../form/event/EventTypeForm';
import EventTypeCategoryPropType from '../../props/EventTypeCategoryPropType';
import EventType from '../eventType/EventType';

export default function EventTypeEditDialog({
  callback,
  categoryCreateCallback,
  etDisplay,
  categories,
  facilities,
  materials,
  isOpen,
  toggle,
  eventType
}) {
  const ref = useRef();

  const passState = () => {
    callback(ref.current.getFormData(), toggle);
  };

  const handleNewCategory = (name, color) => {
    categoryCreateCallback(name, color);
  };

  // build root cats
  const cats = categories
    .filter((c) => c.parent === 0)
    .map((c) => ({ id: c.id, name: etDisplay.getCategory(c) }));

  return (
    <Dialog
      isOpen={isOpen}
      onClose={toggle}
      canOutsideClickClose={false}
      title="Edit event type"
    >
      <DialogBody>
        <EventTypeForm
          eventType={eventType}
          categories={cats}
          facilities={facilities}
          materials={materials}
          ref={ref}
          categoryCreateCallback={handleNewCategory}
        />
      </DialogBody>
      <DialogFooter
        minimal
        actions={
          <Button intent={Intent.PRIMARY} onClick={passState} text="Update" />
        }
      />
    </Dialog>
  );
}

EventTypeEditDialog.propTypes = {
  etDisplay: PropTypes.objectOf(EventType).isRequired,
  callback: PropTypes.func.isRequired,
  categoryCreateCallback: PropTypes.func,
  categories: PropTypes.arrayOf(EventTypeCategoryPropType),
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

EventTypeEditDialog.defaultProps = {
  eventType: null,
  categories: [],
  isOpen: false,
  toggle: () => {},
  categoryCreateCallback: () => {},
};
