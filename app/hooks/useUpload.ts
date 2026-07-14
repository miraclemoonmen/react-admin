import { useState } from "react";
import { confirmUpload, getUploadAuth } from "~/services/file";
import { useRevalidator } from "react-router";
import type { UploadFile, UploadProps } from "antd";
import { requireApiSuccess } from "~/services/http";

export interface PreviewUploadFile extends UploadFile {
  localUrl?: string;
}

const bucket = import.meta.env.VITE_BUCKET;

export default function useUpload() {
  const [fileList, setFileList] = useState<PreviewUploadFile[]>([]);
  const revalidator = useRevalidator();
  const customRequest: NonNullable<UploadProps["customRequest"]> = async ({
    onSuccess,
    onError,
    file,
    onProgress,
  }) => {
    if (typeof file === "string") {
      onError?.(new Error("无法读取文件"));
      return;
    }
    try {
      const data = requireApiSuccess(await getUploadAuth({
        fileName: file instanceof File ? file.name : "upload.bin",
        fileSize: file.size,
        contentType: file.type,
        bucket,
      }));
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", data.uploadUrl);
      xhr.timeout = 120_000;
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percent = Math.floor((event.loaded / event.total) * 80);
          onProgress?.({ percent });
        }
      };
      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error("文件上传失败，请重试"));
        };
        xhr.onerror = () => reject(new Error("网络中断，文件未上传"));
        xhr.onabort = () => reject(new Error("上传已取消"));
        xhr.ontimeout = () => reject(new Error("上传超时，请重试"));
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.send(file);
      });
      const confirmed = requireApiSuccess(await confirmUpload(data.id));
      if (confirmed !== true) throw new Error("服务器未确认文件，请重试");
      onSuccess?.(data.id);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("上传失败，请重试"));
    } finally {
      await revalidator.revalidate();
    }
  };
  return {
    fileList,
    setFileList,
    customRequest,
  };
}
