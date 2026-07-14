import { http } from "~/services/http";
import type {
  FileRecord,
  FileUploadInput,
  PageResult,
  QueryParams,
  UploadPrepare,
} from "~/types/api";

export async function getFiles(params: QueryParams) {
  return http<PageResult<FileRecord>>(`/files`, {
    method: "GET",
    params,
  });
}

export async function getUploadAuth(data: FileUploadInput) {
  return http<UploadPrepare>("/files", {
    method: "POST",
    data,
  });
}

export async function confirmUpload(id: string) {
  return http<boolean>(`/files/complete/${id}`, {
    method: "POST",
  });
}

export async function remove(id: string) {
  return http<boolean>(`/files/${id}`, {
    method: "DELETE",
  });
}
