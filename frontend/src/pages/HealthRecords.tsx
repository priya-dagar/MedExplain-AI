import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getTimeline } from "../services/healthRecordService";
import { HealthRecordItem } from "../types/healthRecord";

export default function HealthRecords() {
  const [records, setRecords] = useState<HealthRecordItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTimeline()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Health Timeline</h1>

        {loading && <p className="text-gray-500">Loading your health records...</p>}

        {!loading && records.length === 0 && (
          <p className="text-gray-500">No health records yet.</p>
        )}

        <div className="space-y-3">
          {records.map((r, i) => (
            <div key={i} className="bg-white border rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    r.record_type === "symptom"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {r.record_type}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{r.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}