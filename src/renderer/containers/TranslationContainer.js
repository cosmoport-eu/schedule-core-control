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
        apiUrl: {
          get: 'unknown',
          create: 'unknown',
          delete: 'unknown',
        }
      },
      currentCategoryData: [],
      buttonLinks: [
        {
          id: 1,
          apiUrl: {
            get: '/dictionary/states',
            create: 'create',
            delete: '/t_events/states', // пока нет апи
          },
          name: 'States'
        },
        {
          id: 2,
          apiUrl: {
            get: '/dictionary/statuses',
            create: 'create',
            delete: '/t_events/statuses', // пока нет апи
          },
          name: 'Statuses'
        },
        {
          id: 3,
          apiUrl: {
            get: '/dictionary/categories',
            create: 'create',
            delete: '/t_events/categories', // пока нет апи
          },
          name: 'Categories'
        },
        {
          id: 4,
          apiUrl: {
            get: '/dictionary/types',
            create: 'create', // создание типов в отдельном разделе, слишком много полей для этого раздела
            delete: '/t_events/types', // пока нет апи
          },
          name: 'Types'
        },
        {
          id: 5,
          apiUrl: {
            get: '/facility/all',
            create: '/facility?localeId=1',
            delete: '/facility',
          },
          name: 'Facilities'
        },
        {
          id: 6,
          apiUrl: {
            get: '/material/all',
            create: '/material?localeId=1',
            delete: '/material',
          },
          name: 'Materials'
        },
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
        headers_.push('Opt');

        this.setState({
          locales: data,
          headers: headers_,
        });
      })
      .catch((error) => ApiError(error));
  };

  handleRefresh = () => {
    console.log('handleRefresh');
  }

  handleCategorySelect = (category) => {
    this.props.api
      .get(category.apiUrl.get)
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
    const valueObject = { text: value };

    this.props.api
      .updateTranslationTextForId(id, valueObject)
      .then(() => {
        Message.show('Translation updated');
        this.getData();
      })
      .catch((error) => {
        ApiError(error);
      });
  };
  
  handleCreateRecord = (apiUrlCreate, data) => {
    console.log('[handleCreateRecord]');
    console.log(`apiUrlCreate: ${apiUrlCreate}`);
    console.log(data);

    this.props.api
      .post(apiUrlCreate, data)
      .then((response) => {
        Message.show('Record has been created.');

        this.getData();

        return 1;
      })
      .then(() => this.handleRefresh())
      .catch((error) => ApiError(error));
  };
  
  handleDeleteRecord = (apiUrlDelete, data) => {
    console.log('[handleDeleteRecord]');
    console.log(`apiUrlDelete: ${apiUrlDelete}`);
    console.log(data);

    this.props.api
      .delete(`${apiUrlDelete}/${data.id}`)
      .then((result) => {
        Message.show(`Record #${data.id} has been deleted`);

        this.handleRefresh();

        return 1;
      })
      .catch((error) => ApiError(error));
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

    if (currentCategory.apiUrl.get.includes('types')) {
      tableData = tableData.concat(
        currentCategoryData.flatMap(category => [
          {
            id: category.nameCode,
            field_name: category.nameCode,
            translations: category.nameTranslations
          },
          {
            id: category.descCode,
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
        <PageCaption text="Translations" />

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
              onDelete={this.handleDeleteRecord}
              onCreate={this.handleCreateRecord}
              onRefresh={this.handleRefresh}
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
