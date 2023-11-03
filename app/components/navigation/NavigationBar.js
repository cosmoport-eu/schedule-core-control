import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Position } from '@blueprintjs/core';

import { NavLink } from 'react-router-dom';
import ServerTime from '../../components/time/ServerTime';
import Player from '../player/Player';
import SimulationPropType from '../../props/SimulationPropType';

import styles from './Navigation.css';

const Navigate = (props) => (
  <NavLink to={props.to} activeClassName={styles.activeLink} exact={props.exact} className="nav-link">
    <span className={`pt-icon-standard pt-icon-${props.icon}`} />
  </NavLink>
);
Navigate.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  exact: PropTypes.bool
};
Navigate.defaultProps = {
  exact: false
};

export default class NavigationBar extends Component {
  static propTypes = {
    auth: PropTypes.bool,
    audio: PropTypes.arrayOf(PropTypes.string),
    nodes: PropTypes.shape({
      timetables: PropTypes.number,
      gates: PropTypes.number
    }),
    timestamp: PropTypes.number,
    simulation: SimulationPropType
  }

  static defaultProps = {
    auth: false,
    audio: [],
    nodes: {
      timetables: 0,
      gates: 0
    },
    timestamp: 1,
    simulation: {
      active: true
    }
  }

  render() {
    const { auth: auth_, audio, nodes, timestamp, simulation } = this.props;

    return (
      <nav className={`pt-navbar ${styles.sticky}`}>
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading app-caption">
            Control
            <span className="version">0.1.3</span>
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
        <div className="pt-navbar-group pt-align-left">
          <Tooltip content="Simulation status (on/off)" position={Position.BOTTOM}>
            <span className={`pt-icon-standard pt-icon-lightbulb ${simulation.active && styles.active}`} />
          </Tooltip>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <Player music={audio} />
          <span className="pt-navbar-divider" />
          <span>{nodes.timetables}/{nodes.gates}</span>
          <span className="pt-navbar-divider" />
          <ServerTime timestamp={timestamp} />
        </div>
      </nav >
    );
  }
}
