export default [
  {
    ignores: ['node_modules', '.next', 'dist', 'build', 'coverage'],
  },
  {
    files: ['**/*.{ts,tsx,js}'],
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
    },
  },
];
