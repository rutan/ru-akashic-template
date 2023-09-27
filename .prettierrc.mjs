export default {
  printWidth: 120,
  singleQuote: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '\\$types',
    '\\$constants',
    '\\$assets',
    '\\$data',
    '\\$libs',
    '\\$share',
    '^[./]',
  ],
  importOrderSeparation: false,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
