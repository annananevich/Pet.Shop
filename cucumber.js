module.exports = {
  default: {
    require: ["src/steps/**/*.ts"],
    requireModule: ["ts-node/register"],
    format: ["progress"],
    paths: ["src/features/**/*.feature"],
    timeout: 40000,
  },
};
