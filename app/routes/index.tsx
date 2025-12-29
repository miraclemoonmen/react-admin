import { Outlet } from "react-router";
import { Layout, theme } from "antd";
import AdminMenu from "~/layouts/AdminMenu";
import AdminHeader from "~/layouts/AdminHeader";
import { useState } from "react";
const { Sider, Content } = Layout;

export function shouldRevalidate() {
  return false;
}

export default function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen!">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className="bg-[#F6F6F6]!"
        style={{ boxShadow: "1px 2px 20px 0px #00000017" }}
      >
        <div className="h-8 m-4 bg-[#fff3] rounded-md" />
        <AdminMenu />
      </Sider>
      <Layout className="bg-[#FAFAFA]! h-screen overflow-hidden">
        <AdminHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          colorBgContainer={colorBgContainer}
        />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
