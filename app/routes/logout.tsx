import { redirect } from "react-router";

export async function action() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": `token=; HttpOnly; Path=/; Max-Age=0`,
    },
  });
}
