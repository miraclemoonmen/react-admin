import { http } from "~/services/http";
import type { AuditRecord, PageResult } from "~/types/api";

export async function getAuditRecord(params: string) {
  return http<PageResult<AuditRecord>>(`/auditRecord`, {
    method: "GET",
    params,
  });
}

export async function approveCommentAudit(auditId: number) {
  return http<null>(`/auditRecord/${auditId}/comments/approve`, {
    method: "PUT",
  });
}

export async function approvePostAudit(auditId: number) {
  return http<null>(`/auditRecord/${auditId}/approve`, {
    method: "PUT",
  });
}

export type AuditDecision = {
  decision: "APPROVE" | "REJECT";
  reasonCode?: string;
  note?: string;
};

export async function decideAudit(auditId: number, decision: AuditDecision) {
  return http<null>(`/auditRecord/${auditId}/decision`, {
    method: "PUT",
    data: decision,
  });
}
