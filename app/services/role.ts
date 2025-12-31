import { request } from "~/services/request";

export async function getRoles() {
  return request(`/sys/roles`, {
    method: "GET",
  });
}

export async function addRole(data) {
  return request(`/sys/roles`, {
    method: "POST",
    data,
  });
}

export async function getPermissionTemplate() {
  return request(`/sys/roles/permissions/template`, {
    method: "GET",
  });
}

export async function getPermission(id: number) {
  return request(`/sys/roles/${id}/permissions`, {
    method: "GET",
  });
}

export async function updatePermission(data) {
  return request(`/sys/roles/${data.id}`, {
    method: "PUT",
    data,
  });
}
