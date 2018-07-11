/* globals Promise */
import path from 'path';
import sass from 'node-sass';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss-modules';
import image from 'rollup-plugin-image';
import autoprefixer from 'autoprefixer';

export default {
  input: './src/index.ts',
  output: {
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    name: 'MLClassifierUI',
    file: './dist/index.js',
    format: 'umd',
  },
  plugins: [
    image(),
    postcss({
      preprocessor: (content, id) => new Promise(resolve => {
        const result = sass.renderSync({ file: id });
        resolve({ code: result.css.toString() });
      }),
      extract: true,
      plugins: [autoprefixer()],
      writeDefinitions: true,
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
    typescript({
    }),
  ],
};
