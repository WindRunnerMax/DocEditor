module.exports = {
  parserOptions: {
    sourceType: "module",
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "simple-import-sort"],
      extends: ["plugin:@typescript-eslint/recommended"],
    },
    {
      files: ["*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["react", "react-hooks", "@typescript-eslint/eslint-plugin", "simple-import-sort"],
      extends: ["plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
    },
  ],
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
  },
  ignorePatterns: ["node_modules", "build", "dist", "coverage", "public"],
  rules: {
    // 分号
    "semi": "error",
    // 对象键值引号样式保持一致
    "quote-props": ["error", "consistent-as-needed"],
    // 箭头函数允许单参数不带括号
    "arrow-parens": ["error", "as-needed"],
    // no var
    "no-var": "error",
    // const
    "prefer-const": "error",
    // 允许console
    "no-console": "off",
    // 关闭每个函数都要显式声明返回值
    // "@typescript-eslint/explicit-module-boundary-types": "off",
    // 偏好import type
    "@typescript-eslint/consistent-type-imports": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
