import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class LockContainer extends PureComponent {
  render() {
    return (
      <div className="bp5-non-ideal-state" style={{ marginTop: '1em' }}>
        <h4 className="bp5-non-ideal-state-title">
          Here you can go back to normal user mode.
        </h4>
        <div className="bp5-non-ideal-state-description">
          <button onClick={this.props.onDeAuth}>Logout</button>
        </div>
      </div>
    );
  }
}

LockContainer.propTypes = {
  onDeAuth: PropTypes.func,
};

LockContainer.defaultProps = {
  onDeAuth: () => {},
};
