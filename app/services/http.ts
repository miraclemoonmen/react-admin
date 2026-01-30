import { redirect } from "react-router";
type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FetchOptions extends RequestInit {
  data?: any;
  params?: string;
  headers?: Record<string, string>;
  baseUrl?: string;
  method?: Method;
}

export const DEFAULT_BASE_URL = "/console";

export async function http<T = any>(
  url: string,
  config: FetchOptions = {},
): Promise<T> {
  const {
    method = "GET",
    data,
    params,
    headers = {},
    baseUrl = DEFAULT_BASE_URL,
    ...rest
  } = config;

  let fetchUrl = baseUrl + url;
  let body: BodyInit | undefined;
  const requestHeaders: Record<string, string> = { ...headers };

  if (method.toUpperCase() === "GET" && params) {
    fetchUrl += params;
  } else if (data) {
    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
      requestHeaders["Content-Type"] = "application/json";
    }
  }

  const res = await fetch(fetchUrl, {
    method,
    headers: requestHeaders,
    body,
    ...rest,
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw redirect("/login");
    }
    if (res.status === 403) {
      throw new Response("抱歉，你无权访问该页面", { status: 403 });
    }
    throw new Response("抱歉，服务器出错了", { status: 500 });
  }

  return await res.json();
}
