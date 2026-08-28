import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useAnnouncements } from "../../hooks/useStore";
import { db } from "../../lib/store";
import { EmptyState } from "../../components/common/Misc";
import { imageFileToDataUrl } from "../../lib/imageUpload";

const EMPTY = { title: "", image: "", timing: "", location: "" };

export default function AdminAnnouncements() {
  const announcements = useAnnouncements();
  const [editing, setEditing] = useState(null); // null | 'new' | announcement
  const [form, setForm] = useState(EMPTY);
  const [uploadingImage, setUploadingImage] = useState(false);

  const openNew = () => {
    setForm(EMPTY);
    setEditing("new");
  };
  const openEdit = (a) => {
    setForm(a);
    setEditing(a);
  };
  const close = () => setEditing(null);

  const save = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image) {
      alert("Please add a title and upload an image.");
      return;
    }
    db.saveAnnouncement(form);
    close();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-mist">Manage</p>
          <h1 className="mt-2 font-display text-3xl text-bone">Announcements</h1>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-full bg-bone px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink"
        >
          <Plus size={14} strokeWidth={2} /> Add Announcement
        </button>
      </div>

      <div className="mt-8">
        {announcements.length === 0 ? (
          <EmptyState
            title="No announcements yet"
            message="Announcements you add here appear on the Home page automatically."
            actionLabel="Add Announcement"
            onAction={openNew}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {announcements.map((a) => (
              <div key={a.id} className="overflow-hidden rounded-2xl border border-line">
                <img src={a.image} alt={a.title} className="block h-auto max-h-64 w-auto max-w-full object-contain" />
                <div className="p-4">
                  <p className="font-display text-lg text-bone">{a.title}</p>
                  <p className="mt-1 text-xs text-mist">{a.timing}</p>
                  <p className="text-xs text-mist">{a.location}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => openEdit(a)}
                      className="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-[11px] text-bone hover:bg-white/5"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => db.deleteAnnouncement(a.id)}
                      className="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-[11px] text-bone hover:bg-white/5"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4">
          <form onSubmit={save} className="glass-strong w-full max-w-md rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-xl text-bone">{editing === "new" ? "Add Announcement" : "Edit Announcement"}</p>
              <button type="button" onClick={close} className="text-mist hover:text-bone">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <div>
                <label className="mb-1.5 block text-[11px] text-mist">Announcement Image</label>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-charcoal/40 p-3 text-sm text-bone hover:bg-white/5">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="h-16 w-16 rounded-xl object-contain bg-black/20" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-line text-mist">Upload</div>
                  )}
                  <div>
                    <p className="text-xs text-bone">{uploadingImage ? "Uploading…" : "Choose image from device"}</p>
                    <p className="mt-1 text-[10px] text-mist">No image URL needed</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingImage(true);
                      try {
                        const image = await imageFileToDataUrl(file);
                        setForm((f) => ({ ...f, image }));
                      } catch (error) {
                        alert(error.message || "Unable to upload image.");
                      } finally {
                        setUploadingImage(false);
                        e.target.value = "";
                      }
                    }}
                  />
                </label>
              </div>
              <Field label="Timing" value={form.timing} onChange={(v) => setForm({ ...form, timing: v })} placeholder="e.g. 6–8 Sept, 5–9 PM" />
              <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-bone py-3 text-xs font-semibold uppercase tracking-widest text-ink"
            >
              Save Announcement
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] text-mist">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-line bg-charcoal/40 px-4 py-2.5 text-sm text-bone placeholder:text-mist/60 focus:border-line-strong focus:outline-none"
      />
    </div>
  );
}
