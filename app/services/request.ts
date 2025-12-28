type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FetchOptions extends RequestInit {
  data?: any; // 请求体数据
  headers?: Record<string, string>;
  baseUrl?: string;
  method?: Method; // 请求方法，默认 GET
}

export const DEFAULT_BASE_URL = "/win-ride";

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
 /*   const payload = data instanceof FormData ? Object.fromEntries(data) : data;
    body = JSON.stringify(payload);
    requestHeaders["Content-Type"] = "application/json";*/
    if (data instanceof FormData) {
      // 1. 如果是 FormData，直接赋值给 body，不要 JSON.stringify
      body = data;
      // 2. 【关键】删除手动设置的 Content-Type
      // 浏览器会自动加上 "multipart/form-data; boundary=..." 或者
      // 你可以直接手动指定为表单格式（取决于你后端 formLogin 的接受能力）
      delete requestHeaders["Content-Type"];
    } else {
      // 原有的 JSON 处理逻辑保持不变
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
    throw new Response("抱歉，服务器出错了", { status: 500 });
  }

  return await res.json();
}
