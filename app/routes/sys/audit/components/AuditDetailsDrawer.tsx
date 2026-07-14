import {
  Button,
  Descriptions,
  type DescriptionsProps,
  Drawer,
  message,
  Space,
} from "antd";
import { useState } from "react";
import { approvePostAudit } from "~/services/audit";
const endpoint = import.meta.env.VITE_MINIO_ENDPOINT;
const bucket = import.meta.env.VITE_BUCKET_POSTS;
interface Props {
  auditId: number;
  status: number | null;
  open: boolean;
  onClose: () => void;
  onApproved: () => Promise<void>;
  record: Record<string, any>;
}
export default function AuditDetailsDrawer({
  auditId,
  status,
  open,
  onClose,
  onApproved,
  record,
}: Props) {
  const [loading, setLoading] = useState(false);
  const items: DescriptionsProps["items"] = [
    {
      key: "title",
      label: "标题",
      children: <p className="font-medium">{record.title}</p>,
    },
    {
      key: "poiName",
      label: "地点",
      children: <p>{record.poiName || "-"}</p>,
    },
    {
      key: "content",
      label: "内容",
      children: <p>{record.content || "-"}</p>,
    },
    {
      key: "creatorId",
      label: "用户",
      children: <p>{record.creatorId}</p>,
    },
    {
      key: "createdAt",
      label: "创建时间",
      children: record.createdAt,
    },
  ];
  if (record.images?.length > 0) {
    items.push(
      ...(record.images.map(i => ({
        key: i.id,
        label: "附件",
        children: <img key={i.id} src={`${endpoint}/${bucket}/${i.path}`} />,
      })) ?? []),
    );
  }
  return (
    <Drawer
      mask={{ blur: false }}
      size="large"
      title="详情"
      closable={false}
      open={open}
      onClose={onClose}
      extra={
        open && status === -1 ? (
          <Space>
            <Button
              loading={loading}
              type="primary"
              onClick={async () => {
                setLoading(true);
                try {
                  const { code, msg } = await approvePostAudit(auditId);
                  if (code === 0) {
                    message.success(msg || "审核通过");
                    await onApproved();
                  } else {
                    message.error(msg || "审核失败");
                  }
                } catch {
                  message.error("审核失败，请稍后重试");
                } finally {
                  setLoading(false);
                }
              }}
            >
              通过
            </Button>
          </Space>
        ) : null
      }
    >
      <Descriptions
        column={1}
        colon={false}
        items={items}
        styles={{ label: { width: "100px" } }}
      />
    </Drawer>
  );
}
