import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, EditableText } from '@blueprintjs/core';

import { Api } from 'cosmoport-core-api-client';
import DefaultLocaleMessage from '../components/locale/DefaultLocaleMessage';
import Message from '../components/messages/Message';
import ApiError from '../components/indicators/ApiError';
import LocaleInput from '../components/locale/LocaleInput';
import LocaleMapper from '../components/mapper/LocaleMapper';
import PageCaption from '../components/page/PageCaption';
import TextValueEditor from '../components/editor/TextValueEditor';
import BusinessHoursEditor from '../components/editor/bs/BusinessHoursEditor';

import styles from '../components/settings/Settings.module.css';

function Caption(props) {
  return <p className={styles.caption}>{props.text}</p>;
}

Caption.propTypes = { text: PropTypes.string.isRequired };
const updateLocale = (locale, locales) => {
  const jo = locales.map((l) => (l.id === locale.id ? locale : l));
  return jo;
};

export default class SettingsContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api).isRequired,
    onRefresh: PropTypes.func,
  };

  static defaultProps = {
    onRefresh: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      hasData: false,
      refs: {},
      locales: [],
      trans: {},
      settings: []
    };
  }

  UNSAFE_componentWillMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([
      this.props.api.fetchReferenceData(),
      this.props.api.fetchLocales(),
      this.props.api.fetchTranslations(),
      this.props.api.fetchSettings(),
    ])
      .then((data) =>
        this.setState({
          hasData: true,
          refs: data[0],
          locales: data[1],
          trans: data[2].en,
          settings: data[3],
        }),
      )
      .catch((error) => ApiError(error));
  };

  handleLocaleTimeoutChange = (locale, value) => {
    const updated = { ...LocaleMapper.map(locale), show_time: value };

    this.props.api
      .updateLocaleShowData(updated)
      .then((result) => Message.show(`Locale has been updated [${result.id}].`))
      .then(
        this.setState({
          locales: updateLocale(
            LocaleMapper.unmap(updated),
            this.state.locales,
          ),
        }),
      )
      .catch((error) => ApiError(error));
  };

  handleCheck = (locale, value) => {
    const updated = { ...LocaleMapper.map(locale), show: value };

    this.props.api
      .updateLocaleShowData(updated)
      .then((result) => Message.show(`Locale has been updated [${result.id}].`))
      .then(
        this.setState({
          locales: updateLocale(
            LocaleMapper.unmap(updated),
            this.state.locales,
          ),
        }),
      )
      .catch((error) => ApiError(error));
  };

  findSetting = (settings, key) =>
    settings.find((setting) => setting.param === key) || { id: 0, value: '' };

  handleSettingConfirm = (id, newVal, oldVal) => {
    if (newVal === oldVal) {
      return;
    }

    const valueObject = { text: newVal };

    this.props.api
      .updateSettingValueForId(id, valueObject)
      .then(() => Message.show('The value has been saved successfully.'))
      .then(() => this.handleRefresh())
      .catch((error) => ApiError(error));
  };

  handlePassChange = () => {
    const pass = this.passField.value;

    this.props.api
      .authSetPass({ pwd: pass })
      .then((response) =>
        response.result
          ? Message.show('Password has changed.')
          : Message.show('Error during save.', 'error'),
      )
      .catch((error) => ApiError(error));
  };

  handleRefresh = () => {
    this.getData();
    this.props.onRefresh();
  };

  handleUpdateSettings = (id, text_) => {
    const valueObject = { text: text_ };

    this.props.api
      .updateSettingValueForId(id, valueObject)
      .then(() => Message.show('The value has been saved successfully.'))
      .then(() => this.handleRefresh())
      .catch((error) => ApiError(error));
  };

  handleLocalesClick = () => {
    this.state.locales.map(locale => (
        this.props.api
          .updateLocaleShowData({
            id: locale.id,
            show: locale.show,
            show_time: locale.showTime
          })
          .then()
          .then()
          .catch(error => ApiError(error))
    ));

    Message.show(`Locales have been updated.`);
  };

  render() {
    const {
      hasData,
      locales,
      refs,
      settings,
      trans
    } = this.state;

    if (!hasData) {
      return null;
    }

    const localeMessage = DefaultLocaleMessage(locales);
    const localeTimeouts = locales.map((locale) => (
      <LocaleInput
        key={locale.id}
        locale={locale}
        onChange={this.handleLocaleTimeoutChange}
        onCheck={this.handleCheck}
      />
    ));
    const linesSetting = this.findSetting(settings, 'timetable_screen_lines');
    const boardingSetting = this.findSetting(settings, 'boarding_time');
    const syncAddrSetting = this.findSetting(settings, 'sync_server_address');
    const businessHoursSetting = this.findSetting(settings, 'business_hours');

    return (
      <>
        <PageCaption text="Settings" />

        <div className="bp5-callout" style={{ fontSize: '80%' }}>
          All of thees changes are applied in real time. 
          So no need to restart any of the applications.
        </div>

        <div className={styles.container}>
          <Caption text="Simulation" />
          <div>
            <p>
              Here you can change the time interval for displaying the flight 
              departure/arrival message on the gate display.
            </p>
            <p style={{ fontSize: '85%' }}>
              It is not recommended to set this value less than 5 
              because some of the intervals might overlap each other.
            </p>
            
            <TextValueEditor
              className={styles.edit}
              id={boardingSetting.id}
              text={boardingSetting.value}
              onSet={this.handleUpdateSettings}
              selectAllOnFocus
            />
          </div>
  
          <Caption text={'Working hours'} />
          <div>
            <p>
              Here you can set the business hours when center will be working.
            </p>
            <BusinessHoursEditor
              setting={businessHoursSetting}
              onSet={this.handleUpdateSettings}
            />
          </div>

          <Caption text="Locales" />
          <div>
            {localeMessage}
            <p>
              You can create new translations in the dedicated translation
              interface of the application (
              <span className="bp5-icon-translate" />
              ).
            </p>
            <p>
              Every other part of the app will show given amount of time in all of
              the selected translations.
            </p>
            <div className={styles.margin}>
              {localeTimeouts}
              <Button
                style={{ marginTop: '1em', width: '7em' }}
                text="Save"
                onClick={this.handleLocalesClick}
              />
            </div>
          </div>

          <Caption text="Timetable" />
          <div>
            <p>
              Here you can choose how many lines of events will be showing on each screen.
            </p>
            <TextValueEditor
              className={styles.baseEdit}
              id={linesSetting.id}
              text={linesSetting.value}
              onSet={this.handleSettingConfirm}
              selectAllOnFocus
            />
          </div>

          <Caption text="Protection" />
          <div>
            <span>Change the password:</span>
            <div className="bp5-control-group" style={{ marginTop: '.6em' }}>
              <input
                type="password"
                className="bp5-input"
                placeholder="Be brave."
                ref={(c) => {
                  this.passField = c;
                }}
              />
              <button
                className="bp5-button bp5-icon-floppy-disk"
                onClick={this.handlePassChange}
              />
            </div>
          </div>

          <Caption text="Synchronization" />
          <div style={{ marginBottom: '6em' }}>
            All tickets data will be being synchronized with the server by the
            address:&nbsp;
            <EditableText
              className={styles.baseEdit}
              value={syncAddrSetting.value}
              placeholder=""
            />
            .
          </div>
          <p />
        </div>
      </>
    );
  }
}
