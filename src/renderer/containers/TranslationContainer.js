import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Api } from 'cosmoport-core-api-client';
import ApiError from '../components/indicators/ApiError';

import { Button } from '@blueprintjs/core';
import PageCaption from '../components/page/PageCaption';
import Message from '../components/messages/Message';
import styles from './App.module.css';
import TranslationCategories from '../components/translation/TranslationCategories';
import TranslationCategoryTable from '../components/translation/TranslationCategoryTable';

export default class TranslationContainer extends Component {
  static propTypes = {
    api: PropTypes.instanceOf(Api),
  };

  static defaultProps = {
    api: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      hasData: false,
      locales: [],
      currentCategory: {
        id: 0,
        name: 'unknown',
        apiUrl: 'unknown'
      },
      currentCategoryData: [],
      buttonLinks: [
        { id: 1, apiUrl: '/dictionary/states', name: 'States' },
        { id: 2, apiUrl: '/dictionary/statuses', name: 'Statuses' },
        { id: 3, apiUrl: '/dictionary/categories', name: 'Categories' },
        { id: 4, apiUrl: '/dictionary/types', name: 'Types' },
        { id: 5, apiUrl: '/facility/all', name: 'Facilities' },
        { id: 6, apiUrl: '/material/all', name: 'Materials' },
      ],
      headers: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.props.api
      .fetchLocales()
      .then((data) => {
        const headers_ = ['Value'];

        data.map((locale) => {
          headers_.push(`${locale.localeDescription} (${locale.code})`);
        });

        this.setState({
          locales: data,
          headers: headers_,
        });
      })
      .catch((error) => ApiError(error));
  };

  handleCategorySelect = (category) => {
    this.props.api
      .get(category.apiUrl)
      .then((data) => {
        this.setState({
          hasData: true,
          currentCategory: category,
          currentCategoryData: data,
        });
      })
      .catch((error) => ApiError(error));
  };

  handleTextChange = (id, value, okCallback, notOkCallback) => {
    this.props.api
      .post(`/translations/update/${id}`, value)
      .then((result) => {
        Message.show('Translation updated');
        this.getData();
      })
      .catch((error) => {
        ApiError(error);
      });
  };

  render() {
    const {
      hasData,
      locales,
      currentCategory,
      currentCategoryData,
      buttonLinks,
      headers
    } = this.state;

    let tableData = [];

    if (currentCategory.apiUrl.includes('types')) {
      // такие стрёмные ID, чтобы можно было отдельно редактировать поля name и description
      tableData = tableData.concat(
        currentCategoryData.flatMap(category => [
          {
            id: `${category.id}_${category.nameCode}`,
            field_name: category.nameCode,
            translations: category.nameTranslations
          },
          {
            id: `${category.id}_${category.descCode}`,
            field_name: category.descCode,
            translations: category.descTranslations
          }
        ])
      );
    } else {
      tableData = currentCategoryData.map((category) => {
        return {
          id: category.id,
          field_name: category.code,
          translations: category.translations
        }
      });
    }

    const categoriesButtons = buttonLinks.map((category) => (
      <TranslationCategories
        key={category.id}
        category={category}
        onCategorySelect={this.handleCategorySelect}
      />
    ));

    return (
      <div>
        <PageCaption text="04 Translations" />

        <div className={styles.inlineContainer}>
          {categoriesButtons}
        </div>

        <div className="bp5-callout" style={{ fontSize: '80%', marginTop: '1em' }}>
          To see a list of records to be translated, click one of the buttons above.
        </div>

        <div className="bp5-callout" style={{ fontSize: '80%', marginTop: '1em' }}>
          Чтобы начать редактировать текст, кликните в нужную ячейку.
          При клике вне её данные сохранятся автоматически.
        </div>

        {
          hasData ?
          <div style={{ marginTop: '2em' }} >
            <TranslationCategoryTable
              key={currentCategory.id}
              headers={headers}
              data={tableData}
              pageCaption={currentCategory.name}
              apiUrl={currentCategory.apiUrl}
              onRefresh={this.handleCategorySelect}
              onTextChange={this.handleTextChange}
            />
          </div>
          :
          <></>
        }
      </div>
    );
  }
}
