module.exports = {
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/', // 👈 faz o Jest transformar o axios também
  ],
};
