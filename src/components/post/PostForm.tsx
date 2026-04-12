import { useState } from "react";
import LocationAutocompleteInput from "../location/LocationAutocompleteInput";

interface PostFormValues {
  title: string;
  location: string;
  content: string;
}

interface PostFormProps {
  initialValues?: PostFormValues;
  submitLabel: string;
  onSubmit: (values: PostFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

function PostForm({
  initialValues,
  submitLabel,
  onSubmit,
  isSubmitting = false,
}: PostFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!location.trim()) {
      setError("지역을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setError("");

    await onSubmit({
      title: title.trim(),
      location: location.trim(),
      content: content.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm"
    >
      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
          />
        </div>

        <LocationAutocompleteInput
          value={location}
          onChange={setLocation}
          label="지역"
          placeholder="예: 영국, 런던"
        />

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="내용을 입력하세요"
            rows={12}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "처리 중..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PostForm;
