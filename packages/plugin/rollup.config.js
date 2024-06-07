import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { glob } from "glob";
import path from "path";
import postcss from "rollup-plugin-postcss";
import ts from "rollup-plugin-typescript2";

const SIGNAL_ENTRY = ["src/index.ts"];
const COMPOSE_ENTRY = ["./src/*/index.{ts,tsx}", "./src/*/types/index.{ts,tsx}"];

/**
 * @typedef { import("rollup").RollupOptions } RollupConfig
 * @return { Promise<RollupConfig> }
 * */
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

  const packages = require("./package.json");
  const deps = { ...(packages.dependencies || {}), ...(packages.peerDependencies || {}) };
  const external = Object.keys(deps).map(key => new RegExp(`(^${key}$)|(^${key}/.*)`));

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
      commonjs({ include: /node_modules/ }),
      ts({
        tsconfig: path.resolve(__dirname, "./tsconfig.build.json"),
        extensions: [".ts", ".tsx"],
      }),
      replace({
        values: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
        preventAssignment: true,
      }),
      postcss({ minimize: true, extensions: [".css", ".scss"] }),
    ],
    external: external,
  };
};
