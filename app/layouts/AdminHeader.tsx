import { Avatar, Button, Dropdown, type MenuProps } from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import { useAuthStore } from "~/stores/useAuthStore";
import { useState } from "react";
const { Header } = Layout;

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  colorBgContainer: string;
}

export default function AdminHeader({
  collapsed,
  setCollapsed,
  colorBgContainer,
}: AdminHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const onClick: MenuProps["onClick"] = async ({ key }) => {
    switch (key) {
      case "3":
        setIsLoggingOut(true);
        try {
          await useAuthStore.getState().logout();
          window.location.replace("/login");
        } finally {
          setIsLoggingOut(false);
        }
    }
  };
  const menuItems: MenuProps["items"] = [
    {
      key: "3",
      label: "退出登录",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];
  return (
    <Header
      style={{ padding: 0, background: colorBgContainer }}
      className="flex items-center justify-between border-b border-gray-200/50 px-4! pr-15!"
    >
      <Button
        type="text"
        aria-label={collapsed ? "展开导航" : "收起导航"}
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
      />
      <div>
        <Dropdown placement="bottom" menu={{ items: menuItems, onClick }}>
          <Avatar
            className={isLoggingOut ? "opacity-50" : "cursor-pointer"}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </Header>
  );
}
