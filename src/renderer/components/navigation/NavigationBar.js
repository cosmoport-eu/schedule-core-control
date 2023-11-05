import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Position, Colors } from '@blueprintjs/core';
import { Exchange } from '@blueprintjs/icons';

import { NavLink } from 'react-router-dom';
import ServerTime from '../time/ServerTime';
import Player from '../player/Player';
import SimulationPropType from '../../props/SimulationPropType';

import styles from './Navigation.module.css';

function Navigate(props) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive, isPending }) =>
        'nav-link ' + (isPending ? 'pending' : isActive ? styles.active : '')
      }
      end={props.exact}
    >
      <span className={`bp5-icon-standard bp5-icon-${props.icon}`} />
    </NavLink>
  );
}

Navigate.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

Navigate.defaultProps = {
  exact: false,
};

export default class NavigationBar extends Component {
  render() {
    const { auth: auth_, audio, nodes, timestamp, simulation } = this.props;

    return (
      <nav className={`bp5-navbar ${styles.sticky}`}>
        <div className="bp5-navbar-group bp5-align-left">
          <div className="bp5-navbar-heading app-caption">
            Control
            <span className="version">0.2.0</span>
          </div>
          <div className="menu">
            <Navigate to="/" icon="home" exact />
            <Navigate to="/simulation" icon="globe" />
            <Navigate to="/table" icon="timeline-events" />
            {auth_ && <Navigate to="/translation" icon="translate" />}
            {auth_ && <Navigate to="/settings" icon="cog" />}
            {!auth_ && <Navigate to="/login" icon="lock" />}
            {auth_ && <Navigate to="/logout" icon="unlock" />}
          </div>
        </div>
        <div className="bp5-navbar-group bp5-align-right">
          <Player music={audio} />
          <span className="bp5-navbar-divider" />
          <span>
            {nodes.timetables}/{nodes.gates}
          </span>
          <span className="bp5-navbar-divider" />
          <Tooltip
            content={`Simulation is ${simulation.active ? 'ON' : 'OFF'}`}
            position={Position.BOTTOM}
          >
            <Exchange
              size={18}
              color={simulation.active ? Colors.GREEN4 : Colors.LIGHT_GRAY1}
            />
          </Tooltip>
          <span className="bp5-navbar-divider" />
          <ServerTime timestamp={timestamp} />
        </div>
      </nav>
    );
  }
}

NavigationBar.propTypes = {
  auth: PropTypes.bool,
  audio: PropTypes.shape({
    path: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.string),
  }),
  nodes: PropTypes.shape({
    timetables: PropTypes.number,
    gates: PropTypes.number,
  }),
  timestamp: PropTypes.number,
  simulation: SimulationPropType,
};

NavigationBar.defaultProps = {
  auth: false,
  audio: { path: '', files: [] },
  nodes: {
    timetables: 0,
    gates: 0,
  },
  timestamp: 1,
  simulation: {
    active: true,
  },
};
