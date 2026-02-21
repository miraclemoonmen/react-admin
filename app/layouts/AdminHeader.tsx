import { Avatar, Dropdown, type MenuProps } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { useAuthStore } from "~/stores/useAuthStore";
const { Header } = Layout;

export default function AdminHeader() {
  const onClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "3":
        useAuthStore.getState().logout();
        window.location.replace("/login");
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
      style={{ padding: 0, background: "transparent" }}
      className="pr-15! border-b border-gray-200/50"
    >
      <div className="justify-self-end">
        <Dropdown placement="bottom" menu={{ items: menuItems, onClick }}>
          <Avatar icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}
