import { resolve } from 'node:path';
import path from 'path';
import { defineConfig } from 'vite';
import { version } from './package.json';

export default defineConfig(({}) => {
  const paths = (() => {
    const root = new URL('.', import.meta.url).pathname;
    return {
      root,
      src: path.join(root, 'src'),
      out: path.join(root, 'game', 'script'),
      nodeModules: path.join(root, 'node_modules'),
    };
  })();

  const defineList = {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VERSION': JSON.stringify(version),
  };

  return {
    build: {
      lib: {
        entry: resolve(paths.src, 'index.ts'),
        fileName: 'bundle',
        formats: ['cjs'],
      },
      outDir: paths.out,
      emptyOutDir: false,
    },
    resolve: {
      alias: {
        $types: path.join(paths.src, 'types'),
        $constants: path.join(paths.src, 'constants'),
        $assets: path.join(paths.src, 'assets'),
        $libs: path.join(paths.src, 'libs'),
        $data: path.join(paths.src, 'data'),
        $share: path.join(paths.src, 'modules', '_share'),
        $storybook: path.join(paths.src, '_storybook'),
      },
    },
    define: {
      ...defineList,
    },
  };
});
