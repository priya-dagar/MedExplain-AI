import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Activity, FileText, ClipboardList, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#123a37] text-white flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold">M</div>
            <span className="text-lg font-semibold">
              MedExplain <span className="text-teal-300">AI</span>
            </span>
          </div>
          <h1 className="text-5xl font-serif leading-tight mb-2">
            Your health,<br />
            <span className="text-teal-300">explained.</span>
          </h1>
          <p className="mt-6 text-white/70 max-w-md leading-relaxed">
            An AI companion that translates medical complexity into plain
            language — so you can make informed decisions about your own
            health.
          </p>
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Activity size={18} />
              </div>
              <span className="text-white/90">Understand what your symptoms actually mean</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <span className="text-white/90">Get plain-English breakdowns of any prescription</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <ClipboardList size={18} />
              </div>
              <span className="text-white/90">Keep a private, organized health timeline</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-white/40 tracking-wide">
          HIPAA-ALIGNED &middot; CLINICALLY REVIEWED &middot; NOT A SUBSTITUTE FOR MEDICAL ADVICE
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-[#f5f3ef] px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h2 className="text-3xl font-serif text-[#1a2e2e] mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your MedExplain AI account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-medium tracking-wide text-gray-600 mb-1.5">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#123a37]/30"
            />
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium tracking-wide text-gray-600">
                PASSWORD
              </label>
              <Link to="/forgot-password" className="text-xs text-teal-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#123a37]/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-[#123a37] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#0e2f2c] disabled:opacity-50 transition"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
            {!isSubmitting && <ArrowRight size={18} />}
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-teal-700 font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}