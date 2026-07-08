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
    <div dir="rtl" className="relative min-h-screen w-full overflow-hidden" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      {/* Background carousel */}
      <div className="absolute inset-0">
        {SLIDES.map((src, i) => (
          <img key={src} src={src} alt="" aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === activeSlide ? "opacity-100" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.25) 40%, rgba(0,0,0,.55) 100%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-10 p-8 lg:p-16">
        {/* Brand panel */}
        <div className="hidden lg:flex flex-col justify-between h-full max-w-sm py-4">
          <div>
            <p className="text-white text-sm leading-relaxed max-w-xs">
              منصة متكاملة لإدارة ومتابعة الأصول الحكومية عبر دورة حياتها الكاملة — من الاقتناء حتى الشطب.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: "تتبع دقيق",      desc: "رصد كامل لحركة الأصول والمسؤوليات" },
              { label: "QR & باركود",    desc: "مسح فوري وربط أصل بلمسة" },
              { label: "تقارير ذكية",    desc: "لوحات Power BI وتحليلات متقدمة" },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D0A165] mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs text-white/70 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/60">نظام مؤمّن — جميع الأنشطة مسجّلة ومراقَبة · الإصدار 2.4.1</p>
        </div>

        {/* Login card */}
        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <div className="rounded-2xl p-7"
            style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 20px 50px -12px rgba(0,0,0,0.35)" }}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#2A3172] flex items-center justify-center flex-shrink-0">
                <Package size={17} className="text-white" />
              </div>
              <span className="text-sm font-bold text-[#2B2B2B]">نظام حصر الأصول</span>
            </div>

            <h3 className="text-lg font-bold text-[#2B2B2B] mb-1">تسجيل الدخول</h3>
            <p className="text-sm text-[#6B7280] mb-6">أدخل بيانات حسابك للمتابعة</p>

            {authError && (
              <div className="flex items-start gap-2.5 p-3 mb-4 bg-[#FAEDED] border border-[#E8B4B4] rounded-xl">
                <AlertCircle size={15} className="text-[#C44D4D] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#9E3A3A] leading-relaxed">{authError}</p>
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div>
                <Inp label="البريد الإلكتروني" placeholder="user@org.sa" value={email}
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

              <div className="flex items-center justify-between">
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
                  hover:bg-[#B8894E] active:bg-[#A07840] transition-colors disabled:opacity-60 cursor-pointer">
                {loading ? "جارٍ التحقق..." : "دخول"}
              </button>
            </div>

            <details className="group mt-5">
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

            <p className="text-center text-[10px] text-[#6B7280] mt-6">
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
