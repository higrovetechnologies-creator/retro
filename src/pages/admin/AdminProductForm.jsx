import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X, ImagePlus } from "lucide-react";
import { useProducts } from "../../hooks/useStore";
import { db } from "../../lib/store";
import { SIZES } from "../../lib/data";
import { imageFileToDataUrl } from "../../lib/imageUpload";

const EMPTY = {
  name: "",
  description: "",
  product_code: "",
  was_price: "",
  now_price: "",
  category: "shirts",
  fabric: "",
  colour: "",
  occasion: "",
  care_instruction: "",
  sizes: [],
  images: [],
  is_new_arrival: false,
  is_offer: false,
  is_featured: false,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const products = useProducts();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageInputKey, setImageInputKey] = useState(0);

  useEffect(() => {
    if (editing) {
      const existing = products.find((p) => p.id === id);
      if (existing) setForm({ ...EMPTY, ...existing });
    }
  }, [editing, id, products]);

  const toggleSize = (s) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingImage(true);
    try {
      const uploaded = await Promise.all(files.map((file) => imageFileToDataUrl(file)));
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    } catch (error) {
      alert(error.message || "Unable to upload image.");
    } finally {
      setUploadingImage(false);
      setImageInputKey((key) => key + 1);
    }
  };

  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.now_price || form.images.length === 0 || form.sizes.length === 0) {
      alert("Please fill in the product name, price, at least one image and one size.");
      return;
    }
    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    db.saveProduct({
      ...form,
      id: editing ? id : undefined,
      slug,
      was_price: form.was_price ? Number(form.was_price) : null,
      now_price: Number(form.now_price),
    });
    navigate("/admin/products");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-mist hover:text-bone"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="font-display text-3xl text-bone">{editing ? "Edit Product" : "Add Product"}</h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        <FormSection title="Basic Information">
          <TextField label="Product Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <TextArea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <TextField label="Product Code" value={form.product_code} onChange={(v) => setForm({ ...form, product_code: v })} />
        </FormSection>

        <FormSection title="Pricing">
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Was Price (₹)" type="number" value={form.was_price} onChange={(v) => setForm({ ...form, was_price: v })} />
            <TextField label="Now Price (₹)" type="number" value={form.now_price} onChange={(v) => setForm({ ...form, now_price: v })} />
          </div>
        </FormSection>

        <FormSection title="Category">
          <div className="flex gap-2">
            {["shirts", "tees", "pants"].map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setForm({ ...form, category: c })}
                className={`rounded-full border px-4 py-2 text-xs capitalize transition-colors ${
                  form.category === c ? "border-bone bg-bone text-ink" : "border-line-strong text-bone hover:bg-white/5"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </FormSection>

        <FormSection title="Sizes">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleSize(s)}
                className={`h-10 w-10 rounded-full border text-xs transition-colors ${
                  form.sizes.includes(s) ? "border-bone bg-bone text-ink" : "border-line-strong text-bone hover:bg-white/5"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </FormSection>

        <FormSection title="Product Images" hint="Select images directly from your device. External image URLs are not required.">
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative h-24 w-20 overflow-hidden rounded-xl border border-line">
                <img src={img} alt={`Product ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-bone"
                  aria-label={`Remove image ${i + 1}`}
                >
                  <X size={11} />
                </button>
              </div>
            ))}
            <label className="flex h-24 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line-strong text-mist hover:text-bone">
              <ImagePlus size={18} strokeWidth={1.75} />
              <span className="text-[10px]">{uploadingImage ? "Uploading…" : "Upload"}</span>
              <input
                key={imageInputKey}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </label>
          </div>
          <p className="mt-3 text-[11px] text-mist">JPG, PNG, WebP and other browser-supported image files are accepted.</p>
        </FormSection>

        <FormSection title="Optional Details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextField label="Fabric" value={form.fabric} onChange={(v) => setForm({ ...form, fabric: v })} />
            <TextField label="Colour" value={form.colour} onChange={(v) => setForm({ ...form, colour: v })} />
            <TextField label="Occasion" value={form.occasion} onChange={(v) => setForm({ ...form, occasion: v })} />
          </div>
        </FormSection>

        <FormSection title="Care Instructions">
          <TextArea label="Care Instructions" hideLabel value={form.care_instruction} onChange={(v) => setForm({ ...form, care_instruction: v })} />
        </FormSection>

        <FormSection title="Display Options">
          <div className="flex flex-wrap gap-2">
            {[
              ["is_new_arrival", "New Arrival"],
              ["is_offer", "Offer Product"],
              ["is_featured", "Featured Product"],
            ].map(([key, label]) => (
              <button
                type="button"
                key={key}
                onClick={() => setForm({ ...form, [key]: !form[key] })}
                className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                  form[key] ? "border-bone bg-bone text-ink" : "border-line-strong text-bone hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </FormSection>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 rounded-full border border-line-strong py-3.5 text-xs uppercase tracking-widest text-bone hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-full bg-bone py-3.5 text-xs font-semibold uppercase tracking-widest text-ink"
          >
            {editing ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, hint, children }) {
  return (
    <div className="glass rounded-2xl p-6">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-widest text-mist">{title}</p>
      {hint && <p className="mb-4 text-[12px] text-mist/80">{hint}</p>}
      <div className={hint ? "mt-4" : "mt-4"}>{children}</div>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1.5 block text-[11px] text-mist">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-line bg-charcoal/40 px-4 py-2.5 text-sm text-bone focus:border-line-strong focus:outline-none"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, hideLabel }) {
  return (
    <div>
      {!hideLabel && <label className="mb-1.5 block text-[11px] text-mist">{label}</label>}
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-2xl border border-line bg-charcoal/40 px-4 py-3 text-sm text-bone focus:border-line-strong focus:outline-none"
      />
    </div>
  );
}
