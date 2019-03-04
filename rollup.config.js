/* globals Promise */
import path from 'path';
import sass from 'node-sass';
import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss-modules';
import image from 'rollup-plugin-image';
import autoprefixer from 'autoprefixer';

export default {
  input: './src/index.ts',
  output: {
    moduleName: 'MLClassifierUI',
    name: 'MLClassifierUI',
    file: './dist/index.js',
    format: 'es',
  },
  plugins: [
    typescript({
      typescript: require("typescript"),
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    postcss({
      preprocessor: (content, id) => new Promise(resolve => {
        const result = sass.renderSync({ file: id });
        resolve({ code: result.css.toString() });
      }),
      extract: true,
      plugins: [autoprefixer()],
      // sometimes this writes out blank definitions
      writeDefinitions: false,
      modules: true,
      extensions: [
        '.css',
        '.scss',
      ],
      use: [
        [
          'sass',
          {
            includePaths: [
              path.resolve('node_modules'),
            ],
          },
        ],
      ],
    }),
    image(),
  ],
};
