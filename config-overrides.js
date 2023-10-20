const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { override, disableEsLint, addLessLoader, babelInclude } = require("customize-cra");
// https://github.com/arackaf/customize-cra

const configWebpackPlugins = () => config => {
  // 太卡关闭一些插件
  // 关闭`ESLINT`的插件 -> 在`VSCode`校验
  // 关闭`CaseSensitivePathsPlugin`插件
  // 关闭`IgnorePlugin`插件
  config.plugins = config.plugins.filter(
    plugin =>
      plugin.constructor.name !== "ESLintWebpackPlugin" &&
      plugin.constructor.name !== "CaseSensitivePathsPlugin" &&
      plugin.constructor.name !== "IgnorePlugin"
  );
  // 添加插件
  process.env.NODE_ENV === "production" &&
    config.plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: { drop_debugger: true, drop_console: true },
        },
      })
    );
  // `Babel mjs`
  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto",
  });
  return config;
};

const src = path.resolve(__dirname, "src");
const example = path.resolve(__dirname, "example");

module.exports = {
  paths: function (paths) {
    paths.appSrc = src;
    paths.appIndexJs = example;
    return paths;
  },
  webpack: override(
    ...[
      babelInclude([src, example]),
      addLessLoader({
        javascriptEnabled: true,
        importLoaders: true,
        localIdentName: "[name]__[hash:base64:5]",
      }),
      disableEsLint(),
      configWebpackPlugins(),
    ].filter(Boolean)
  ),
};
