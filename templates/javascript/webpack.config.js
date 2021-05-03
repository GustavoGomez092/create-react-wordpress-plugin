const webpack = require('webpack')
const path = require('path')
const buildFolder = path.resolve(__dirname, './dist')
const port = 3000

// Building for development
if (process.env.NODE_ENV !== 'production') {
  //  console.log('Building for development')

  module.exports = {
    entry: {
      main: [
        'webpack-dev-server/client?http://localhost:' + port,
        './src/index'
      ]
    },
    mode: 'development',
    externals: {
      // Use external version of React & ReactDOM via WordPress
      react: 'React',
      'react-dom': 'ReactDOM'
    },
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    output: {
      path: buildFolder,
      filename: '[name].js',
      publicPath: 'http://localhost:' + port + '/assets/'
    },
    module: {
      rules: [
        {
          test: /\.(jpg|png)$/i,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.(scss|css|less)$/,
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader' // translates CSS into CommonJS
          }, {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                strictMath: true
              }
            }
          }, {
            loader: 'sass-loader' // compiles sass to CSS
          }]
        }
      ]
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ],

    devServer: {
      host: 'localhost',
      disableHostCheck: true,
      port: port,
      historyApiFallback: true,
      hot: true,
      inline: true,
      headers: { 'Access-Control-Allow-Origin': '*' }
    },

    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom'
      }
    }
  }
}

// Building for production
if (process.env.NODE_ENV === 'production') {
  //  console.log('Building for production')

  module.exports = {
    entry: {
      main: ['./src/index']
    },
    mode: 'production',
    externals: {
      // Use external version of React & ReactDOM via WordPress
      react: 'React',
      'react-dom': 'ReactDOM'
    },
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    output: {
      path: buildFolder,
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.(jpg|png)$/i,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.(scss|css|less)$/,
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader' // translates CSS into CommonJS
          }, {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                strictMath: true
              }
            }
          }, {
            loader: 'sass-loader' // compiles sass to CSS
          }]
        }
      ]
    }
  }
}
