import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Msg = { id: string; name: string; message: string; created_at: string };

const NAME_KEY = "tss-chat-name";

export function GroupChat({ accent = "primary" }: { accent?: "primary" | "csa" | "nit" }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setName(localStorage.getItem(NAME_KEY) || "");
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(200);
      if (active && data) setMessages(data as Msg[]);
    })();

    const channel = supabase
      .channel("chat_messages_rt")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) =>
            prev.some((m) => m.id === (payload.new as Msg).id) ? prev : [...prev, payload.new as Msg],
          );
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const n = name.trim();
    const m = text.trim();
    if (!n || !m || sending) return;
    setSending(true);
    localStorage.setItem(NAME_KEY, n);
    const { error } = await supabase.from("chat_messages").insert({ name: n, message: m });
    setSending(false);
    if (!error) setText("");
  };

  const accentClass =
    accent === "csa" ? "bg-csa text-primary-foreground"
    : accent === "nit" ? "bg-nit text-primary-foreground"
    : "bg-primary text-primary-foreground";

  const myName = name.trim().toLowerCase();

  return (
    <div className="flex h-[560px] flex-col overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <MessageCircle className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Class Group Chat</h3>
        <span className="ml-auto text-xs text-muted-foreground">live · everyone sees this</span>
      </div>

      <div className="border-b border-border px-4 py-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={40}
          className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">No messages yet — say hi 👋</p>
        )}
        {messages.map((m) => {
          const mine = m.name.trim().toLowerCase() === myName && myName.length > 0;
          return (
            <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <span className="mb-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                {m.name} · {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  mine ? accentClass : "bg-muted text-foreground"
                }`}
              >
                {m.message}
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2 border-t border-border p-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={name ? "Type a message..." : "Enter your name first"}
          maxLength={500}
          disabled={!name.trim()}
          className="flex-1 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!name.trim() || !text.trim() || sending}
          className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${accentClass}`}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
