export interface ApiResult<T> {
  code: number;
  msg: string;
  data: T | null;
}

export interface PageResult<T> {
  total: number;
  page: number;
  size: number;
  list: T[];
}

export interface MenuItem {
  id: number;
  label: string;
  key: string;
  children?: MenuItem[];
}

export interface Role {
  id: number;
  roleName: string;
  roleKey: string;
  userCount: number;
  usernames: string[];
}

export interface PermissionAction {
  id: number;
  name: string;
}

export interface PermissionTemplate {
  id: number;
  name: string;
  actions: PermissionAction[];
}

export interface RoleMutationInput {
  id?: number;
  roleName: string;
  roleKey: string;
  permissions: number[];
}

export interface ConsoleUser {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  gender: number | null;
  lastLoginIp: string | null;
  roles: number[];
  lastLoginAt: string | null;
  remark: string | null;
}

export interface UserMutationInput {
  id?: string;
  username: string;
  password?: string;
  email?: string;
  phone?: string;
  gender?: number;
  roles?: number[];
  remark?: string;
}

export interface FileRecord {
  id: string;
  fileName: string;
  fileSize: number;
  status: number;
  bucket: string;
  createdAt: string;
  createdBy: string;
}

export interface UploadPrepare {
  uploadUrl: string;
  id: string;
}

export interface FileUploadInput {
  fileName: string;
  fileSize: number;
  fileHash?: string;
  contentType: string;
  bucket: string;
  width?: number;
  height?: number;
}

export interface AuditRecord {
  id: number;
  creator: string;
  bizType: number;
  bizId: string;
  status: number;
  hitKeywords: string[] | null;
  rejectReasonCode: string | null;
  reviewNote: string | null;
  reviewer: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface PostRecordImage {
  id: string;
  path: string;
}

export interface PostRecord {
  id: string;
  creatorId: string;
  username: string;
  title: string;
  poiId: string | null;
  poiName: string | null;
  content: string | null;
  images: PostRecordImage[];
  createdAt: string;
}

export interface CommentRecord {
  id: string;
  creatorId: string;
  username: string;
  content: string;
  replyToUsername: string | null;
  postId: string;
  postTitle: string;
  status: number;
  createdAt: string;
}

export interface AuditDetails {
  detail: PostRecord | CommentRecord;
  auditMeta: AuditRecord;
}

export interface ReportRecord {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: "POST" | "COMMENT" | "USER";
  targetId: string;
  targetSummary: string | null;
  targetAuthorId: string | null;
  targetAuthorName: string | null;
  reasonCode: string;
  description: string | null;
  status: number;
  action: string | null;
  reviewNote: string | null;
  reviewerName: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface OperationLog {
  id: string;
  userId: string | null;
  username: string | null;
  module: string | null;
  action: string | null;
  requestUrl: string | null;
  requestMethod: string | null;
  traceId: string | null;
  requestParams: unknown;
  responseBody: unknown;
  status: number;
  costTime: number;
  errorMsg: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export type QueryParams = string;
