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
        is_deletable: true,
        is_creatable: true,
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
          is_deletable: false,
          is_creatable: false,
          apiUrl: {
            get: '/dictionary/states',
            create: '',
            delete: '/t_events/states',
          },
          name: 'States'
        },
        {
          id: 2,
          is_deletable: false,
          is_creatable: false,
          apiUrl: {
            get: '/dictionary/statuses',
            create: '',
            delete: '/t_events/statuses',
          },
          name: 'Statuses'
        },
        {
          id: 3,
          is_deletable: true,
          is_creatable: true,
          apiUrl: {
            get: '/dictionary/categories?isActive=true',
            create: '/category',
            delete: '/category',
          },
          name: 'Categories'
        },
        {
          id: 4,
          is_deletable: false,
          is_creatable: false,
          apiUrl: {
            get: '/dictionary/types?isActive=true',
            // работа с типами в отдельном разделе
            create: '',
            delete: '',
          },
          name: 'Types'
        },
        {
          id: 5,
          is_deletable: true,
          is_creatable: true,
          apiUrl: {
            get: '/facility/all?isActive=true',
            create: '/facility?localeId=1',
            delete: '/facility',
          },
          name: 'Facilities'
        },
        {
          id: 6,
          is_deletable: true,
          is_creatable: true,
          apiUrl: {
            get: '/material/all?isActive=true',
            create: '/material?localeId=1',
            delete: '/material',
          },
          name: 'Materials'
        },
        {
          id: 7,
          is_deletable: true,
          is_creatable: true,
          apiUrl: {
            get: '/gates?isActive=true',
            create: '/gates',
            delete: '/gates',
          },
          name: 'Gates'
        },
        {
          id: 8,
          is_deletable: false,
          is_creatable: false,
          apiUrl: {
            get: '/translations/external',
            create: '',
            delete: '',
          },
          name: 'UI elements'
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
    if (this.state.currentCategory.id !== 0) {
      this.handleCategorySelect(this.state.currentCategory);
    }
    this.props.onRefresh();
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

  handleTextChange = (id, value, apiUrl, okCallback, notOkCallback) => {
    const valueObject = apiUrl === '/translations/external' ? { id, text: value } : value;

    const apiCall = apiUrl === '/translations/external' ?
      this.props.api.post(apiUrl, valueObject) :
      this.props.api.updateTranslationTextForId(id, valueObject);
  
    apiCall
      .then(() => {
        Message.show('Translation updated');
        this.getData();
        if (okCallback) okCallback();
      })
      .catch((error) => {
        ApiError(error);
        if (notOkCallback) notOkCallback();
      });
  };
  
  handleCreateRecord = (apiUrlCreate, data) => {
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
  
  handleDeleteRecord = async (apiUrlDelete, data) => {
    try {
      await this.props.api.delete(`${apiUrlDelete}/${data.id}`);
      Message.show(`Record #${data.id} has been deleted`);
  
      if (apiUrlDelete === '/category') {
        await this.removeConnectedTypes(data.id);
      }
  
      this.handleRefresh();
  
      return 1;
    } catch (error) {
      ApiError(error);
    }
  };
  
  removeConnectedTypes = async (categoryId) => {
    try {
      const result = await this.props.api.get('/t_events/types?isActive=true');
      const typesToDelete = result.filter((t) => t.categoryId === categoryId);
  
      for (const typeToDelete of typesToDelete) {
        await this.removeRecord(`/t_events/type/${typeToDelete.id}`);
      }
  
      Message.show('Connected types put in archive');
    } catch (error) {
      ApiError(error);
    }
  };
  
  removeRecord = async (apiUrl) => {
    try {
      await this.props.api.delete(apiUrl);
    } catch (error) {
      ApiError(error);
    }
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
    } else if (currentCategory.apiUrl.get.includes('external')) {
      const groupByCode = (data) => {
        return Object.values(
          data.reduce((acc, item) => {
            acc[item.code] = acc[item.code] || {
              field_name: item.code,
              translations: [],
            };
      
            acc[item.code].translations.push({
              id: item.id,
              localeId: item.localeId,
              text: item.text,
            });
      
            return acc;
          }, {})
        );
      };

      tableData = groupByCode(currentCategoryData);
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
              is_deletable={currentCategory.is_deletable}
              is_creatable={currentCategory.is_creatable}
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
