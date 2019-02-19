module.exports = {
  entry: ['regenerator-runtime/runtime', './src/index.js'],
  output: {
    filename: 'prismic-toolbar.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
};
