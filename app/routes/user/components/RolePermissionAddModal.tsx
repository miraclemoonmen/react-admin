import { Button, Checkbox, Input, message, Modal } from "antd";
import { getPermissionTemplate, addRole } from "~/services/role";
import { useEffect, useState } from "react";
import { useRoleStore } from "~/stores/useRoleStore";
import { useRevalidator } from "react-router";

interface Props {
  open: boolean;
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
export default function RolePermissionEditModal({ open, onClose }: Props) {
  const [permissionTree, setPermissionTree] = useState<PermissionTemplate[]>(
    [],
  );
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [roleName, setRoleName] = useState("");
  const revalidator = useRevalidator();

  useEffect(() => {
    if (open) {
      getPermissionTemplate().then(({ data }) => {
        setPermissionTree(data);
      });
    }
  }, [open]);

  const handleSubmit = async () => {
    const { code, msg } = await addRole({
      roleName,
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
            创建角色权限
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
          <Button onClick={handleSubmit} type="primary">
            确定
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <Input
            value={roleName}
            onChange={e => setRoleName(e.target.value)}
            size="large"
            placeholder="例如：黄大狗"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#4A4A65]">功能权限配置</h3>
          </div>

          {/*          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-[#4A4A65] font-medium">超级管理权限</span>
            <Checkbox className="text-gray-500">全选</Checkbox>
          </div>*/}
          <div className="mt-2 min-h-100 overflow-y-auto pr-2 custom-scrollbar">
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
      </div>
    </Modal>
  );
}
