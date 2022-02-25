const webpack = require('webpack')
const dotenv = require('dotenv')

dotenv.config();

module.exports = {
  stats: {
    warnings: false
  },
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
    // ...
  ],
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  }, 
}