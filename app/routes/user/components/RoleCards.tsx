import RolePermissionAddModal from "~/routes/user/components/RolePermissionAddModal";
import RolePermissionEditModal from "~/routes/user/components/RolePermissionEditModal";
import { Avatar, Button } from "antd";
import illustration from "~/assets/illustration.webp";
import { useState } from "react";
import { useLoaderData } from "react-router";
const ColorList = ["#1677ff", "#52c41a", "#faad14"];
export default function RoleCars() {
  const [modalStatus, setModalStatus] = useState({
    permissionEdit: false,
    permissionAdd: false,
  });
  const [activeRole, setActiveRole] = useState(null);
  const { roles } = useLoaderData();

  return (
    <>
      <div className="mb-6">
        <RolePermissionAddModal
          open={modalStatus.permissionAdd}
          onClose={() => {
            setModalStatus(pre => ({ ...pre, permissionAdd: false }));
          }}
        />
        <RolePermissionEditModal
          roleData={activeRole}
          open={modalStatus.permissionEdit}
          onClose={() => {
            setModalStatus(pre => ({ ...pre, permissionEdit: false }));
          }}
        />
        <h2 className="text-xl font-bold text-gray-800">角色</h2>
        <p className="text-sm text-gray-400 mt-1.5 leading-relaxed max-w-3xl">
          角色决定了用户可访问的菜单和功能。通过为用户分配特定角色，确保其仅能使用与其相关的资源。
        </p>
      </div>
      <div className="col-span-8 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {roles.map(item => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-500">
                  共{item.userCount}位用户
                </span>
                <Avatar.Group>
                  {item.usernames.map((v, i) => (
                    <Avatar
                      style={{
                        backgroundColor: ColorList[i],
                      }}
                      key={v}
                    >
                      {v}
                    </Avatar>
                  ))}
                  {item.userCount > item.usernames.length && (
                    <Avatar
                      style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                    >
                      +{item.userCount - 3}
                    </Avatar>
                  )}
                </Avatar.Group>
              </div>
              <div className="text-xl font-bold mb-2">{item.roleName}</div>
              <a
                onClick={() => {
                  setActiveRole(item);
                  setModalStatus(pre => ({ ...pre, permissionEdit: true }));
                }}
              >
                编辑
              </a>
            </div>
          ))}
          <div className="grid grid-cols-2 bg-white rounded-3xl px-6 shadow-sm border border-gray-50 min-h-36.75">
            <div className="flex flex-col justify-end">
              <img className="w-26 h-30 object-contain" src={illustration} />
            </div>
            <div className="py-6 flex flex-col justify-between">
              <div className="flex flex-row-reverse">
                <Button
                  type="primary"
                  onClick={() =>
                    setModalStatus(pre => ({ ...pre, permissionAdd: true }))
                  }
                >
                  创建
                </Button>
              </div>
              <span className="text-sm font-medium text-gray-500 text-right">
                创建自定义角色
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
