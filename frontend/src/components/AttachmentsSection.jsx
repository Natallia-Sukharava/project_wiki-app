import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAttachments,
  uploadAttachment,
  deleteAttachment,
} from "../api/articles";

export default function AttachmentsSection({ articleId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAttachments(articleId);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [articleId]);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ok = ["image/jpeg", "image/png", "application/pdf"].includes(
      file.type
    );
    if (!ok) {
      toast.error("Only JPG, PNG, or PDF files are allowed");
      return;
    }

    try {
      await uploadAttachment(articleId, file);
      toast.success("File uploaded");
      e.target.value = "";
      await load();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    }
  };

  const handleDelete = async (filename) => {
    try {
      await deleteAttachment(articleId, filename);
      toast.success("Attachment deleted");
      await load();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div
      style={{
        padding: 12,
        border: "1px solid #eee",
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <strong>Attachments</strong>
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          onChange={onUpload}
        />
        {loading && <span>Loading…</span>}
      </div>

      {items.length > 0 && (
        <ul style={{ marginTop: 8 }}>
          {items.map((a) => (
            <li key={a.storedAs}>
              <a
                href={`http://localhost:4000${a.url}`}
                target="_blank"
                rel="noreferrer"
              >
                {a.storedAs}
              </a>

              <button
                onClick={() => handleDelete(a.storedAs)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
