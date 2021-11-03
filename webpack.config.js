const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const git = require('git-rev-sync');
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

const gitCommitId = (() => {
  try {
    return git.short();
  } catch (_) {
    return '-';
  }
})();

const isProduction = process.env.NODE_ENV === 'production';
const packageJSON = JSON.parse(fs.readFileSync(path.join(paths.root, 'package.json')));
const header = [
  `/*! ${packageJSON.name} v.${packageJSON.version}(${isProduction ? gitCommitId : 'development'}) */`,
].join('\n');

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
      '@': paths.src
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        include: paths.src,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    safari: '10',
                  },
                },
              ],
              '@babel/preset-typescript',
            ],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        type: 'json',
        test: /\.ya?ml$/,
        include: paths.src,
        use: 'yaml-loader',
      },
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.DefinePlugin(defineList),
    new webpack.BannerPlugin({
      banner: header,
      raw: true,
      entryOnly: true,
    }),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
