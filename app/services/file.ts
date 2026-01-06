import { request } from "~/services/request";

export async function getFiles(params): Promise<any> {
  return request(`/files`, {
    method: "GET",
    params,
  });
}

export async function getPresignedUrl(data): Promise<any> {
  return request("/files", {
    method: "POST",
    data,
  });
}

export async function complete(fileUuid): Promise<any> {
  return request(`/files/complete/${fileUuid}`, {
    method: "POST",
  });
}

export async function remove(fileUuid: string): Promise<any> {
  return request(`/files/${fileUuid}`, {
    method: "DELETE",
  });
}
