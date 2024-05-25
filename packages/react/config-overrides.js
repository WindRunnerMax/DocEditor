const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const {
  override,
  disableEsLint,
  addLessLoader,
  babelInclude,
  addWebpackExternals,
  addWebpackResolve,
} = require("customize-cra");
// https://github.com/arackaf/customize-cra

const configWebpackPlugins = () => config => {
  // 关闭`ESLINT`的插件 -> 在`VSCode`校验
  // 关闭`CaseSensitivePathsPlugin`插件
  // 关闭`IgnorePlugin`插件
  config.plugins = config.plugins.filter(
    plugin =>
      plugin.constructor.name !== "ESLintWebpackPlugin" &&
      plugin.constructor.name !== "CaseSensitivePathsPlugin" &&
      plugin.constructor.name !== "IgnorePlugin"
  );
  // 在`MonoRepo`中关闭`ModuleScopePlugin`的检查
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => plugin.constructor.name !== "ModuleScopePlugin"
  );
  // 处理`webpack.DefinePlugin`相关能力
  const definePlugin = config.plugins.find(it => it.constructor.name === "DefinePlugin");
  if (definePlugin) {
    definePlugin.definitions["process.platform"] = JSON.stringify("darwin");
  }
  // 添加代码压缩插件且配置
  process.env.NODE_ENV === "production" &&
    config.plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: { drop_debugger: true, drop_console: false },
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
const index = path.resolve(__dirname, "src/index.tsx");
const core = path.resolve(__dirname, "../core/src");
const delta = path.resolve(__dirname, "../delta/src");
const plugin = path.resolve(__dirname, "../plugin/src");
const utils = path.resolve(__dirname, "../utils/src");

module.exports = {
  paths: function (paths) {
    paths.appSrc = src;
    paths.appIndexJs = index;
    return paths;
  },
  webpack: override(
    ...[
      addWebpackExternals({
        "react": "React",
        "react-dom": "ReactDOM",
      }),
      addWebpackResolve({
        alias: {
          "doc-editor-core": core,
          "doc-editor-delta": delta,
          "doc-editor-plugin": plugin,
          "doc-editor-utils": utils,
        },
      }),
      babelInclude([src, core, delta, plugin, utils]),
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
