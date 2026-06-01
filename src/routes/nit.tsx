import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Network, Shuffle, Sparkles, Wand2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { nitScenarios } from "@/lib/exam-data";
import { ScenarioCard } from "@/components/ScenarioCard";
import { GroupChat } from "@/components/GroupChat";
import { buildIndexPhp, pickRandomStyle } from "@/lib/ultrasonic-php";
import { toast } from "sonner";

export const Route = createFileRoute("/nit")({
  head: () => ({
    meta: [
      { title: "NIT Track — Ultrasonic + NodeMCU + XAMPP" },
      { name: "description", content: "Featured NIT project: NodeMCU ESP8266 + HC-SR04 ultrasonic sensor pushing live data into a PHP web app served by XAMPP." },
    ],
  }),
  component: NitPage,
});

function NitPage() {
  const [studentName, setStudentName] = useState("");
  const [preview, setPreview] = useState(() => pickRandomStyle());

  const downloadPersonal = () => {
    const style = preview;
    const php = buildIndexPhp(studentName, style);
    const blob = new Blob([php], { type: "application/x-httpd-php;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `index.php`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded "${style.name}" style index.php`);
  };

  const downloadFullPack = () => {
    const ino = nitScenarios[0].code.find((c) => c.filename.endsWith(".ino"))?.content || "";
    const data = nitScenarios[0].code.find((c) => c.filename === "data.php")?.content || "";
    const index = buildIndexPhp(studentName, preview);
    // Use a simple multipart text bundle (no zip dep)
    const bundle = [
      `// ===== ultrasonic_nodemcu.ino =====\n${ino}`,
      `// ===== data.php =====\n${data}`,
      `// ===== index.php (style: ${preview.name}) =====\n${index}`,
    ].join("\n\n\n");
    const blob = new Blob([bundle], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ultrasonic-xampp-pack.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded full XAMPP pack");
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
            <Network className="h-4 w-4 text-nit" /> <span className="text-gradient-nit">NIT · Networking</span>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-nit" />
            <span className="text-muted-foreground">Featured Project · 100% exam-ready</span>
          </div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Ultrasonic + <span className="text-gradient-nit">NodeMCU + XAMPP</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            HC-SR04 measures distance → NodeMCU ESP8266 sends it over Wi-Fi to <code>data.php</code> on XAMPP →
            <code> index.php</code> shows it live with a personalized look for every student.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Personalized download card */}
          <div className="rounded-2xl border border-nit/30 bg-card/70 p-5 backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-nit" />
              <h2 className="font-display text-lg font-bold text-gradient-nit">
                Personalized <code>index.php</code> generator
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Each student gets a different look — same PHP logic, different colors / fonts / layout. So no two submissions look identical.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Your name (shown inside the page)"
                maxLength={40}
                className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-nit"
              />
              <Button variant="outline" onClick={() => setPreview(pickRandomStyle())} className="gap-2">
                <Shuffle className="h-4 w-4" /> Re-roll style
              </Button>
              <Button onClick={downloadPersonal} className="gap-2 bg-nit text-primary-foreground hover:bg-nit/90">
                <Download className="h-4 w-4" /> Download index.php
              </Button>
            </div>

            {/* Live preview of the chosen style */}
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2 text-xs">
                <span className="font-mono text-muted-foreground">Preview · style: <strong className="text-foreground">{preview.name}</strong></span>
              </div>
              <div
                style={{
                  background: preview.bg,
                  color: preview.text,
                  fontFamily: preview.font,
                  padding: "32px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    background: preview.card,
                    borderRadius: preview.radius,
                    boxShadow: preview.shadow,
                    padding: "28px 40px",
                    display: "inline-block",
                    minWidth: 260,
                  }}
                >
                  {studentName && (
                    <div style={{ fontSize: 11, color: preview.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                      {studentName}
                    </div>
                  )}
                  <div style={{ fontSize: 18, color: preview.muted, marginBottom: 6 }}>Ultrasonic Distance Monitor</div>
                  <div style={{ fontSize: 64, fontWeight: 700, color: "#16a34a" }}>
                    42<span style={{ fontSize: 18, color: preview.muted }}> cm</span>
                  </div>
                  <div style={{
                    display: "inline-block",
                    padding: "4px 14px",
                    borderRadius: 999,
                    background: "#16a34a",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    marginTop: 6,
                  }}>OK</div>
                  <div style={{ marginTop: 14, fontSize: 11, color: preview.muted }}>
                    NodeMCU + HC-SR04 + XAMPP · style: {preview.name}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={downloadFullPack} className="gap-2">
                <Download className="h-3.5 w-3.5" /> Download full pack (.ino + data.php + index.php)
              </Button>
            </div>
          </div>

          {/* Code cards (Arduino .ino + data.php + base index.php) */}
          {nitScenarios.map((s, i) => (
            <ScenarioCard key={s.id} scenario={s} index={i} accent="nit" />
          ))}

          <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
            <strong className="text-foreground">XAMPP setup:</strong> put <code>data.php</code> and your personalized
            <code> index.php</code> into <code>C:\xampp\htdocs\iot\</code>, start Apache, then point the NodeMCU
            <code> SERVER</code> URL to <code>http://YOUR-PC-IP/iot/data.php</code>.
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <GroupChat accent="nit" />
        </aside>
      </section>
    </div>
  );
}
