const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './docs/demo.ts',
  output: {
    path: path.resolve('./docs'),
    filename: 'demo.bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  },
  devServer: {
    contentBase: path.resolve('./docs'),
    filename: 'demo.bundle.js',
    compress: false,
    port: 4200
  }
}
