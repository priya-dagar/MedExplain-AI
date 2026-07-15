import { useState, ChangeEvent, FormEvent } from "react";
import { Prescription } from "../types/prescription";
import { uploadPrescription } from "../services/prescriptionService";
import Navbar from "../components/Navbar";

export default function UploadPrescription() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<Prescription | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setResult(null);
    setError("");
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError("");
    try {
      const data = await uploadPrescription(file);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to analyze prescription. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose a prescription image
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {preview && (
            <img
              src={preview}
              alt="Prescription preview"
              className="max-h-64 rounded-md border mb-4 object-contain"
            />
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={!file || isUploading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? "Analyzing prescription..." : "Analyze Prescription"}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-md font-semibold text-gray-800 mb-3">AI Explanation</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {result.ai_summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}