import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: './index.ts',
    app: './src/app.ts',
  },
  outDir: 'dist',
  format: ['esm'],
  dts: false,
  sourcemap: true,
  clean: true,
});
