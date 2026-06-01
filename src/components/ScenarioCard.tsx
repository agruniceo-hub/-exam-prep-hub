import { useState } from "react";
import { ChevronDown, Cpu, ListChecks, Star } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import type { Scenario } from "@/lib/exam-data";

type Props = {
  scenario: Scenario;
  index: number;
  accent: "csa" | "nit";
};

export function ScenarioCard({ scenario, index, accent }: Props) {
  const [open, setOpen] = useState(index === 0);
  const accentText = accent === "csa" ? "text-gradient-csa" : "text-gradient-nit";
  const accentBg = accent === "csa" ? "bg-csa/10 text-csa" : "bg-nit/10 text-nit";

  return (
    <article className="group rounded-2xl border border-border bg-card/70 backdrop-blur transition hover:border-primary/40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm ${accentBg}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className={`text-lg font-semibold ${accentText}`}>{scenario.title}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < scenario.likelihood ? "fill-warning text-warning" : "text-muted"}`}
                />
              ))}
              <span className="ml-2">Likelihood</span>
            </div>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-5 border-t border-border px-5 pb-6 pt-5">
          <div className="grid gap-5 md:grid-cols-2">
            <section>
              <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Cpu className="h-3.5 w-3.5" /> Components
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {scenario.components.map((c) => (
                  <span key={c} className="rounded-md border border-border bg-muted/40 px-2 py-1 text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </section>
            <section>
              <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <ListChecks className="h-3.5 w-3.5" /> Tasks
              </h4>
              <ul className="space-y-1 text-sm text-foreground/85">
                {scenario.tasks.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <p className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed text-foreground/80">
            <span className="font-semibold text-foreground">How it works — </span>
            {scenario.explanation}
          </p>

          {scenario.code.map((c) => (
            <CodeBlock key={c.filename} {...c} />
          ))}
        </div>
      )}
    </article>
  );
}
