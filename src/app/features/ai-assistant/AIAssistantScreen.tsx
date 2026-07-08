import { useState } from "react";
import { Bot, User, Send } from "lucide-react";
import { AI_INIT, AI_SUGGESTIONS } from "../../data/mock";

// ─────────────────────────────────────────────
// AI Assistant
// ─────────────────────────────────────────────

export function AIAssistantScreen() {
  const [messages, setMessages] = useState(AI_INIT);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(prev => [...prev, { role: "user" as const, content: text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant" as const,
        content: `شكراً على سؤالك. وفقاً لبيانات النظام المتاحة، يمكنني معالجة استفسارك حول "${text}". هذه الوظيفة ستكون متاحة بشكل كامل بعد ربط النظام بخدمة الذكاء الاصطناعي وقاعدة البيانات الإنتاجية.`,
      }]);
      setLoading(false);
    }, 1400);
  };

  return (
    <div className="flex flex-col max-w-2xl" style={{ height: "calc(100vh - 136px)" }}>
      <div className="flex items-center gap-3 mb-5 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#3E3124] flex items-center justify-center flex-shrink-0">
          <Bot size={18} className="text-[#D6C5A4]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#3E3124]">المساعد الذكي</h1>
          <p className="text-xs text-[#8B7F72]">مدعوم بالذكاء الاصطناعي — يعمل على بيانات النظام الحي</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-[#C79A32] bg-[#FDF4DC] px-2.5 py-1 rounded-full mr-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C79A32]" />
          وضع التجريب
        </span>
      </div>

      {messages.length === 1 && (
        <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
          {AI_SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              className="text-right px-4 py-3 bg-white border border-[#D8D3C8] rounded-xl text-sm text-[#3E3124]
                hover:border-[#556B2F] hover:bg-[#EEF1E8] transition-all leading-snug">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
              ${m.role === "assistant" ? "bg-[#3E3124]" : "bg-[#EEF1E8]"}`}>
              {m.role === "assistant"
                ? <Bot  size={14} className="text-[#D6C5A4]" />
                : <User size={14} className="text-[#556B2F]" />
              }
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
              ${m.role === "assistant"
                ? "bg-white border border-[#D8D3C8] text-[#3E3124] rounded-tr-sm"
                : "bg-[#556B2F] text-[#F7F4EE] rounded-tl-sm"
              }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#3E3124] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot size={14} className="text-[#D6C5A4]" />
            </div>
            <div className="bg-white border border-[#D8D3C8] px-4 py-3.5 rounded-2xl rounded-tr-sm flex items-center gap-1.5">
              {[0, 200, 400].map(delay => (
                <span key={delay} className="w-1.5 h-1.5 rounded-full bg-[#C4B9A8]"
                  style={{ animation: `bounce 1s ${delay}ms infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 bg-white border border-[#D8D3C8] rounded-xl p-2 shadow-sm flex-shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="اكتب سؤالك هنا..."
          className="flex-1 px-3 py-2 text-sm text-[#3E3124] placeholder:text-[#A09580] bg-transparent focus:outline-none" />
        <button onClick={() => send(input)} disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-lg bg-[#556B2F] flex items-center justify-center text-white
            hover:bg-[#4A5E28] transition-colors disabled:opacity-40 cursor-pointer flex-shrink-0">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
