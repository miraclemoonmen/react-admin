import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export default function AdminMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [
    {
      key: "/",
      icon: <UserOutlined />,
      label: "nav 1",
    },
    {
      key: "/user",
      icon: <VideoCameraOutlined />,
      label: "nav 2",
    },
    {
      key: "3",
      icon: <UploadOutlined />,
      label: "nav 3",
    },
  ];
  return (
    <Menu
      onClick={({ key }) => {
        navigate(key);
      }}
      // theme="dark"
      className="bg-[#F6F6F6]! border-0!"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
    />
  );
}
