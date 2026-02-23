import { http } from "~/services/http";

export async function getAuditRecord(params: string) {
  return http(`/auditRecord`, {
    method: "GET",
    params,
  });
}
