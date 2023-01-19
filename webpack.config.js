module.exports = {
  entry: './docs/demo.ts',
  mode: 'development',
  target: 'web',
  output: {
    path: `${__dirname}/docs/`,
    filename: 'demo.bundle.js'
  },
  devServer: {
    port: 4200,
    static: {
      directory: `${__dirname}/docs`,
    },
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
