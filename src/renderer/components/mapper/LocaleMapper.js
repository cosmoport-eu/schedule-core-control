export default class LocaleMapper {
  static map = (object) => ({
    code: object.code,
    is_default: object.default,
    id: object.id,
    locale_description: object.localeDescription,
    show: object.show,
    show_time: object.showTime,
  });

  static unmap = (object) => ({
    code: object.code,
    default: object.is_default,
    id: object.id,
    localeDescription: object.locale_description,
    show: object.show,
    showTime: object.show_time,
  });
}
