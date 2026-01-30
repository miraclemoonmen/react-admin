import { http } from "~/services/http";

export async function getRoleList() {
  return http(`/roles`, {
    method: "GET",
  });
}

export async function addRole(data) {
  return http(`/roles`, {
    method: "POST",
    data,
  });
}

export async function getPermissionList() {
  return http(`/permissions`, {
    method: "GET",
  });
}

export async function getMenuIdsByRoleId(id: number) {
  return http(`/roles/${id}/permissions`, {
    method: "GET",
  });
}

export async function updateRolePermissions(data) {
  return http(`/roles/${data.id}`, {
    method: "PUT",
    data,
  });
}

export async function removeRole(id) {
  return http(`/roles/${id}`, {
    method: "DELETE"
  });
}
