import ts from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import { terser } from "rollup-plugin-terser";
import fs from "fs";
import postcss from "rollup-plugin-postcss";

const basePath = "src/plugins";
const dirsMap = fs
  .readdirSync(basePath)
  .map(item => [
    fs.existsSync(basePath + "/" + item + "/index.tsx")
      ? basePath + "/" + item + "/index.tsx"
      : basePath + "/" + item,
    item.split(".")[0],
  ])
  .reduce((res, [pre, cur]) => {
    res[cur] = pre;
    return res;
  }, {});

module.exports = {
  input: dirsMap,
  output: {
    dir: "./dist",
    format: "es",
  },
  plugins: [
    resolve(),
    postcss({ minimize: true, extensions: [".css", ".scss"] }),
    commonjs({ include: "node_modules/**" }),
    babel({ babelrc: true, exclude: "node_modules/**" }),
    ts({
      tsconfig: path.resolve(__dirname, "./tsconfig.dist.json"),
      extensions: [".ts", ".tsx"],
    }),
    terser(),
  ],
  external: Object.keys(require("./package.json").dependencies || {}),
};
