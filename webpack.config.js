const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const paths = (() => {
  const root = __dirname;
  return {
    root,
    src: path.join(root, 'src'),
    out: path.join(root, 'game', 'script'),
    nodeModules: path.join(root, 'node_modules'),
  };
})();

const isProduction = process.env.NODE_ENV === 'production';
const packageJSON = JSON.parse(fs.readFileSync(path.join(paths.root, 'package.json')));
const header = [`/*! ${packageJSON.name} v.${packageJSON.version} */`].join('\n');
const isAnalyze = String(process.env.IS_ANALYZE || '0') !== '0';

const defineList = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  'process.env.VERSION': JSON.stringify(packageJSON.version),
};
console.log(defineList);

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    bundle: [path.join(paths.src, 'index.ts')],
  },
  output: {
    libraryTarget: 'commonjs',
    path: paths.out,
    publicPath: '.',
    filename: '[name].js',
  },
  devtool: isProduction ? false : 'eval-cheap-module-source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      $types: path.join(paths.src, 'types'),
      $constants: path.join(paths.src, 'constants'),
      $assets: path.join(paths.src, 'assets'),
      $libs: path.join(paths.src, 'libs'),
      $data: path.join(paths.src, 'data'),
      $share: path.join(paths.src, 'modules', '_share'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        include: paths.src,
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'ts',
            target: 'es2015',
          },
        },
      },
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin(defineList),
    new webpack.BannerPlugin({
      banner: header,
      raw: true,
      entryOnly: true,
    }),
    isAnalyze ? new BundleAnalyzerPlugin() : null,
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
