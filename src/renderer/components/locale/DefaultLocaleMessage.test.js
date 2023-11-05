import DefaultLocaleMessage from './DefaultLocaleMessage';

test('renders text with a default locale', () => {
  const def = DefaultLocaleMessage([
    { code: 'aa', localeDescription: 'aa', defaultLocale: false },
    { code: 'bb', localeDescription: 'bb', defaultLocale: true }
  ]);
  expect(def).toBe('Default locale is bb (bb) and the rest are aa (aa).');
});
