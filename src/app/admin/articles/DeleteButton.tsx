"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setConfirming(false);
      setDeleting(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1 text-xs font-semibold text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {deleting ? (
            "Deleting..."
          ) : (
            <>
              <AlertTriangle size={12} />
              Confirm
            </>
          )}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="text-xs text-gray-400 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      title={`Delete ${title}`}
    >
      <Trash2 size={15} />
    </button>
  );
}
