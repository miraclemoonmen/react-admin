import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import devtoolsJson from "vite-plugin-devtools-json";
import { visualizer } from "rollup-plugin-visualizer";
import { compression } from "vite-plugin-compression2";
import babel from "vite-plugin-babel";
import { resolve, sep } from "node:path";

const ReactCompilerConfig = {};
const appDirectory = `${resolve(process.cwd(), "app")}${sep}`;

export default defineConfig({
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  build: {
    // 保持 Vite 7 的 JavaScript 语法目标，不随构建工具升级提高门槛。
    target: ["chrome107", "edge107", "firefox104", "safari16"],
  },
  plugins: [
    devtoolsJson(),
    tailwindcss(),
    reactRouter(),
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
      include: `${appDirectory}**/*.{js,jsx,ts,tsx}`,
      exclude: /\?/,
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
