const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './demo/index.ts',
  output: {
    path: path.resolve('./demo/build'),
    filename: 'demo.bundle.js'
  },
  resolve: {
    fallback: { buffer: false, process: false, path: false },
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
