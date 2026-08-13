import { Descriptions, type DescriptionsProps, Drawer, Image } from "antd";
import type { ManagedContent } from "~/types/api";
import { formatDateTime } from "~/utils/date";
import {
  CONTENT_DELETE_SOURCE_LABELS,
  CONTENT_STATUS_LABELS,
} from "~/constants/content";

const endpoint = import.meta.env.VITE_MINIO_ENDPOINT;
const bucket = import.meta.env.VITE_BUCKET_POSTS;

interface Props {
  detail: ManagedContent | null;
  open: boolean;
  onClose: () => void;
  onAfterClose: () => void;
}

export default function ContentDetailsDrawer({
  detail,
  open,
  onClose,
  onAfterClose,
}: Props) {
  if (!detail) return null;

  const items: DescriptionsProps["items"] = [
    { key: "author", label: "作者", children: detail.authorName },
    {
      key: "status",
      label: "状态",
      children: CONTENT_STATUS_LABELS[detail.status] || detail.status,
    },
    ...(detail.title
      ? [{ key: "title", label: "标题", children: detail.title }]
      : []),
    ...(detail.postTitle
      ? [{ key: "post", label: "所属帖子", children: detail.postTitle }]
      : []),
    {
      key: "content",
      label: "正文",
      children: detail.content || "（无文本内容）",
    },
    ...(detail.poiName
      ? [{ key: "poi", label: "地点", children: detail.poiName }]
      : []),
    {
      key: "created",
      label: "创建时间",
      children: formatDateTime(detail.createdAt),
    },
    ...(detail.deletedAt
      ? [
          {
            key: "source",
            label: "删除来源",
            children:
              CONTENT_DELETE_SOURCE_LABELS[detail.deleteSource || ""] ||
              "历史删除",
          },
          {
            key: "deleted",
            label: "删除时间",
            children: formatDateTime(detail.deletedAt),
          },
          {
            key: "deleter",
            label: "操作人",
            children: detail.deletedBy || "-",
          },
          {
            key: "reason",
            label: "删除原因",
            children: detail.deleteReason || "历史数据未记录",
          },
          ...(!detail.canRestore
            ? [
                {
                  key: "restore",
                  label: "恢复",
                  children:
                    detail.deleteSource === "USER"
                      ? "作者主动删除，管理端不可恢复"
                      : detail.deleteSource
                        ? "随一级评论删除，需恢复一级评论"
                        : "历史删除无批次记录，不可自动恢复",
                },
              ]
            : []),
        ]
      : []),
  ];

  return (
    <Drawer
      mask={{ blur: false }}
      size="large"
      title={detail.type === "POST" ? "帖子详情" : "评论详情"}
      closable={false}
      open={open}
      onClose={onClose}
      afterOpenChange={nextOpen => {
        if (!nextOpen) onAfterClose();
      }}
    >
      <Descriptions
        column={1}
        colon={false}
        items={items}
        styles={{ label: { width: "100px" } }}
      />
      {detail.images.length > 0 && (
        <Image.PreviewGroup>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {detail.images.map(path => (
              <Image
                key={path}
                className="rounded-xl object-cover"
                height={220}
                width="100%"
                src={`${endpoint}/${bucket}/${path}`}
              />
            ))}
          </div>
        </Image.PreviewGroup>
      )}
    </Drawer>
  );
}
