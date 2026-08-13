import { redirect } from "react-router";
import type { ApiResult } from "~/types/api";
type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FetchOptions extends RequestInit {
  data?: unknown;
  params?: string;
  headers?: Record<string, string>;
  baseUrl?: string;
  method?: Method;
}

export const DEFAULT_BASE_URL = "/console";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseApiResult<T>(value: unknown): ApiResult<T> {
  if (
    !isRecord(value) ||
    typeof value.code !== "number" ||
    typeof value.msg !== "string" ||
    !("data" in value)
  ) {
    throw new Response("服务器返回了无法识别的数据", { status: 502 });
  }
  return value as unknown as ApiResult<T>;
}

export function requireApiSuccess<T>(result: ApiResult<T>): T {
  if (result.code !== 0) throw new Error(result.msg || "请求未能完成");
  return result.data as T;
}

export async function http<T = unknown>(
  url: string,
  config: FetchOptions = {},
): Promise<ApiResult<T>> {
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
  if (method !== "GET") {
    requestHeaders["X-WinRide-Request"] = "1";
  }

  if (method.toUpperCase() === "GET" && params) {
    fetchUrl += params;
  } else if (data !== undefined) {
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
    credentials: "include",
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw redirect("/login");
    }
    if (res.status === 403) {
      throw new Response("抱歉，你无权访问该页面", { status: 403 });
    }
    throw new Response("抱歉，服务器出错了", { status: res.status });
  }

  return parseApiResult<T>(await res.json());
}
