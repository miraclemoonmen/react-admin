import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devtoolsJson from "vite-plugin-devtools-json";
import { visualizer } from "rollup-plugin-visualizer";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [
    devtoolsJson(),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    compression(),
    visualizer({
      open: true, // 构建完成后自动在浏览器打开分析报告
      filename: "stats.html", // 生成分析文件的名称
      gzipSize: true, // 显示压缩后的大小
      brotliSize: true, // 显示 brotli 压缩大小
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 1. 拆出 React 核心库（这是所有页面都必用的）
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "vendor-react";
          }
          // 2. 拆出 Antd 的图标（图标通常占 200KB-300KB）
          if (id.includes("node_modules/@ant-design/icons")) {
            return "vendor-icons";
          }
          // 3. 拆出 Antd 组件库及其直接依赖
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
