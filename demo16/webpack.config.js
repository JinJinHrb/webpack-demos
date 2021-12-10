// const WebpackShellPluginNext = require('webpack-shell-plugin-next');
// const CustomLogin = require('./plugin/CustomPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
          }
        }
      },
    ]
  },
  plugins: [
    // new CustomLogin(),
    new HtmlWebpackPlugin({
        templateContent: `
            <html>
            <body>
                <div id="app"></div>
            </body>
            </html>
        `
    })
  ]
}