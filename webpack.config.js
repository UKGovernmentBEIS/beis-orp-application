const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function (options) {
  return {
    ...options,
    entry: {
      main: options.entry,
      'assets/client': 'src/client/main.ts',
      'assets/client-ie8': 'src/client/main-ie8.ts',
    },
    devtool: 'source-map',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          include: /client.*/,
        }),
        new CssMinimizerPlugin(),
      ],
    },
    externals: [
      nodeExternals({
        allowlist: ['html5shiv', 'jquery', 'jquery-ui', 'govuk-frontend'],
      }),
    ],
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.ts$/i,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: false,
                configFile: 'tsconfig.build.json',
                getCustomTransformers: (program) => ({
                  before: [
                    require('@nestjs/swagger/plugin').before({}, program),
                  ],
                }),
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { url: false } },
            'sass-loader',
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/fonts/',
              },
            },
          ],
        },
        {
          test: /\.(png|jp(e)?g)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/images/',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      ...options.plugins,
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new CopyPlugin({
        patterns: [
          { from: 'node_modules/govuk-frontend/govuk/assets', to: 'assets' },
          { from: 'src/client/assets', to: 'assets' },
          { from: 'src/client/swagger.css', to: 'assets' },
        ],
      }),
    ],
  };
};
