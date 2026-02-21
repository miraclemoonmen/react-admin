import {
  CheckCircleFilled,
  CloseOutlined,
  CloudUploadOutlined,
  DeleteTwoTone,
  DownloadOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Popconfirm,
  Progress,
  Select,
  Space,
  Table,
  type TableProps,
  Tooltip,
  Upload,
  type UploadProps,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import useUpload from "~/hooks/useUpload";
import { useTableQuery } from "~/hooks/useTableQuery";
import { Dayjs } from "dayjs";
import { useLoaderData, useNavigation, useRevalidator } from "react-router";
import { getFiles } from "~/services/file";
import { remove } from "~/services/file";
import type { Route } from "./+types";
const { Dragger } = Upload;
const { RangePicker } = DatePicker;

const STATUS_MAP = {
  uploading: "active",
  done: "success",
  error: "exception",
};
interface FormValues {
  name?: string;
  status?: number;
  createTimeRange?: [Dayjs, Dayjs];
}

export async function clientLoader({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  return await getFiles(url.search);
}

export default function Index() {
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const { fileList, setFileList, customRequest } = useUpload();
  const { data } = useLoaderData() as any;
  const props: UploadProps = {
    name: "file",
    multiple: true,
    showUploadList: false,
    fileList,
    beforeUpload: file => {
      file["localUrl"] = URL.createObjectURL(file);
      return true;
    },
    customRequest,
    onChange: info => {
      const file = info.file;
      if (file.status === "error" && file.percent === 0) {
        file.percent = 50;
      }
      setFileList([...info.fileList]);
    },
  };
  const columns: TableProps["columns"] = [
    {
      title: "名称",
      dataIndex: "fileName",
    },
    {
      title: "桶",
      dataIndex: "bucket",
    },
    {
      title: "大小",
      dataIndex: "fileSize",
      render: (_, record) => (
        <>{(record.fileSize / (1024 * 1024)).toFixed(2)} MB</>
      ),
    },
    {
      title: "上传状态",
      dataIndex: "status",
      render: (_, record) => {
        switch (record.status) {
          case 0:
            return <Badge status="success" text="完成" />;
          case -2:
            return <Badge status="error" text="失败" />;
          default:
            return <Badge status="warning" text="非公开" />;
        }
      },
    },
    {
      title: "时间",
      dataIndex: "createdAt",
    },
    {
      title: "创建者",
      dataIndex: "createdBy",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            href={`/console/files/view/${record.id}`}
            target="_blank"
            size="small"
            type="text"
            icon={<EyeOutlined />}
          />
          <Button
            size="small"
            href={`/console/files/download/${record.id}`}
            type="text"
            icon={<DownloadOutlined />}
          />
          <Popconfirm
            placement="topRight"
            icon={<ExclamationCircleFilled style={{ color: "#ff4d4f" }} />}
            title={`删除${record.fileName}？`}
            description="此文件将从列表中移除。"
            onConfirm={async () => {
              const { code, msg } = await remove(record.id);
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
  const { form, formInitialValues, handleSearch, handleReset, onPageChange } =
    useTableQuery<FormValues>({
      dateFields: ["createdAtRange"],
    });

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">上传</h2>
        <p className="text-sm text-gray-400 mt-1.5 leading-relaxed max-w-3xl">
          上传完成后，文件将立即进入“就绪”状态。
        </p>
      </div>
      <div className="h-60 bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
        <Dragger {...props}>
          <CloudUploadOutlined className="text-5xl transition-all duration-500 [.ant-upload-drag:hover_&]:text-[#1677FF]!" />
          <p className="font-semibold text-gray-900">点击或将文件拖拽至此处</p>
        </Dragger>
      </div>
      <motion.div layout className="mt-4 grid grid-cols-3 gap-4 relative">
        <AnimatePresence mode="popLayout">
          {fileList.map(file => {
            const isUploading = file.status === "uploading";
            const isDone = file.status === "done";
            const isError = file.status === "error";
            const isImage = file.type.startsWith("image/");
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.2 },
                }}
                key={file.uid}
                className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="p-3">
                      {isImage ? (
                        <a
                          href={file.localUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={file.localUrl}
                            className="h-8 object-cover"
                            alt="preview"
                          />
                        </a>
                      ) : (
                        <a
                          href={file.localUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileTextOutlined className="text-xl" />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700  max-w-50">
                        {file.name}
                      </span>
                      <span className="text-[12px] text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {isDone && (
                      <CheckCircleFilled
                        style={{ color: "#22c55e" }}
                        className="text-xl"
                      />
                    )}
                    {isError && (
                      <Tooltip title="失败">
                        <InfoCircleOutlined className="text-xl" />
                      </Tooltip>
                    )}
                    {isUploading ? (
                      <LoadingOutlined className="text-xl" />
                    ) : (
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() =>
                          setFileList(fileList.filter(f => f.uid !== file.uid))
                        }
                      />
                    )}
                  </div>
                </div>
                <Progress
                  percent={file.percent}
                  showInfo={false}
                  size="small"
                  status={STATUS_MAP[file.status]}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <motion.div layout className="my-6">
        <h2 className="text-xl font-bold text-gray-800">文件</h2>
        <p className="text-sm text-gray-400 mt-1.5 leading-relaxed max-w-3xl">
          项目中的所有文档与附件，现已在此就绪。
        </p>
      </motion.div>
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
              <Input allowClear placeholder="名称" />
            </Form.Item>
            <Form.Item name="status">
              <Select
                placeholder="状态"
                style={{ width: 120 }}
                allowClear
                options={[
                  { value: "-2", label: "上传失败" },
                  { value: "-1", label: "非公开" }
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
          columns={columns}
          dataSource={data.list}
          rowKey="id"
          pagination={{
            current: data.page,
            pageSize: data.size,
            total: data.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20"],
            showQuickJumper: true,
            onChange: (p, ps) => onPageChange(p, ps),
          }}
        />
      </section>
    </>
  );
}
