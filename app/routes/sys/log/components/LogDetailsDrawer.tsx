import {
  Badge,
  Descriptions,
  type DescriptionsProps,
  Drawer,
  Typography,
} from "antd";
const { Text } = Typography;
interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
}
export default function LogDetailsDrawer({ open, onClose, data }: Props) {
  if (!data) return null;

  const items: DescriptionsProps["items"] = [
    {
      key: "module",
      label: "所属功能",
      children: (
        <Text strong>
          {data.module} / {data.action}
        </Text>
      ),
    },
    {
      key: "status",
      label: "执行结果",
      children:
        data.status === 0 ? (
          <Badge status="success" text="完成" />
        ) : (
          <Badge status="error" text="失败" />
        ),
    },
    {
      key: "operator",
      label: "用户",
      children: <>{data.username}</>,
    },
    {
      key: "request",
      label: "路径",
      children: (
        <span>
          <Text code>{data.requestMethod}</Text> {data.requestUrl}
        </span>
      ),
    },
    {
      key: "time",
      label: "时间",
      children: data.createdAt,
    },
    {
      key: "cost",
      label: "耗时",
      children: `${data.costTime} ms`,
    },
    {
      key: "ip",
      label: "网络地址",
      children: data.ipAddress,
    },
    {
      key: "params",
      label: "请求数据",
      children: (
        <pre className="w-full bg-[#f5f5f7] p-3 rounded-lg text-[12px] whitespace-pre-wrap break-all leading-relaxed text-[#1d1d1f] font-mono">
          {JSON.stringify(data.requestParams, null, 2)}
        </pre>
      ),
    },
  ];
  if (data.errorMsg !== null) {
    items.push({
      key: "errorMsg",
      label: "失败原因",
      children: (
        <pre className=" w-full bg-[#f5f5f7] p-3 rounded-lg text-[12px] whitespace-pre-wrap break-all leading-relaxed text-[#1d1d1f] font-mono">
          {data.errorMsg}
        </pre>
      ),
    });
  }
  return (
    <Drawer
      mask={{ blur: false }}
      title="日志详情"
      closable={false}
      open={open}
      onClose={onClose}
    >
      <Descriptions
        column={1}
        colon={false}
        items={items}
        labelStyle={{ width: "100px" }}
      />
    </Drawer>
  );
}
