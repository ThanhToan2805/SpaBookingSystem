import { useState } from "react";
import { fileApi } from "../api/fileApi";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(null);

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const res = await fileApi.upload(file);
      setUrl(res.url || res.data.url);
      return res.url || res.data.url;
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, url };
}