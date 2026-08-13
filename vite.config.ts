import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devtoolsJson from "vite-plugin-devtools-json";
import { visualizer } from "rollup-plugin-visualizer";
import { compression } from "vite-plugin-compression2";
import babel from "vite-plugin-babel";
import { resolve, sep } from "node:path";

const ReactCompilerConfig = {
  /* ... */
};
const appDirectory = `${resolve(process.cwd(), "app")}${sep}`;

export default defineConfig({
  plugins: [
    devtoolsJson(),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    compression({
      algorithms: ["gzip"],
    }),
    process.env.ANALYZE === "true" &&
      visualizer({
        filename: "stats.html",
        gzipSize: true,
      }),
    babel({
      // React Compiler only needs to process application code. Running Babel
      // over precompiled dependencies substantially slows builds and can alter
      // third-party production bundles.
      filter: id => {
        return (
          !id.includes("?") &&
          id.startsWith(appDirectory) &&
          /\.[jt]sx?$/.test(id)
        );
      },
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
  server: {
    proxy: {
      "/console": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
