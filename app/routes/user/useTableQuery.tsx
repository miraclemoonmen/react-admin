import { useSearchParams } from "react-router";
import { useDebounceFn } from "ahooks";
import { Form } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";

interface QueryConfig {
  dateFields?: string[]; // 哪些字段是时间范围类型
}

export function useTableQuery<T extends object>(config: QueryConfig = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const { dateFields = [] } = config;

  // 1. 动态初始化回显
  const formInitialValues = useMemo(() => {
    const values: any = {};
    // 基础字段处理
    searchParams.forEach((value, key) => {
      if (!dateFields.includes(key)) {
        values[key] = value;
      }
    });
    // 时间范围字段处理
    dateFields.forEach(field => {
      const dates = searchParams.getAll(field);
      if (dates.length === 2) {
        values[field] = [dayjs(dates[0]), dayjs(dates[1])];
      }
    });
    return values as T;
  }, [searchParams, dateFields]);

  // 2. 动态提交逻辑
  const { run: handleSearch } = useDebounceFn(
    (values: any) => {
      const params = new URLSearchParams();

      Object.keys(values).forEach(key => {
        const val = values[key];
        if (val === undefined || val === null || val === "") return;

        if (
          dateFields.includes(key) &&
          Array.isArray(val) &&
          val.length === 2
        ) {
          // 处理时间范围
          params.append(key, val[0].format("YYYY-MM-DD HH:mm:ss"));
          params.append(key, val[1].endOf("d").format("YYYY-MM-DD HH:mm:ss"));
        } else {
          // 处理普通字段
          params.set(key, String(val));
        }
      });

      params.set("page", "1");
      setSearchParams(params, { replace: true });
    },
    { wait: 300 },
  );

  const handleReset = () => {
    form.setFieldsValue(
      Object.keys(form.getFieldsValue()).reduce((acc, key) => {
        acc[key] = undefined;
        return acc;
      }, {} as any),
    );
    setSearchParams({}, { replace: true });
  };

  return {
    form,
    formInitialValues,
    handleSearch,
    handleReset,
    searchParams,
    setSearchParams,
  };
}
