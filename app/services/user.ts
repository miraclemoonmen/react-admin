import { fetcher } from "~/services/fetcher";

export async function login(data: any) {
  return await fetcher<string>("/login", {
    method: "POST",
    data,
  });
}
