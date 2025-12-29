import { guardPermission } from "~/guards/ensurePermission";

export async function clientLoader() {
  await guardPermission("sys:dashboard:view");
}

export default function Dashboard() {
  return <div>Dashboard</div>;
}
