import { useState } from "react";
import { complete, getPresignedUrl } from "~/services/file";
import { useRevalidator } from "react-router";

export default function useUpload() {
  const [fileList, setFileList] = useState<any[]>([]);
  const revalidator = useRevalidator();
  const customRequest = async ({ onSuccess, onError, file, onProgress }: any) => {
    const { code, data } = await getPresignedUrl({
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
    });
    if (code === 0) {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", data.uploadUrl);
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percent = Math.floor((event.loaded / event.total) * 80);
          onProgress({ percent });
        }
      };
      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          await complete(data.fileUuid);
          await revalidator.revalidate();
          onSuccess(data.fileUuid);
        } else {
          onError(new Error("上传失败"));
        }
      };
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    } else {
      onError();
    }
  }
  return {
    fileList,
    setFileList,
    customRequest,
  };
}
