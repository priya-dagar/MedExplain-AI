import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getDashboardSummary, getTimeline } from "../services/healthRecordService";
import { DashboardSummary, HealthRecordItem } from "../types/healthRecord";
import {
  Pill,
  FileText,
  MessageSquare,
  Upload,
  FolderOpen,
  ChevronRight,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [timeline, setTimeline] = useState<HealthRecordItem[]>([]);

  useEffect(() => {
    getDashboardSummary().then(setSummary);
    getTimeline().then(setTimeline);
  }, []);

  const activeMedications = timeline.filter((r) => r.record_type === "prescription").length;
  const recentRecordsCount = timeline.length;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const addedThisWeek = timeline.filter((r) => new Date(r.created_at) >= oneWeekAgo).length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-serif text-[#1a2e2e]">
        Welcome{user ? `, ${user.name.split(" ")[0]}` : ""} 👋
      </h1>
      <p className="text-gray-500 mt-1">{today} · Here's your health snapshot for today.</p>

      {/* Health Summary */}
      <p className="text-xs tracking-widest text-gray-500 mt-10 mb-3">HEALTH SUMMARY</p>
      <div className="grid sm:grid-cols-3 gap-5">
        <SummaryCard
          icon={<Pill size={20} className="text-teal-700" />}
          value={activeMedications}
          label="Active Medications"
          sub="From your prescriptions"
        />
        <SummaryCard
          icon={<FileText size={20} className="text-teal-700" />}
          value={recentRecordsCount}
          label="Recent Records"
          sub={`${addedThisWeek} added this week`}
        />
        <SummaryCard
          icon={<MessageSquare size={20} className="text-teal-700" />}
          value={summary?.chat_count ?? 0}
          label="Conversations"
          sub="With AI Health Companion"
        />
      </div>

      {/* Quick Actions */}
      <p className="text-xs tracking-widest text-gray-500 mt-10 mb-3">QUICK ACTIONS</p>
      <div className="grid sm:grid-cols-3 gap-5">
        <Link
          to="/chat"
          className="bg-[#123a37] text-white rounded-xl p-5 flex items-center gap-4 hover:bg-[#0e2f2c] transition"
        >
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <MessageSquare size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Start Chat</h3>
            <p className="text-sm text-white/70">Ask the AI companion anything</p>
          </div>
          <ChevronRight size={18} className="text-white/60" />
        </Link>

        <Link
          to="/upload-prescription"
          className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-teal-300 hover:shadow-sm transition"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
            <Upload size={20} className="text-teal-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1a2e2e]">Upload Prescription</h3>
            <p className="text-sm text-gray-500">Scan or upload a medication doc</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>

        <Link
          to="/health-records"
          className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-teal-300 hover:shadow-sm transition"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
            <FolderOpen size={20} className="text-teal-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1a2e2e]">View Records</h3>
            <p className="text-sm text-gray-500">Browse your health history</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="flex items-center justify-between mt-10 mb-3">
        <p className="text-xs tracking-widest text-gray-500">RECENT ACTIVITY</p>
        <Link to="/health-records" className="text-sm text-teal-700 hover:underline">
          View all
        </Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {timeline.length === 0 && (
          <p className="text-sm text-gray-500 p-5">No activity yet — start a chat or upload a prescription to get going.</p>
        )}
        {timeline.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-5">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
              <FileText size={16} className="text-teal-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1a2e2e]">{item.summary}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Clock size={12} />
                {new Date(item.created_at).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 bg-teal-50 border border-teal-100 rounded-xl p-5">
        <p className="text-sm text-teal-900">
          <strong>Note:</strong> MedExplain AI is designed to help you understand your
          health better — it does not replace professional medical advice. Always consult
          a licensed doctor for diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  value,
  label,
  sub,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  sub: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <p className="text-3xl font-serif text-[#1a2e2e]">{value}</p>
      <p className="font-medium text-[#1a2e2e] mt-1">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
  );
}