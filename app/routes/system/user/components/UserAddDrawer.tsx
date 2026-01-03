import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Space,
} from "antd";
import { useRevalidator } from "react-router";
import { create } from "~/services/user";
import { useRoleStore } from "~/stores/useRoleStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UserAddDrawer({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const revalidator = useRevalidator();
  const onFinish = async (values: any) => {
    const { msg, code } = await create(values);
    if (code === 0) {
      onClose();
      form.resetFields();
      useRoleStore.getState().reset();
      await revalidator.revalidate();
    }
    message[code === 0 ? "success" : "error"](msg);
  };

  return (
    <Drawer
      mask={{ blur: false }}
      title="新增用户"
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
      <Form
        layout="vertical"
        name="user_add"
        form={form}
        initialValues={{}}
        onFinish={onFinish}
      >
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
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password
                placeholder="设置初始密码"
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
          label="手机号"
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
        <Form.Item label="用户角色" name="roles">
          <Select
            fieldNames={{
              value: "id",
              label: "roleName",
            }}
            mode="multiple"
            options={useRoleStore.getState().allRoles}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
