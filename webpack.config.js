import path from 'path'
import webpack from 'webpack'

import ClientConfig from './app/config/ClientConfig'
const WebpackConfig = {
  devtools: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    path.join(ClientConfig.Path.BASE, 'Client.js')
  ],
  output: {
    path: ClientConfig.URL.BASE,
    publicPath: ClientConfig.URL.BASE,
    filename: 'bundle.min.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
    ),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  },
  resolve: {
    extensions: ['', 'webpack.js', 'web.js', '.js'],
    modulesDirectories: ['node_modules', 'bower_components']
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
}

export default WebpackConfig
