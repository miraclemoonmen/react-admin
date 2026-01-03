import { Button, Checkbox, Form, Input, message } from "antd";
import {
  redirect,
  useActionData,
  useNavigate,
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
  remember?: string;
};

export async function clientAction({ request }: Route.ActionArgs) {
  const res = await login(await request.formData());
  if (res.code === 0) {
    return redirect("/");
  }
  return res;
}

export default function Login() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData();
  const navigation = useNavigation();
  useEffect(() => {
    if (!actionData) return;
    const { msg } = actionData;
    message["error"](msg);
  }, [navigate, actionData]);

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
              沙拉在跳舞 🥗💃，你敢吃吗 😳
            </h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• 数据正在思考人生 🧠💻</li>
              <li>• 猫咪偷了你的鼠标 🐱🖱️</li>
              <li>• AI 已经写好了你的明天 🤖📄</li>
            </ul>
          </div>

          <div className="absolute top-56 left-80 w-44 bg-white text-slate-800 rounded-xl shadow-lg p-4 rotate-6">
            <ul className="text-xs space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 rounded-md"></span>
                云端正在飘舞 🎈☁️
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-100 rounded-md"></span>
                Wi-Fi 在唱歌 📶🎤
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-pink-100 rounded-md"></span>
                星星在后台开会 🌟
              </li>
            </ul>
          </div>

          <div className="absolute bottom-16 left-12">
            <h2 className="text-2xl font-semibold mb-3">
              如果地球是方的 🌍⬛，你会骑哪条边 ？
            </h2>
            <p className="text-sm text-blue-100 max-w-xs leading-relaxed">
              如果你能读懂这句话 🤯，你已经赢了一点积分 🏅
            </p>
          </div>
        </aside>
        <section className="h-full flex flex-col justify-center px-16 bg-white">
          <h1 className="text-2xl font-semibold text-slate-800">
            小恐龙 🦖 正在排队等待注册！
          </h1>
          <p className="text-sm text-slate-400 mt-2 mb-8 leading-relaxed">
            后台咖啡 ☕ 已为你备好
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
            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              label={null}
            >
              <Checkbox>记住我</Checkbox>
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
