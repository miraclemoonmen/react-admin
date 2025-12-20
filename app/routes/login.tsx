import type { Route } from "../../.react-router/types/app/routes/+types";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useFetcher, useNavigate } from "react-router";
import { login } from "~/services/user";
import { useEffect } from "react";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const res = await login(formData);
  if (res.code === 0) {
    return new Response(JSON.stringify({ code: 0, msg: "登录成功" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Set-Cookie": `token=${res.data}; HttpOnly; Path=/; Max-Age=3600`,
      },
    });
  }
  return { msg: res.message, code: res.code };
}

export default function Login() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  useEffect(() => {
    if (!fetcher.data) return;
    const { code, msg } = fetcher.data;
    message[code === 0 ? "success" : "error"](msg);
    if (code === 0) {
      navigate("/");
    }
  }, [fetcher.data, navigate]);

  return (
    <main className="h-full grid p-28">
      <section className="grid w-300 h-170  m-auto items-center self-center grid-cols-2 rounded-2xl shadow-2xl overflow-hidden">
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
        <section className="px-16">
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
              fetcher.submit(values, { method: "post" });
            }}
          >
            <Form.Item<FieldType>
              name="username"
              rules={[{ required: true, message: "用户名不能为空" }]}
            >
              <Input name="username" placeholder="用户名" />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[{ required: true, message: "密码不能为空" }]}
            >
              <Input.Password name="password" placeholder="密码" />
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
                loading={fetcher.state === "submitting"}
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
