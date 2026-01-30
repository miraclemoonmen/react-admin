import { useState } from "react";
import { confirmUpload, getUploadAuth } from "~/services/file";
import { useRevalidator } from "react-router";

export default function useUpload() {
  const [fileList, setFileList] = useState<any[]>([]);
  const revalidator = useRevalidator();
  const customRequest = async ({ onSuccess, onError, file, onProgress }: any) => {
    const { code, data } = await getUploadAuth({
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
          await confirmUpload(data.id);
          onSuccess(data.id);
        } else {
          onError(new Error("失败"));
        }
        await revalidator.revalidate();
      };
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    } else {
      onError();
      await revalidator.revalidate();
    }
  }
  return {
    fileList,
    setFileList,
    customRequest,
  };
}
