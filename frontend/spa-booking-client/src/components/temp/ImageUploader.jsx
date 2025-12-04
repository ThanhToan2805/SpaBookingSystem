import { useImageUpload } from "../hooks/useImageUpload";

export default function ImageUploader({ onUploaded }) {
  const { uploadImage, uploading, url } = useImageUpload();

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedUrl = await uploadImage(file);
    
    if (onUploaded) onUploaded(uploadedUrl);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium">Ảnh dịch vụ</label>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {uploading && (
        <p className="text-yellow-600">Đang upload...</p>
      )}

      {url && (
        <img
          src={url}
          alt="Uploaded"
          className="w-32 h-32 object-cover border rounded"
        />
      )}
    </div>
  );
}