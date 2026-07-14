import { useSearchParams } from "react-router";
import { useDebounceFn } from "ahooks";
import { Form } from "antd";
import dayjs from "dayjs";
import qs from "qs";

interface QueryConfig {
  dateFields?: string[];
  numberFields?: string[];
}

export function useTableQuery<T extends Record<string, unknown>>(config: QueryConfig = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm<T>();
  const { dateFields = [], numberFields = [] } = config;
  const formInitialValues = () => {
    const values: Record<string, unknown> = { ...qs.parse(searchParams.toString(), {
      ignoreQueryPrefix: true,
    }) };

    dateFields.forEach(field => {
      const dates = values[field];
      if (Array.isArray(dates) && dates.length === 2) {
        const [from, to] = dates;
        if (typeof from === "string" && typeof to === "string") {
          values[field] = [dayjs(from), dayjs(to)];
        }
      }
    });
    numberFields.forEach(field => {
      const val = values[field];
      if (val !== undefined && val !== null) {
        if (Array.isArray(val)) {
          values[field] = val.map(Number).filter(n => !isNaN(n));
        } else {
          const num = Number(val);
          values[field] = isNaN(num) ? val : num;
        }
      }
    });
    return values as T;
  };

  const { run: handleSearch } = useDebounceFn(
    (values: T) => {
      const formattedValues: Record<string, unknown> = { ...values };
      dateFields.forEach(key => {
        const val = values[key];
        if (Array.isArray(val) && val.length === 2) {
          const [from, to] = val;
          if (
            from &&
            to &&
            typeof from === "object" &&
            typeof to === "object" &&
            "toISOString" in from &&
            "endOf" in to &&
            typeof from.toISOString === "function" &&
            typeof to.endOf === "function"
          ) {
            const endOfDay = to.endOf("d") as { toISOString(): string };
            formattedValues[key] = [from.toISOString(), endOfDay.toISOString()];
          }
        }
      });
      const queryString = qs.stringify(
        { ...formattedValues, page: 1 },
        {
          arrayFormat: "repeat",
          addQueryPrefix: true,
          skipNulls: true,
        },
      );
      setSearchParams(queryString);
    },
    { wait: 300 },
  );

  const handleReset = () => {
    setSearchParams({}, { replace: true });
    setTimeout(() => {
      form.resetFields();
    }, 300);
  };

  const onPageChange = (page: number, size: number) => {
    setSearchParams(
      prev => {
        prev.set("page", page.toString());
        prev.set("size", size.toString());
        return prev;
      },
      { preventScrollReset: true },
    );
  };

  return {
    form,
    formInitialValues,
    handleSearch,
    handleReset,
    searchParams,
    setSearchParams,
    onPageChange,
  };
}
