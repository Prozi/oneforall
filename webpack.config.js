module.exports = {
  entry: `${__dirname}/src/demo/index.ts`,
  mode: 'development',
  target: 'web',
  devtool: false,
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: `${__dirname}/docs/demo/`,
    filename: 'demo.bundle.js'
  },
  devServer: {
    port: 3000,
    static: {
      directory: `${__dirname}/demo`
    }
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
};
