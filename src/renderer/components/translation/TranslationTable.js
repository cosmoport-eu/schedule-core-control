import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag, Intent } from '@blueprintjs/core';

import TextEditor from './TextEditor';

export default class TranslationTable extends Component {
  static propTypes = {
    translations: PropTypes.arrayOf(
      PropTypes.shape({
        i18nId: PropTypes.number,
        id: PropTypes.number,
        localeId: PropTypes.number,
        text: PropTypes.string,
        i18n: PropTypes.shape({
          description: PropTypes.string,
          external: PropTypes.bool,
          id: PropTypes.number,
          params: PropTypes.string,
          tag: PropTypes.string,
        }),
      }),
    ),
    onTextChange: PropTypes.func,
  };

  static defaultProps = {
    translations: {},
    onTextChange: () => {},
  };

  onSaveOk = () => {
    console.log('ok');
  };

  onSaveFail = () => {
    console.log('not ok');
  };

  handleTextChange = (id, value, oldValue) => {
    if (value === oldValue) {
      return;
    }

    this.props.onTextChange(id, value, this.onSaveOk, this.onSaveFail);
  };

  render() {
    const { translations } = this.props;

    const records = translations.map((record) => (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>
          <TextEditor
            id={record.id}
            text={record.text}
            onConfirm={this.handleTextChange}
          />
        </td>
        <td>{record.i18n ? record.i18n.description : null}</td>
        <td>
          {record.i18n && record.i18n.tag ? (
            <Tag className="bp5-minimal">{record.i18n.tag}</Tag>
          ) : null}
          {record.i18n && record.i18n.params ? (
            <Tag intent={Intent.WARNING} className="bp5-minimal">
              {record.i18n.params}
            </Tag>
          ) : null}
          {record.i18n && record.i18n.external ? (
            <Tag className="bp5-minimal">external</Tag>
          ) : null}
        </td>
      </tr>
    ));

    if (translations.length < 1) {
      return (
        <div>
          <p>&nbsp;</p>
          <div className="bp5-callout">
            Select any locale up above or create new.
          </div>
        </div>
      );
    }

    return (
      <div>
        <table className="bp5-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Text</th>
              <th>Description</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>{records}</tbody>
        </table>
      </div>
    );
  }
}
