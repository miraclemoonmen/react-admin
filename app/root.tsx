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
  return [{ title: "Very cool app" }];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ConfigProvider variant={"filled"} locale={zhCN} >
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
  console.error(error);
  if (isRouteErrorResponse(error)) {
    return <ErrorPage status={error.status} text={error.data} />;
  } else if (error instanceof Error) {
    return (
      <main className="pt-16 p-4 container mx-auto">
        <h1>Oops!</h1>
        <p>{error.message}</p>
        <pre className="w-full p-4 overflow-x-auto">
          <code>{error.stack}</code>
        </pre>
      </main>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
