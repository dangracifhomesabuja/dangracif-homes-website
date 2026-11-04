"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  link?: {
    text: string;
    href: string;
  };
  time: string;
}

const QUICK_PROMPTS = [
  "What are the unit prices?",
  "How does the payment plan work?",
  "Where is Fidelis Court located?",
  "How do I book an inspection?",
];

function getBotReply(userQuery: string): {
  text: string;
  link?: { text: string; href: string };
} {
  const q = userQuery.toLowerCase();

  // Price inquiries
  if (
    q.includes("price") ||
    q.includes("cost") ||
    q.includes("how much") ||
    q.includes("amount") ||
    q.includes("rate")
  ) {
    if (q.includes("1-bed") || q.includes("1 bed") || q.includes("one bed")) {
      return {
        text: "The 1-Bedroom Apartment at Fidelis Court is priced at ₦55,500,000 (32 units available). With our flexible payment plan, you can secure it with a 40% initial deposit (₦22,200,000).",
        link: { text: "View pricing & breakdown", href: "/pricing" },
      };
    }
    if (q.includes("4-bed") || q.includes("4 bed") || q.includes("terrace")) {
      return {
        text: "The 4-Bedroom Terrace Duplex (Shell) is ₦127,500,000 (8 units available). Initial 40% deposit is ₦51,000,000 with the remaining spread across 12 months.",
        link: { text: "View pricing & breakdown", href: "/pricing" },
      };
    }
    return {
      text: "Fidelis Court pricing options:\n• 1-Bedroom Apartment: ₦55,500,000 (32 units)\n• 2-Bedroom Apartment: ₦82,500,000 (48 units)\n• 4-Bedroom Terrace (Shell): ₦127,500,000 (8 units)\n\nAll units can be secured with a 40% initial deposit.",
      link: { text: "Explore full pricing & plans", href: "/pricing" },
    };
  }

  // Payment plan inquiries
  if (
    q.includes("payment") ||
    q.includes("plan") ||
    q.includes("instalment") ||
    q.includes("deposit") ||
    q.includes("spread")
  ) {
    return {
      text: "Our payment structure allows you to spread payments over 12 months:\n• 40% Initial deposit on subscription\n• 20% 2nd instalment after 3 months\n• 20% 3rd instalment after 6 months\n• 20% Final instalment within 12 months (plus applicable fees).",
      link: { text: "See payment calculator", href: "/pricing" },
    };
  }

  // Location / Address inquiries
  if (
    q.includes("location") ||
    q.includes("address") ||
    q.includes("where") ||
    q.includes("kubwa") ||
    q.includes("office")
  ) {
    return {
      text: "Fidelis Court Estate is located at 21, Josephat Mojeckwu Avenue, Kubwa F01, Abuja, FCT.\n\nOur Developer Head Office is at Suite B5, Bricks 'N' More Plaza, 6th Avenue, Gwarimpa, Abuja. Phone: +234 813 318 7860.",
      link: { text: "View map & contact info", href: "/contact" },
    };
  }

  // Inspection inquiries
  if (
    q.includes("inspect") ||
    q.includes("visit") ||
    q.includes("tour") ||
    q.includes("book") ||
    q.includes("see the site")
  ) {
    return {
      text: "Site inspections are conducted at the estate in Kubwa Monday to Saturday between 9:00 AM and 5:00 PM. You can choose your preferred date and submit directly through our contact page or WhatsApp.",
      link: { text: "Schedule an inspection", href: "/contact" },
    };
  }

  // Title / Legal inquiries
  if (
    q.includes("title") ||
    q.includes("document") ||
    q.includes("c of o") ||
    q.includes("deed") ||
    q.includes("legal")
  ) {
    return {
      text: "The title provided to every buyer is a Deed of Lease. All legal, administrative, and survey documentation (2% of basic price) are handled transparently by our legal advisory team.",
      link: { text: "Read title & legal FAQs", href: "/pricing" },
    };
  }

  // Completion timeline
  if (
    q.includes("complete") ||
    q.includes("timeline") ||
    q.includes("finish") ||
    q.includes("when") ||
    q.includes("handover")
  ) {
    return {
      text: "Fidelis Court has a 14-month construction programme with target delivery in December 2027, following groundbreaking in April 2026. Regular updates are posted on our blog and YouTube channel.",
      link: { text: "Read construction updates", href: "/blog" },
    };
  }

  // Default fallback
  return {
    text: "Thank you for asking! I can provide details on Fidelis Court unit prices (1-Bed, 2-Bed, 4-Bed), payment instalments, location in Kubwa, or schedule an on-site inspection for you.",
    link: { text: "Contact our sales team", href: "/contact" },
  };
}

interface FloatingChatProps {
  onClick?: () => void;
  className?: string;
}

export const FloatingChat: React.FC<FloatingChatProps> = ({
  onClick,
  className,
}) => {
  const pathname = usePathname();


  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! Welcome to Dangracif Homes. I'm your digital assistant. How can I help you regarding Fidelis Court, apartment prices, or scheduling an inspection today?",
      time: "Just now",
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text: query.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(query);
      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: "bot",
        text: reply.text,
        link: reply.link,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "bot",
        text: "Conversation reset. Feel free to ask about Fidelis Court prices, instalments, or booking an inspection!",
        time: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close assistant" : "Open chat assistant"}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full text-white flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 bg-[#0754C6] shadow-[#0754C6]/30 focus:ring-[#0754C6]/20"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 stroke-[2.2]" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageCircle className="h-6 w-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#071630] px-5 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm shrink-0 bg-[#0754C6]"
              >
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight leading-tight">
                  Dangracif Assistant
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-slate-300">
                    Online • Fidelis Court
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-sm">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    isBot ? "items-start mr-auto" : "items-end ml-auto"
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed",
                      isBot
                        ? "bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm whitespace-pre-line"
                        : "bg-[#0754C6] text-white rounded-tr-sm"
                    )}
                  >
                    {msg.text}

                    {msg.link && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <Link
                          href={msg.link.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#00ABF0] hover:underline"
                        >
                          <span>{msg.link.text}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-2xl rounded-tl-sm w-fit text-slate-400 text-xs shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce bg-[#0754C6]" />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s] bg-[#0754C6]" />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s] bg-[#0754C6]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors shrink-0 cursor-pointer bg-[#EAF2FE] hover:bg-[#00ABF0] text-[#00ABF0] hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors focus:border-[#0754C6]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-10 w-10 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 transition-colors shadow-sm cursor-pointer bg-[#0754C6] hover:bg-[#0648AB]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
