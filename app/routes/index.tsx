import { Outlet, redirect } from "react-router";

import { Layout, theme } from "antd";
import AdminMenu from "~/layouts/admin-menu";
import AdminHeader from "~/layouts/admin-header";
import { useState } from "react";

const { Sider, Content } = Layout;

export const loader = async ({ request }: { request: Request }) => {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match?.[1];

  if (!token) {
    return redirect("/login");
  }

  return null;
};

export default function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="h-full">
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
      <Layout className="bg-[#FAFAFA]!">
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
