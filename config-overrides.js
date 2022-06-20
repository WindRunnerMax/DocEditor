const { override, fixBabelImports, disableEsLint, addLessLoader } = require("customize-cra");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const { paths: rewiredPaths } = require("react-app-rewired");
// const { scriptVersion } = rewiredPaths;
// const paths = require(`${scriptVersion}/config/paths`);
// https://github.com/arackaf/customize-cra

const configWebpackPlugins = () => config => {
  // 太卡关闭一些插件
  // 关闭`ESLINT`的插件 在`VSCode`校验
  // 关闭`CaseSensitivePathsPlugin`插件
  // 关闭`IgnorePlugin`插件
  // 关闭`TS`校验插件 在`VSCode`校验
  config.plugins = config.plugins.filter(
    plugin =>
      plugin.constructor.name !== "ESLintWebpackPlugin" &&
      plugin.constructor.name !== "CaseSensitivePathsPlugin" &&
      plugin.constructor.name !== "IgnorePlugin"
    // plugin.constructor.name !== "ForkTsCheckerWebpackPlugin"
  );
  // paths.appTsConfig = void 0; // 关闭`TS`校验插件 在`VSCode`校验
  // 添加插件
  process.env.NODE_ENV === "production" &&
    config.plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true,
          },
        },
      })
    );
  return config;
};

module.exports = {
  webpack: override(
    fixBabelImports("@arco-design/web-react", {
      libraryDirectory: "es",
      camel2DashComponentName: false,
      style: true,
    }),
    fixBabelImports("@arco-design/web-react/icon", {
      libraryDirectory: "react-icon",
      camel2DashComponentName: false,
    }),
    addLessLoader({
      javascriptEnabled: true,
      importLoaders: true,
      localIdentName: "[name]__[hash:base64:5]",
    }),
    disableEsLint(),
    configWebpackPlugins()
  ),
};
