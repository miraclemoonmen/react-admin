import { request } from "~/services/request";

export async function getLogs(params: string) {
  return request(`/logs`, {
    method: "GET",
    params,
  });
}
