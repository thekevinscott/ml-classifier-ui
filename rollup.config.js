// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default {
  entry: './src/index.tsx',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
  plugins: [
    typescript({
    }),
  ],
};
