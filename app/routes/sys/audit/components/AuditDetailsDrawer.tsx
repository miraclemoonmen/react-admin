import {
  Button,
  Descriptions,
  type DescriptionsProps,
  Drawer,
  message,
  Space,
} from "antd";
import { http } from "~/services/http";
import { type RefObject, useState } from "react";
const endpoint = import.meta.env.VITE_MINIO_ENDPOINT;
const bucket = import.meta.env.VITE_BUCKET_POSTS;
interface Props {
  auditId: RefObject<number>;
  open: boolean;
  onClose: () => void;
  record: Record<string, any>;
}
export default function AuditDetailsDrawer({
  auditId,
  open,
  onClose,
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
        key: i,
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
        <Space>
          <Button
            loading={loading}
            type="primary"
            onClick={async () => {
              setLoading(true);
              const { code, msg } = await http(
                `/auditRecord/${auditId.current}/approve`,
                {
                  method: "PUT",
                  data: {
                    postId: record.id,
                    poiId: record.poiId,
                    creatorId: record.creatorId,
                    fileIds: record.images?.map(i => i.id),
                  },
                },
              );
              if (code === 0) {
                setLoading(false);
                onClose();
                message["success"](msg);
              } else {
                message["error"](msg);
              }
            }}
          >
            通过
          </Button>
        </Space>
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
