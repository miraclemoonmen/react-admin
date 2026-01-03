import { request } from "~/services/request";

export function login(data: any) {
  return request("/login", {
    method: "POST",
    data,
  });
}

export function logout() {
  return request("/logout", {
    method: "POST"
  });
}

export async function getCurrentUser() {
  return request(`/auth/getInfo`, {
    method: "GET",
  });
}

export async function getUsers(params: any) {
  return request(`/users`, {
    method: "GET",
    data: params,
  });
}

export async function create(data: any) {
  return request(`/users`, {
    method: "POST",
    data,
  });
}

export async function update(data: any) {
  return request(`/users/${data.id}`, {
    method: "PATCH",
    data,
  });
}

export async function remove(data: any) {
  return request(`/users/${data.id}`, {
    method: "DELETE",
  });
}
