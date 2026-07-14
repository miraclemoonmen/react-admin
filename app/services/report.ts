import { http } from "~/services/http";

export const getReports = (params: string) =>
  http("/reports", { method: "GET", params });

export const getReport = (id: string) => http(`/reports/${id}`);

export const decideReport = (
  id: string,
  data: {
    decision: "RESOLVE" | "DISMISS";
    action: "NONE" | "REMOVE_CONTENT" | "DISABLE_USER";
    reviewNote?: string;
  },
) => http(`/reports/${id}/decision`, { method: "PUT", data });
