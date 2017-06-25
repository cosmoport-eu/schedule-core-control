// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import {
  Route,
  Switch
} from 'react-router-dom';

import NavigationBar from '../components/navigation/NavigationBar';
import Api from '../../lib/core-api-client/ApiV1';
import Socket0 from '../../lib/core-api-client/WebSocketWrapper';
import Rupor from '../components/player/Announcer';
import ApiError from '../components/indicators/ApiError';
import Message from '../components/messages/Message';
import MainPage from '../containers/MainPage';
import Table from '../containers/TableContainer';
import Simulation from '../containers/SimulationContainer';
import Translation from '../containers/TranslationContainer';
import Settings from '../containers/SettingsContainer';
import Lock from '../containers/LockContainer';
import Unlock from '../containers/UnlockContainer';
import Simulator from '../components/simulator/v0/Simulator';
import EventMapper from '../components/mapper/EventMapper';
import _date from '../components/date/_date';

import styles from './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 1,
      nodes: { gates: 0, timetables: 0 },
      boarding: 10,
      events: [],
      audio: [],
      api: null,
      socket: null,
      simulationAnnouncements: [],
      simulation: {
        active: true,
        actions: [],
        ticks: 0
      },
      auth: false
    };

    ipcRenderer.on('audio', this.handleSetAudio);
    // After receiving the config, we should fetch the data and render markup.
    ipcRenderer.on('config', this.handleConfig);
  }

  handleSetAudio = (event, files) => {
    this.setState({ audio: files });
  }

  handleConfig = (event, data) => {
    this.init(data);
  }

  init = (config) => {
    const self = this;
    const socket0 = new Socket0({
      url: `ws://${config.address.server}/events?id=control`,

      onopen() { },

      onmessage(...args) {
        const message = args[0].data;

        console.log(message);

        if (message === ':update-nodes:') {
          self.state.api.fetchNodes()
            .then(data => self.setState({ nodes: data }))
            .catch(error => console.error(error));
        }
      },

      onclose() {
        if (self.state.socket) {
          self.state.socket.close();
        }
      },

      onerror(...args) {
        console.error(args);
      }
    });
    const api0 = new Api(`http://${config.address.server}`);

    this.setState({ api: api0, socket: socket0 }, () => {
      this.getData();
    });
  }

  getData = () => {
    const { api, simulation } = this.state;
    const today = _date.current();

    Promise.all([
      api.fetchTime(),
      api.fetchNodes(),
      api.fetchEventsInRange(today, today),
      api.fetchSettings()])
      .then(([time, nodes_, events_, settings_]) => {
        const boardingTime =
          parseInt(settings_.find(setting => setting.param === 'boarding_time').value, 10) || 10;

        const todayBs =
          JSON.parse(settings_.find(setting => setting.param === 'business_hours').value);

        const dayBs = todayBs.hours[(new Date().getDay() + 6) % 7];

        this.setState(
          {
            timestamp: time.timestamp,
            nodes: nodes_,
            events: events_,
            boarding: boardingTime,
            bs: dayBs,
            simulation: {
              active: simulation.active,
              actions: this.simulator.scheduleActions(events_),
              ticks: simulation.ticks
            }
          }
        );

        return 1;
      })
      .catch(error => console.error(error));
  }

  handleAnnouncement = (ann) => {
    this.setState({
      simulationAnnouncements: this.state.simulationAnnouncements.concat(ann)
    });
    console.info('announcement', ann.type);
  }

  handleAnnouncementEnd = () => {
    if (this.state.simulationAnnouncements.length > 0) {
      // Remove last announcement
      this.setState((prevState) => ({
        simulationAnnouncements: prevState.simulationAnnouncements.filter((_, i) => i !== 0)
      }));
    }
  }

  handlePassword = (pass) => {
    this.state.api.authWith({ pwd: pass })
      .then(response => {
        if (response.result) {
          this.setState({ auth: true }, () => {
            Message.show('Access was granted.');
          });
        }

        return 1;
      })
      .catch(error => ApiError(error));
  }

  handleLogout = () => {
    this.setState({ auth: false }, () => {
      Message.show('Access was revoked.');
    });
  }

  handleStatusChange = (action) => {
    console.info('status', action);

    this.setEventStatus(action.event, action);
  }

  setEventStatus = (event, action) => {
    // Be careful with these values
    const statusIdMap = {
      set_status_boarding: 2,
      set_status_departed: 3,
      show_return: 4,
      set_status_returned: 5
    }[action.do];

    const ev = event;
    ev.eventStatusId = statusIdMap;
    const modifiedEvent = EventMapper.unmap(ev);

    this.state.api
      .updateEvent(modifiedEvent)
      .then(result => Message.show(`Event status has been updated [${result.id}].`))
      // .then(() => this.handleRefresh())
      .catch(error => ApiError(error));
  }

  handleTurnGateOn = (action) => {
    console.info('gateOn', action);
    this.fireUpTheGate(action.event, 'before_departion');
  }

  fireUpTheGate = (evt, tpy) => {
    this.state.api
      .proxy({ name: 'fire_gate', event: evt, type: tpy })
      .then(() => Message.show(`Firing up the Gate #${evt.gateId}.`))
      .catch(error => ApiError(error));
  }

  handleArchive = (action) => {
    console.info('archive', action);
  }

  handleReturn = (action) => {
    console.info('return', action);
    this.setEventStatus(action.event, action);
    this.fireUpTheGate(action.event, 'before_return');
  }

  handleAction = (action) => {
    this.simulator.doIt(action);
  }

  handleSimulationTick = (state) => {
    this.setState({ simulation: state });
  }

  handleRefresh = () => {
    this.getData();
  }

  handleActionsUpdate = (actions_) => {
    if (actions_ !== this.state.simulation.actions) {
      const newSimulation = Object.assign({}, this.state.simulation, { actions: actions_ });
      this.setState({ simulation: newSimulation });
    }
  }

  render() {
    const {
      auth: auth_,
      api: api_,
      boarding,
      bs,
      events: events_,
      simulation: sim,
      simulationAnnouncements: sa,
      timestamp,
      nodes,
      audio
    } = this.state;

    if (api_ === null) {
      return <div>Loading...</div>;
    }

    const commonProps = { api: api_, auth: auth_, onRefresh: this.handleRefresh };

    return (
      <div>
        <Simulator
          ref={s => { this.simulator = s; }}
          active
          events={events_}
          boarding={boarding}
          business={bs}
          onAnnouncement={this.handleAnnouncement}
          onStatusChange={this.handleStatusChange}
          onTurnGateOn={this.handleTurnGateOn}
          onArchive={this.handleArchive}
          onReturn={this.handleReturn}
          onSimulationTick={this.handleSimulationTick}
          onNewDay={this.handleRefresh}
          onActionsUpdate={this.handleActionsUpdate}
        />
        <Rupor announcements={sa} onAnnouncementEnd={this.handleAnnouncementEnd} />
        <div className="pt-ui-text">
          <div className={styles.container}>
            <NavigationBar
              timestamp={timestamp}
              nodes={nodes}
              audio={audio}
              auth={auth_}
              simulation={sim}
            />
            <div className={styles.content}>
              <Switch>
                <Route exact path="/" render={props => <MainPage {...props} {...commonProps} />} />
                <Route path="/simulation" render={() => <Simulation simulation={sim} announcements={sa} onActionClick={this.handleAction} events={events_} {...commonProps} />} />
                <Route path="/translation" render={props => <Translation {...props} {...commonProps} auth />} />
                <Route path="/table" render={props => <Table {...props} {...commonProps} />} />
                <Route path="/login" render={() => <Unlock onAuth={this.handlePassword} />} />
                <Route path="/logout" render={() => <Lock onDeAuth={this.handleLogout} />} />
                <Route path="/settings" render={props => <Settings {...props} {...commonProps} />} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
