const webpack = require("webpack");

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.plugin("done", function(){
    var dts = require("dts-bundle");

    dts.bundle({
      name: "@chiubaka/core",
      main: "dist/types/index.d.ts",
      // This path is relative to main... smh
      out: "../index.d.ts",
      removeSource: false,
      outputAsModuleFolder: true // to use npm in-package typings
    });
  });
};

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: __dirname + "/dist",
    publicPath: "/"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.html$/, loader: "html-loader" },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'
      { test: /\.tsx?$/, loaders: ["react-hot-loader/webpack", "awesome-typescript-loader"] },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      // Compile all '.scss' files through 'sass-loader'.
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [
                  require("autoprefixer")
                ]
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.(woff|woff2)$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "fonts/[providerName].[hash].[ext]"
        }
      },
      {
        test: /\.(eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          name: "fonts/[providerName].[hash].[ext]"
        }
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "images/[providerName].[hash].[ext]"
          }
        }
      },
    ]
  },

  devServer: {
    proxy: {
      "/**": {
        target: "/index.html",
        secure: false,
        bypass: function(req, res, opt) {
          if (req.path.indexOf("/img") !== -1 || req.path.indexOf("/public/") !== -1 || req.path.indexOf("/favicon.ico") !== -1) {
            return "/";
          }

          if (req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          }
        }
      }
    }
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Popper: ["popper.js", "default"],
    }),
    new DtsBundlePlugin()
  ]
};
