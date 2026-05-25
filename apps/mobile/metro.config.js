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
  "react-native": require.resolve("react-native", { paths: [__dirname] }),
  "@react-native/virtualized-lists": require.resolve(
    "@react-native/virtualized-lists",
    { paths: [__dirname] }
  ),
};

const forcedModuleRoots = {
  "react-native": path.resolve(__dirname, "node_modules/react-native"),
  "@react-native/virtualized-lists": path.resolve(
    __dirname,
    "node_modules/@react-native/virtualized-lists"
  ),
};

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  react: path.resolve(__dirname, "node_modules/react"),
  "react-native": path.resolve(__dirname, "node_modules/react-native"),
  "@react-native/virtualized-lists": path.resolve(
    __dirname,
    "node_modules/@react-native/virtualized-lists"
  ),
  "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
};

const nativeWindConfig = withNativeWind(config, { input: "./global.css" });
const nativeWindResolveRequest = nativeWindConfig.resolver.resolveRequest;

const clerkNativeSpecPaths = {
  "../specs/NativeClerkAuthView": path.resolve(
    __dirname,
    "../../node_modules/@clerk/expo/src/specs/NativeClerkAuthView.ts"
  ),
  "../specs/NativeClerkUserProfileView": path.resolve(
    __dirname,
    "../../node_modules/@clerk/expo/src/specs/NativeClerkUserProfileView.ts"
  ),
};

nativeWindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  const forcedPath = forcedModulePaths[moduleName];

  const clerkNativeSpecPath = clerkNativeSpecPaths[moduleName];

  if (
    clerkNativeSpecPath &&
    context.originModulePath.includes(
      `${path.sep}@clerk${path.sep}expo${path.sep}dist${path.sep}native${path.sep}`
    )
  ) {
    return {
      type: "sourceFile",
      filePath: clerkNativeSpecPath,
    };
  }

  if (forcedPath) {
    return {
      type: "sourceFile",
      filePath: forcedPath,
    };
  }

  for (const [moduleRoot, modulePath] of Object.entries(forcedModuleRoots)) {
    const prefix = `${moduleRoot}/`;

    if (moduleName.startsWith(prefix)) {
      return {
        type: "sourceFile",
        filePath: require.resolve(moduleName, { paths: [__dirname] }),
      };
    }
  }

  return nativeWindResolveRequest(context, moduleName, platform);
};

module.exports = nativeWindConfig;
