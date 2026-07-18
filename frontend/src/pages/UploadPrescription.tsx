import { useState, useRef, useCallback } from "react";
import api from "../services/api"; // adjust path to match your project structure

interface UploadResult {
  image_url: string;
  ai_summary: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/heic", "application/pdf"];
const MAX_SIZE_MB = 10;

export default function UploadPrescription() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback((f: File) => {
    setErrorMsg(null);
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setErrorMsg("Unsupported file type. Use JPG, PNG, HEIC, or PDF.");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File is too large. Max ${MAX_SIZE_MB} MB.`);
      return;
    }
    setFile(f);
    setStatus("idle");
    setResult(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) validateAndSet(dropped);
    },
    [validateAndSet]
  );

  const handleBrowse = () => inputRef.current?.click();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    if (chosen) validateAndSet(chosen);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post<UploadResult>("/api/prescription/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Upload failed. Please try again.");
    }
  };

  return (
    <div className="px-10 py-8 max-w-6xl">
      <h1 className="font-serif text-4xl font-bold text-[#1a2e2e] mb-2">
        Upload a Prescription
      </h1>
      <p className="text-[#6b6b63] mb-8">
        Drag in a photo or scan of your prescription and our AI will extract, structure, and
        explain it for you.
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Document Input */}
        <div>
          <p className="text-xs font-mono tracking-widest text-[#8a8a80] uppercase mb-3">
            Document Input
          </p>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center min-h-[380px] transition-colors ${
              isDragging ? "border-teal-600 bg-teal-50" : "border-[#d8d5cb] bg-[#e9e6dd]"
            }`}
          >
            <div className="w-14 h-14 rounded-lg bg-[#dcecea] flex items-center justify-center mb-5">
              <i className="ti ti-file-description text-2xl text-teal-700" aria-hidden="true" />
            </div>

            {!file ? (
              <>
                <p className="font-semibold text-[#1a2e2e] text-lg mb-1">
                  Drag & drop your prescription
                </p>
                <p className="text-sm text-[#8a8a80] mb-6">PNG, JPG, PDF · Up to 10 MB</p>
                <div className="flex items-center gap-3 w-full max-w-xs mb-6">
                  <div className="h-px bg-[#d8d5cb] flex-1" />
                  <span className="text-xs text-[#8a8a80]">or</span>
                  <div className="h-px bg-[#d8d5cb] flex-1" />
                </div>
                <button
                  onClick={handleBrowse}
                  className="bg-[#1a4d4a] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#153f3c] transition-colors"
                >
                  Browse File
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  onChange={handleFileInput}
                  className="hidden"
                />
              </>
            ) : (
              <>
                <p className="font-semibold text-[#1a2e2e] text-lg mb-1">{file.name}</p>
                <p className="text-sm text-[#8a8a80] mb-6">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={handleUpload}
                  disabled={status === "uploading"}
                  className="bg-[#1a4d4a] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#153f3c] transition-colors disabled:opacity-60"
                >
                  {status === "uploading" ? "Analyzing…" : "Analyze Prescription"}
                </button>
              </>
            )}
          </div>

          {errorMsg && <p className="text-sm text-red-600 mt-2">{errorMsg}</p>}

          <div className="flex items-center gap-2 mt-4 text-sm text-[#8a8a80]">
            {["JPG", "PNG", "HEIC", "PDF"].map((fmt) => (
              <span
                key={fmt}
                className="px-3 py-1 rounded-full border border-[#d8d5cb] text-xs"
              >
                {fmt}
              </span>
            ))}
            <span className="ml-1">supported formats</span>
          </div>
        </div>

        {/* Right: AI Analysis */}
        <div>
          <p className="text-xs font-mono tracking-widest text-[#8a8a80] uppercase mb-3">
            AI Analysis
          </p>
          <div className="rounded-xl border-2 border-dashed border-[#d8d5cb] p-10 flex flex-col items-center justify-center text-center min-h-[380px] bg-white/40">
            {status !== "done" ? (
              <>
                <div className="w-14 h-14 rounded-lg bg-[#e9e6dd] flex items-center justify-center mb-5">
                  <i className="ti ti-scan text-2xl text-[#8a8a80]" aria-hidden="true" />
                </div>
                <p className="font-semibold text-[#1a2e2e] text-lg mb-1">AI Analysis</p>
                <p className="text-sm text-[#8a8a80]">
                  Upload a prescription to see extracted details here
                </p>
              </>
            ) : (
              <div className="text-left w-full">
                <p className="font-semibold text-[#1a2e2e] text-lg mb-3">Summary</p>
                <p className="text-[#3d3d3a] leading-relaxed whitespace-pre-wrap">
                  {result?.ai_summary}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}