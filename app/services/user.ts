import { fetcher } from "~/services/fetcher";

export async function login(data: any) {
  return await fetcher<string>("/login", {
    method: "POST",
    data,
  });
}

export async function list(data: any) {
  return await fetcher<string>(
    `/category/list?name=${data.username}&pageNum=${data.page}&pageSize=${data.pageSize}`,
    {
      method: "GET",
    },
  );
}
