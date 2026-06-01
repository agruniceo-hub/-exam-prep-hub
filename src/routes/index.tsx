import { createFileRoute, Link } from "@tanstack/react-router";
import { Cpu, Network, Sparkles, MessageCircle } from "lucide-react";
import { GroupChat } from "@/components/GroupChat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TSS Exam Lab — CSA & NIT Prep" },
      { name: "description", content: "Ready-to-flash Arduino + NodeMCU/PHP code for TSS CSA and NIT integrated assessments, with a live class group chat." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <Sparkles className="h-5 w-5 text-primary" /> TSS Exam Lab
          </Link>
          <nav className="flex gap-2 text-sm">
            <Link to="/csa" className="rounded-lg px-3 py-1.5 hover:bg-muted">CSA</Link>
            <Link to="/nit" className="rounded-lg px-3 py-1.5 hover:bg-muted">NIT</Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">TSS 2025 / 2026 Integrated Assessment Lab</span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Pick your track. <span className="text-gradient-csa">CSA</span> or <span className="text-gradient-nit">NIT</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Ready-to-flash code, step-by-step explanations, and a live class chat so you can study together.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-3">
        <Link
          to="/csa"
          className="group rounded-2xl border border-border bg-card/70 p-6 backdrop-blur transition hover:border-csa/60 hover:bg-card"
        >
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-csa/10 text-csa">
            <Cpu className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-bold text-gradient-csa">CSA · Embedded</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Arduino projects: IR parking, DHT/MQ lab monitor, keypad door lock, soil irrigation, load cell scale, fire detect.
          </p>
          <span className="mt-4 inline-block text-xs font-semibold text-csa">Open CSA track →</span>
        </Link>

        <Link
          to="/nit"
          className="group rounded-2xl border border-border bg-card/70 p-6 backdrop-blur transition hover:border-nit/60 hover:bg-card"
        >
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-nit/10 text-nit">
            <Network className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-bold text-gradient-nit">NIT · Networking</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Featured: <strong>Ultrasonic + NodeMCU + XAMPP</strong> with personalized <code>index.php</code> styling per student.
          </p>
          <span className="mt-4 inline-block text-xs font-semibold text-nit">Open NIT track →</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-bold">Class Chat</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A live room. Type your name, send a message — everyone in your class sees it instantly.
          </p>
          <span className="mt-4 inline-block text-xs font-semibold text-primary">Scroll down ↓</span>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <GroupChat />
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-muted-foreground">
          Built for TSS candidates — good luck 🚀
        </div>
      </footer>
    </div>
  );
}
