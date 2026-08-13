import { http } from "~/services/http";
import type { PageResult, ReportRecord } from "~/types/api";

export const getReports = (params: string) =>
  http<PageResult<ReportRecord>>("/reports", { method: "GET", params });

export const getReport = (id: string) => http<ReportRecord>(`/reports/${id}`);

export const decideReport = (
  id: string,
  data: {
    decision: "RESOLVE" | "DISMISS";
    action: "NONE" | "REMOVE_CONTENT" | "DISABLE_USER";
    reviewNote?: string;
  },
) => http<null>(`/reports/${id}/decision`, { method: "PUT", data });
