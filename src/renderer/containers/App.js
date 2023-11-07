import React, { Component } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { FocusStyleManager } from '@blueprintjs/core';

import NavigationBar from '../components/navigation/NavigationBar';
import { Api, Websocket } from 'cosmoport-core-api-client';
import Rupor from '../components/player/Announcer';
import ApiError from '../components/indicators/ApiError';
import MainPage from './MainPage';
import Table from './TableContainer';
import Simulation from './SimulationContainer';
import Translation from './TranslationContainer';
import Settings from './SettingsContainer';
import Lock from './LockContainer';
import Unlock from './UnlockContainer';
import Simulator from '../components/simulator/v0/Simulator';
import EventMapper from '../components/mapper/EventMapper';
import _date from '../components/date/_date';
import Message from '../components/messages/Message';

import './app.global.css';
import styles from './App.module.css';

FocusStyleManager.onlyShowFocusOnTabs();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 1,
      nodes: { gates: 0, timetables: 0 },
      boarding: 10,
      events: [],
      audio: { path: props.audio.dir, files: props.audio.mp3s },
      api: new Api(
        `http${props.conf.address.ssl === 'true' ? 's' : ''}://${
          props.conf.address.server
        }`,
      ),
      socket: null,
      simulationAnnouncements: [],
      simulation: {
        active: true,
        actions: [],
        ticks: 0,
      },
      auth: false,
    };

    this.init(props.conf);
    this.getData();
  }

  init = (config) => {
    const self = this;
    this.state.socket = new Websocket({
      url: `ws${config.address.ssl === 'true' ? 's' : ''}://${
        config.address.ws
      }/events?id=control`,

      onopen() {},

      onmessage(...args) {
        const message = args[0].data;

        console.log(message);

        if (message === ':update-nodes:') {
          self.state.api
            .fetchNodes()
            .then((data) => self.setState({ nodes: data }))
            .catch((error) => console.error(error));
        }
      },

      onclose() {
        if (self.state.socket) {
          self.state.socket.close();
        }
      },

      onerror(...args) {
        console.error(args);
      },
    });
  };

  getData = () => {
    const { api, simulation } = this.state;
    const today = _date.current();

    Promise.all([
      api.fetchTime(),
      api.fetchNodes(),
      api.fetchEventsInRange(today, today),
      api.fetchSettings(),
    ])
      .then(([time, nodes_, events_, settings_]) => {
        const settings = Array.isArray(settings_) ? settings_ : [];
        const events = Array.isArray(events_) ? events_ : [];

        const boardingTime =
          parseInt(
            settings.find((setting) => setting.param === 'boarding_time').value,
            10,
          ) || 10;

        const todayBs = JSON.parse(
          settings.find((setting) => setting.param === 'business_hours').value,
        );

        const dayBs = todayBs.hours[(new Date().getDay() + 6) % 7];

        this.setState({
          timestamp: time.timestamp,
          nodes: nodes_,
          events: events,
          boarding: boardingTime,
          bs: dayBs,
          simulation: {
            active: simulation.active,
            actions: this.simulator.scheduleActions(events),
            ticks: simulation.ticks,
          },
        });

        return 1;
      })
      .catch((error) => console.error(error));
  };

  handleAnnouncement = (ann) => {
    this.setState({
      simulationAnnouncements: this.state.simulationAnnouncements.concat(ann),
    });
    console.info('announcement', ann.type);
  };

  handleAnnouncementEnd = () => {
    if (this.state.simulationAnnouncements.length > 0) {
      // Remove last announcement
      this.setState((prevState) => ({
        simulationAnnouncements: prevState.simulationAnnouncements.filter(
          (_, i) => i !== 0,
        ),
      }));
    }
  };

  handlePassword = (pass) => {
    this.state.api
      .authWith({ pwd: pass })
      .then((response) => {
        if (response.result) {
          this.setState({ auth: true }, () => {
            Message.show('Access was granted.');
          });
        }

        return 1;
      })
      .catch((error) => ApiError(error));
  };

  handleLogout = () => {
    this.setState({ auth: false }, () => {
      Message.show('Access was revoked.');
    });
  };

  handleStatusChange = (action) => {
    console.info('status', action);

    this.setEventStatus(action.event, action);
  };

  setEventStatus = (event, action) => {
    // Be careful with these values
    const statusIdMap = {
      set_status_boarding: 2,
      set_status_departed: 3,
      show_return: 4,
      set_status_returned: 5,
    }[action.do];

    const ev = event;
    ev.eventStatusId = statusIdMap;
    const modifiedEvent = EventMapper.unmap(ev);

    this.state.api
      .updateEvent(modifiedEvent)
      .then((result) =>
        Message.show(`Event status has been updated [${result.id}].`),
      )
      // .then(() => this.handleRefresh())
      .catch((error) => ApiError(error));
  };

  handleTurnGateOn = (action) => {
    console.info('gateOn', action);
    this.fireUpTheGate(action.event, 'before_departion');
  };

  fireUpTheGate = (evt, tpy) => {
    this.state.api
      .proxy({ name: 'fire_gate', event: evt, type: tpy })
      .then(() => Message.show(`Firing up the Gate #${evt.gateId}.`))
      .catch((error) => ApiError(error));
  };

  handleArchive = (action) => {
    console.info('archive', action);
  };

  handleReturn = (action) => {
    console.info('return', action);
    this.setEventStatus(action.event, action);
    this.fireUpTheGate(action.event, 'before_return');
  };

  handleAction = (action) => {
    this.simulator.doIt(action);
  };

  handleSimulationTick = (state) => {
    this.setState({ simulation: state });
  };

  handleRefresh = () => {
    this.getData();
  };

  handleActionsUpdate = (actions_) => {
    if (actions_ !== this.state.simulation.actions) {
      const newSimulation = { ...this.state.simulation, actions: actions_ };
      this.setState({ simulation: newSimulation });
    }
  };

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
      audio,
    } = this.state;

    if (api_ === null) {
      return <div>Loading...</div>;
    }

    const commonProps = {
      api: api_,
      auth: auth_,
      pre: boarding,
      onRefresh: this.handleRefresh,
    };

    return (
      <>
        <Simulator
          ref={(s) => {
            this.simulator = s;
          }}
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
        <Rupor
          audio={audio}
          announcements={sa}
          onAnnouncementEnd={this.handleAnnouncementEnd}
        />
        <Router>
          <div className="bp5-ui-text">
            <div className={styles.container}>
              <NavigationBar
                timestamp={timestamp}
                nodes={nodes}
                audio={audio}
                auth={auth_}
                simulation={sim}
              />
              <div className={styles.content}>
                <Routes>
                  <Route path="/" element={<MainPage {...commonProps} />} />
                  <Route
                    path="/simulation"
                    element={
                      <Simulation
                        simulation={sim}
                        announcements={sa}
                        onActionClick={this.handleAction}
                        events={events_}
                        {...commonProps}
                      />
                    }
                  />
                  <Route
                    path="/translation"
                    element={<Translation {...commonProps} auth />}
                  />
                  <Route path="/table" element={<Table {...commonProps} />} />
                  <Route
                    path="/login"
                    element={<Unlock onAuth={this.handlePassword} />}
                  />
                  <Route
                    path="/logout"
                    element={<Lock onDeAuth={this.handleLogout} />}
                  />
                  <Route
                    path="/settings"
                    element={<Settings {...commonProps} />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
        <Message.render />
      </>
    );
  }
}
