import { http } from "~/services/http";

export async function getLogs(params: string) {
  return http(`/logs`, {
    method: "GET",
    params,
  });
}
