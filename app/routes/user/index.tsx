import type { TableProps } from "antd";
import { Button, Form, Input, Table } from "antd";
import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import debounce from "lodash/debounce";
import { list } from "~/services/user";
import type { Route } from "../../../.react-router/types/app/routes/user/+types";
import { useEffect, useMemo } from "react";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export async function loader({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username") || "";
  const page = url.searchParams.get("page") || 1;
  const pageSize = url.searchParams.get("pageSize") || 10;
  return await list({ username, page, pageSize });
}

export default function User() {
  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "createTime",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];
  const data = useLoaderData();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm();

  const debouncedSubmit = useMemo(
    () =>
      debounce((values: any) => {
        const params = new URLSearchParams(window.location.search);
        params.set("username", values.username || "");
        params.set("page", "1");
        setSearchParams(params, { replace: true });
      }, 300),
    [setSearchParams],
  );

  useEffect(() => {
    return () => debouncedSubmit.cancel();
  }, [debouncedSubmit]);

  return (
    <section>
      <header className="flex justify-between mb-4">
        <Form
          form={form}
          size="large"
          layout="inline"
          initialValues={{ username: searchParams.get("username") || "" }}
          onValuesChange={(_, allValues) => {
            debouncedSubmit(allValues);
          }}
        >
          <Form.Item<FieldType> name="username">
            <Input placeholder="用户名" />
          </Form.Item>
        </Form>
        <div className="actions">
          <Button size="large" type="primary">
            新增
          </Button>
        </div>
      </header>
      <Table<DataType>
        loading={navigation.state === "loading"}
        columns={columns}
        dataSource={data.data.list}
        rowKey="id"
        pagination={{
          current: data.data.pageNum,
          pageSize: data.data.pageSize, // 每页显示条数
          total: data.data.total,
          showSizeChanger: true, // 是否可以修改 pageSize
          pageSizeOptions: ["5", "10", "20"],
          showQuickJumper: true, // 快速跳转页码
          onChange: (p, ps) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", p.toString());
            params.set("pageSize", ps.toString());
            setSearchParams(params);
          },
        }}
      />
    </section>
  );
}
