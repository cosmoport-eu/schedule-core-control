export default class LocaleMapper {
  static map = (object) => ({
    code: object.code,
    isDefault: object.default,
    id: object.id,
    localeDescription: object.localeDescription,
    show: object.show,
    showTime: object.showTime,
  });

  static unmap = (object) => ({
    code: object.code,
    isDefault: object.is_default,
    id: object.id,
    localeDescription: object.locale_description,
    show: object.show,
    showTime: object.show_time,
  });
}
