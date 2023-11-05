import React from 'react';
import { Intent, OverlayToaster, Position } from '@blueprintjs/core';

function Message() {
  let toaster;

  return {
    render() {
      return (
        <OverlayToaster
          position={Position.BOTTOM_RIGHT}
          ref={(ref) => (toaster = ref)}
        />
      );
    },
    show(text, type) {
      toaster.show({
        message: text,
        intent: type === 'error' ? Intent.DANGER : Intent.SUCCESS,
      });
    },
  };
}

export default Message();
