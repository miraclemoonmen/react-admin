import { Button, Result } from "antd";

export function NotFound() {
  return (
    <Result
      className="h-full content-center"
      status="404"
      title="404"
      subTitle="抱歉，你访问的页面不存在"
      extra={
        <Button href="/" type="primary">
          返回首页
        </Button>
      }
    />
  );
}
