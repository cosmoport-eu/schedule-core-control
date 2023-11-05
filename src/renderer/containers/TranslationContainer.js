import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

import PageCaption from '../components/page/PageCaption';
import Message from '../components/messages/Message';
import Translation from '../components/translation/Translation';
import TranslationTable from '../components/translation/TranslationTable';
import LocaleAddDialog from '../components/dialog/LocaleAddDialog';
import Api from '../../lib/core-api-client/ApiV1';
import ApiError from '../components/indicators/ApiError';

import styles from './App.module.css';

export default class TranslationContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api)
  }

  static defaultProps = {
    api: null
  }

  constructor(props) {
    super(props);

    this.state = { locales: [], translations: [], currentTranslation: '' };
  }

  componentDidMount() {
    this.fetchLocales();
  }

  fetchLocales = () => {
    this.props.api
      .fetchLocales()
      .then(data => this.setState({ locales: data }))
      .catch(error => ApiError(error));
  }

  handleLocaleSelect = (locale) => {
    this.props.api
      .fetchTranslationsForLocale(locale)
      .then(data => this.setState({ translations: data, currentTranslation: locale }))
      .catch(error => ApiError(error));
  }

  handleTextChange = (id, value, okCallback, notOkCallback) => {
    const valueObject = { text: value };

    this.props.api
      .updateTranslationTextForId(id, valueObject)
      .then(() => Message.show('Translation value has been saved successfully.'))
      .then(() => this.updateTranslationStateById(id, value))
      .then(() => okCallback)
      .catch(error => {
        ApiError(error);
        notOkCallback();
      });
  }

  handleAddClick = () => {
    this.addDialog.toggleDialog();
  }

  handleLocaleCreate = (data) => {
    this.props.api
      .createLocale({ code: data.code, locale_description: data.description })
      .then(() => Message.show('Locale has been created.'))
      .then(() => this.addDialog.toggleDialog())
      .then(() => this.fetchLocales())
      .catch(error => ApiError(error));
  }

  updateTranslationStateById = (id, value) => {
    const ts = this.state.translations;
    const i = ts.findIndex(el => el.id === id);

    if (i > -1) {
      ts[i].text = value;
      this.setState({ translations: ts });
    }
  }

  render() {
    const locales = this.state.locales.map(locale =>
      <Translation key={locale.id} locale={locale} onLocaleSelect={this.handleLocaleSelect} />
    );

    return (
      <div>
        <PageCaption text="04 Translations" />
        <LocaleAddDialog ref={(c) => { this.addDialog = c; }} callback={this.handleLocaleCreate} />
        <div className={styles.inlineContainer}>
          {locales}
          <Button className="bp5-minimal" icon="add" onClick={this.handleAddClick} />
        </div>
        <TranslationTable
          translations={this.state.translations}
          onTextChange={this.handleTextChange}
        />
      </div>
    );
  }
}
