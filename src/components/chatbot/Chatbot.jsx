import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useSettings } from "../../hooks/useStore";
import { whatsappGeneralUrl } from "../../lib/whatsapp";

const QUICK_PROMPTS = [
  "What sizes are available?",
  "Is COD available?",
  "How do I order?",
  "Where is the shop located?",
];

function answerFor(text, s) {
  const q = text.toLowerCase();
  if (q.includes("size"))
    return "We stock S, M, L, XL and XXL depending on the product — check the size selector on each product page. Unsure of your fit? Message us on WhatsApp with your measurements.";
  if (q.includes("cod") || q.includes("payment") || q.includes("cash"))
    return "Retro Clothing is Cash on Delivery only, all over India. No online payment needed at checkout.";
  if (q.includes("deliver") || q.includes("ship"))
    return `${s.deliveryInfo} We ship all over India.`;
  if (q.includes("order") || q.includes("buy") || q.includes("whatsapp"))
    return "Pick a product, choose your size, then tap 'Order on WhatsApp' — it opens a pre-filled message straight to our team for confirmation.";
  if (q.includes("offer") || q.includes("discount") || q.includes("sale"))
    return "Check the Offer Products page — every discounted piece shows both the original and current price with an offer badge.";
  if (q.includes("location") || q.includes("shop") || q.includes("address") || q.includes("store"))
    return `Our flagship store: ${s.address}. Open daily, ${s.shopTiming.replace("Open Daily · ", "")}.`;
  if (q.includes("contact") || q.includes("phone") || q.includes("number") || q.includes("call"))
    return `You can reach us at ${s.phone1} or ${s.phone2}, or email ${s.email}.`;
  if (q.includes("shirt") || q.includes("tee") || q.includes("pant") || q.includes("categor"))
    return "We carry Shirts, Tees and Pants — every category has its own page with filters for size, price and new arrivals.";
  return "I can help with products, sizes, prices, offers, COD, delivery, WhatsApp ordering or our shop location — what would you like to know?";
}

export default function Chatbot() {
  const s = useSettings();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi, I'm the Retro Clothing assistant. Ask me about products, sizes, offers, COD or delivery.",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (text) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setMessages((m) => [...m, { role: "user", text: value }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: answerFor(value, s) }]);
    }, 400);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        aria-label="Open chat assistant"
        className="glass-strong fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full text-bone shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
      >
        {open ? <X size={20} strokeWidth={1.75} /> : <MessageCircle size={20} strokeWidth={1.75} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong fixed bottom-24 right-5 z-[90] flex h-[440px] w-[calc(100vw-2.5rem)] max-w-[360px] flex-col overflow-hidden rounded-[22px]"
          >
            <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
              <Sparkles size={16} strokeWidth={1.75} className="text-bone" />
              <div>
                <p className="text-sm font-medium text-bone">Retro Assistant</p>
                <p className="text-[11px] text-mist">Usually replies instantly</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 no-scrollbar">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.role === "bot"
                      ? "bg-surface text-bone/90"
                      : "ml-auto bg-bone text-ink"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full border border-line px-2.5 py-1 text-[10.5px] text-mist transition-colors hover:border-line-strong hover:text-bone"
                >
                  {p}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-t border-line px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 bg-transparent px-2 text-[13px] text-bone placeholder:text-mist focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-bone text-ink"
              >
                <Send size={13} strokeWidth={2} />
              </button>
            </form>
            <a
              href={whatsappGeneralUrl(s.whatsapp, "Hello Retro Clothing, I have a question.")}
              target="_blank"
              rel="noreferrer"
              className="border-t border-line px-4 py-2.5 text-center text-[11px] uppercase tracking-widest text-mist transition-colors hover:text-bone"
            >
              Prefer WhatsApp? Chat with our team →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
