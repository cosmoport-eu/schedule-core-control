import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { Api } from 'cosmoport-core-api-client';
import { Button } from '@blueprintjs/core';

import ApiError from '../components/indicators/ApiError';
import Message from '../components/messages/Message';
import EventAddonTable from '../components/eventAddons/EventAddonTable';

export default class AdditionalsContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api).isRequired,
    auth: PropTypes.bool,
    onRefresh: PropTypes.func,
    pre: PropTypes.number.isRequired,
  };

  static defaultProps = {
    auth: false,
    onRefresh: () => {},
  };

  state = {
    hasData: false,
    facilities: {},
    materials: {}
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([
      this.props.api.get('/facility?localeId=1'),
      this.props.api.get('/material?localeId=1')
    ])
      .then((data) => {
        this.setState({
          hasData: true,
          facilities: data[0],
          materials: data[1]
        });

        Message.show('Table data is refreshed.');
      })
      .catch((error) => ApiError(error));
  };

  onCreateRecord = (apiUrl, name) => {
    this.props.api
      .post(apiUrl, name)
      .then((response) => {
        Message.show('Record has been created.');

        this.getData();

        return 1;
      })
      .then(() => this.handleRefresh())
      .catch((error) => ApiError(error));
  };
  
  onDeleteRecord = (apiUrl, id) => {
    this.props.api
      .delete(`${apiUrl}/${id}`)
      .then((result) => {
        Message.show(`Record #${id} has been deleted`);

        this.handleRefresh();

        return 1;
      })
      .catch((error) => ApiError(error));
  };

  handleRefresh = () => {
    this.getData();
    this.props.onRefresh();
  };

  render() {
    if (!this.state.hasData) {
      return <span>Loading...</span>;
    }

    return (
      <>
        <div style={{
            marginTop: '2em',
            display: 'flex',
            overflow: 'auto',
            height: '45em',
            overflowY: 'scroll'
          }}
        >
          <EventAddonTable
            key="facilities"
            pageCaption="Facilities"
            apiUrl="/facility"
            data={this.state.facilities}
            onRefresh={this.handleRefresh}
            onCreateCallback={this.onCreateRecord}
            onDeleteCallback={this.onDeleteRecord}
          />
          <EventAddonTable
            key="materials"
            pageCaption="Materials"
            apiUrl="/material"
            data={this.state.materials}
            onRefresh={this.handleRefresh}
            onCreateCallback={this.onCreateRecord}
            onDeleteCallback={this.onDeleteRecord}
          />
        </div>
      </>
    );
  }
}