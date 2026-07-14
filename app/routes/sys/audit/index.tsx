import {
  Badge,
  Button,
  DatePicker,
  Flex,
  Form,
  message,
  Popconfirm,
  Select,
  Table,
  type TableProps,
} from "antd";
const { RangePicker } = DatePicker;
import { useTableQuery } from "~/hooks/useTableQuery";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { CheckOutlined, EyeOutlined } from "@ant-design/icons";
import type { Route } from "./+types";
import { approveCommentAudit, getAuditRecord } from "~/services/audit";
import { useState } from "react";
import AuditDetailsDrawer from "~/routes/sys/audit/components/AuditDetailsDrawer";
import { http } from "~/services/http";

interface SelectedPostAudit {
  auditId: number;
  status: number;
  detail: Record<string, any>;
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  return await getAuditRecord(url.search);
}

export default function Index() {
  const [selectedPostAudit, setSelectedPostAudit] =
    useState<SelectedPostAudit | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const revalidator = useRevalidator();

  const handleApproveComment = async (id: number) => {
    setApprovingId(id);
    try {
      const { code, msg } = await approveCommentAudit(id);
      if (code === 0) {
        message.success(msg || "审核通过");
        await revalidator.revalidate();
      } else {
        message.error(msg);
      }
    } catch {
      message.error("审核失败，请稍后重试");
    } finally {
      setApprovingId(null);
    }
  };

  const columns: TableProps["columns"] = [
    {
      title: "发布者",
      dataIndex: "creator",
    },
    {
      title: "类型",
      dataIndex: "bizType",
      render: bizType => {
        switch (bizType) {
          case 1:
            return "帖子";
          case 2:
            return "评论";
          default:
            return "图片";
        }
      },
    },
    {
      title: "命中关键词",
      dataIndex: "hitKeywords",
      render: hitKeywords => hitKeywords?.join(",") ?? "-",
    },
    {
      title: "执行结果",
      dataIndex: "status",
      render: (_, record) =>
        record.status === 0 ? (
          <Badge status="success" text="通过" />
        ) : (
          <Badge status="error" text="未通过" />
        ),
    },
    {
      title: "时间",
      dataIndex: "createdAt",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => {
        switch (record.bizType) {
          case 1:
            return (
              <Button
                onClick={async () => {
                  const { data, code, msg } = await http(
                    `/auditRecord/posts/${record.bizId}`,
                  );
                  if (code === 0) {
                    setSelectedPostAudit({
                      auditId: record.id,
                      status: record.status,
                      detail: data,
                    });
                  } else {
                    message["error"](msg);
                  }
                }}
                size="small"
                type="text"
                icon={<EyeOutlined />}
              />
            );
          case 2:
            if (record.status !== -1) {
              return null;
            }
            return (
              <Popconfirm
                title="确认通过该评论？"
                description="通过后评论将公开显示。"
                okText="通过"
                cancelText="取消"
                onConfirm={() => handleApproveComment(record.id)}
              >
                <Button
                  loading={approvingId === record.id}
                  size="small"
                  type="text"
                  icon={<CheckOutlined />}
                >
                  通过
                </Button>
              </Popconfirm>
            );
          case 3:
            return (
              <Button
                href={`/console/files/view/${record.bizId}`}
                target="_blank"
                size="small"
                type="text"
                icon={<EyeOutlined />}
              />
            );
        }
      },
    },
  ];
  const { data } = useLoaderData();

  const navigation = useNavigation();
  const { form, formInitialValues, handleSearch, handleReset, onPageChange } =
    useTableQuery<any>({
      dateFields: ["createdAtRange"],
    });

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">审核</h2>
        <p className="text-sm text-gray-400 mt-1.5 leading-relaxed max-w-3xl">
          在公开前需经过系统核准。
        </p>
      </div>
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
        <header className="flex justify-between mb-4">
          <Form
            form={form}
            layout="inline"
            initialValues={formInitialValues()}
            onValuesChange={(_, allValues) => {
              handleSearch(allValues);
            }}
          >
            <Form.Item name="status">
              <Select
                placeholder="状态"
                style={{ width: 120 }}
                allowClear
                options={[
                  { value: "0", label: "通过" },
                  { value: "-1", label: "未通过" },
                ]}
              />
            </Form.Item>
            <Form.Item name="createdAtRange">
              <RangePicker />
            </Form.Item>
          </Form>
          <Flex gap="small" wrap>
            <Button onClick={handleReset}>重置</Button>
          </Flex>
        </header>
        <Table
          loading={{
            spinning: navigation.state === "loading",
            delay: 150,
            size: "large",
          }}
          scroll={{ y: "calc(100vh - 386px)" }}
          columns={columns}
          dataSource={data.list}
          rowKey="id"
          pagination={{
            current: data.page,
            pageSize: data.size,
            total: data.total,
            showSizeChanger: true,
            pageSizeOptions: ["20", "40"],
            showQuickJumper: true,
            onChange: (p, ps) => onPageChange(p, ps),
          }}
        />
        <AuditDetailsDrawer
          auditId={selectedPostAudit?.auditId ?? -1}
          status={selectedPostAudit?.status ?? null}
          record={selectedPostAudit?.detail ?? {}}
          open={selectedPostAudit !== null}
          onClose={() => setSelectedPostAudit(null)}
          onApproved={async () => {
            setSelectedPostAudit(null);
            await revalidator.revalidate();
          }}
        />
      </section>
    </>
  );
}
