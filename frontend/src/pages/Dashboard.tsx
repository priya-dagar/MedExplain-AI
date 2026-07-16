import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/healthRecordService";
import { DashboardSummary } from "../types/healthRecord";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    getDashboardSummary().then(setSummary);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what you can do with MedExplain AI today.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <Link
            to="/chat"
            className="group bg-white p-6 rounded-xl border hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-lg mb-4">
              💬
            </div>
            <h2 className="font-semibold text-gray-800 group-hover:text-blue-700">
              AI Symptom Chat
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Describe how you're feeling and get clear, safe guidance on possible causes.
            </p>
          </Link>

          <Link
            to="/upload-prescription"
            className="group bg-white p-6 rounded-xl border hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 text-lg mb-4">
              📄
            </div>
            <h2 className="font-semibold text-gray-800 group-hover:text-blue-700">
              Upload Prescription
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload a photo of your prescription and get a plain-language explanation.
            </p>
          </Link>
        </div>

        {summary && (
          <div className="mt-8 bg-white border rounded-xl p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Your Activity</h2>
            <p className="text-sm text-gray-600">💬 {summary.chat_count} conversations so far</p>
            {summary.last_activity_summary && (
              <p className="text-sm text-gray-600 mt-2">
                🕓 Last activity: {summary.last_activity_summary}
              </p>
            )}
          </div>
        )}

        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-5">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> MedExplain AI is designed to help you understand your
            health better — it does not replace professional medical advice. Always consult
            a licensed doctor for diagnosis and treatment.
          </p>
        </div>
      </div>
    </div>
  );
}