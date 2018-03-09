module.exports = function (w) {

    return {
      files: [
        'tsconfig.json',
        'src/**/*.ts'
      ],

      tests: [
        'test/**/*.test.ts'
      ],

      env: {
        type: 'node',
        runner: 'node'
      },

      compilers: {
        'src/**/*.ts?(x)': w.compilers.typeScript({ module: 'es2015' }),
        'test/**/*.ts?(x)': w.compilers.typeScript({ module: 'es2015' })
      },
      preprocessors: {
        '**/*.js': file => require('babel-core').transform(
          file.content,
          { sourceMap: true, plugins: ['transform-es2015-modules-commonjs'] })
      },

      testFramework: 'jest',

      debug: true
    };
  };
