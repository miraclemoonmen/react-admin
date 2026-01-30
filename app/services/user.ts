import { http } from "~/services/http";

export function login(data: any) {
  return http("/login", {
    method: "POST",
    data,
  });
}

export function logout() {
  return http("/logout", {
    method: "POST",
  });
}

export async function getUsers(params: any) {
  return http(`/users`, {
    method: "GET",
    params,
  });
}

export async function create(data: any) {
  return http(`/users`, {
    method: "POST",
    data,
  });
}

export async function update(data: any) {
  return http(`/users/${data.id}`, {
    method: "PATCH",
    data,
  });
}

export async function remove(data: any) {
  return http(`/users/${data.id}`, {
    method: "DELETE",
  });
}
