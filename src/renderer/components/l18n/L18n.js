export default class L18n {
  constructor(locale, refs) {
    this.locale = locale;
    this.refs = refs;
  }

  findEventRefByEventTypeId(eventTypeId) {
    return this.findEventById(eventTypeId, 'types');
  }

  findEventRefByEventStatusId(eventStatusId) {
    return this.findEventById(eventStatusId, 'statuses');
  }

  findEventRefByEventStateId(eventStateId) {
    return this.findEventById(eventStateId, 'states');
  }

  findEventById = (id, property) =>
    this.refs[property].find((el) => el.id === id) || false;

  findTranslationById(ref, name) {
    if (ref === undefined || this.locale === undefined) return '';
    const data = this.locale[ref[name]];
    return ref && data ? data.values[0] : '';
  }
}
