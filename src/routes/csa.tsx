import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Cpu, Download, Search, Sparkles, ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { csaScenarios, type Scenario } from "@/lib/exam-data";
import { ScenarioCard } from "@/components/ScenarioCard";
import { GroupChat } from "@/components/GroupChat";
import { toast } from "sonner";

export const Route = createFileRoute("/csa")({
  head: () => ({
    meta: [
      { title: "CSA Track — TSS Exam Lab" },
      { name: "description", content: "Arduino exam scenarios: IR, DHT, MQ, keypad, load cell, irrigation. Copy and download ready code." },
    ],
  }),
  component: CsaPage,
});

function CsaPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return csaScenarios;
    return csaScenarios.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.components.some((c) => c.toLowerCase().includes(q)) ||
        s.tasks.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query]);

  const downloadAll = (list: Scenario[]) => {
    const parts = list.map(
      (s) =>
        `// ============================================\n// ${s.title} (likelihood ${s.likelihood}/5)\n// Components: ${s.components.join(", ")}\n// ============================================\n\n` +
        s.code.map((c) => `// ---- ${c.filename} ----\n${c.content}`).join("\n\n"),
    );
    const blob = new Blob([parts.join("\n\n\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `csa-exam-pack.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded CSA pack");
  };

  return (
    <div className="min-h-screen text-foreground">
      <Toaster theme="dark" position="top-right" />

      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Cpu className="h-4 w-4 text-csa" /> <span className="text-gradient-csa">CSA · Embedded</span>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-csa" />
            <span className="text-muted-foreground">CSA Integrated Assessment</span>
          </div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            <span className="text-gradient-csa">Arduino</span> exam scenarios
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            IR, DHT22, MQ135, 4×4 keypad, soil moisture, HX711 load cell — every most-likely scenario with ready code.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search component or task..."
                className="w-full rounded-lg border border-border bg-card/60 py-2.5 pl-9 pr-3 text-sm outline-none backdrop-blur focus:border-csa"
              />
            </div>
            <Button onClick={() => downloadAll(csaScenarios)} className="gap-2 bg-csa text-primary-foreground hover:bg-csa/90">
              <Download className="h-4 w-4" /> Download all CSA code
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {filtered.map((s, i) => (
            <ScenarioCard key={s.id} scenario={s} index={i} accent="csa" />
          ))}
          {filtered.length === 0 && (
            <p className="rounded-xl border border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
              No scenario matches "{query}".
            </p>
          )}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <GroupChat accent="csa" />
        </aside>
      </section>
    </div>
  );
}
