import { Outlet, useLoaderData } from "react-router";
import { Layout, theme } from "antd";
import AdminMenu from "~/layouts/AdminMenu";
import AdminHeader from "~/layouts/AdminHeader";
import { useState } from "react";
import { getMenu } from "~/services/menu";
import { requireApiSuccess } from "~/services/http";
const { Sider, Content } = Layout;

export function shouldRevalidate() {
  return false;
}

export async function clientLoader() {
  return { menu: requireApiSuccess(await getMenu()) };
}

export default function Index() {
  const { menu } = useLoaderData<typeof clientLoader>();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen!">
      {menu.length > 0 && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          className=" border-r border-[#E8E8E8]"
        >
          <div className="h-8 m-4 bg-[#fff3] rounded-md" />
          <AdminMenu menu={menu} />
        </Sider>
      )}
      <Layout className="bg-[#FAFAFA]! h-screen overflow-hidden">
        <AdminHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          colorBgContainer={colorBgContainer}
        />
        <Content className="p-6 overflow-y-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
