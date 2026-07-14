import { Button, Form, Input, message } from "antd";
import {
  redirect,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router";
import { login } from "~/services/user";
import { useEffect } from "react";
import loginBg from "~/assets/login-bg.webp";
import type { Route } from "./+types";

type FieldType = {
  username?: string;
  password?: string;
};

export async function clientAction({ request }: Route.ActionArgs) {
  const res = await login(await request.formData());
  if (res.code === 0) {
    return redirect("/");
  }
  return res;
}

export default function Login() {
  const submit = useSubmit();
  const actionData = useActionData();
  const navigation = useNavigation();
  useEffect(() => {
    if (!actionData) return;
    const { msg } = actionData;
    message["error"](msg);
  }, [actionData]);

  return (
    <main
      className="min-h-screen grid bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <section className="grid w-300 h-170 items-center self-center justify-self-center grid-cols-2 rounded-2xl shadow-2xl overflow-hidden">
        <aside className="relative h-full w-full bg-linear-to-br from-blue-500 to-blue-700 text-white p-12">
          <div className="absolute top-20 left-20 w-64 bg-white text-slate-800 rounded-xl shadow-xl p-4 -rotate-6">
            <div className="h-28 bg-yellow-200 rounded-lg mb-3"></div>
            <h4 className="text-sm font-semibold mb-2">
              WinRide 内容与社区管理
            </h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• 内容审核与发布管理</li>
              <li>• 用户、角色与权限管理</li>
              <li>• 文件和操作日志追踪</li>
            </ul>
          </div>

          <div className="absolute top-56 left-80 w-44 bg-white text-slate-800 rounded-xl shadow-lg p-4 rotate-6">
            <ul className="text-xs space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 rounded-md"></span>
                待审核内容
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-100 rounded-md"></span>
                系统运行记录
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-pink-100 rounded-md"></span>
                权限边界管理
              </li>
            </ul>
          </div>

          <div className="absolute bottom-16 left-12">
            <h2 className="text-2xl font-semibold mb-3">
              让每一次公开发布都有迹可循
            </h2>
            <p className="text-sm text-blue-100 max-w-xs leading-relaxed">
              登录后进入 WinRide 管理工作台。
            </p>
          </div>
        </aside>
        <section className="h-full flex flex-col justify-center px-16 bg-white">
          <h1 className="text-2xl font-semibold text-slate-800">
            欢迎回到 WinRide
          </h1>
          <p className="text-sm text-slate-400 mt-2 mb-8 leading-relaxed">
            请使用具备管理权限的账号登录
          </p>
          <Form
            size="large"
            requiredMark={false}
            onFinish={values => {
              submit(values, { method: "post" });
            }}
          >
            <Form.Item<FieldType>
              name="username"
              rules={[{ required: true, message: "用户名不能为空" }]}
            >
              <Input autoComplete="username" placeholder="用户名" />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[{ required: true, message: "密码不能为空" }]}
            >
              <Input.Password
                autoComplete="current-password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item label={null}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={navigation.state !== "idle"}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </section>
    </main>
  );
}
