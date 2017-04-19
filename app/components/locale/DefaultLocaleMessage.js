
const DefaultLocaleMessage = (locales) => {
  if (locales.length < 1) {
    return '';
  }

  let defaultLocale = false;
  const rest = [];
  locales.forEach(locale => {
    if (locale.defaultLocale) {
      defaultLocale = locale;
    } else {
      rest.push(locale);
    }
  });

  let restText = '';
  let sep = '';
  rest.forEach(locale => {
    restText += `${sep}${locale.code} (${locale.localeDescription})`;
    sep = ', ';
  });

  return `Default locale is ${defaultLocale.code} (${defaultLocale.localeDescription}) and the rest are ${restText}.`;
};

export default DefaultLocaleMessage;
