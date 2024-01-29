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

        // жду метод, который вернёт записи с переводами
        { id: 5, apiUrl: '/facility', name: 'Facilities' },
        { id: 6, apiUrl: '/material', name: 'Materials' },
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
        const headers_ = ['ID', 'Value'];
        const fieldNames_ = ['id', 'field_name'];

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
          currentCategory: category,
          currentCategoryData: data,
        });
      })
      .catch((error) => ApiError(error));
  };

  // пока нет api
  handleTextChange = (apiUrl, id, value, oldValue, locale, okCallback, notOkCallback) => {
    console.log(`[handleTextChange] id: ${id}, value: ${value}`);
    const valueObject = { name: value };

    // this.props.api
    // .post(`${apiUrl}/${id}`, valueObject)
    // .then((result) => {
    //   Message.show(`Event category updated`);
    //   // this.getData();
    // })
    // .catch((error) => ApiError(error));

    // this.props.api
    //   .updateTranslationTextForId(id, valueObject)
    //   .then(() =>
    //     Message.show('Translation value has been saved successfully.'),
    //   )
    //   .then(() => this.updateTranslationStateById(id, value))
    //   .then(() => okCallback)
    //   .catch((error) => {
    //     ApiError(error);
    //     notOkCallback();
    //   });
  };

  render() {
    const {
      hasData,
      locales,
      currentCategory,
      currentCategoryData,
      buttonLinks,
      headers,
      fieldNames
    } = this.state;

    let tableData = [];

    if (currentCategory.apiUrl.includes('types')) {
      let nameData = [];
      let descrData = [];

      currentCategoryData.map((category) => {
        nameData.push({
          id: category.id,
          field_name: category.nameCode,
          en: category.nameTranslations[1],
          ru: category.nameTranslations[2],
          el: category.nameTranslations[3]
        })

        descrData.push({
          id: category.id,
          field_name: category.descCode,
          en: category.descTranslations[1],
          ru: category.descTranslations[2],
          el: category.descTranslations[3]
        })
      });
      tableData = nameData.concat(descrData);
    } else if (currentCategory.apiUrl.includes('dictionary')) {
      tableData = currentCategoryData.map((category) => {
        return {
          id: category.id,
          field_name: category.code,
          en: category.translations[1],
          ru: category.translations[2],
          el: category.translations[3]
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

        {
          hasData ?
          <div style={{ marginTop: '2em' }} >
            <TranslationCategoryTable
              key={currentCategory.id}
              headers={headers}
              data={tableData}
              fieldNames={fieldNames}
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
