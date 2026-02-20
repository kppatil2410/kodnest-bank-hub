import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const faqResponses: Record<string, string> = {
  "transfer": "To transfer money:\n1. Go to Dashboard\n2. Click 'Transfer Money'\n3. Enter receiver's email and amount\n4. Confirm the transaction\n\nTransfers are instant and secure!",
  "balance": "To check your balance:\n1. Go to Dashboard\n2. Click 'Check Balance'\n3. Re-enter your password for security\n4. Your balance will be displayed\n\nWe require password verification for your security.",
  "minimum": "The minimum balance requirement is ₹500. You can deposit any amount above this when creating your account.",
  "password": "If you forgot your password, please contact our support team at support@kodnestbank.com. We'll help you reset it securely.",
  "security": "🔒 Security Tips:\n• Never share your password\n• Use strong passwords with mixed characters\n• Log out after each session\n• Enable notifications for transactions\n• Contact us for any suspicious activity",
  "help": "I can help you with:\n• How to transfer money\n• How to check balance\n• Minimum balance info\n• Password issues\n• Security tips\n\nJust type your question!",
};

const quickActions = [
  { label: "Transfer Help", key: "transfer" },
  { label: "Check Balance", key: "balance" },
  { label: "Security Tips", key: "security" },
  { label: "More Help", key: "help" },
];

const getResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes("transfer") || lower.includes("send money")) return faqResponses.transfer;
  if (lower.includes("balance") || lower.includes("check")) return faqResponses.balance;
  if (lower.includes("minimum") || lower.includes("min")) return faqResponses.minimum;
  if (lower.includes("password") || lower.includes("forgot")) return faqResponses.password;
  if (lower.includes("security") || lower.includes("safe") || lower.includes("tip")) return faqResponses.security;
  if (lower.includes("help") || lower.includes("hi") || lower.includes("hello")) return faqResponses.help;
  return "I'm not sure about that. Try asking about transfers, balance, security, or type 'help' for options!";
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm KodBot 🤖 your banking assistant. How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), text, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, text: getResponse(text), isBot: true };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] glass-card-strong flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="gradient-primary p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary-foreground text-sm">KodBot Assistant</h3>
                <p className="text-primary-foreground/70 text-xs">Always here to help</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.isBot ? "" : "flex-row-reverse"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.isBot ? "bg-primary/20" : "bg-accent/20"}`}>
                    {msg.isBot ? <Bot className="w-3 h-3 text-primary" /> : <User className="w-3 h-3 text-accent" />}
                  </div>
                  <div className={`max-w-[250px] rounded-xl px-3 py-2 text-xs whitespace-pre-line ${msg.isBot ? "bg-muted text-foreground" : "gradient-primary text-primary-foreground"}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickActions.map(a => (
                <button key={a.key} onClick={() => send(a.key)} className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  {a.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send(input)}
                placeholder="Ask me anything..."
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={() => send(input)} className="gradient-primary rounded-lg p-2 text-primary-foreground hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary shadow-lg flex items-center justify-center glow-primary"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};
