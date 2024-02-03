export default class L18n {
  constructor(translations) {
    // все переводы в выбранной локали в формате code: text
    this.translations = translations;
  }

  findByCode(code) {
    return this.translations[code];
  }
}
