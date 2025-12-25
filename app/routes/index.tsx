import { Outlet, redirect } from "react-router";

import { Layout, message, theme } from "antd";
import AdminMenu from "~/layouts/AdminMenu";
import AdminHeader from "~/layouts/AdminHeader";
import { useState } from "react";
import { getCurrentUser } from "~/services/user";
const { Sider, Content } = Layout;

export async function clientLoader() {
  const res = await getCurrentUser();
  if (res.code === 0) {
    return res;
  } else {
    message.error(res.msg);
    throw redirect("/login");
  }
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
