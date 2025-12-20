import type { Route } from "../../.react-router/types/app/routes/+types";
import { Button, Checkbox, Form, Input } from "antd";
import { useSubmit } from "react-router";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  console.log(formData);
  return formData;
}

export default function Login() {
  const submit = useSubmit();
  return (
    <Form
      onFinish={values => {
        submit(values, { method: "post" });
      }}
      labelCol={{ span: 8 }}
    >
      <Form.Item<FieldType>
        label="用户名"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input name="username" />
      </Form.Item>

      <Form.Item<FieldType>
        label="密码"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password name="password" />
      </Form.Item>
      <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        label={null}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
