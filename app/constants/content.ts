export const CONTENT_STATUS_LABELS: Readonly<Record<number, string>> = {
  [-1]: "审核中",
  0: "已发布",
  1: "需修改",
};

export const CONTENT_DELETE_SOURCE_LABELS: Readonly<Record<string, string>> = {
  USER: "作者删除",
  ADMIN: "管理删除",
  REPORT: "举报处置",
};
