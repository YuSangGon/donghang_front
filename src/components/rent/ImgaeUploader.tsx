import { useState } from "react";
import { uploadImage } from "../../api/fileApi";

interface ImageUploaderProps {
  imageUrls: string[];
  onChange: (imageUrls: string[]) => void;
}

function ImageUploader({ imageUrls, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleSelectFiles = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const imageUrl = await uploadImage(file);
        uploadedUrls.push(imageUrl);
      }

      onChange([...imageUrls, ...uploadedUrls]);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemove = (index: number) => {
    onChange(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-900">
          집 사진
        </label>
        <label className="cursor-pointer rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100">
          사진 선택
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleSelectFiles}
          />
        </label>
      </div>

      {uploading && (
        <div className="mb-3 text-sm text-slate-600">업로드 중...</div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {imageUrls.map((url, index) => (
          <div
            key={url + index}
            className="relative overflow-hidden rounded-2xl border border-slate-200"
          >
            <img
              src={url}
              alt={`rent-${index}`}
              className="h-36 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;
