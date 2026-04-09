import { useToast } from "../../contexts/ToastContext";

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-6 top-24 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-slate-200 bg-white text-slate-900"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-sm opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
