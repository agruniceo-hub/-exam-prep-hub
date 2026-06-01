// Generates a personalized index.php for the Ultrasonic + NodeMCU + XAMPP project.
// Each student gets a different look but the PHP logic stays identical.

type Style = {
  name: string;
  bg: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  font: string;
  radius: string;
  shadow: string;
  layout: "center" | "top" | "split";
};

const PALETTES: Style[] = [
  { name: "Midnight",  bg: "#0f172a", card: "#1e293b", text: "#f1f5f9", muted: "#94a3b8", accent: "#22d3ee", font: "Arial, sans-serif",        radius: "16px", shadow: "0 10px 40px rgba(0,0,0,.4)",     layout: "center" },
  { name: "Sunrise",   bg: "#fff7ed", card: "#ffffff", text: "#1f2937", muted: "#6b7280", accent: "#ea580c", font: "Georgia, serif",            radius: "10px", shadow: "0 8px 24px rgba(234,88,12,.2)",   layout: "top"    },
  { name: "Forest",    bg: "#052e1f", card: "#064e3b", text: "#ecfdf5", muted: "#a7f3d0", accent: "#34d399", font: "Verdana, sans-serif",       radius: "20px", shadow: "0 10px 30px rgba(0,0,0,.5)",      layout: "center" },
  { name: "Royal",     bg: "#1e1b4b", card: "#312e81", text: "#eef2ff", muted: "#c7d2fe", accent: "#fbbf24", font: "Tahoma, sans-serif",        radius: "8px",  shadow: "0 12px 30px rgba(0,0,0,.45)",     layout: "split"  },
  { name: "Paper",     bg: "#f5f5f4", card: "#ffffff", text: "#111827", muted: "#6b7280", accent: "#2563eb", font: "'Courier New', monospace", radius: "4px",  shadow: "0 4px 12px rgba(0,0,0,.1)",       layout: "top"    },
  { name: "Rose",      bg: "#fdf2f8", card: "#ffffff", text: "#831843", muted: "#9d174d", accent: "#db2777", font: "'Trebuchet MS', sans-serif",radius: "24px", shadow: "0 10px 25px rgba(219,39,119,.2)", layout: "center" },
  { name: "Cyber",     bg: "#000000", card: "#0a0a0a", text: "#00ff9c", muted: "#4ade80", accent: "#ff00aa", font: "'Courier New', monospace",  radius: "0px",  shadow: "0 0 30px rgba(255,0,170,.4)",     layout: "center" },
  { name: "Ocean",     bg: "#082f49", card: "#0c4a6e", text: "#e0f2fe", muted: "#7dd3fc", accent: "#facc15", font: "Helvetica, sans-serif",     radius: "14px", shadow: "0 10px 30px rgba(0,0,0,.4)",      layout: "split"  },
  { name: "Sand",      bg: "#fef3c7", card: "#fffbeb", text: "#451a03", muted: "#92400e", accent: "#b45309", font: "Georgia, serif",            radius: "12px", shadow: "0 8px 20px rgba(180,83,9,.2)",    layout: "top"    },
  { name: "Slate",     bg: "#1f2937", card: "#374151", text: "#f9fafb", muted: "#d1d5db", accent: "#60a5fa", font: "Arial, sans-serif",         radius: "10px", shadow: "0 10px 30px rgba(0,0,0,.4)",      layout: "center" },
];

export function pickRandomStyle(): Style {
  return PALETTES[Math.floor(Math.random() * PALETTES.length)];
}

export function buildIndexPhp(studentName: string, style: Style = pickRandomStyle()): string {
  const tag = studentName.trim() ? `<!-- Personalized for: ${studentName.replace(/[<>]/g, "")} -->\n` : "";
  const layoutCSS =
    style.layout === "center"
      ? `body{display:flex;align-items:center;justify-content:center;min-height:100vh;}`
      : style.layout === "top"
        ? `body{padding-top:60px;text-align:center;}`
        : `body{display:grid;grid-template-columns:1fr 1fr;align-items:center;min-height:100vh;padding:40px;gap:40px;} .card{margin:0;}`;

  return `<?php
${tag}// index.php — Ultrasonic Distance Monitor (NodeMCU + XAMPP)
// Style preset: ${style.name}
$distance = "--";
$time     = "no data yet";

if (file_exists("data.txt")) {
    $raw   = file_get_contents("data.txt");
    $parts = explode("|", $raw);
    if (count($parts) == 2) {
        $distance = $parts[0];
        $time     = $parts[1];
    }
}

$status = "OK";
$color  = "#16a34a";
if ($distance !== "--") {
    if ($distance < 20)      { $status = "DANGER";  $color = "#dc2626"; }
    else if ($distance < 50) { $status = "WARNING"; $color = "#f59e0b"; }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="2">
  <title>Ultrasonic Monitor${studentName ? " — " + studentName.replace(/[<>"]/g, "") : ""}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:${style.font};background:${style.bg};color:${style.text};min-height:100vh;}
    ${layoutCSS}
    .card{background:${style.card};padding:40px 60px;border-radius:${style.radius};text-align:center;box-shadow:${style.shadow};min-width:320px;display:inline-block;}
    h1{font-size:20px;color:${style.muted};font-weight:500;margin-bottom:8px;}
    .who{font-size:12px;color:${style.accent};margin-bottom:14px;text-transform:uppercase;letter-spacing:2px;}
    .value{font-size:84px;font-weight:bold;margin:16px 0;color:<?php echo $color; ?>;}
    .unit{font-size:22px;color:${style.muted};}
    .status{display:inline-block;padding:6px 18px;border-radius:999px;background:<?php echo $color; ?>;color:#fff;font-weight:bold;margin-top:8px;}
    .time{margin-top:18px;font-size:12px;color:${style.muted};}
    .footer{margin-top:20px;font-size:11px;color:${style.muted};opacity:.7;}
  </style>
</head>
<body>
  <div class="card">
    ${studentName ? `<div class="who">${studentName.replace(/[<>"]/g, "")}</div>` : ""}
    <h1>Ultrasonic Distance Monitor</h1>
    <div class="value"><?php echo $distance; ?><span class="unit"> cm</span></div>
    <div class="status"><?php echo $status; ?></div>
    <div class="time">Last update: <?php echo $time; ?></div>
    <div class="footer">NodeMCU + HC-SR04 + XAMPP · style: ${style.name}</div>
  </div>
</body>
</html>
`;
}
