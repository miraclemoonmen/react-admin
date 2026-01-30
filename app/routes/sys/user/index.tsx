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
  message,
  Tag,
} from "antd";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { getUsers, remove } from "~/services/user";
import { useState } from "react";
const { RangePicker } = DatePicker;
import { Dayjs } from "dayjs";
import UserAddDrawer from "~/routes/sys/user/components/UserAddDrawer";
import UserEditDrawer from "~/routes/sys/user/components/UserEditDrawer";
import {
  DeleteTwoTone,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useTableQuery } from "~/hooks/useTableQuery";
import RoleCars from "~/routes/sys/user/components/RoleCards";
import { useRoleStore } from "~/stores/useRoleStore";
import type { Route } from "./+types";

interface DataType {
  id: string;
  name: string;
  createTime: string;
  roles: [];
}

interface FormValues {
  name?: string;
  status?: number;
  createTimeRange?: [Dayjs, Dayjs];
}

export async function clientLoader({ request }: Route.ActionArgs) {
  const url = new URL(request.url);

  const [rolesRes, usersRes] = await Promise.all([
    useRoleStore.getState().getAllRoles(),
    getUsers(url.search),
  ]);
  return {
    roles: rolesRes,
    users: usersRes.data,
  };
}

export default function User() {
  const [modalStatus, setModalStatus] = useState({
    userAdd: false,
    userEdit: false,
  });
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const revalidator = useRevalidator();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "所属角色",
      dataIndex: "roleName",
      render: (_, record) => (
        <Flex gap="small" align="center" wrap>
          {record.roles?.map(item => (
            <Tag key={item}>{useRoleStore.getState().rolesMap[item]}</Tag>
          ))}
        </Flex>
      ),
    },
    /*    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
    },*/
    {
      title: "账号状态",
      dataIndex: "status",
    },
    {
      title: "最后登录IP",
      dataIndex: "lastLoginIp",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
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
              setModalStatus(pre => ({ ...pre, userEdit: true }));
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
              const { code, msg } = await remove(record);
              if (code === 0) {
                message.success(msg);
                await revalidator.revalidate();
              } else {
                message.error(msg);
              }
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
  const { form, formInitialValues, handleSearch, handleReset, onPageChange } =
    useTableQuery<FormValues>({
      dateFields: ["createdAtRange"],
      numberFields: ["roles"],
    });

  const { users } = useLoaderData() as any;

  return (
    <>
      <RoleCars />
      <div className="mb-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800">用户</h2>
        <p className="text-sm text-gray-400 mt-1.5 leading-relaxed max-w-3xl">
          管理成员档案及其在项目中的身份。
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
              <Input allowClear placeholder="用户名" />
            </Form.Item>
            <Form.Item name="roles">
              <Select
                allowClear
                maxTagCount={1}
                placeholder="所属角色"
                style={{ width: 200 }}
                fieldNames={{
                  value: "id",
                  label: "roleName",
                }}
                mode="multiple"
                options={useRoleStore.getState().allRoles}
              />
            </Form.Item>
            <Form.Item name="createdAtRange">
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
            <Button
              type="primary"
              onClick={() => setModalStatus(pre => ({ ...pre, userAdd: true }))}
            >
              新增
            </Button>
            <UserAddDrawer
              open={modalStatus.userAdd}
              onClose={() =>
                setModalStatus(pre => ({ ...pre, userAdd: false }))
              }
            />
            <UserEditDrawer
              initialValues={currentRecord}
              open={modalStatus.userEdit}
              onClose={() => {
                setModalStatus(pre => ({ ...pre, userEdit: false }));
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
          dataSource={users.list}
          rowKey="id"
          pagination={{
            current: users.page,
            pageSize: users.size,
            total: users.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20"],
            showQuickJumper: true, // 快速跳转页码
            onChange: (p, ps) => onPageChange(p, ps),
          }}
        />
      </section>
    </>
  );
}
