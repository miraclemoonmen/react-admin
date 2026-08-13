import { http } from "~/services/http";
import type { OperationLog, PageResult } from "~/types/api";

export async function getLogs(params: string) {
  return http<PageResult<OperationLog>>(`/logs`, {
    method: "GET",
    params,
  });
}
