import { http } from "~/services/http";

export async function getFiles(params): Promise<any> {
  return http(`/files`, {
    method: "GET",
    params,
  });
}

export async function getUploadAuth(data): Promise<any> {
  return http("/files", {
    method: "POST",
    data,
  });
}

export async function confirmUpload(id): Promise<any> {
  return http(`/files/complete/${id}`, {
    method: "POST",
  });
}

export async function remove(id: string): Promise<any> {
  return http(`/files/${id}`, {
    method: "DELETE",
  });
}
