import {
  Badge,
  Button,
  Descriptions,
  type DescriptionsProps,
  Drawer,
  message,
  Space,
} from "antd";
import { useState } from "react";
import { decideAudit } from "~/services/audit";
const endpoint = import.meta.env.VITE_MINIO_ENDPOINT;
const bucket = import.meta.env.VITE_BUCKET_POSTS;
const reasonLabels: Record<string, string> = {
  SENSITIVE_TEXT: "文字内容不合规",
  IMAGE_RISK: "图片内容不合规",
  ADVERTISING: "广告或推广内容",
  IRRELEVANT: "内容与主题无关",
  OTHER: "其他原因",
};
interface Props {
  auditId: number;
  status: number | null;
  open: boolean;
  onClose: () => void;
  onApproved: () => Promise<void>;
  onRejectRequest: () => void;
  auditMeta?: Record<string, any>;
  record: Record<string, any>;
}
export default function AuditDetailsDrawer({
  auditId,
  status,
  open,
  onClose,
  onApproved,
  onRejectRequest,
  auditMeta,
  record,
}: Props) {
  const [loading, setLoading] = useState(false);
  const items: DescriptionsProps["items"] = [
    {
      key: "status",
      label: "审核状态",
      children:
        status === -1 ? (
          <Badge status="processing" text="待审核" />
        ) : status === 0 ? (
          <Badge status="success" text="已通过" />
        ) : status === 1 ? (
          <Badge status="error" text="已驳回" />
        ) : (
          <Badge status="default" text="已取消" />
        ),
    },
    {
      key: "title",
      label: "标题",
      children: <p className="font-medium">{record.title}</p>,
    },
    ...(auditMeta?.rejectReasonCode
      ? [
          {
            key: "rejectReason",
            label: "驳回原因",
            children:
              reasonLabels[auditMeta.rejectReasonCode] ||
              auditMeta.rejectReasonCode,
          },
        ]
      : []),
    ...(auditMeta?.reviewNote
      ? [
          {
            key: "reviewNote",
            label: "审核备注",
            children: auditMeta.reviewNote,
          },
        ]
      : []),
    ...(auditMeta?.reviewer
      ? [
          {
            key: "reviewer",
            label: "审核人",
            children: auditMeta.reviewer,
          },
        ]
      : []),
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
      children: (
        <p>
          {record.username || "-"}
          {record.creatorId && (
            <span className="ml-2 text-xs text-gray-400">
              {record.creatorId}
            </span>
          )}
        </p>
      ),
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
        children: (
          <img
            key={i.id}
            alt="待审核附件"
            className="max-h-80 max-w-full rounded-xl object-contain"
            src={`${endpoint}/${bucket}/${i.path}`}
          />
        ),
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
            <Button danger onClick={onRejectRequest}>
              驳回
            </Button>
            <Button
              loading={loading}
              type="primary"
              onClick={async () => {
                setLoading(true);
                try {
                  const { code, msg } = await decideAudit(auditId, {
                    decision: "APPROVE",
                  });
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
