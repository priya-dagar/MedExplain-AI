import { Link } from "react-router-dom";
import {
  Activity,
  FileText,
  ClipboardList,
  ArrowRight,
  Shield,
  Zap,
  Heart,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-[#f5f3ef]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#123a37] text-white flex items-center justify-center font-bold">
            M
          </div>
          <span className="text-lg font-semibold text-[#1a2e2e]">
            MedExplain <span className="text-teal-600">AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-gray-700">
          <a href="#features" className="hover:text-[#123a37]">Features</a>
          <a href="#about" className="hover:text-[#123a37]">About</a>
        </div>
        <Link
          to="/register"
          className="bg-[#123a37] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0e2f2c] transition"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-2 text-xs tracking-wide text-gray-600 border border-gray-300 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          YOUR AI HEALTH COMPANION
        </span>
        <h1 className="text-5xl md:text-6xl font-serif text-[#1a2e2e] leading-tight mb-2">
          Medicine, explained
        </h1>
        <h1 className="text-5xl md:text-6xl font-serif text-teal-500 leading-tight mb-6">
          clearly.
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          MedExplain AI helps you understand what your body is telling you,
          what your prescriptions actually do, and keep your health history
          organized — all in one private, intelligent space.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700">
            Understand Symptoms
          </span>
          <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700">
            Explain Prescriptions
          </span>
          <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700">
            Maintain Health Records
          </span>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Link
            to="/register"
            className="bg-[#123a37] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-[#0e2f2c] transition"
          >
            Get Started <ArrowRight size={18} />
          </Link>
          <a href="#features" className="text-gray-700 underline hover:text-[#123a37]">
            See how it works
          </a>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-y border-gray-200 py-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-10 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-teal-600" />
            HIPAA-aligned privacy
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-teal-600" />
            Real-time AI analysis
          </div>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-teal-600" />
            Clinically reviewed responses
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-end mb-14">
          <div>
            <p className="text-xs tracking-widest text-gray-500 mb-3">CORE FEATURES</p>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a2e2e] leading-tight">
              Three tools, one coherent health picture.
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Most people search symptoms on generic engines and get overwhelmed.
            MedExplain AI gives you structured, sourced answers — calibrated
            to what you actually need to know, not what generates the most
            anxiety.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Activity size={20} className="text-teal-700" />}
            tag="Symptom Analysis"
            title="Understand Symptoms"
            description="Describe what you're feeling in plain language. MedExplain AI cross-references thousands of clinical sources to give you clear, contextual guidance — not panic-inducing search results."
          />
          <FeatureCard
            icon={<FileText size={20} className="text-teal-700" />}
            tag="Medication Clarity"
            title="Explain Prescriptions"
            description="Upload a photo or type your medication name. Get a plain-English breakdown of what it does, common side effects, interactions to watch for, and questions to ask your doctor."
          />
          <FeatureCard
            icon={<ClipboardList size={20} className="text-teal-700" />}
            tag="Personal Records"
            title="Maintain Health Records"
            description="Keep a structured, private timeline of visits, diagnoses, and medications. Share a clean summary with any provider in seconds — no more repeating your history from memory."
          />
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-[#123a37] text-white text-center px-6 py-24">
        <p className="text-xs tracking-widest text-white/60 mb-4">ABOUT MEDEXPLAIN AI</p>
        <h2 className="text-4xl md:text-5xl font-serif mb-6 max-w-3xl mx-auto leading-tight">
          Built for patients, not for panic.
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          MedExplain AI was created by a team of engineers and clinicians who
          were tired of watching people make health decisions based on
          fear-driven search results. Every response is grounded in vetted
          medical literature and reviewed by licensed practitioners.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition"
        >
          Start for free <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-4 px-8 py-6 bg-[#f5f3ef] border-t border-gray-200">
        <span className="font-semibold text-[#1a2e2e]">
          MedExplain <span className="text-teal-600">AI</span>
        </span>
        <p className="text-sm text-gray-500">
          Not a substitute for professional medical advice. Always consult
          your physician.
        </p>
        <div className="flex gap-5 text-sm text-gray-600">
          <Link to="/privacy" className="hover:text-[#123a37]">Privacy</Link>
          <Link to="/terms" className="hover:text-[#123a37]">Terms</Link>
          <Link to="/contact" className="hover:text-[#123a37]">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  tag,
  title,
  description,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
          {tag}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-[#1a2e2e] mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
      <a href="#features" className="text-teal-700 text-sm font-medium hover:underline inline-flex items-center gap-1">
        Learn more <ArrowRight size={14} />
      </a>
    </div>
  );
}