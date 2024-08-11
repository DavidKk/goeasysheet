import fs from 'fs'
import path from 'path'
import type { Configuration, RuleSetRule, WebpackPluginInstance } from 'webpack'
import { WatchIgnorePlugin, BannerPlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { outDir, rootDir, srcDir } from './constants/conf'
import ClaspWebpackPlugin from './plugins/ClaspWebpackPlugin'

export const Rules: RuleSetRule[] = [
  {
    test: /\.tsx?$/,
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
]

export const Plugins: WebpackPluginInstance[] = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: [outDir],
  }),
  new WatchIgnorePlugin({
    paths: [/\.d\.ts$/],
  }),
  new BannerPlugin({
    banner: fs.readFileSync(path.join(rootDir, 'public/pioneer.gs'), 'utf-8'),
    raw: true, // 保证代码以纯文本形式插入，而不是注释
    entryOnly: true, // 仅在入口文件插入
  }),
  new CopyPlugin({
    // prettier-ignore
    patterns: [
      path.join(rootDir, 'appsscript.json'),
      path.join(rootDir, 'credentials.json'),
      path.join(rootDir, '.clasp.json'),
      path.join(rootDir, '.clasprc.json')
    ],
  }),
  new ClaspWebpackPlugin(),
]

export const Config: Configuration = {
  stats: 'errors-only',
  devtool: false,
  mode: 'production',
  entry: path.join(srcDir, 'index'),
  output: {
    path: outDir,
    filename: '[name].bundle.js',
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(rootDir, './tsconfig.json'),
      }),
    ],
  },
  module: {
    rules: [...Rules],
  },
  plugins: [...Plugins],
}

export default Config
