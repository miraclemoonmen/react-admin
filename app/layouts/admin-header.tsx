import { Avatar, Button, Dropdown } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
const { Header } = Layout;
import { useFetcher, useNavigate } from "react-router";

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  colorBgContainer: string;
}

export default function AdminHeader({
  collapsed,
  setCollapsed,
  colorBgContainer,
}: AdminHeaderProps) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const menuItems = [
    {
      key: "profile",
      label: "个人中心",
      onClick: () => {
        navigate("/profile");
      },
    },
    {
      key: "logout",
      label: "退出登录",
      onClick: () => {
        fetcher.submit(null, { method: "post", action: "/logout" });
      },
    },
  ];
  return (
    <Header
      style={{ padding: 0, background: colorBgContainer }}
      className="flex items-center justify-between pr-20!"
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
        <Dropdown placement="bottomRight" menu={{ items: menuItems }}>
          <Avatar icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}
