const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  entry: './docs/demo.ts',
  mode: 'development',
  target: 'web',
  output: {
    path: `${__dirname}/docs/`,
    filename: 'demo.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig-demo.json'
        }
      }
    ]
  }
}
