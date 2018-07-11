// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss-modules';
import autoprefixer from 'autoprefixer';

export default {
  entry: './src/index.tsx',
  output: {
    name: 'MLClassifierUI',
    file: './index.js',
    format: 'umd',
  },
  plugins: [
    postcss({
      extract: true,
      plugins: [autoprefixer()],
      writeDefinitions: true,
      modules: true,
    }),
    typescript({
    }),
  ],
};
