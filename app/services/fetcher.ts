type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FetchOptions extends RequestInit {
  data?: any; // 请求体数据
  headers?: Record<string, string>;
  baseUrl?: string; // 可选全局 baseUrl
  method: Method; // 请求方法
  baseURL?: string;
}

export interface FetchResponse<T = any> {
  data: T | null;
  message: string;
  code: number;
}
const DEFAULT_BASE_URL = "http://localhost";

export async function fetcher<T = any>(
  url: string,
  config: FetchOptions,
): Promise<FetchResponse<T>> {
  const {
    method,
    data,
    headers = {},
    baseURL = DEFAULT_BASE_URL,
    ...rest
  } = config;
  try {
    const res = await fetch(baseURL + url, {
      method,
      // headers: { /*"Content-Type": "application/json", */...headers },
      // body: data ? JSON.stringify(data) : undefined,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data ? new URLSearchParams(data).toString() : null,
      ...rest,
    });
    const contentType = res.headers.get("Content-Type") || "";
    let result: any;
    if (contentType.includes("application/json")) {
      result = await res.json();
    }
    return result;
  } catch {
    // console.log(data)
    return {
      data: null,
      code: -1,
      message: "网络错误",
    };
  }
}
