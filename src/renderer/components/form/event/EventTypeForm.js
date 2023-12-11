import React, { useState, useImperativeHandle } from 'react';

import {
  Button,
  Callout,
  Classes,
  Popover,
  Tag,
  Section,
  SectionCard,
  Intent,
} from '@blueprintjs/core';
import { Translate } from '@blueprintjs/icons';

import TextFieldGroup from '../group/TextFieldGroup';
import NumberFieldGroup from '../group/NumberFieldGroup';
import ListFieldGroup from '../group/ListFieldGroup';
import TextAreaGroup from '../group/TextAreaGroup';

import styles from './EventTypeForm.module.css';

const uuid = () => crypto.randomUUID();

function EventTypeForm(
  { categories = [], categoryCreateCallback = (name) => {} },
  ref,
) {
  const [
    {
      category_id,
      name,
      description,
      default_cost,
      default_duration,
      default_repeat_interval,
      sections,
      section_last_pos,
      category_name,
    },
    setState,
  ] = useState({
    category_id: 0,
    name: '',
    description: '',
    default_duration: 0,
    default_repeat_interval: 0,
    default_cost: 0,

    // the initial 1 section
    sections: { [uuid()]: { pos: 0, name: '', description: '' } },
    section_last_pos: 0,

    category_name: '',
  });

  const validate_section_name = (s) =>
    s && s.name === '' ? "Name shouldn't be empty." : '';
  const validate_section_description = (s) =>
    s && s.description === '' ? "Description shouldn't be empty." : '';

  const validators = {
    name: () =>
      name === '' ? "Field name/subcategory shouldn't be empty." : '',
    category_id: () => (category_id === 0 ? 'Category is not selected.' : ''),
    sections: () => {
      const s = Object.values(sections);
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
    category_name: () => (category_name === '' ? "It shouldn't be empty" : ''),
  };

  /**
   * Returns all form validators' call result.
   * It will return false on a first validation with a negative result (which has a message).
   *
   * @return {boolean} The result of validation.
   * @since 0.1.0
   */
  const isValid = () => {
    return !Object.keys(validators)
      // skip
      .filter((v) => !['category_name'].includes(v))
      .some((key) => {
        const v = validators[key]();
        v !== '' && console.warn('validator fail', key, v);
        return v !== '';
      });
  };

  useImperativeHandle(ref, () => ({
    /**
     * Returns all form's field mapped values.
     *
     * @return {Object} The form field values.
     * @since 0.1.0
     */
    getFormData() {
      // transform sections
      const subtypes = Object.values(sections)
        .sort((a, b) => (a.pos < b.pos ? -1 : a.pos > b.pos ? 1 : 0))
        .map((x) => ({ name: x.name, description: x.description }));

      return {
        ...{
          category_id,
          name,
          description,
          default_cost,
          default_duration,
          default_repeat_interval,
          subtypes,
        },
        valid: isValid(),
      };
    },
  }));

  /**
   * Handles a component's value change.
   *
   * @since 0.1.0
   */
  const handleChange = (name_, value) => {
    setState((prevState) => ({ ...prevState, [name_]: value }));
  };

  const handleSectionNameChange = (name_, value) => {
    setState((prev) => {
      const { sections, ...rest } = prev;
      sections[name_].name = value;
      return { ...rest, sections };
    });
  };

  const handleSectionDescChange = (name_, value) => {
    setState((prev) => {
      const { sections, ...rest } = prev;
      sections[name_].description = value;
      return { ...rest, sections };
    });
  };

  const handleAddEvent = () => {
    setState((prev) => {
      const uid = uuid();
      const { sections, section_last_pos, ...rest } = prev;
      const last_pos = section_last_pos + 1;
      sections[uid] = { pos: last_pos, name: '', description: '' };
      return { ...rest, sections, section_last_pos: last_pos };
    });
  };

  const handleRemoveEvent = (event) => {
    const { id } = event.currentTarget.dataset;
    setState((prev) => {
      const { sections, ...rest } = prev;
      delete sections[id];
      return { sections, ...rest };
    });
  };

  const handleCategoryCreate = () => {
    categoryCreateCallback(category_name);
  };

  return (
    <>
      <Callout className={styles.smaller}>
        Fill the fields in English and don&apos;t forget to translate it later
        in the dedicated translation interface of the application (
        <Translate size={14} />
        ).
        <br />
        Empty custom event list allows adding event type with a name and
        description, otherwise multiple event types will be created with the
        name as their subcategory.
      </Callout>
      <br />
      <div>
        <ListFieldGroup
          name="category_id"
          caption="Category"
          index={category_id}
          validator={validators.category_id()}
          onChange={handleChange}
          rightElement={
            <Popover
              interactionKind="click"
              popoverClassName={Classes.POPOVER_CONTENT_SIZING}
              placement="left"
              content={
                <>
                  <div style={{ fontWeight: 'bold' }}>Create new category</div>
                  <br />
                  <TextFieldGroup
                    name="category_name"
                    value={category_name}
                    validator={validators.category_name()}
                    onChange={handleChange}
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
                      onClick={handleCategoryCreate}
                      intent={Intent.PRIMARY}
                      disabled={validators.category_name() !== ''}
                    />
                    <Button
                      className={Classes.POPOVER_DISMISS}
                      text="Cancel"
                      onClick={() => {
                        setState((prev) => ({ ...prev, category_name: '' }));
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
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </ListFieldGroup>
      </div>
      <TextFieldGroup
        name="name"
        caption="Name (sub)"
        value={name}
        validator={validators.name()}
        onChange={handleChange}
        inline
        fill
      />
      {Object.keys(sections).length === 0 && (
        <TextAreaGroup
          name="description"
          value={description}
          onChange={handleChange}
          inline
        />
      )}
      <Section
        className={styles.noSelect}
        compact
        title="Custom event list (aka Lessons)"
        rightElement={<Button minimal icon="add" onClick={handleAddEvent} />}
      >
        {Object.keys(sections).map((sid) => {
          const section = sections[sid];
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
                    onChange={handleSectionNameChange}
                    placeholder="Name"
                    inline
                    noLabel
                    fill
                  />
                  <TextAreaGroup
                    name={sid}
                    value={section.description}
                    validator={isDescriptionValid}
                    onChange={handleSectionDescChange}
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
                  onClick={handleRemoveEvent}
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
        number={default_duration}
        onChange={handleChange}
        rightElement={<Tag minimal>minutes</Tag>}
        inline
      />
      <NumberFieldGroup
        name="default_repeat_interval"
        caption="Repeat"
        rightElement={<Tag minimal>times</Tag>}
        number={default_repeat_interval}
        onChange={handleChange}
        inline
      />
      <NumberFieldGroup
        name="default_cost"
        caption="Cost"
        number={default_cost}
        onChange={handleChange}
        rightElement={<Tag minimal>Euro</Tag>}
        inline
      />
    </>
  );
}

export default React.forwardRef(EventTypeForm);
