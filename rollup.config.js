// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default {
  entry: './src/index.tsx',
  output: {
    name: 'MLClassifierUI',
    file: './dist/index.js',
    format: 'iife',
  },
  plugins: [
    typescript({

    }),
  ],
};
