type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FetchOptions extends RequestInit {
  data?: any; // 请求体数据
  headers?: Record<string, string>;
  baseUrl?: string;
  method?: Method; // 请求方法，默认 GET
}

export const DEFAULT_BASE_URL = "/his-api";

export async function request<T = any>(
  url: string,
  config: FetchOptions = {},
): Promise<T> {
  const {
    method = "GET",
    data,
    headers = {},
    baseUrl = DEFAULT_BASE_URL,
    ...rest
  } = config;

  let fetchUrl = baseUrl + url;
  let body: BodyInit | undefined;
  const requestHeaders: Record<string, string> = { ...headers };

  // GET 请求把 data 转成 query 参数
  if (method.toUpperCase() === "GET" && data) {
    const params = new URLSearchParams(data).toString();
    fetchUrl += (fetchUrl.includes("?") ? "&" : "?") + params;
  } else if (data) {
    body = JSON.stringify(Object.fromEntries(data));
    requestHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(fetchUrl, {
    method,
    headers: requestHeaders,
    body,
    ...rest,
  });

  if (!res.ok) {
    throw new Response("抱歉，服务器出错了", { status: 500 });
  }

  return await res.json();
}
