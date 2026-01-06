import { Button, Checkbox, Form, Input, message, Modal } from "antd";
import {
  getPermissionTemplate,
  getPermission,
  updatePermission,
} from "~/services/role";
import { useEffect, useState } from "react";
import { useRoleStore } from "~/stores/useRoleStore";
import { useRevalidator } from "react-router";

interface Props {
  open: boolean;
  data: any;
  onClose: () => void;
}

interface PermissionTemplate {
  id: number;
  menuName: string;
  actions: {
    id: number;
    name: string;
  }[];
}

export default function RolePermissionEditModal({
  open,
  data,
  onClose,
}: Props) {
  const [permissionTree, setPermissionTree] = useState<PermissionTemplate[]>(
    [],
  );
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [form] = Form.useForm();
  const revalidator = useRevalidator();
  useEffect(() => {
    if (open) {
      Promise.all([getPermissionTemplate(), getPermission(data.id)]).then(
        ([{ data: tplData }, { data: perData }]) => {
          setPermissionTree(tplData);
          setSelectedKeys(perData);
          form.setFieldsValue(data);
        },
      );
    }
  }, [data, form, open]);

  const obSubmit = async () => {
    await form.validateFields();
    const values = await form.validateFields();
    const { code, msg } = await updatePermission({
      id: data.id,
      ...values,
      permissions: selectedKeys,
    });
    message[code === 0 ? "success" : "error"](msg);
    if (code === 0) {
      onClose();
      useRoleStore.getState().reset();
      await revalidator.revalidate();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={700}
      centered
      mask={{ blur: false }}
      title={
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#4A4A65] mb-1">
            编辑角色权限
          </h2>
          <p className="text-gray-400 text-sm font-normal">
            配置该角色在系统中的功能权限
          </p>
        </div>
      }
      closable
      footer={
        <div className="flex justify-center gap-4 pb-4">
          <Button onClick={onClose}>取消</Button>
          <Button onClick={obSubmit} type="primary">
            确定
          </Button>
        </div>
      }
    >
      <section>
        <h3 className="text-lg font-bold text-[#4A4A65]">基本信息</h3>
        <Form
          form={form}
          layout="inline"
          size="large"
          className="grid! grid-cols-2 gap-4 my-4!"
        >
          <Form.Item
            name="roleName"
            rules={[{ required: true, message: "请输入角色名称" }]}
          >
            <Input placeholder="例如：超人强" />
          </Form.Item>
          <Form.Item
            name="roleKey"
            rules={[{ required: true, message: "请输入唯一标识" }]}
          >
            <Input placeholder="例如：GGBond" />
          </Form.Item>
        </Form>
        <div>
          <h3 className="text-lg font-bold text-[#4A4A65]">权限设置</h3>
          <div className="mt-2 max-h-[45vh] overflow-y-auto pr-2">
            {permissionTree?.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 border-b border-gray-50 group"
              >
                <div className="text-gray-600 font-medium">{item.menuName}</div>
                <div className="flex justify-end flex-wrap gap-x-6 gap-y-2 flex-1">
                  {item.actions.map(action => (
                    <Checkbox
                      checked={selectedKeys.includes(action.id)}
                      key={action.id}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedKeys(prev => [...prev, action.id]);
                        } else {
                          setSelectedKeys(prev =>
                            prev.filter(item => item !== action.id),
                          );
                        }
                      }}
                    >
                      {action.name}
                    </Checkbox>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Modal>
  );
}
