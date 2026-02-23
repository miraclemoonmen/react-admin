import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";

const MENU_DEFAULT_PARAMS = {
  "/sys/audit": "?status=-1",
};

export default function AdminMenu({ menu }: any) {
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
