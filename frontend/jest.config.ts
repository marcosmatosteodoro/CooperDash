// jest.config.ts
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './', // raiz do projeto
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1', // se você usa aliases
  },
}

export default createJestConfig(customJestConfig)
