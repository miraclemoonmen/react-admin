import { Outlet } from "react-router";

export function meta() {
  return [
    { title: "React Admin" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Index() {
  return (
    <>
      <div>Hello word</div>
      <Outlet />
    </>
  );
}
