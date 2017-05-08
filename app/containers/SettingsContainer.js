import React, { Component, PropTypes } from 'react';
import { Button, EditableText } from '@blueprintjs/core';

import DefaultLocaleMessage from '../components/locale/DefaultLocaleMessage';
import EventTypeAddDialog from '../components/dialog/EventTypeAddDialog';
import Message from '../components/messages/Message';
import Api from '../../lib/core-api-client/ApiV1';
import ApiError from '../components/indicators/ApiError';
import LocaleInput from '../components/locale/LocaleInput';
import LocaleMapper from '../components/mapper/LocaleMapper';
import PageCaption from '../components/page/PageCaption';
import TextValueEditor from '../components/editor/TextValueEditor';

import styles from '../components/settings/Settings.css';

const mapEvent = (data) => ({
  default_duration: data.default_duration,
  default_repeat_interval: data.default_repeat_interval,
  description: data.description,
  name: data.name,
  subname: data.subname
});
const Caption = (props) => <p className={styles.caption}>{props.text}</p>;
const updateLocale = (locale, locales) => {
  const jo = locales.map(l => (l.id === locale.id ? locale : l));
  return jo;
};

export default class SettingsContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api)
  }

  static defaultProps = {
    api: null
  }

  constructor(props) {
    super(props);

    this.state = { locales: [], settings: [] };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([
      this.props.api.fetchLocales(),
      this.props.api.fetchSettings()
    ])
      .then(data => this.setState({ locales: data[0], settings: data[1] }))
      .catch(error => ApiError(error));
  }

  handleCreateEventType = () => {
    this.eventTypeAddDialog.toggleDialog();
  }

  handleCreate = (formData) => {
    if (!formData.valid) {
      Message.show('Please check the form data.', 'error');
      return;
    }

    this.props.api.createEventType(mapEvent(formData))
      .then(result => Message.show(`Event type has been created [${result.id}].`))
      // .then(() => this.props.onRefresh())
      .catch(error => ApiError(error));
  }

  handleLocaleTimeoutChange = (locale, value) => {
    const updated = Object.assign({}, LocaleMapper.map(locale), { show_time: value });

    this.props.api.updateLocaleShowData(updated)
      .then(result => Message.show(`Locale has been updated [${result.id}].`))
      .then(this.setState(
        { locales: updateLocale(LocaleMapper.unmap(updated), this.state.locales) })
      )
      .catch(error => ApiError(error));
  }

  handleCheck = (locale, value) => {
    const updated = Object.assign({}, LocaleMapper.map(locale), { show: value });

    this.props.api.updateLocaleShowData(updated)
      .then(result => Message.show(`Locale has been updated [${result.id}].`))
      .then(this.setState(
        { locales: updateLocale(LocaleMapper.unmap(updated), this.state.locales) })
      )
      .catch(error => ApiError(error));
  }

  findSetting = (settings, key) => settings.find(setting => setting.param === key) || { id: 0, value: '' }

  handleSettingConfirm = (id, newVal, oldVal) => {
    if (newVal === oldVal) {
      return;
    }

    const valueObject = { text: newVal };

    this.props.api.updateSettingValueForId(id, valueObject)
      .then(() => Message.show('Setting value has been saved successfully.'))
      .then(() => this.getData())
      .catch(error => ApiError(error));
  }

  render() {
    const localeMessage = DefaultLocaleMessage(this.state.locales);
    const localeTimeouts = this.state.locales.map(
      locale => <LocaleInput key={locale.id} locale={locale} onChange={this.handleLocaleTimeoutChange} onCheck={this.handleCheck} />
    );
    const linesSetting = this.findSetting(this.state.settings, 'timetable_screen_lines');
    const boardingSetting = this.findSetting(this.state.settings, 'boarding_time');

    return (
      <div>
        <EventTypeAddDialog
          ref={(c) => { this.eventTypeAddDialog = c; }}
          callback={this.handleCreate}
        />
        <PageCaption text="05 Settings" />

        <div>All of thees changes are applied in real time.
        So no need to restart any of the applications.</div>

        <div className={styles.container}>
          <Caption text={'00 Simulation'} />
          <div>
            <div>
              Before each departion there is a boarding interval of
              <TextValueEditor className={styles.edit} id={boardingSetting.id} text={boardingSetting.value} onConfirm={this.handleSettingConfirm} placeholder="" selectAllOnFocus />
              minutes to show an information.
            </div>
          </div>

          <Caption text={'01 Events'} />
          <div>
            <Button className="pt-minimal" text="Click if you want to create new event type" onClick={this.handleCreateEventType} />
          </div>

          <Caption text={'02 Locales'} />
          <div>
            {localeMessage}
            <div>Every other app will be being shown given amount of time in all of the selected translations:</div>
            <div className={styles.margin}>{localeTimeouts}</div>
            <div>You can create new translations in the dedicated translation interfase of the application
            (<span className="pt-icon-translate" />).</div>
          </div>

          <Caption text="03 Timetable" />
          <div>
            For each of 3 screens of the Timetable app it will be showing just
            <TextValueEditor className={styles.edit} id={linesSetting.id} text={linesSetting.value} onConfirm={this.handleSettingConfirm} placeholder="" selectAllOnFocus />
            lines of events.
          </div>

          <Caption text={'04 Synchronization [wip]'} />
          <div>
            All tickets data will be being synchronized with the server by the address:&nbsp;
            <EditableText className={styles.baseEdit} defaultValue="http://sync.cosmoport.com" placeholder="" />.
          </div>
          <p />
        </div>
      </div>);
  }
}
