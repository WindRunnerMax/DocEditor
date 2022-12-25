import ts from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import { fileExist, fsStat, readDir } from "./config/fs-utils";
import json from "@rollup/plugin-json";

const basePath = ["src/plugins", "src/core"];
const baseEntry = ["src/styles/index.ts"];

export default async () => {
  const dirsMap = await Promise.all(
    basePath.map(async item => await readDir(item).then(files => files.map(it => item + "/" + it)))
  )
    .then(res => res.reduce((pre, cur) => [...pre, ...cur], []))
    .then(dirs => {
      dirs.push(...baseEntry);
      return Promise.all(
        dirs.map(async fullPath => {
          const isDir = (await fsStat(fullPath)).isDirectory();
          if (isDir) {
            const isTsx = await fileExist(fullPath + "/index.tsx");
            return [
              fullPath + "/index.ts" + (isTsx ? "x" : ""),
              fullPath.replace("src/", "") + "/index",
            ];
          }
          return [fullPath, fullPath.replace(/\.tsx?$/, "").replace("src/", "")];
        })
      );
    })
    .then(arr => {
      return arr.reduce((res, [pre, cur]) => ({ ...res, [cur]: pre }), {});
    });

  const external = Object.keys(require("./package.json").dependencies || {});
  external.push(/@arco-design\/web-react\/.*/);
  external.push(/lodash\/.*/);
  external.push(/embed-drawio\/.*/);
  external.push(/prismjs\/.*/);

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
      resolve({
        preferBuiltins: false,
      }),
      json(),
      postcss({ minimize: true, extensions: [".css", ".scss"] }),
      commonjs({ include: "node_modules/**" }),
      babel({
        exclude: "node_modules/**",
        presets: [["@babel/preset-env", { module: false, targets: { chrome: ">= 70" } }]],
      }),
      ts({
        tsconfig: path.resolve(__dirname, "./tsconfig.dist.json"),
        extensions: [".ts", ".tsx"],
      }),
      terser(),
    ],
    external: external,
  };
};
