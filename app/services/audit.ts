import { http } from "~/services/http";

export async function getAuditRecord(params: string) {
  return http(`/auditRecord`, {
    method: "GET",
    params,
  });
}

export async function approveCommentAudit(auditId: number) {
  return http(`/auditRecord/${auditId}/comments/approve`, {
    method: "PUT",
  });
}
