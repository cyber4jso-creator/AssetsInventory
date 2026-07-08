import { useState } from "react";
import { Package, Eye, EyeOff, AlertCircle, Info } from "lucide-react";
import { Inp } from "../../components/shared";
import { useAuth, DEMO_ACCOUNTS, DEMO_PASSWORD, ROLE_LABELS } from "../../auth";

// ─────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────

export function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState("");

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
    <div dir="rtl" className="min-h-screen flex" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-96 flex-shrink-0 p-12"
        style={{ background: "#3E3124" }}>
        <div>
          <div className="w-12 h-12 rounded-xl bg-[#556B2F] flex items-center justify-center mb-8">
            <Package size={22} className="text-[#F7F4EE]" />
          </div>
          <h2 className="text-2xl font-bold text-[#F7F4EE] leading-snug mb-3">نظام حصر الأصول</h2>
          <p className="text-[#A09580] text-sm leading-relaxed">
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
              <div className="w-1.5 h-1.5 rounded-full bg-[#6B7D45] mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#D6C5A4]">{f.label}</p>
                <p className="text-xs text-[#6B5E4E] mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#6B5E4E]">نظام مؤمّن — جميع الأنشطة مسجّلة ومراقَبة · الإصدار 2.4.1</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#F2F1F1" }}>
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#3E3124] flex items-center justify-center mx-auto mb-3">
              <Package size={20} className="text-[#D6C5A4]" />
            </div>
            <h2 className="text-xl font-bold text-[#3E3124]">نظام حصر الأصول</h2>
          </div>

          <div className="bg-white rounded-2xl border border-[#D8D3C8] shadow-sm p-8">
            <h3 className="text-lg font-bold text-[#3E3124] mb-1">تسجيل الدخول</h3>
            <p className="text-sm text-[#8B7F72] mb-6">أدخل بيانات حسابك للمتابعة</p>

            {authError && (
              <div className="flex items-start gap-2.5 p-3 mb-4 bg-[#FAEAEA] border border-[#E3B8B8] rounded-xl">
                <AlertCircle size={15} className="text-[#B04A4A] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#7A2E2E] leading-relaxed">{authError}</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <Inp label="البريد الإلكتروني" placeholder="user@org.sa" value={email}
                  onChange={v => { setEmail(v); if (fieldErrors.email) setFieldErrors(e => ({ ...e, email: undefined })); }}
                  required />
                {fieldErrors.email && <p className="text-xs text-[#B04A4A] mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#3E3124] mb-1.5 block">
                  كلمة المرور<span className="text-[#B04A4A] mr-1">*</span>
                </label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                    onChange={e => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(er => ({ ...er, password: undefined })); }}
                    className="w-full px-3.5 py-2.5 pl-10 rounded-lg border border-[#D8D3C8] bg-white text-[#3E3124] text-sm
                      placeholder:text-[#A09580] focus:outline-none focus:ring-2 focus:ring-[#556B2F]/25 focus:border-[#556B2F] transition-all" />
                  <button type="button" onClick={() => setShowPassword(s => !s)} tabIndex={-1}
                    className="absolute top-1/2 -translate-y-1/2 left-3 text-[#A09580] hover:text-[#556B2F] transition-colors cursor-pointer">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-xs text-[#B04A4A] mt-1">{fieldErrors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#D8D3C8] text-[#556B2F] focus:ring-[#556B2F]/25 cursor-pointer" />
                  <span className="text-xs text-[#3E3124]">تذكرني</span>
                </label>
                <span title="قريباً">
                  <span className="text-xs text-[#A09580] cursor-not-allowed">نسيت كلمة المرور؟</span>
                </span>
              </div>

              <button onClick={handleLogin} disabled={loading}
                className="w-full py-3 rounded-xl bg-[#556B2F] text-[#F7F4EE] font-semibold text-sm mt-1
                  hover:bg-[#4A5E28] transition-colors disabled:opacity-60 cursor-pointer">
                {loading ? "جارٍ التحقق..." : "دخول"}
              </button>
            </div>

            <div className="flex items-start gap-2.5 p-3 mt-5 bg-[#F7F5F0] border border-[#E8E3D8] rounded-xl">
              <Info size={14} className="text-[#8B7F72] mt-0.5 flex-shrink-0" />
              <div className="text-[11px] text-[#6B7060] leading-relaxed">
                <p className="font-semibold text-[#3E3124] mb-1">بيانات دخول تجريبية</p>
                {DEMO_ACCOUNTS.map(a => (
                  <p key={a.email} className="font-mono">{a.email} — {ROLE_LABELS[a.role]}</p>
                ))}
                <p className="mt-1">كلمة المرور لجميع الحسابات: <span className="font-mono">{DEMO_PASSWORD}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#E8E3D8]" />
              <span className="text-xs text-[#A09580]">أو</span>
              <div className="flex-1 h-px bg-[#E8E3D8]" />
            </div>

            <button className="w-full py-2.5 rounded-xl border border-[#D8D3C8] text-[#3E3124] text-sm font-medium
              flex items-center justify-center gap-2 hover:bg-[#F7F4EE] transition-colors cursor-pointer">
              <svg width="15" height="15" viewBox="0 0 21 21" fill="none">
                <path d="M0 10.5C0 4.701 4.701 0 10.5 0c2.662 0 5.075.963 6.933 2.542L14.608 5.366A6.716 6.716 0 0 0 10.5 3.783c-3.712 0-6.717 3.005-6.717 6.717s3.005 6.717 6.717 6.717c3.282 0 6.041-2.168 6.92-5.113H10.5V8.321H21c.145.7.217 1.432.217 2.179C21.217 16.299 16.516 21 10.5 21 4.701 21 0 16.299 0 10.5z" fill="#4285F4"/>
              </svg>
              دخول عبر Microsoft Entra ID
            </button>
          </div>
          <p className="text-center text-xs text-[#A09580] mt-4">
            استخدام النظام يعني موافقتك على سياسة الاستخدام المقبول
          </p>
        </div>
      </div>
    </div>
  );
}
