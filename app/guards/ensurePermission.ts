import { useAuthStore } from "~/stores/authStore";

export async function guardPermission(permission: string) {
  const hasAuth = await useAuthStore.getState().checkPermission(permission);
  if (!hasAuth) {
    throw new Response("抱歉，你无权访问该页面", { status: 403 });
  }
}
