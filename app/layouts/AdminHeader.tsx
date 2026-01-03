import { Avatar, Button, Dropdown, type MenuProps } from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import { useAuthStore } from "~/stores/useAuthStore";
const { Header } = Layout;

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  colorBgContainer: string;
}

export default function AdminHeader({
  collapsed,
  setCollapsed,
}: AdminHeaderProps) {
  const onClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "3":
        useAuthStore.getState().logout();
        window.location.replace("/login");
    }
  };
  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Profile",
    },
    {
      key: "2",
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "退出登录",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];
  return (
    <Header
      style={{ padding: 0, background: "transparent" }}
      className="flex items-center justify-between pr-20! border-b border-gray-200/50"
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <div>
        <Dropdown placement="bottomRight" menu={{ items: menuItems, onClick }}>
          <Avatar icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}
