const path = require('path');

module.exports = {
  entry: {
    main: './src/main.ts',
    example_scd30: './src/example_scd30.ts'
  },
  target: 'node',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[name].js.map'
  },
};