// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

export default {
  entry: './src/index.ts',
  output: {
    name: 'MLClassifierUI',
    file: './dist/index.js',
    format: 'umd',
  },
  plugins: [
    typescript({
    }),
    postcss({
      plugins: [],
    }),
  ],
};
