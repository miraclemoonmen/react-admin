import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import { ConfigProvider } from "antd";
import { ErrorPage } from "~/routes/error-page";
import "./app.css";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";

export function meta() {
  return [{ title: "WinRide 管理台" }];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=1200, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ConfigProvider variant={"filled"} locale={zhCN}>
          {children}
        </ConfigProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (import.meta.env.DEV) console.error(error);
  if (isRouteErrorResponse(error)) {
    return <ErrorPage status={error.status} text={error.data} />;
  } else if (error instanceof Error) {
    return (
      <main className="pt-16 p-4 container mx-auto">
        <h1>系统暂时无法处理该请求</h1>
        <p>{import.meta.env.DEV ? error.message : "请稍后重试"}</p>
        {import.meta.env.DEV && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{error.stack}</code>
          </pre>
        )}
      </main>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
