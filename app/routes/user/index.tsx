import {
  Button,
  Form,
  Input,
  Table,
  DatePicker,
  Flex,
  Select,
  Popconfirm,
  Space,
  type TableProps,
} from "antd";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { getUsers, remove } from "~/services/user";
import type { Route } from "../../../.react-router/types/app/routes/user/+types";
import { useState } from "react";
const { RangePicker } = DatePicker;
import { Dayjs } from "dayjs";
import UserAddDrawer from "~/routes/user/components/UserAddDrawer";
import UserEditDrawer from "~/routes/user/components/UserEditDrawer";
import {
  DeleteTwoTone,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useTableQuery } from "~/routes/user/useTableQuery";

interface DataType {
  id: string;
  name: string;
  createTime: string;
}

interface FormValues {
  name?: string;
  status?: number;
  createTimeRange?: [Dayjs, Dayjs];
}

export async function clientLoader({ request }: Route.ActionArgs) {
  // await guardPermission("USER:SELECT");
  const urlParams = new URL(request.url).searchParams;
  const params = {
    keyword: urlParams.get("name") || "",
    page: Number(urlParams.get("page") || 1),
    size: Number(urlParams.get("size") || 10),
    createTimeRange: urlParams.getAll("createTimeRange") || [],
    status: urlParams.get("status") || "0",
  };
  return await getUsers(params);
}

export default function User() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const revalidator = useRevalidator();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
    },
    {
      title: "账号状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "最后登录IP",
      dataIndex: "lastLoginIp",
      key: "lastLoginIp",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => {
              setCurrentRecord(record);
              setEditOpen(true);
            }}
            type="text"
            icon={<EditOutlined />}
          />
          <Popconfirm
            placement="topRight"
            icon={<ExclamationCircleFilled style={{ color: "#ff4d4f" }} />}
            title="确认删除该用户？"
            description="删除后该用户将无法登录，且关联数据可能受影响。"
            onConfirm={async () => {
              await remove(record);
              await revalidator.revalidate();
            }}
            okText="确认"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button
              size="small"
              type="text"
              icon={<DeleteTwoTone twoToneColor="#ff4d4f" />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const navigation = useNavigation();

  // 只需要定义哪些是时间字段，其他的它会自动根据 Form 里的 Name 匹配
  const {
    form,
    formInitialValues,
    handleSearch,
    handleReset,
    searchParams,
    setSearchParams,
  } = useTableQuery<FormValues>({
    dateFields: ["createTimeRange"],
  });

  const { data } = useLoaderData();

  // 分页也可以直接复用逻辑
  const onPageChange = (page: number, size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    params.set("size", String(size));
    setSearchParams(params);
  };

  return (
    <section>
      <header className="flex justify-between mb-4">
        <Form
          form={form}
          layout="inline"
          initialValues={formInitialValues}
          onValuesChange={(_, allValues) => {
            handleSearch(allValues);
          }}
        >
          <Form.Item name="name">
            <Input placeholder="用户名/昵称" />
          </Form.Item>
          <Form.Item name="createTimeRange">
            <RangePicker />
          </Form.Item>
          <Form.Item name="status">
            <Select
              placeholder="账号状态"
              style={{ width: 120 }}
              allowClear
              options={[
                { value: "0", label: "正常" },
                { value: "1", label: "停用" },
                { value: "2", label: "锁定" },
              ]}
            />
          </Form.Item>
        </Form>
        <Flex gap="small" wrap>
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={() => setAddOpen(!addOpen)}>
            新增
          </Button>
          <UserAddDrawer open={addOpen} onClose={() => setAddOpen(false)} />
          <UserEditDrawer
            initialValues={currentRecord}
            open={editOpen}
            onClose={() => {
              setEditOpen(false);
              setCurrentRecord(null);
            }}
          />
        </Flex>
      </header>
      <Table<DataType>
        loading={{
          spinning: navigation.state === "loading",
          delay: 150,
          size: "large",
        }}
        columns={columns}
        dataSource={data.list}
        rowKey="id"
        pagination={{
          current: data.page,
          pageSize: data.size,
          total: data.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          showQuickJumper: true, // 快速跳转页码
          onChange: (p, ps) => {
            onPageChange(p, ps);
          },
        }}
      />
    </section>
  );
}
