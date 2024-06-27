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

/**
 * The class for event type add dialog.
 *
 * @since 0.1.0
 */
export default function EventTypeAddDialog({
  callback,
  categoryCreateCallback,
  etDisplay,
  categories,
  facilities,
  materials,
  isOpen,
  toggle,
}) {
  const ref = useRef();

  const passState = () => {
    callback(ref.current.getFormData(), toggle);
  };

  const handleNewCategory = (name, color) => {
    categoryCreateCallback(name, color);
  };

  const cats = categories
    .map((c) => ({ id: c.id, name: etDisplay.getCategory(c) }));

  return (
    <Dialog
      isOpen={isOpen}
      onClose={toggle}
      canOutsideClickClose={false}
      title="Create new event type"
    >
      <DialogBody>
        <EventTypeForm
          categories={cats}
          facilities={facilities}
          materials={materials}
          etDisplay={etDisplay}
          ref={ref}
          categoryCreateCallback={handleNewCategory}
        />
      </DialogBody>
      <DialogFooter
        minimal
        actions={
          <Button intent={Intent.PRIMARY} onClick={passState} text="Create" />
        }
      />
    </Dialog>
  );
}

EventTypeAddDialog.propTypes = {
  etDisplay: PropTypes.objectOf(EventType).isRequired,
  callback: PropTypes.func.isRequired,
  categoryCreateCallback: PropTypes.func,
  categories: PropTypes.arrayOf(EventTypeCategoryPropType),
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

EventTypeAddDialog.defaultProps = {
  categories: [],
  isOpen: false,
  toggle: () => {},
  categoryCreateCallback: () => {},
};
