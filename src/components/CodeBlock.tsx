import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  filename: string;
  language: string;
  content: string;
};

export function CodeBlock({ filename, language, content }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success(`Copied ${filename}`);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
          </div>
          <span className="ml-2 font-mono text-xs text-muted-foreground">{filename}</span>
          <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {language}
          </span>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={handleDownload} className="h-7 gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Save
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 gap-1.5 text-xs">
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <pre className="max-h-[480px] overflow-auto p-4 text-[12.5px] leading-relaxed">
        <code className="text-foreground/90">{content}</code>
      </pre>
    </div>
  );
}
