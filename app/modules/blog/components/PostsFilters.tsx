import { Search, SlidersHorizontal, X } from "lucide-react";
import type { PostSort, PostStatusFilter } from "../hooks/usePosts";

const TABS = [{ value: "all", label: "همه مطالب" }, { value: "published", label: "منتشرشده" }, { value: "draft", label: "پیش‌نویس‌ها" }] as const;
type Props = {
  query: string; onQuery: (value: string) => void;
  status: PostStatusFilter; onStatus: (value: PostStatusFilter) => void;
  tag: string; tags: string[]; onTag: (value: string) => void;
  sort: PostSort; onSort: (value: PostSort) => void;
  counts: Record<PostStatusFilter, number>;
};
export default function PostsFilters({ query, onQuery, status, onStatus, tag, tags, onTag, sort, onSort, counts }: Props) {
  return <div className="space-y-5">
    <div className="flex gap-5 overflow-x-auto border-b border-stone-100 sm:gap-7" aria-label="فیلتر وضعیت مطالب">{TABS.map((tab) => <button key={tab.value} type="button" aria-pressed={status === tab.value} onClick={() => onStatus(tab.value)} className={`relative flex shrink-0 items-center gap-2 border-b-2 pb-4 pt-2 text-xs transition-colors ${status === tab.value ? "border-stone-800 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-700"}`}>{tab.label}<span className={`rounded px-1.5 py-0.5 text-[10px] ${status === tab.value ? "bg-stone-100 text-stone-600" : "text-stone-400"}`}>{counts[tab.value].toLocaleString("fa-IR")}</span></button>)}</div>
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-48 flex-1 sm:max-w-sm">
        <Search size={15} strokeWidth={1.5} className="pointer-events-none absolute right-3 top-3 text-stone-400" />
        <input type="search" aria-label="جست‌وجوی مطالب" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="جست‌وجو در مطالب…" className="h-10 w-full rounded-lg border border-stone-200 bg-white pr-9 pl-3 text-xs text-stone-700 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400" />
      </div>
      <div className="mr-auto flex flex-wrap items-center gap-2">
        <SlidersHorizontal size={14} strokeWidth={1.5} aria-hidden="true" className="ml-1 hidden text-stone-400 sm:block" />
        <select aria-label="فیلتر تگ" value={tag} onChange={(event) => onTag(event.target.value)} className="h-10 max-w-40 rounded-lg border border-stone-200 bg-white px-2 text-[11px] text-stone-500 outline-none focus:border-stone-400"><option value="">همه تگ‌ها</option>{tags.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select aria-label="مرتب‌سازی مطالب" value={sort} onChange={(event) => onSort(event.target.value as PostSort)} className="h-10 rounded-lg border border-stone-200 bg-white px-2 text-[11px] text-stone-500 outline-none focus:border-stone-400"><option value="newest">آخرین ویرایش</option><option value="oldest">قدیمی‌ترین ویرایش</option><option value="title">عنوان مطلب</option></select>
      </div>
      {(query || tag) && <button type="button" onClick={() => { onQuery(""); onTag(""); }} className="flex items-center gap-1 p-2 text-[10px] text-stone-400 hover:text-stone-700"><X size={12} />پاک کردن فیلترها</button>}
    </div>
  </div>;
}
