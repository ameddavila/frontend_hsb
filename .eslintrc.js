module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020, // Soporta características modernas de JS
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      project: './tsconfig.json', // Apunta a tu tsconfig
    },
    plugins: [
      '@typescript-eslint',
      'react'
    ],
    extends: [
      'eslint:recommended',                  // Reglas básicas de ESLint
      'plugin:react/recommended',            // Reglas recomendadas para React
      'plugin:@typescript-eslint/recommended', // Reglas recomendadas para TS
      'next/core-web-vitals'                 // Reglas recomendadas de Next.js
    ],
    rules: {
      // Personaliza o desactiva reglas según tus necesidades:
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true }
      ],
      // Evitar advertencias si usas `router.push()` sin await:
      '@typescript-eslint/no-floating-promises': 'off',
  
      // Si usas React 17+ y Next.js, no necesitas 'react/react-in-jsx-scope':
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect', // Detecta automáticamente la versión de React
      },
    },
  };
  