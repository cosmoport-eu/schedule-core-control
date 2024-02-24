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
import EventTypePropType from '../../props/EventTypePropType';

export default function EventTypeEditDialog({
  callback,
  categoryCreateCallback,
  onTextChange,
  onDelete,
  etDisplay,
  categories,
  types,
  subtypes,
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

  const handleTextChange = (id, data) => {
    onTextChange(id, data);
  };

  const deleteCallback = (id) => {
    onDelete(id);
  };

  const cats = categories
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
          types={types}
          subtypes={subtypes}
          ref={ref}
          etDisplay={etDisplay}
          categoryCreateCallback={handleNewCategory}
          onTextChange={handleTextChange}
          onDelete={deleteCallback}
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
  onTextChange: PropTypes.func,
  onDelete: PropTypes.func,
  categories: PropTypes.arrayOf(EventTypeCategoryPropType),
  types: PropTypes.arrayOf(EventTypePropType),
  subtypes: PropTypes.arrayOf(EventTypePropType),
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

EventTypeEditDialog.defaultProps = {
  eventType: null,
  categories: [],
  types: [],
  subtypes: [],
  isOpen: false,
  toggle: () => {},
  categoryCreateCallback: () => {},
  onTextChange: () => {},
  onDelete: () => {},
};
