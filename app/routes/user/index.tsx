import { Button, Form, Input, Table, DatePicker } from "antd";
import type { TableProps } from "antd";
import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import debounce from "lodash/debounce";
import { getUsers } from "~/services/user";
import type { Route } from "../../../.react-router/types/app/routes/user/+types";
import { useEffect, useMemo } from "react";
const { RangePicker } = DatePicker;
import dayjs, { Dayjs } from "dayjs";
import { guardPermission } from "~/guards/ensurePermission";

interface DataType {
  id: string;
  name: string;
  createTime: string;
}
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
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
  },
];

interface FormValues {
  username?: string;
  time?: [Dayjs, Dayjs];
}

export async function clientLoader({ request }: Route.ActionArgs) {
  await guardPermission("USER:SELECT");
  const urlParams = new URL(request.url).searchParams;
  const params = {
    username: urlParams.get("username") || "",
    pageNum: Number(urlParams.get("page") || 1),
    pageSize: Number(urlParams.get("pageSize") || 10),
    time: urlParams.getAll("time") || [],
  };
  return await getUsers(params);
}

export default function User() {
  const { data } = useLoaderData();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const formInitialValues: FormValues = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const timeParam = params.getAll("time").map(t => dayjs(t));
    return {
      username: params.get("username") || "",
      time: timeParam.length === 2 ? [timeParam[0], timeParam[1]] : undefined,
    };
  }, []);
  const debouncedSubmit = useMemo(
    () =>
      debounce((values: FormValues) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("username", values.username || "");
        params.delete("time");
        if (values.time?.length === 2) {
          values.time.forEach(d => params.append("time", d.toISOString()));
        }
        params.set("page", "1");
        setSearchParams(params, { replace: true });
      }, 300),
    [searchParams, setSearchParams],
  );

  useEffect(() => () => debouncedSubmit.cancel(), [debouncedSubmit]);

  return (
    <section>
      <header className="flex justify-between mb-4">
        <Form
          layout="inline"
          initialValues={formInitialValues}
          onValuesChange={(_, allValues) => {
            debouncedSubmit(allValues);
          }}
        >
          <Form.Item name="username">
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="time">
            <RangePicker />
          </Form.Item>
        </Form>
        <div className="actions">
          <Button type="primary">新增</Button>
        </div>
      </header>
      <Table<DataType>
        loading={{
          spinning: navigation.state === "loading",
          delay: 150,
          size: "large",
        }}
        columns={columns}
        dataSource={data}
        rowKey="id"
        /*        pagination={{
          current: data.pageNum,
          pageSize: data.pageSize, // 每页显示条数
          total: data.total,
          showSizeChanger: true, // 是否可以修改 pageSize
          pageSizeOptions: ["5", "10", "20"],
          showQuickJumper: true, // 快速跳转页码
          onChange: (p, ps) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", p.toString());
            params.set("pageSize", ps.toString());
            setSearchParams(params);
          },
        }}*/
      />
    </section>
  );
}
