module.exports = {
  entry: `${__dirname}/src/demo/index.ts`,
  mode: 'development',
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: `${__dirname}/docs/`,
    filename: 'demo.bundle.js'
  },
  devServer: {
    port: 4200,
    static: {
      directory: `${__dirname}/docs`
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
