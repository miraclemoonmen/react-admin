import { request } from "~/services/request";

export async function getFiles(data): Promise<any> {
  return request("/file/list", {
    method: "GET",
    data,
  });
}

export async function getPresignedUrl(data): Promise<any> {
  return request("/file/upload", {
    method: "POST",
    data,
  });
}

export async function complete(fileUuid): Promise<any> {
  return request(`/file/complete/${fileUuid}`, {
    method: "POST",
  });
}

export async function getPreviewUrl(fileUuid): Promise<any> {
  return request(`/file/view/${fileUuid}`, {
    method: "GET",
  });
}

export async function getDownloadUrl(fileUuid): Promise<any> {
  return request(`/file/download/${fileUuid}`, {
    method: "GET",
  });
}

export async function remove(fileUuid: string): Promise<any> {
  return request(`/file/${fileUuid}`, {
    method: "DELETE",
  });
}
