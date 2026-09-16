import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowRight, IconX } from "../ui/Icons";

const FAQ = [
  { match: ["leave", "pto", "vacation"], answer: "You can apply for leave under Leave > Apply Leave. Your balance updates live once a manager approves it." },
  { match: ["comp", "comp-off", "compoff"], answer: "Comp-off is earned by working a holiday or week-off. Apply from Attendance & Shift > Comp-Off, then your manager approves and you redeem it against a future date." },
  { match: ["payslip", "salary", "pay"], answer: "Payslips are issued by our payroll vendor and listed on your Dashboard under My Payslips. This system doesn't calculate salary." },
  { match: ["holiday"], answer: "Upcoming holidays for your location are on your Dashboard, and the full calendar is in Policy Hub." },
  { match: ["resign", "resignation", "quit"], answer: "Head to Exit > Resignation to submit yours, with your preferred last working day." },
  { match: ["password", "access", "login"], answer: "This demo uses a role switcher instead of real login — click your name in the top-right to switch roles." },
];
const FALLBACK = "I'm a prototype — in the real build I'd route this to HR Helpdesk automatically. Try asking about leave, comp-off, payslips, holidays, or resignation.";

export default function HrChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi! I'm the ITBD HR Assistant prototype. Ask me about leave, comp-off, payslips, or holidays." }]);
  const [input, setInput] = useState("");

  function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    const hit = FAQ.find((f) => f.match.some((m) => lower.includes(m)));
    setMessages((prev) => [...prev, { from: "user", text }, { from: "bot", text: hit?.answer ?? FALLBACK }]);
    setInput("");
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-36 right-4 z-40 flex h-[420px] w-[320px] flex-col overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] sm:bottom-24 sm:right-6"
            style={{ boxShadow: "var(--shadow-pop)" }}
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-cyan to-brand-cyan-dark px-4 py-3 text-white">
              <div>
                <p className="text-sm font-semibold">HR Assistant</p>
                <p className="text-[11px] opacity-80">Prototype · WhatsApp-style self-service (roadmap #21)</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-white/15" aria-label="Close chat">
                <IconX size={16} />
              </button>
            </div>
            <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
              {messages.map((m, i) => (
                <div key={i} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.from === "bot" ? "bg-[var(--surface-2)] text-[var(--text-primary)]" : "ml-auto bg-brand-cyan text-white"}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={send} className="flex items-center gap-2 border-t border-[var(--surface-border)] p-2.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about leave, comp-off…"
                className="flex-1 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] px-3 py-1.5 text-sm outline-none focus:border-brand-cyan/50"
              />
              <button type="submit" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-cyan text-white hover:brightness-110" aria-label="Send">
                <IconArrowRight size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-green text-white sm:bottom-6 sm:right-6"
        style={{ width: 52, height: 52, boxShadow: "var(--glow-cyan)" }}
        aria-label={open ? "Close HR Assistant" : "Open HR Assistant"}
      >
        {open ? <IconX size={20} /> : <ChatIcon />}
      </motion.button>
    </>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}
