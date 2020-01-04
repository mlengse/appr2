// const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

// // @see https://github.com/netlify/netlify-lambda#webpack-configuration
// module.exports = {
//   plugins: [new Dotenv()],
// }
module.exports = {
  mode: "development",
  plugins: [
    // new webpack.DefinePlugin({ "global.GENTLY": false }),
    new Dotenv()
  ],
}