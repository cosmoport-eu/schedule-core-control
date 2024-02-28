import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EventType from '../../eventType/EventType';
import EventTypePropType from '../../../props/EventTypePropType';

import styles from './EventTypeForm.module.css';
import EventTypeCategoryPropType from '../../../props/EventTypeCategoryPropType';
import { Button, Callout, Classes, Intent, Popover, Section, SectionCard, Tag } from '@blueprintjs/core';
import ListFieldGroup from '../group/ListFieldGroup';
import TextFieldGroup from '../group/TextFieldGroup';
import TextAreaGroup from '../group/TextAreaGroup';
import NumberFieldGroup from '../group/NumberFieldGroup';

const uuid = () => crypto.randomUUID();

const validate_section_name = (s) => 
  s && s.name === '' ? "Name shouldn't be empty." : '';

const validate_section_description = (s) =>
  s && s.description === '' ? "Description shouldn't be empty." : '';

export default class EventTypeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      category_id: 0,
      name: '',
      description: '',
      default_duration: 0,
      default_repeat_interval: 0,
      default_cost: 0,
  
      // to initialize 1 section
      sections: { [uuid()]: { id: 0, pos: 0, name: '', description: '' } },
      section_last_pos: 0,
  
      category_name: '',
      category_color: '#808080',
    };

    // Overrides initial data with passed in parameters
    if (props.eventType !== null) {
      const eventType = props.eventType;
      const etDisplay = props.etDisplay;
      const categoryData = etDisplay.getCategoryById(eventType);
      const sectionsData = {};
      let pos = 0;

      const subtypes = props.subtypes
        .filter((t) => t.parentId === eventType.id)
        .map((t) => {
          sectionsData[uuid()] = {
            id: t.id,
            pos: pos,
            name: etDisplay.getName(t),
            description: etDisplay.getDescription(t),
          };
          pos ++;
        });
      const section_last_pos = subtypes.length;

      this.state = {
        id: eventType.id,
        category_id: eventType.categoryId,
        name: etDisplay.getName(eventType),
        description: etDisplay.getDescription(eventType),
        default_duration: eventType.defaultDuration,
        default_repeat_interval: eventType.defaultRepeatInterval,
        default_cost: eventType.defaultCost,

        sections: sectionsData,
        section_last_pos: section_last_pos,

        category_name: categoryData.name,
        category_color: categoryData.color,
      };
    }

    this.validators = {
      name: () =>
        this.state.name === '' ? "Field name shouldn't be empty." : '',
      category_id: () => (this.state.category_id === 0 ? 'Category is not selected.' : ''),
      sections: () => {
        const s = Object.values(this.state.sections);
        if (s.length === 0) return '';
        return s
          .map((section) => [
            validate_section_name(section),
            validate_section_description(section),
          ])
          .flat()
          .filter((x) => x !== '')
          .join(',');
      },
      category_name: () => (this.state.category_name === '' ? "Category name shouldn't be empty" : ''),
      categoryColor: () => {
        if (this.state.category_color === '') {
          return "Category color shouldn't be empty";
        }
        const hexColorPattern =
          /^#(?:[0-9a-fA-F]{3}){1,2}$|^#(?:[0-9a-fA-F]{4}){1,2}$/;
        if (!hexColorPattern.test(this.state.category_color)) {
          return 'Invalid color format. Color should be in hex format (#RRGGBB, #RGB, #RRGGBBAA, or #RGBA)';
        }
        return '';
      },
    };
  }

  getFormData = () => {
    const subtypes = Object.values(this.state.sections)
      .sort((a, b) => (a.pos < b.pos ? -1 : a.pos > b.pos ? 1 : 0))
      .map((x) => ({ id: x.id, name: x.name, description: x.description }));

    const data = Object.assign(this.state, {
      subTypes: subtypes,
      valid: this.isValid(),
    });

    return data;
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value }, () => {
      const updateData = { localeId: 1, [name]: value };
  
      if (name === 'name' || name === 'description') {
        this.props.onTextChange(this.state.id, updateData);
      }
    });
  };

  handleSectionNameChange = (name_, value) => {
    this.setState((prev) => {
      const { sections, ...rest } = prev;
      sections[name_].name = value;
  
      if (sections[name_].id !== 0) {
        this.props.onTextChange(sections[name_].id, { localeId: 1, name: value });
      }

      return { ...rest, sections };
    });
  };

  handleSectionDescChange = (name_, value) => {
    this.setState((prev) => {
      const { sections, ...rest } = prev;
      sections[name_].description = value;

      if (sections[name_].id !== 0) {
        this.props.onTextChange(sections[name_].id, { localeId: 1, description: value });
      }

      return { ...rest, sections };
    });
  };

  handleAddSection = () => {
    this.setState((prev) => {
      const uid = uuid();
      const { sections, section_last_pos, ...rest } = prev;
      const last_pos = section_last_pos + 1;
      sections[uid] = { id: 0, pos: last_pos, name: '', description: '' };
      return { ...rest, sections, section_last_pos: last_pos };
    });
  };

  handleRemoveSection = (event) => {
    const { id } = event.currentTarget.dataset;
    this.setState((prev) => {
      const { sections, ...rest } = prev;
      this.props.onDelete(sections[id].id);
      delete sections[id];

      return { sections, ...rest };
    });
  };

  handleCategoryCreate = () => {
    this.props.categoryCreateCallback(this.state.category_name, this.state.category_color);
  };

  isValid = () => {
    return !Object.keys(this.validators)
      .filter((v) => !['category_name'].includes(v))
      .some((key) => {
        const v = this.validators[key]();
        v !== '' && console.warn('validator fail', key, v);
        return v !== '';
      });
  };

  render() {
    return (
      <>
        <Callout className={styles.smaller}>
          Fill the fields in English and don&apos;t forget to translate it later
          in the dedicated Translation section.
        </Callout>
        <br />
        <div>
          <ListFieldGroup
            name="category_id"
            caption="Category"
            index={this.state.category_id}
            validator={this.validators.category_id()}
            onChange={this.handleChange}
            rightElement={
              <Popover
                interactionKind="click"
                popoverClassName={Classes.POPOVER_CONTENT_SIZING}
                placement="left"
                content={
                  <>
                    <div style={{ fontWeight: 'bold' }}>Create new category</div>
                    <br />
                    <div>Name</div>
                    <TextFieldGroup
                      name="category_name"
                      value={this.state.category_name}
                      validator={this.validators.category_name()}
                      onChange={this.handleChange}
                      inline
                      noLabel
                      fill
                    />
                    <div style={{ color: this.state.category_color }}>Color</div>
                    <TextFieldGroup
                      name="category_color"
                      value={this.state.category_color}
                      validator={this.validators.categoryColor()}
                      onChange={this.handleChange}
                      inline
                      noLabel
                      fill
                    />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'end',
                        gap: '10px',
                      }}
                    >
                      <Button
                        text="Create"
                        onClick={this.handleCategoryCreate}
                        intent={Intent.PRIMARY}
                        disabled={this.validators.category_name() !== ''}
                      />
                      <Button
                        className={Classes.POPOVER_DISMISS}
                        text="Cancel"
                        onClick={() => {
                          this.setState((prev) => ({ ...prev, category_name: '' }));
                        }}
                      />
                    </div>
                  </>
                }
                renderTarget={({ isOpen, ...targetProps }) => (
                  <Button {...targetProps} icon="add" minimal />
                )}
              />
            }
          >
            {this.props.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </ListFieldGroup>
        </div>
        <TextFieldGroup
          name="name"
          caption="Name"
          value={this.state.name}
          validator={this.validators.name()}
          onChange={this.handleChange}
          inline
          fill
        />
        {Object.keys(this.state.sections).length === 0 && (
          <TextAreaGroup
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
            inline
          />
        )}
        <Section
          className={styles.noSelect}
          compact
          title="Custom event list (aka Lessons)"
          rightElement={<Button minimal icon="add" onClick={this.handleAddSection} />}
        >
          {Object.keys(this.state.sections).map((sid) => {
            const section = this.state.sections[sid];
            const isNameValid = validate_section_name(section);
            const isDescriptionValid = validate_section_description(section);
  
            return (
              <SectionCard key={sid} className={styles.sections}>
                <div className={styles.section}>
                  <div style={{ flex: '1' }}>
                    <TextFieldGroup
                      name={sid}
                      value={section.name}
                      validator={isNameValid}
                      onChange={this.handleSectionNameChange}
                      placeholder="Name"
                      inline
                      noLabel
                      fill
                    />
                    <TextAreaGroup
                      name={sid}
                      value={section.description}
                      validator={isDescriptionValid}
                      onChange={this.handleSectionDescChange}
                      className={styles.noMargin}
                      placeholder="Description"
                      noLabel
                      inline
                    />
                  </div>
                  <Button
                    minimal
                    icon="remove"
                    data-id={sid}
                    onClick={this.handleRemoveSection}
                  />
                </div>
              </SectionCard>
            );
          })}
        </Section>
        <br />
        <NumberFieldGroup
          name="default_duration"
          caption="Duration"
          number={this.state.default_duration}
          onChange={this.handleChange}
          rightElement={<Tag minimal>minutes</Tag>}
          inline
        />
        <NumberFieldGroup
          name="default_repeat_interval"
          caption="Repeat"
          rightElement={<Tag minimal>times</Tag>}
          number={this.state.default_repeat_interval}
          onChange={this.handleChange}
          inline
        />
        <NumberFieldGroup
          name="default_cost"
          caption="Cost"
          number={this.state.default_cost}
          onChange={this.handleChange}
          rightElement={<Tag minimal>Euro</Tag>}
          inline
        />
      </>
    );
  }
}

EventTypeForm.propTypes = {
  eventType: EventTypePropType,
  categories: PropTypes.arrayOf(EventTypeCategoryPropType),
  etDisplay: PropTypes.objectOf(EventType).isRequired,
  categoryCreateCallback: PropTypes.func,
  onTextChange: PropTypes.func,
  onDelete: PropTypes.func,
};

EventTypeForm.defaultProps = {
  eventType: null,
  categories: [],
  categoryCreateCallback: () => {},
  onTextChange: () => {},
  onDelete: () => {},
};
