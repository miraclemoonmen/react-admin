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
import { update } from "~/services/user";
import { useEffect } from "react";
import { useRoleStore } from "~/stores/useRoleStore";
import type { ConsoleUser, UserMutationInput } from "~/types/api";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues: ConsoleUser | null;
}

export default function UserAddDrawer({ open, onClose, initialValues }: Props) {
  const [form] = Form.useForm<UserMutationInput>();
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        email: initialValues.email ?? undefined,
        phone: initialValues.phone ?? undefined,
        gender: initialValues.gender ?? undefined,
        remark: initialValues.remark ?? undefined,
      });
    }
  }, [open, initialValues, form]);
  const revalidator = useRevalidator();
  const onFinish = async (values: UserMutationInput) => {
    if (!initialValues) return;
    const { msg, code } = await update({ id: initialValues.id, ...values });
    if (code === 0) {
      onClose();
      useRoleStore.getState().reset();
      await revalidator.revalidate();
    }
    message[code === 0 ? "success" : "error"](msg);
  };

  return (
    <Drawer
      mask={{ blur: false }}
      title="编辑用户"
      closable={false}
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
        <Form.Item label="所属角色" name="roles">
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
