import { http } from "~/services/http";
import type {
  ConsoleUser,
  PageResult,
  QueryParams,
  UserMutationInput,
} from "~/types/api";

export function login(data: FormData) {
  return http<string>("/login", {
    method: "POST",
    data,
  });
}

export function logout() {
  return http<string>("/logout", {
    method: "POST",
  });
}

export async function getUsers(params: QueryParams) {
  return http<PageResult<ConsoleUser>>(`/users`, {
    method: "GET",
    params,
  });
}

export async function createUser(data: UserMutationInput) {
  return http<boolean>(`/users`, {
    method: "POST",
    data,
  });
}

export async function updateUser(data: UserMutationInput & { id: string }) {
  return http<boolean>(`/users/${data.id}`, {
    method: "PATCH",
    data,
  });
}

export async function removeUser(data: { id: string }) {
  return http<boolean>(`/users/${data.id}`, {
    method: "DELETE",
  });
}
