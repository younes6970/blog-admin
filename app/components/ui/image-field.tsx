import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Input } from "./input";
import { EditorField } from "./editor-field";

type ImageValue = { src: string; alt: string };
const MAX_BYTES = 1024 * 1024;
export function ImageField({ value, onChange }: { value: ImageValue; onChange: (value: ImageValue) => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const generation = useRef(0);
  const latestValue = useRef(value);
  latestValue.current = value;
  return <div className="space-y-3">
    <EditorField label="آدرس تصویر" hint="لینک تصویر یا فایل PNG، JPG، WebP یا GIF تا ۱ مگابایت.">
      {(id) => <Input id={id} dir="ltr" value={value.src.startsWith("data:") ? "" : value.src} placeholder={value.src.startsWith("data:") ? "تصویر بارگذاری شده است" : "https://…"}
        onChange={(event) => { generation.current++; onChange({ ...value, src: event.target.value }); }} />}
    </EditorField>
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed bg-slate-50 p-3 text-sm text-slate-600">
      <ImagePlus size={17} />{busy ? "در حال خواندن تصویر…" : "انتخاب تصویر از دستگاه"}
      <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={busy}
        onChange={async (event) => {
          const file = event.target.files?.[0]; event.target.value = "";
          if (!file) return;
          if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type) || file.size > MAX_BYTES) { setError("فرمت تصویر یا حجم فایل مجاز نیست."); return; }
          setError(""); setBusy(true);
          const current = ++generation.current;
          try {
            const src = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file);
            });
            if (current === generation.current) onChange({ ...latestValue.current, src });
          } catch { setError("خواندن تصویر انجام نشد."); } finally { setBusy(false); }
        }} />
    </label>
    {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    {value.src && <button type="button" className="text-xs text-red-600" onClick={() => { generation.current++; onChange({ ...value, src: "" }); }}>حذف تصویر</button>}
    <EditorField label="متن جایگزین تصویر">{(id) => <Input id={id} value={value.alt} onChange={(event) => onChange({ ...value, alt: event.target.value })} placeholder="توضیح کوتاه تصویر برای دسترس‌پذیری" />}</EditorField>
  </div>;
}
