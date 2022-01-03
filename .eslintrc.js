module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "*" },
      { blankLine: "always", prev: ["const", "let"], next: ["const", "let"] },
      {
        blankLine: "always",
        prev: ["case", "default"],
        next: ["case", "default"],
      },
    ],
  },
};
