import type { Route } from "./+types";
import {
  Badge,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Table,
  type TableProps,
  Tag,
} from "antd";
import { useTableQuery } from "~/hooks/useTableQuery";
import { useLoaderData, useNavigation } from "react-router";
import { getLogs } from "~/services/log";
import { useState } from "react";
import LogDetailsDrawer from "~/routes/sys/log/components/LogDetailsDrawer";
import { EyeOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

export async function clientLoader({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  return await getLogs(url.search);
}

export default function Index() {
  const columns: TableProps["columns"] = [
    {
      title: "所属功能",
      dataIndex: "module",
    },
    {
      title: "操作类型",
      dataIndex: "action",
    },
    {
      title: "路径",
      dataIndex: "requestUrl",
      ellipsis: true,
    },
    {
      title: "方法",
      dataIndex: "requestMethod",
    },
    {
      title: "执行结果",
      dataIndex: "status",
      render: (_, record) =>
        record.status === 0 ? (
          <Badge status="success" text="完成" />
        ) : (
          <Badge status="error" text="失败" />
        ),
    },
    {
      title: "耗时",
      dataIndex: "costTime",
      render: ms => `${ms} ms`,
    },
    {
      title: "时间",
      dataIndex: "createdAt",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Button
          onClick={() => {
            setRecord(record);
            setActive(true);
          }}
          size="small"
          type="text"
          icon={<EyeOutlined />}
        />
      ),
    },
  ];

  const { form, formInitialValues, handleSearch, handleReset, onPageChange } =
    useTableQuery<any>({
      dateFields: ["createdAtRange"],
    });
  const [active, setActive] = useState(false);
  const [record, setRecord] = useState({});
  const navigation = useNavigation();
  const { data } = useLoaderData();
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">日志</h2>
        <p className="text-sm text-gray-400 mt-1.5 leading-relaxed max-w-3xl">
          审计重要操作行为。
        </p>
      </div>
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
        <header className="flex justify-between mb-4">
          <Form
            form={form}
            layout="inline"
            initialValues={formInitialValues}
            onValuesChange={(_, allValues) => {
              handleSearch(allValues);
            }}
          >
            <Form.Item name="keyword">
              <Input allowClear placeholder="搜索任何相关记录..." />
            </Form.Item>
            <Form.Item name="status">
              <Select
                placeholder="执行结果"
                style={{ width: 120 }}
                allowClear
                options={[
                  { value: "0", label: "完成" },
                  { value: "1", label: "失败" },
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
            showQuickJumper: true, // 快速跳转页码
            onChange: (p, ps) => onPageChange(p, ps),
          }}
        />
        <LogDetailsDrawer
          data={record}
          open={active}
          onClose={() => setActive(false)}
        />
      </section>
    </>
  );
}
