import { useState, FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import * as authService from "../services/authService";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string })?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await authService.verifyOtp(email, otp);
      navigate("/login", { state: { verified: true } });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid or expired code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      await authService.resendOtp(email);
      setMessage("A new code has been sent.");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not resend code.");
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-gray-700 mb-4">No email found. Please sign up again.</p>
          <Link to="/register" className="text-blue-600 hover:underline">
            Go to Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">Verify your email</h1>
        <p className="text-sm text-gray-600 mb-6">
          We sent a 6-digit code to <span className="font-medium">{email}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm">{message}</div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Verification code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center text-lg"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Didn't get a code?{" "}
          <button type="button" onClick={handleResend} className="text-blue-600 hover:underline">
            Resend
          </button>
        </p>
      </form>
    </div>
  );
}