import ts from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import replace from "@rollup/plugin-replace";
import { glob } from "glob";

const SIGNAL_ENTRY = ["src/styles/index.ts", "src/plugins/index.ts"];
const COMPOSE_ENTRY = ["src/plugins/*/index.{ts,tsx}", "src/plugins/*/types/index.{ts,tsx}"];

export default async () => {
  const dirsMap = await Promise.all(COMPOSE_ENTRY.map(item => glob(item)))
    .then(res => res.reduce((pre, cur) => [...pre, ...cur], [...SIGNAL_ENTRY]))
    .then(dirs => {
      return Promise.all(
        dirs.map(async fullPath => [
          fullPath,
          fullPath.replace(/^src\//, "").replace(/\.tsx?$/, ""),
        ])
      );
    })
    .then(arr => {
      return arr.reduce((res, [pre, cur]) => ({ ...res, [cur]: pre }), {});
    });

  const external = Object.keys(require("./package.json").dependencies || {}).map(
    key => new RegExp(`(^${key}$)|(^${key}/.*)`)
  );

  return {
    input: dirsMap,
    output: {
      dir: "./dist",
      format: "es",
    },
    onwarn: (warning, warn) => {
      if (warning.code === "EVAL") return;
      warn(warning);
    },
    plugins: [
      resolve({ preferBuiltins: false }),
      commonjs({ include: "node_modules/**" }),
      ts({
        tsconfig: path.resolve(__dirname, "./tsconfig.dist.json"),
        extensions: [".ts", ".tsx"],
      }),
      replace({
        values: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
        preventAssignment: true,
      }),
      babel({
        exclude: "node_modules/**",
        presets: [["@babel/preset-env", { module: false, targets: { chrome: ">= 70" } }]],
        // extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs"],
        // plugins: [["babel-plugin-import", { libraryName: "xxx" }]],
      }),
      postcss({ minimize: true, extensions: [".css", ".scss"] }),
      terser(),
    ],
    external: external,
  };
};
