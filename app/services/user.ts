import { request } from "~/services/request";

export function login(data: any) {
  return request("/login", {
    method: "POST",
    data,
  });
}

export async function getCurrentUser() {
  return request(`/me`, {
    method: "GET",
  });
}

export async function getUsers(params: any) {
  return request(`/user`, {
    method: "GET",
    data: params,
  });
}

export async function getPermissions() {
  return request(`/me/permissions`, {
    method: "GET",
  });
}
