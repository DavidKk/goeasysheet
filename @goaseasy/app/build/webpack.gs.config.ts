import path from 'path'
import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import ClaspPlugin from './plugins/ClaspWebpackPlugin'
import { srcDir, outDir } from './constants/conf'

/**
 * TS_NODE_PROJECT 用于编译 webpack config 文件
 * 但该参数会影响, 项目中的 tsconfig.json 因此
 * 这里将其删掉
 */
delete process.env.TS_NODE_PROJECT

export const Rules: webpack.RuleSetRule[] = [
  {
    test: /\.tsx?$/,
    loaders: [
      {
        loader: 'es3ify-loader'
      },
      {
        loader: 'ts-loader'
      }
    ]
  }
]

export const Plugins: webpack.Plugin[] = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: [
      outDir
    ]
  }),
  new webpack.WatchIgnorePlugin([
    /\.d\.ts$/
  ]),
  new CopyPlugin([
    {
      from: 'pioneer/*',
      to: '[contenthash].[ext]',
      flatten: true
    },
    'appsscript.json',
    'creds.json',
    '.clasp.json',
    '.clasprc.json'
  ], {
    copyUnmodified: true
  }),
  new ClaspPlugin()
]

export const Config: webpack.Configuration = {
  stats: 'errors-only',
  devtool: false,
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: [
    path.join(srcDir, 'index.ts')
  ],
  output: {
    path: outDir,
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(srcDir, './tsconfig.json')
      })
    ]
  },
  module: {
    rules: [
      ...Rules
    ]
  },
  plugins: [
    ...Plugins
  ]
}

if (process.env.NODE_ENV === 'production') {
  Config.optimization = {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          ie8: true,
          keep_fnames: true
        }
      })
    ]
  }
}

export default Config
