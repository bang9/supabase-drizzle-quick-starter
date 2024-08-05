import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm'],
  dts: true,
  external: [/^\$/],
  platform: 'node',
  clean: true,
});
