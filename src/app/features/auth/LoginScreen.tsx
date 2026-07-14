import { useEffect, useState } from "react";
import { Package, Eye, EyeOff, AlertCircle, ChevronDown } from "lucide-react";
import { Inp } from "../../components/shared";
import { useAuth, DEMO_ACCOUNTS, DEMO_PASSWORD, ROLE_LABELS } from "../../auth";
import lagoonBg from "./images/login-bg-lagoon.png";
import canyonBg from "./images/login-bg-canyon.png";

// ─────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────

const SLIDES = [lagoonBg, canyonBg];
const SLIDE_INTERVAL_MS = 7000;

const FEATURES = [
  {
    icon: "📦",
    title: "إدارة دورة حياة الأصل",
    desc: "من التسجيل وحتى الشطب مع تتبع كامل لكل مرحلة.",
  },
  {
    icon: "📱",
    title: "QR ذكي",
    desc: "وصول فوري إلى بيانات الأصل وسجلّه بمجرد المسح.",
  },
  {
    icon: "📊",
    title: "تقارير ولوحات معلومات",
    desc: "تحليلات تفاعلية وتكامل مع Power BI لدعم اتخاذ القرار.",
  },
] as const;

export function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveSlide(i => (i + 1) % SLIDES.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [activeSlide]);

  const validate = () => {
    const next: typeof fieldErrors = {};
    if (!email.trim()) next.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "صيغة البريد الإلكتروني غير صحيحة";
    if (!password) next.password = "كلمة المرور مطلوبة";
    else if (password.length < 6) next.password = "كلمة المرور يجب ألا تقل عن 6 أحرف";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    setAuthError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="relative min-h-screen w-full overflow-hidden" style={{ fontFamily: "'Thmanyah Serif Text', system-ui, sans-serif" }}>
      {/* Background carousel */}
      <div className="absolute inset-0">
        {SLIDES.map((src, i) => (
          <img key={src} src={src} alt="" aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === activeSlide ? "opacity-100" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.38) 0%, rgba(0,0,0,.18) 45%, rgba(0,0,0,.46) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(270deg, rgba(0,0,0,.40) 0%, rgba(0,0,0,.14) 48%, transparent 72%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 p-8 lg:px-16 lg:py-14">
        {/* Hero panel */}
        <div className="hidden lg:flex flex-col justify-between flex-1 min-h-[calc(100vh-7rem)] max-w-2xl py-2">
          <div className="flex flex-col justify-center flex-1">
            <h1
              className="text-white leading-[1.2] max-w-[550px]"
              style={{
                fontFamily: "'Thmanyah Serif Text', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(52px, 3.6vw, 60px)",
              }}
            >
              منصة ذكية لإدارة الأصول الحكومية
            </h1>

            <p
              className="mt-7 text-white/72 leading-[1.75] max-w-[550px]"
              style={{ fontSize: "clamp(20px, 1.5vw, 22px)" }}
            >
              تتبع جميع الأصول من الاستلام وحتى الشطب عبر منصة موحدة، مع QR Code، وسجل حركة وصيانة متكامل، ولوحات معلومات تساعد على اتخاذ القرار.
            </p>

            <div className="mt-12 flex flex-col gap-4 max-w-xl">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl p-5 bg-white/[0.08] hover:bg-white/[0.13] border border-white/[0.14] hover:border-white/[0.22] shadow-[0_4px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-[background,box-shadow,border-color,transform] duration-300 hover:-translate-y-0.5"
                  style={{
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[1.65rem] leading-none flex-shrink-0 w-9 text-center select-none">{f.icon}</span>
                    <div>
                      <p className="text-[15px] font-semibold text-white leading-snug">{f.title}</p>
                      <p className="text-sm text-white/68 mt-1.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-white/55 pt-10">نظام مؤمّن — جميع الأنشطة مسجّلة ومراقَبة · الإصدار 2.4.1</p>
        </div>

        {/* Login card */}
        <div className="w-full max-w-sm mx-auto lg:mx-0 flex-shrink-0">
          <div
            className="rounded-2xl px-8 py-8"
            style={{
              background: "rgba(255,255,255,0.86)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.65)",
              boxShadow: "0 20px 50px -12px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-11 h-11 rounded-xl bg-[#2A3172] flex items-center justify-center flex-shrink-0">
                <Package size={20} className="text-white" />
              </div>
              <span className="text-[15px] font-bold text-[#2B2B2B] tracking-tight">نظام حصر الأصول</span>
            </div>

            <h3 className="text-xl font-bold text-[#2B2B2B] mb-1.5">تسجيل الدخول</h3>
            <p className="text-sm text-[#6B7280] mb-7 leading-relaxed">أدخل بيانات حسابك للمتابعة</p>

            {authError && (
              <div className="flex items-start gap-2.5 p-3 mb-5 bg-[#FAEDED] border border-[#E8B4B4] rounded-xl">
                <AlertCircle size={15} className="text-[#C44D4D] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#9E3A3A] leading-relaxed">{authError}</p>
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div>
                <Inp label="البريد الإلكتروني" placeholder="employee@org.sa" value={email}
                  onChange={v => { setEmail(v); if (fieldErrors.email) setFieldErrors(e => ({ ...e, email: undefined })); }}
                  required />
                {fieldErrors.email && <p className="text-xs text-[#C44D4D] mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#2B2B2B] mb-1.5 block">
                  كلمة المرور<span className="text-[#C44D4D] mr-1">*</span>
                </label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                    onChange={e => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(er => ({ ...er, password: undefined })); }}
                    className="w-full px-3.5 py-2.5 pl-10 rounded-lg border border-[#E5E7EB] bg-white text-[#2B2B2B] text-sm
                      placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165] transition-all" />
                  <button type="button" onClick={() => setShowPassword(s => !s)} tabIndex={-1}
                    className="absolute top-1/2 -translate-y-1/2 left-3 text-[#6B7280] hover:text-[#2A3172] transition-colors cursor-pointer">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-xs text-[#C44D4D] mt-1">{fieldErrors.password}</p>}
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#E5E7EB] text-[#2A3172] focus:ring-[#D0A165]/30 cursor-pointer" />
                  <span className="text-xs text-[#2B2B2B]">تذكرني</span>
                </label>
                <span title="قريباً">
                  <span className="text-xs text-[#6B7280] cursor-not-allowed">نسيت كلمة المرور؟</span>
                </span>
              </div>

              <button onClick={handleLogin} disabled={loading}
                className="w-full py-3 rounded-xl bg-[#D0A165] text-[#2B2B2B] font-semibold text-sm
                  hover:bg-[#B8894E] active:bg-[#A07840] transition-colors disabled:opacity-60 cursor-pointer mt-1">
                {loading ? "جارٍ التحقق..." : "دخول"}
              </button>
            </div>

            <details className="group mt-6">
              <summary className="flex items-center gap-1.5 text-xs text-[#6B7280] cursor-pointer select-none list-none hover:text-[#2B2B2B] transition-colors">
                <ChevronDown size={13} className="transition-transform group-open:rotate-180" />
                عرض بيانات دخول تجريبية
              </summary>
              <div className="text-[11px] text-[#6B7280] leading-relaxed mt-2 pr-[19px]">
                {DEMO_ACCOUNTS.map(a => (
                  <p key={a.email} className="font-mono">{a.email} — {ROLE_LABELS[a.role]}</p>
                ))}
                <p className="mt-1">كلمة المرور لجميع الحسابات: <span className="font-mono">{DEMO_PASSWORD}</span></p>
              </div>
            </details>

            <p className="text-center text-[10px] text-[#6B7280] mt-7 leading-relaxed">
              استخدام النظام يعني موافقتك على سياسة الاستخدام المقبول
            </p>
          </div>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-6 inset-x-0 z-10 flex items-center justify-center gap-2">
        {SLIDES.map((src, i) => (
          <button key={src} onClick={() => setActiveSlide(i)} aria-label={`الشريحة ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === activeSlide ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"}`} />
        ))}
      </div>
    </div>
  );
}
