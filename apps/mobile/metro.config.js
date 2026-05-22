const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const forcedModulePaths = {
  react: require.resolve("react", { paths: [__dirname] }),
  "react/jsx-runtime": require.resolve("react/jsx-runtime", {
    paths: [__dirname],
  }),
  "react/jsx-dev-runtime": require.resolve("react/jsx-dev-runtime", {
    paths: [__dirname],
  }),
  "react-dom": require.resolve("react-dom", { paths: [__dirname] }),
  "react-dom/client": require.resolve("react-dom/client", {
    paths: [__dirname],
  }),
};

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  react: path.resolve(__dirname, "node_modules/react"),
  "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
};

const nativeWindConfig = withNativeWind(config, { input: "./global.css" });
const nativeWindResolveRequest = nativeWindConfig.resolver.resolveRequest;

nativeWindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  const forcedPath = forcedModulePaths[moduleName];

  if (forcedPath) {
    return {
      type: "sourceFile",
      filePath: forcedPath,
    };
  }

  return nativeWindResolveRequest(context, moduleName, platform);
};

module.exports = nativeWindConfig;
