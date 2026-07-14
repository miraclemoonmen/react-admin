import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import type { MenuProps } from "antd";

const MENU_DEFAULT_PARAMS: Record<string, string> = {
  "/sys/audit": "?status=-1",
  "/sys/report": "?status=-1",
};

export default function AdminMenu({ menu }: { menu: MenuProps["items"] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathArray = location.pathname.split("/").filter(Boolean);
  const openKeys = pathArray.map(
    (_, i) => "/" + pathArray.slice(0, i + 1).join("/"),
  );
  const [openKeysState, setOpenKeysState] = useState<string[]>(openKeys);
  return (
    <Menu
      onClick={({ key }) => {
        const params = MENU_DEFAULT_PARAMS[key] || "";
        navigate(key + params);
      }}
      className="border-0!"
      mode="inline"
      items={menu}
      openKeys={openKeysState}
      selectedKeys={[location.pathname]}
      onOpenChange={keys => setOpenKeysState(keys)}
    />
  );
}
