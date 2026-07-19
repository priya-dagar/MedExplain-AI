import { useEffect, useState, KeyboardEvent } from "react";
import api from "../services/api";
import { X } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
  blood_group: string | null;
  allergies: string | null; // comma-separated
  medical_history: string | null;
}

const GENDER_OPTIONS = ["Female", "Male", "Other", "Prefer not to say"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [allergyInput, setAllergyInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<ProfileData>("/api/profile").then((res) => setProfile(res.data));
  }, []);

  if (!profile) {
    return <div className="px-10 py-8 text-[#8a8a80]">Loading profile…</div>;
  }

  const allergyList = profile.allergies
    ? profile.allergies.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  const updateField = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  };

  const addAllergy = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" && e.key !== ",") return;
    e.preventDefault();
    const value = allergyInput.trim();
    if (!value || allergyList.includes(value)) {
      setAllergyInput("");
      return;
    }
    updateField("allergies", [...allergyList, value].join(","));
    setAllergyInput("");
  };

  const removeAllergy = (allergy: string) => {
    updateField("allergies", allergyList.filter((a) => a !== allergy).join(","));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put<ProfileData>("/api/profile", profile);
      setProfile(res.data);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-10 py-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl bg-[#1a4d4a] text-white flex items-center justify-center text-2xl font-semibold flex-shrink-0">
          {profile.name?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1a2e2e]">My Profile</h1>
          <p className="text-sm text-[#8a8a80]">Personal details and medical information</p>
        </div>
      </div>

      <p className="text-xs font-mono tracking-widest text-[#8a8a80] uppercase mb-4">
        Personal information
      </p>

      <div className="grid grid-cols-2 gap-5 mb-8">
        <div>
          <label className="text-sm text-[#4a4a44] mb-1.5 block">Full Name</label>
          <input
            value={profile.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full bg-white border border-[#e5e2d8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
          />
        </div>
        <div>
          <label className="text-sm text-[#4a4a44] mb-1.5 block">Age</label>
          <input
            type="number"
            value={profile.age ?? ""}
            onChange={(e) =>
              updateField("age", e.target.value ? Number(e.target.value) : null)
            }
            className="w-full bg-white border border-[#e5e2d8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
          />
        </div>
        <div>
          <label className="text-sm text-[#4a4a44] mb-1.5 block">Gender</label>
          <select
            value={profile.gender ?? ""}
            onChange={(e) => updateField("gender", e.target.value)}
            className="w-full bg-white border border-[#e5e2d8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
          >
            <option value="">Select</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-[#4a4a44] mb-1.5 block">Blood Group</label>
          <select
            value={profile.blood_group ?? ""}
            onChange={(e) => updateField("blood_group", e.target.value)}
            className="w-full bg-white border border-[#e5e2d8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-600"
          >
            <option value="">Select</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <hr className="border-[#e5e2d8] mb-8" />

      <p className="text-xs font-mono tracking-widest text-[#8a8a80] uppercase mb-4">
        Medical details
      </p>

      <div className="mb-6">
        <label className="text-sm text-[#4a4a44] mb-1.5 block">Known Allergies</label>
        <div className="w-full bg-white border border-[#e5e2d8] rounded-lg px-3 py-2 flex flex-wrap items-center gap-2">
          {allergyList.map((allergy) => (
            <span
              key={allergy}
              className="flex items-center gap-1.5 bg-[#d9f0ea] text-teal-800 text-sm px-3 py-1 rounded-full"
            >
              {allergy}
              <button onClick={() => removeAllergy(allergy)} aria-label={`Remove ${allergy}`}>
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            onKeyDown={addAllergy}
            placeholder={allergyList.length === 0 ? "Add an allergy…" : ""}
            className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none py-1"
          />
        </div>
        <p className="text-xs text-[#8a8a80] mt-1.5">
          Press Enter or comma to add each item. Backspace to remove the last.
        </p>
      </div>

      <div className="mb-8">
        <label className="text-sm text-[#4a4a44] mb-1.5 block">Medical History</label>
        <textarea
          value={profile.medical_history ?? ""}
          onChange={(e) => updateField("medical_history", e.target.value)}
          rows={5}
          className="w-full bg-white border border-[#e5e2d8] rounded-lg px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-teal-600 resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1a4d4a] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#153f3c] transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span className="text-sm text-teal-700">Saved</span>}
      </div>
    </div>
  );
}