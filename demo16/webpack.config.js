// const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const SetScriptTimestampPlugin = require('./plugin/SetScriptTimestampPlugin')
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
    new HtmlWebpackPlugin({
        templateContent: `
<html>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv='cache-control' content='no-cache'>
    <meta http-equiv='expires' content='0'>
    <meta http-equiv='pragma' content='no-cache'>
    <title>demo16</title>
    <!--SetScriptTimestampPlugin inset script-->
<body>
    <div id="app"></div>
</body>
</html>
        `
    }),
    new SetScriptTimestampPlugin()
  ]
}