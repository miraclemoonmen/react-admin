import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Radio,
  Row,
  Space,
} from "antd";
import { useRevalidator } from "react-router";
import { create, update } from "~/services/user";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues: Record<string, unknown>;
}

export default function UserAddDrawer({ open, onClose, initialValues }: Props) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues);
    }
  }, [open, initialValues, form]);
  const revalidator = useRevalidator();
  const onFinish = async (values: any) => {
    const { msg, code } = await update({ id: initialValues.id, ...values });
    if (code === 0) {
      onClose();
      await revalidator.revalidate();
    }
    message[code === 0 ? "success" : "error"](msg);
  };

  return (
    <Drawer
      mask={{ blur: false }}
      title="编辑用户"
      closable={{ "aria-label": "Close Button" }}
      open={open}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button onClick={() => form.submit()} type="primary">
            确定
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" name="user_add" form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input placeholder="登录账号" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="密码" name="password">
              <Input.Password
                placeholder="设置新密码"
                autoComplete="new-password"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="昵称"
              name="nickname"
              rules={[{ required: true, message: "请输入昵称" }]}
            >
              <Input placeholder="例如：狗篮子" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="性别" name="gender">
              <Radio.Group>
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="联系电话"
          name="phone"
          rules={[{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" }]}
        >
          <Input placeholder="131********" />
        </Form.Item>

        <Form.Item
          label="电子邮箱"
          name="email"
          rules={[{ type: "email", message: "请输入有效的邮箱地址" }]}
        >
          <Input placeholder="example@mail.com" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
