/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'], // Busca cualquier archivo que termine en .test.ts
  verbose: true, // Muestra el detalle de cada prueba en la terminal
  forceExit: true, // Asegura que Jest se cierre al terminar
  clearMocks: true
};