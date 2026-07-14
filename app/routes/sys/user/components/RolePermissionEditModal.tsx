import { Button, Checkbox, Form, Input, message, Modal } from "antd";
import {
  getPermissionList,
  getMenuIdsByRoleId,
  updateRolePermissions,
} from "~/services/role";
import { useEffect, useState } from "react";
import { useRoleStore } from "~/stores/useRoleStore";
import { useRevalidator } from "react-router";
import type { PermissionTemplate, Role, RoleMutationInput } from "~/types/api";
import { getErrorMessage } from "~/utils/errors";
import { requireApiSuccess } from "~/services/http";

interface Props {
  open: boolean;
  data: Role | null;
  onClose: () => void;
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
  const [form] = Form.useForm<Omit<RoleMutationInput, "permissions">>();
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const revalidator = useRevalidator();
  useEffect(() => {
    if (open && data) {
      setLoadError("");
      Promise.all([getPermissionList(), getMenuIdsByRoleId(data.id)]).then(
        ([templateResult, permissionResult]) => {
          const tplData = requireApiSuccess(templateResult);
          const perData = requireApiSuccess(permissionResult);
          setPermissionTree(tplData);
          setSelectedKeys(perData);
          form.setFieldsValue(data);
        },
      ).catch(error => setLoadError(getErrorMessage(error, "角色权限加载失败")));
    }
  }, [data, form, open]);

  const obSubmit = async () => {
    if (!data) return;
    setLoading(true);
    try {
      const values = await form.validateFields();
      const { code, msg } = await updateRolePermissions({
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
    } catch (error) {
      message.error(getErrorMessage(error, "角色权限保存失败"));
    } finally {
      setLoading(false);
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
          <Button loading={loading} onClick={obSubmit} type="primary">
            确定
          </Button>
        </div>
      }
    >
      <section>
        {loadError && <p role="alert" className="mb-4 text-sm text-red-600">{loadError}</p>}
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
                <div className="text-gray-600 font-medium">{item.name}</div>
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
