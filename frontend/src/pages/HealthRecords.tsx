import { useEffect, useMemo, useState } from "react";
import { getTimeline } from "../services/healthRecordService";
import { HealthRecordItem } from "../types/healthRecord";
import { Search, SlidersHorizontal, Pill, MessageCircle, ChevronRight, X, Calendar } from "lucide-react";

type FilterKey = "all" | "symptom" | "prescription" | "ai_chat";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "symptom", label: "Symptoms" },
  { key: "prescription", label: "Prescriptions" },
  { key: "ai_chat", label: "AI Chats" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleString("en-US", { month: "short" }),
    day: d.getDate(),
    full: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  };
}

function recordTitle(r: HealthRecordItem) {
  if (r.record_type === "prescription") return "Prescription — Uploaded";
  if (r.record_type === "symptom") return "AI Chat — Symptom Discussion";
  return "Record";
}

function recordBadge(r: HealthRecordItem) {
  if (r.record_type === "prescription") return "Prescription";
  return "AI Chat";
}

function RecordIcon({ type, size = 16 }: { type: string; size?: number }) {
  return type === "prescription" ? (
    <Pill size={size} className="text-purple-600" />
  ) : (
    <MessageCircle size={size} className="text-teal-700" />
  );
}

export default function HealthRecords() {
  const [records, setRecords] = useState<HealthRecordItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<HealthRecordItem | null>(null);

  useEffect(() => {
    getTimeline().then(setRecords);
  }, []);

  const filtered = useMemo(() => {
    return records
      .filter((r) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "ai_chat") return r.record_type === "symptom";
        return r.record_type === activeFilter;
      })
      .filter((r) => r.summary.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [records, activeFilter, search]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Search + filter row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a80]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              className="w-full bg-[#efece3] rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-1.5 text-sm font-medium border border-[#d8d5cb] rounded-full px-4 py-2.5 text-[#4a4a44] hover:bg-[#f1efe6]">
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                activeFilter === f.key
                  ? "bg-[#1a4d4a] text-white"
                  : "border border-[#d8d5cb] text-[#4a4a44] hover:bg-[#f1efe6]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <h1 className="font-serif text-3xl font-bold text-[#1a2e2e] mb-1">Health Timeline</h1>
        <p className="text-sm text-[#8a8a80] mb-6">
          {filtered.length} records · newest first
        </p>

        {/* Timeline */}
        <div className="relative">
          {filtered.map((r, i) => {
            const { month, day } = formatDate(r.created_at);
            const isLast = i === filtered.length - 1;
            const isSelected =
              selected?.source_id === r.source_id && selected?.record_type === r.record_type;

            return (
              <div key={`${r.record_type}-${r.source_id}`} className="flex gap-4 pb-6 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      r.record_type === "prescription" ? "bg-[#e9e0f5]" : "bg-[#d9f0ea]"
                    }`}
                  >
                    <RecordIcon type={r.record_type} />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-[#e5e2d8] mt-1" />}
                </div>

                <button
                  onClick={() => setSelected(r)}
                  className={`flex-1 text-left rounded-xl p-4 transition-colors ${
                    isSelected
                      ? "border-2 border-teal-600 bg-white"
                      : "border border-transparent hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span className="text-xs font-mono text-[#8a8a80] pt-1 w-8">
                        {month} {day}
                      </span>
                      <div>
                        <p className="font-semibold text-[#1a2e2e]">{recordTitle(r)}</p>
                        <p className="text-sm text-[#6b6b63] mt-0.5 line-clamp-2">{r.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#d9f0ea] text-teal-800">
                        {recordBadge(r)}
                      </span>
                      <ChevronRight size={16} className="text-[#8a8a80]" />
                    </div>
                  </div>
                </button>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-sm text-[#8a8a80] text-center py-10">No records found.</p>
          )}
        </div>
      </div>

      {/* Detail side panel */}
      {selected && (
        <div className="w-[340px] border-l border-[#e5e2d8] bg-[#f9f8f4] overflow-y-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono tracking-widest text-[#8a8a80] uppercase">
              Record detail
            </p>
            <button onClick={() => setSelected(null)} aria-label="Close">
              <X size={16} className="text-[#8a8a80]" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-teal-700 mb-2">
            <RecordIcon type={selected.record_type} size={16} />
            {recordBadge(selected)}
          </div>
          <h2 className="font-serif text-xl font-bold text-[#1a2e2e] mb-4">
            {recordTitle(selected)}
          </h2>

          <div className="bg-white rounded-lg p-3 mb-4">
            <p className="text-xs text-[#8a8a80] flex items-center gap-1.5">
              <Calendar size={14} />
              Date
            </p>
            <p className="text-sm font-medium text-[#1a2e2e] mt-0.5">
              {formatDate(selected.created_at).full}
            </p>
          </div>

          <p className="text-xs font-mono tracking-widest text-[#8a8a80] uppercase mb-2">
            Summary
          </p>
          <p className="text-sm text-[#3d3d3a] leading-relaxed whitespace-pre-wrap">
            {selected.summary}
          </p>
        </div>
      )}
    </div>
  );
}