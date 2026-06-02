import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  streaming?: boolean;
}

const SUGGESTED_PROMPTS = [
  "How do I tailor my CV for a banking role?",
  "What ATS keywords should I use for a senior developer job?",
  "Write a cover letter for a Full Stack Developer role at Takealot",
  "How do I prepare for a technical interview at FNB?",
  "What salary should I expect as a Python developer in Johannesburg?",
  "Review my summary and make it more ATS-friendly",
];

const MOCK_RESPONSES: Record<string, string> = {
  default: `I can help you with that. Here's what I recommend based on your job search context:

When optimizing your CV for ATS systems, focus on these key principles:

1. **Mirror the job description language** — Use exact phrases from the posting. If they say "REST APIs", don't write "RESTful services".

2. **Quantify everything** — Replace "improved performance" with "reduced API response time by 40%".

3. **Lead with a strong summary** — 3–4 sentences max. Include your seniority level, core stack, and years of experience.

4. **Skills section placement** — Put it near the top, not the bottom. ATS scores the first 60% of your CV higher.

5. **Avoid tables and columns** — Many ATS parsers can't read multi-column layouts. Use a single-column format.

Would you like me to rewrite a specific section of your CV?`,

  banking: `For banking and financial services roles in South Africa, here are the most important ATS keywords to include:

**Technical:**
- Java, Python, Spring Boot, Microservices
- REST APIs, SOAP, MQ (IBM MQ or RabbitMQ)
- Oracle, DB2, SQL Server
- Docker, Kubernetes, OpenShift
- CI/CD, Jenkins, GitLab

**Domain:**
- Core Banking, SWIFT, ISO 20022
- Payment processing, Reconciliation
- Regulatory compliance, POPIA, FICA
- Agile, Scrum, SAFe

**Soft skills (still ATS-scanned):**
- Stakeholder management
- Cross-functional collaboration
- Risk management

FNB, Standard Bank, and Absa all use Taleo or SAP SuccessFactors as their ATS — both heavily weight keyword density in the top third of your CV.`,

  salary: `Here are current 2026 salary benchmarks for tech roles in Johannesburg (gross, per month):

| Role | Junior | Mid | Senior |
|---|---|---|---|
| Python Developer | R28k–R38k | R42k–R58k | R65k–R90k |
| Full Stack (React/Node) | R30k–R42k | R45k–R62k | R68k–R95k |
| DevOps / Cloud Engineer | R35k–R48k | R52k–R72k | R78k–R110k |
| Data Engineer | R32k–R45k | R50k–R68k | R72k–R100k |
| Software Architect | — | R70k–R90k | R95k–R140k |

Remote roles typically pay 10–20% more. Contract rates are roughly 1.4–1.6x the permanent equivalent.

For banking (FNB, Standard Bank, Absa), add 15–25% to mid/senior figures — they pay above market for experienced engineers.`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("bank") || lower.includes("fnb") || lower.includes("ats") || lower.includes("keyword")) {
    return MOCK_RESPONSES.banking;
  }
  if (lower.includes("salary") || lower.includes("pay") || lower.includes("rate") || lower.includes("earn")) {
    return MOCK_RESPONSES.salary;
  }
  return MOCK_RESPONSES.default;
}

function useTypewriter(text: string, active: boolean, onDone: () => void) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current += 3;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(interval);
        onDone();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [text, active]);

  return displayed;
}

function AssistantBubble({ message, onDone }: { message: Message; onDone: () => void }) {
  const text = useTypewriter(message.content, !!message.streaming, onDone);
  const content = message.streaming ? text : message.content;

  return (
    <div className="flex gap-3 max-w-2xl">
      <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex-1">
        <div
          className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none
            prose-headings:text-gray-900 prose-strong:text-gray-900
            prose-code:text-brand-600 prose-code:bg-brand-50 prose-code:px-1 prose-code:rounded"
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.*?)\*/g, "<em>$1</em>")
              .replace(/`(.*?)`/g, "<code>$1</code>")
              .replace(/\n\n/g, "<br/><br/>")
              .replace(/\n/g, "<br/>")
              .replace(/\|(.+)\|/g, (match) => {
                const cells = match.split("|").filter((c) => c.trim() && !c.match(/^[-\s|]+$/));
                return `<span class="font-mono text-xs">${cells.join(" · ")}</span>`;
              }),
          }}
        />
        {message.streaming && text.length < message.content.length && (
          <span className="inline-block w-1.5 h-4 bg-brand-400 ml-0.5 animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi, I'm your AI job search assistant. I can help you tailor your CV, extract ATS keywords, write cover letters, and prepare for interviews. What do you need?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    const responseText = getResponse(text);
    const assistantId = (Date.now() + 1).toString();

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: responseText, streaming: true },
      ]);
    }, 600);
  };

  const markDone = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, streaming: false } : m))
    );
    setLoading(false);
  };

  const reset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hi, I'm your AI job search assistant. I can help you tailor your CV, extract ATS keywords, write cover letters, and prepare for interviews. What do you need?",
      },
    ]);
    setLoading(false);
    setInput("");
  };

  const showSuggestions = messages.length === 1;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">AI Assistant</p>
            <p className="text-xs text-gray-400">Powered by DeepSeek</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600" onClick={reset}>
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> New chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-md text-sm leading-relaxed">
                {msg.content}
              </div>
            </div>
          ) : (
            <AssistantBubble
              key={msg.id}
              message={msg}
              onDone={() => markDone(msg.id)}
            />
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      {showSuggestions && (
        <div className="px-6 pb-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-brand-300 hover:text-brand-600 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-5 pt-2">
        <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-brand-300 transition-colors">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask anything about your job search..."
            className="flex-1 border-0 p-0 text-sm resize-none focus-visible:ring-0 bg-transparent min-h-[24px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 self-end transition-colors",
              input.trim() && !loading
                ? "bg-brand-600 text-white hover:bg-brand-700"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-gray-300 text-center mt-2">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
