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
      category: {
        id: 0,
        name: 'unknown',
        apiUrl: 'unknown'
      },
      categoryData: [],
      categories: [
        { id: 1, apiUrl: '/dictionary/states', name: 'States' },
        { id: 2, apiUrl: '/dictionary/statuses', name: 'Statuses' },
        { id: 3, apiUrl: '/dictionary/categories', name: 'Categories' },
        // { id: 4, apiUrl: '/dictionary/types', name: 'Types' },
        // { id: 5, apiUrl: '/gates', name: 'Gates' },
      ],
      headers: [],
      fieldNames: [],
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
        const fieldNames_ = ['field_name'];

        // разные в зависимости от apiUrl
        data.map((locale) => {
          headers_.push(`${locale.localeDescription} (${locale.code})`);
          fieldNames_.push(locale.code);
        });

        this.setState({
          locales: data,
          headers: headers_,
          fieldNames: fieldNames_,
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
          category: category,
          categoryData: data,
        });
      })
      .catch((error) => ApiError(error));
  };

  // todo
  handleRefresh = (apiUrl) => {
    console.log(`[handleRefresh] ${apiUrl}`);
    handleCategorySelect(apiUrl);
  };

  render() {
    const {
      hasData,
      locales,
      category,
      categoryData,
      categories,
      headers,
      fieldNames
    } = this.state;

    // преобразовать полученные данные для формирования таблицы
    // если для всех категорий будет одна схема, перенести эту функцию в TranslationCategoryTable

    // ??
    // можно ли возвращать редактируемое поле, html реактовый ??
    // if (1) {
      const tableData = categoryData.map((category) => {
        return {
          field_name: category.code,
          en: category.translations[1],
          ru: category.translations[2],
          el: category.translations[3]
        }
      });
    // } else {
    //   const tableData = categoryData.map((category) => {
    //     return {
    //       field_name: category.code,
    //       en: category.translations[1],
    //       ru: category.translations[2],
    //       el: category.translations[3]
    //     }
    //   });
    // }

    const categoriesButtons = categories.map((category) => (
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

        {
          hasData ?
          <div style={{ marginTop: '2em' }} >
            <TranslationCategoryTable
              key={category.id}
              headers={headers}
              data={tableData}
              fieldNames={fieldNames}
              pageCaption={category.name}
              apiUrl={category.apiUrl}
              onRefresh={this.handleRefresh}
            />
          </div>
          :
          <></>
        }
      </div>
    );
  }
}
