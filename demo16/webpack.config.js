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
//<head>
    //<base href="http://localhost:3000/"></base>
    //<title>demo16</title>
//</head>
        templateContent: `
<html>
    <title>demo16</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv='cache-control' content='no-cache'>
    <meta http-equiv='expires' content='0'>
    <meta http-equiv='pragma' content='no-cache'>
<body>
    <div id="app"></div>
</body>
</html>
        `
    }),

    new SetScriptTimestampPlugin({
        author: 'wangfan',
        indexTargetPath: '/Users/alexwang/Documents/workspace/github2/webpack-demos-wf/demo16/dist2/index.html',
        uploadUrl: 'http://localhost:8889/test_parseMultipartRequest',
        baseUrl: 'https://foo.com/',
        password: '',
        ossKey: ''
    })
  ]

}