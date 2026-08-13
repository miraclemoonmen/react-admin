import { Form } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router";

interface QueryConfig {
  dateFields?: string[];
  numberFields?: string[];
  debounceMs?: number;
}

type QueryValue = string | number | Dayjs | QueryValue[] | null | undefined;

function parseQueryValue(
  values: string[],
  field: string,
  dateFields: ReadonlySet<string>,
  numberFields: ReadonlySet<string>,
): unknown {
  if (dateFields.has(field) && values.length === 2) {
    return values.map(value => dayjs(value));
  }

  const parsedValues = numberFields.has(field)
    ? values.map(value => {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? value : parsed;
      })
    : values;

  return parsedValues.length === 1 ? parsedValues[0] : parsedValues;
}

function parseQuery<T extends Record<string, unknown>>(
  searchParams: URLSearchParams,
  dateFields: ReadonlySet<string>,
  numberFields: ReadonlySet<string>,
): T {
  const values: Record<string, unknown> = {};
  for (const field of new Set(searchParams.keys())) {
    values[field] = parseQueryValue(
      searchParams.getAll(field),
      field,
      dateFields,
      numberFields,
    );
  }
  return values as T;
}

function appendQueryValue(
  params: URLSearchParams,
  key: string,
  value: QueryValue,
): void {
  if (value == null || value === "") return;
  if (Array.isArray(value)) {
    value.forEach(item => appendQueryValue(params, key, item));
    return;
  }
  params.append(key, String(value));
}

function createQueryParams(
  values: Record<string, unknown>,
  dateFields: ReadonlySet<string>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(values)) {
    let value = rawValue as QueryValue;
    if (dateFields.has(key) && Array.isArray(value) && value.length === 2) {
      const [from, to] = value;
      if (dayjs.isDayjs(from) && dayjs.isDayjs(to)) {
        value = [from.toISOString(), to.endOf("day").toISOString()];
      }
    }
    appendQueryValue(params, key, value);
  }
  params.set("page", "1");
  return params;
}

export function useTableQuery<T extends Record<string, unknown>>(
  config: QueryConfig = {},
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm<T>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dateFieldsKey = (config.dateFields ?? []).join("\0");
  const numberFieldsKey = (config.numberFields ?? []).join("\0");
  const dateFields = useMemo(
    () => new Set(config.dateFields ?? []),
    // The joined key keeps callers from having to memoize a configuration array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateFieldsKey],
  );
  const numberFields = useMemo(
    () => new Set(config.numberFields ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [numberFieldsKey],
  );
  const queryKey = searchParams.toString();
  const initialValues = useMemo(
    () =>
      parseQuery<T>(new URLSearchParams(queryKey), dateFields, numberFields),
    [dateFields, numberFields, queryKey],
  );

  useEffect(() => {
    const registeredFields = form.getFieldsValue(true);
    const clearedFields = Object.fromEntries(
      Object.keys(registeredFields).map(key => [key, undefined]),
    );
    form.setFieldsValue({
      ...clearedFields,
      ...initialValues,
    } as Parameters<typeof form.setFieldsValue>[0]);
  }, [form, initialValues]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleSearch = (values: T) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearchParams(createQueryParams(values, dateFields), {
        preventScrollReset: true,
        replace: true,
      });
      timerRef.current = null;
    }, config.debounceMs ?? 300);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    const clearedFields = Object.fromEntries(
      Object.keys(form.getFieldsValue(true)).map(key => [key, undefined]),
    );
    form.setFieldsValue(
      clearedFields as Parameters<typeof form.setFieldsValue>[0],
    );
    setSearchParams({}, { replace: true, preventScrollReset: true });
  };

  const onPageChange = (page: number, size: number) => {
    setSearchParams(
      previous => {
        const next = new URLSearchParams(previous);
        const sizeChanged = next.get("size") !== String(size);
        next.set("page", String(sizeChanged ? 1 : page));
        next.set("size", String(size));
        return next;
      },
      { preventScrollReset: true },
    );
  };

  return {
    form,
    initialValues,
    handleSearch,
    handleReset,
    searchParams,
    setSearchParams,
    onPageChange,
  };
}
