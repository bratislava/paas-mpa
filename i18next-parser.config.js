module.exports = {
  locales: ['sk', 'en'],
  input: '(app|components|hooks|state|utils|modules)/**/*.{tsx,ts}',
  output: './translations/$LOCALE.json',
  // if set to true preserves old values in a separate json file
  createOldCatalogs: false,
  sort: true,
  // makes the translation json file flat
  keySeparator: false,
}
