import { join, resolve } from 'node:path';
import { defineConfig } from 'vite';
import { version } from './package.json';

export default defineConfig((_) => {
  const paths = (() => {
    const root = new URL('.', import.meta.url).pathname;
    return {
      root,
      src: join(root, 'src'),
      out: join(root, 'game', 'script'),
      nodeModules: join(root, 'node_modules'),
    };
  })();

  const defineList = {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VERSION': JSON.stringify(version),
  };

  return {
    build: {
      target: 'es2015',
      lib: {
        entry: resolve(paths.src, 'index.ts'),
        fileName: () => 'bundle.js',
        formats: ['cjs'],
      },
      outDir: paths.out,
      emptyOutDir: false,
    },
    resolve: {
      alias: {
        $types: join(paths.src, 'types'),
        $constants: join(paths.src, 'constants'),
        $assets: join(paths.src, 'assets'),
        $libs: join(paths.src, 'libs'),
        $data: join(paths.src, 'data'),
        $share: join(paths.src, 'modules', '_share'),
        $storybook: join(paths.src, '_storybook'),
      },
    },
    define: {
      ...defineList,
    },
  };
});
