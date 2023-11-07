import DefaultLocaleMessage from './DefaultLocaleMessage';

test('renders text with a default locale', () => {
  const def = DefaultLocaleMessage([
    { code: 'aa', localeDescription: 'aa', default: false },
    { code: 'bb', localeDescription: 'bb', default: true },
  ]);
  expect(def).toBe('Default locale is bb (bb) and the rest are aa (aa).');
});
