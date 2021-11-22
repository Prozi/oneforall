const path = `${__dirname}/dist/demo/`;

module.exports = {
  entry: "./docs/demo.ts",
  mode: "development",
  target: "web",
  output: {
    path,
    filename: "demo.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ]
  }
};
