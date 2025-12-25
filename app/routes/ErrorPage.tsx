import { Button, Result } from "antd";
import type { ResultStatusType } from "antd/es/result";
const statusMap: Record<number, ResultStatusType> = {
  404: "404",
  403: "403",
  500: "500",
};
export function ErrorPage({ status, text }: { status: number; text: string }) {
  return (
    <Result
      className="min-h-screen content-center"
      status={statusMap[status]}
      title={status}
      subTitle={status === 404 ? "抱歉，你访问的页面不存在" : text}
      extra={
        <Button href="/" type="primary">
          返回首页
        </Button>
      }
    />
  );
}
