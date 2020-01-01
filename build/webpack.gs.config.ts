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
    loader: 'ts-loader'
  },
  {
    test: /\.html$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          // 5.0之后默认开启
          esModule: false
        }
      },
      {
        loader: 'extract-loader'
      },
      {
        loader: 'html-loader',
        options: {
          interpolate: true,
          attrs: ['link:href', 'script:src']
        }
      }
    ]
  },
  {
    test: /component\/.+?\/view\/.+?\.tsx?$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[contenthash].html'
        }
      },
      {
        loader: 'ts-loader'
      }
    ]
  },
  {
    test: /\.s[ac]ss$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[contenthash].html'
        }
      },
      {
        loader: 'extract-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('autoprefixer')
          ]
        }
      },
      {
        loader: 'sass-loader',
        options: {
          prependData: '@import "styles/bootstrap.scss";'
        }
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
      from: 'src/pioneer/*',
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
  mode: 'production',
  devtool: 'cheap-source-map',
  entry: [
    path.join(srcDir, 'index.ts')
  ],
  output: {
    path: outDir,
    filename: '[name].bundle.js',
    libraryTarget: 'var',
    library: 'Bootstrap'
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
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          ie8: true,
          keep_fnames: true
        }
      })
    ]
  },
  plugins: [
    ...Plugins
  ]
}

export default Config
