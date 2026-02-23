import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devtoolsJson from "vite-plugin-devtools-json";
import { visualizer } from "rollup-plugin-visualizer";
import { compression } from "vite-plugin-compression2";
import babel from "vite-plugin-babel";

const ReactCompilerConfig = {
  /* ... */
};

export default defineConfig({
  plugins: [
    devtoolsJson(),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    compression({
      algorithms: ["gzip"],
    }),
    visualizer({
      filename: "stats.html",
      gzipSize: true, // 显示压缩后的大小
    }),
    babel({
      filter: /\.[jt]sx?$/,
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom")) {
            return "react-dom-vendor";
          }
          if (id.includes("node_modules/react/")) {
            return "react-core";
          }
          if (
            id.includes("node_modules/antd") ||
            id.includes("node_modules/@ant-design") ||
            id.includes("node_modules/@rc-component") ||
            id.includes("node_modules/rc-")
          ) {
            return "vendor-antd";
          }
        },
      },
    },
  },
});
