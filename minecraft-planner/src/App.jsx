import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  Save,
  Upload,
  Download,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "./component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./component/ui/card";
import { Input } from "./component/ui/input";
import { Badge } from "./component/ui/badge";
import { Progress } from "./component/ui/progress";

// ---------------------------------------------
// Seed data (edit freely). Quantities are suggestions.
// ---------------------------------------------
const SEED_FARMS = [
  {
    id: "crop-basic",
    name: "Basic Crop Farm (Wheat/Carrot/Potato)",
    phase: "Early",
    difficulty: "Easy",
    resources: [
      { name: "Water Bucket", qty: 1 },
      { name: "Seeds/Carrots/Potatoes", qty: 64 },
      { name: "Hoe (any)", qty: 1 },
      { name: "Fences", qty: 32 },
      { name: "Torches", qty: 16 },
    ],
    steps: [
      "Lay 9×9 plots with water in the center.",
      "Light up to keep growth at night.",
      "Optional: Villager farmer in a 9×9 with composter for auto-harvest (collection manual early game).",
    ],
  },
  {
    id: "sugarcane",
    name: "Sugar Cane Farm (Observer + Piston)",
    phase: "Early",
    difficulty: "Easy",
    resources: [
      { name: "Sugar Cane", qty: 16 },
      { name: "Water source blocks", qty: 8 },
      { name: "Observer", qty: 8 },
      { name: "Piston", qty: 8 },
      { name: "Redstone Dust", qty: 16 },
      { name: "Hopper", qty: 4 },
      { name: "Chest", qty: 2 },
      { name: "Building Blocks", qty: 64 },
    ],
    steps: [
      "Place sugar cane in a line with water behind.",
      "Observers watch middle-height cane, power pistons to break.",
      "Hoppers feed into chests for storage.",
    ],
  },
  {
    id: "cactus",
    name: "Cactus Farm (Auto Drop)",
    phase: "Early",
    difficulty: "Easy",
    resources: [
      { name: "Cactus", qty: 16 },
      { name: "Sand", qty: 16 },
      { name: "Fence/Glass panes", qty: 32 },
      { name: "Hopper", qty: 2 },
      { name: "Chest", qty: 2 },
      { name: "Building Blocks", qty: 32 },
    ],
    steps: [
      "Place cacti on sand with a fence/glass pane adjacent so growth breaks automatically.",
      "Water stream/hoppers collect drops into chest.",
    ],
  },
  {
    id: "bamboo",
    name: "Bamboo Farm",
    phase: "Early",
    difficulty: "Easy",
    resources: [
      { name: "Bamboo", qty: 16 },
      { name: "Observer", qty: 8 },
      { name: "Piston", qty: 8 },
      { name: "Redstone Dust", qty: 16 },
      { name: "Hopper", qty: 2 },
      { name: "Chest", qty: 2 },
    ],
    steps: [
      "Similar to sugar cane farm; use as furnace fuel or scaffolding.",
      "Optional: route output to super smelter.",
    ],
  },
  {
    id: "chicken",
    name: "Cooked Chicken Farm (Auto)",
    phase: "Early",
    difficulty: "Moderate",
    resources: [
      { name: "Dispenser", qty: 2 },
      { name: "Observer", qty: 1 },
      { name: "Lava Bucket", qty: 1 },
      { name: "Hopper", qty: 3 },
      { name: "Chest", qty: 2 },
      { name: "Glass", qty: 16 },
      { name: "Building Blocks", qty: 32 },
      { name: "Chicken Eggs", qty: 32 },
    ],
    steps: [
      "Top chamber holds breeders laying eggs into dispenser.",
      "Eggs dispense chicks to cooking chamber; when grown, lava pulse cooks.",
      "Collect feathers and cooked chicken in chest.",
    ],
  },
  {
    id: "iron",
    name: "Iron Farm (Villagers + Zombie)",
    phase: "Mid",
    difficulty: "Hard",
    resources: [
      { name: "Villagers", qty: 3 },
      { name: "Zombie (named)", qty: 1 },
      { name: "Beds", qty: 3 },
      { name: "Workstations (e.g., composter)", qty: 3 },
      { name: "Hoppers", qty: 6 },
      { name: "Chests", qty: 2 },
      { name: "Lava Bucket", qty: 1 },
      { name: "Water Buckets", qty: 2 },
      { name: "Building Blocks", qty: 128 },
      { name: "Trapdoors", qty: 8 },
    ],
    steps: [
      "Create spawn/kill chamber with lava blade and water push.",
      "Place 3 villagers with beds and workstations; scare with zombie on cycle.",
      "Collect iron + poppies via hoppers.",
    ],
  },
  {
    id: "lava",
    name: "Lava Farm (Dripstone + Cauldrons)",
    phase: "Mid",
    difficulty: "Easy",
    resources: [
      { name: "Pointed Dripstone", qty: 16 },
      { name: "Dripstone Blocks", qty: 16 },
      { name: "Cauldrons", qty: 8 },
      { name: "Lava source", qty: 1 },
      { name: "Building Blocks", qty: 32 },
    ],
    steps: [
      "Place lava source above dripstone blocks with pointed dripstone facing down into cauldrons.",
      "Wait to fill, bucket out; infinite fuel.",
    ],
  },
  {
    id: "smelter",
    name: "Super Smelter (Auto)",
    phase: "Mid",
    difficulty: "Moderate",
    resources: [
      { name: "Furnaces", qty: 8 },
      { name: "Hoppers", qty: 20 },
      { name: "Chests", qty: 6 },
      { name: "Rails", qty: 32 },
      { name: "Minecart with Hopper", qty: 2 },
      { name: "Fuel (Bamboo/Lava)", qty: 1 },
    ],
    steps: [
      "Parallel furnace array with hopper lines for input and fuel.",
      "Optional: minecart loaders for even distribution.",
    ],
  },
  {
    id: "mob-xp",
    name: "Mob Farm / XP (Darkroom or Spawner)",
    phase: "Mid",
    difficulty: "Moderate",
    resources: [
      { name: "Building Blocks", qty: 256 },
      { name: "Trapdoors", qty: 32 },
      { name: "Water Buckets", qty: 4 },
      { name: "Hoppers", qty: 4 },
      { name: "Chests", qty: 2 },
    ],
    steps: [
      "Dark platforms with water channels pushing mobs to drop chute.",
      "Looting/XP kill chamber at bottom.",
    ],
  },
  {
    id: "trading-hall",
    name: "Villager Trading Hall (+ Breeder)",
    phase: "Mid",
    difficulty: "Hard",
    resources: [
      { name: "Villagers", qty: 10 },
      { name: "Beds", qty: 10 },
      { name: "Workstations (various)", qty: 10 },
      { name: "Rails + Minecarts", qty: 16 },
      { name: "Zombify/Cure Setup (Potion + Golden Apple)", qty: 1 },
      { name: "Building Blocks", qty: 192 },
    ],
    steps: [
      "Breeder feeds hall; lock trades by assigning workstations.",
      "Optional: zombify/cure for discounts.",
    ],
  },
  {
    id: "gold",
    name: "Gold Farm (Nether)",
    phase: "Late Mid",
    difficulty: "Hard",
    resources: [
      { name: "Building Blocks (non-spawnable)", qty: 512 },
      { name: "Turtle Eggs", qty: 2 },
      { name: "Trapdoors", qty: 32 },
      { name: "Hoppers", qty: 8 },
      { name: "Chests", qty: 4 },
      { name: "Magma Blocks (if portal design)", qty: 128 },
    ],
    steps: [
      "Choose roof/portal design; funnel piglins to kill chamber.",
      "Sort gold nuggets, rotten flesh; feed gold to bartering if desired.",
    ],
  },
  {
    id: "creeper",
    name: "Creeper-Only Gunpowder Farm",
    phase: "Endgame",
    difficulty: "Hard",
    resources: [
      { name: "Cats", qty: 4 },
      { name: "Trapdoors", qty: 64 },
      { name: "Carpet", qty: 64 },
      { name: "Building Blocks", qty: 256 },
      { name: "Hoppers", qty: 8 },
      { name: "Chests", qty: 4 },
    ],
    steps: [
      "Trapdoor-slab trick to restrict spawns to creepers.",
      "Cats scare into drop chute; collect gunpowder.",
    ],
  },
  {
    id: "enderman",
    name: "Enderman XP Farm (End)",
    phase: "Endgame",
    difficulty: "Hard",
    resources: [
      { name: "Leaves/Slabs (non-spawnable)", qty: 256 },
      { name: "Endermite (named) + Minecart", qty: 1 },
      { name: "Trapdoors", qty: 16 },
      { name: "Hoppers", qty: 4 },
      { name: "Chests", qty: 2 },
    ],
    steps: [
      "Long spawn platform + drop tunnel to kill height.",
      "Endermite in minecart as lure; sweeping edge to farm XP.",
    ],
  },
];

// ---------------------------------------------
// Minecraft color themes
// ---------------------------------------------
const PHASE_THEME = {
  Early: {
    badge: "bg-emerald-800 border-emerald-600",
    border: "border-emerald-800",
  },
  Mid: { badge: "bg-amber-800 border-amber-600", border: "border-amber-800" },
  "Late Mid": {
    badge: "bg-orange-800 border-orange-600",
    border: "border-orange-800",
  },
  Endgame: {
    badge: "bg-purple-800 border-purple-600",
    border: "border-purple-800",
  },
};
const DIFF_THEME = {
  Easy: {
    border: "border-lime-500",
    bg: "bg-lime-950/60",
    title: "text-lime-400",
  },
  Moderate: {
    border: "border-amber-500",
    bg: "bg-amber-950/60",
    title: "text-amber-400",
  },
  Hard: {
    border: "border-rose-500",
    bg: "bg-rose-950/60",
    title: "text-rose-400",
  },
};

// ---------------------------------------------
// Utilities
// ---------------------------------------------
// ---- download helpers ----
function downloadBlob(filename, mime, data) {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Flatten farms for CSV/RTF
function flattenFarmsForExport(farms) {
  return farms.map((f) => ({
    id: f.id,
    name: f.name,
    phase: f.phase,
    difficulty: f.difficulty,
    built: f.built ? "Yes" : "No",
    resources: (f.resources || [])
      .map((r) => `${r.name} x${r.qty}`)
      .join(" | "),
    steps: (f.steps || []).join(" | "),
    resourcesDone: (f.resourcesDone || []).join(" | "),
  }));
}

// ---- exporters ----
function exportAsJSON(farms) {
  downloadBlob(
    "minecraft-farm-planner.json",
    "application/json",
    JSON.stringify(farms, null, 2)
  );
}

// “Excel” export using CSV (opens in Excel)
function exportAsCSV(farms) {
  const rows = flattenFarmsForExport(farms);
  const headers = [
    "id",
    "name",
    "phase",
    "difficulty",
    "built",
    "resources",
    "steps",
    "resourcesDone",
  ];
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          // CSV escape
          const val = (r[h] ?? "").toString().replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(",")
    ),
  ].join("\r\n");
  downloadBlob("minecraft-farm-planner.csv", "text/csv;charset=utf-8", csv);
}

// Word export via RTF (opens in Word)
function exportAsRTF(farms) {
  const rows = flattenFarmsForExport(farms);
  const rtfHeader = `{\\rtf1\\ansi\\deff0\n`;
  const title = `\\b Minecraft Farm Planner Export \\b0\\line\\line\n`;
  const body = rows
    .map(
      (r) =>
        `\\b Name:\\b0 ${r.name}\\line ` +
        `\\b Phase:\\b0 ${r.phase}   \\b Difficulty:\\b0 ${r.difficulty}   \\b Built:\\b0 ${r.built}\\line ` +
        `\\b Resources:\\b0 ${r.resources}\\line ` +
        `\\b Steps:\\b0 ${r.steps}\\line ` +
        `\\b Resources Done:\\b0 ${r.resourcesDone}\\line\\line`
    )
    .join("\n");
  const rtf = rtfHeader + title + body + `\n}`;
  downloadBlob("minecraft-farm-planner.rtf", "application/rtf", rtf);
}

// PDF export using the browser's print-to-PDF
function exportAsPDF(farms) {
  const rows = flattenFarmsForExport(farms);
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Minecraft Farm Planner Export</title>
        <style>
          body{font:14px system-ui,Segoe UI,Arial; padding:24px; color:#111;}
          h1{margin:0 0 12px;}
          table{border-collapse:collapse; width:100%;}
          th,td{border:1px solid #999; padding:8px; vertical-align:top;}
          th{background:#eee;}
        </style>
      </head>
      <body>
        <h1>Minecraft Farm Planner Export</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Phase</th><th>Difficulty</th><th>Built</th>
              <th>Resources</th><th>Steps</th><th>Resources Done</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr>
                <td>${r.name}</td>
                <td>${r.phase}</td>
                <td>${r.difficulty}</td>
                <td>${r.built}</td>
                <td>${r.resources}</td>
                <td>${r.steps}</td>
                <td>${r.resourcesDone}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };</script>
      </body>
    </html>
  `;
  const win = window.open("", "_blank", "noopener,noreferrer");
  win.document.open();
  win.document.write(html);
  win.document.close();
}

const STORAGE_KEY = "mc-farm-planner-v1";

function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

// ---------------------------------------------
// Component
// ---------------------------------------------
function toTitleCase(str) {
  return String(str)
    .toLowerCase()
    .split(/(\s+|-|_)/) // keep separators
    .map((part) =>
      /^[a-z]/.test(part) ? part[0].toUpperCase() + part.slice(1) : part
    )
    .join("");
}

export default function MinecraftFarmPlanner() {
  const [farms, setFarms] = useLocalState(
    STORAGE_KEY,
    SEED_FARMS.map((f) => ({ ...f, built: false, resourcesDone: [] }))
  );
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const phases = ["All", "Early", "Mid", "Late Mid", "Endgame"];
  const difficulties = ["All", "Easy", "Moderate", "Hard"];

  const filtered = useMemo(() => {
    let list = farms;
    if (phase !== "All") list = list.filter((f) => f.phase === phase);
    if (difficulty !== "All")
      list = list.filter((f) => f.difficulty === difficulty);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.resources.some((r) => r.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [farms, phase, difficulty, query]);

  const overallProgress = useMemo(() => {
    const total = farms.length;
    const done = farms.filter((f) => f.built).length;
    return total ? Math.round((done / total) * 100) : 0;
  }, [farms]);

  function toggleResource(farmId, resName) {
    setFarms((prev) =>
      prev.map((f) => {
        if (f.id !== farmId) return f;
        const set = new Set(f.resourcesDone || []);
        set.has(resName) ? set.delete(resName) : set.add(resName);
        return { ...f, resourcesDone: Array.from(set) };
      })
    );
  }

  function markAllResources(farmId) {
    setFarms((prev) =>
      prev.map((f) =>
        f.id === farmId
          ? { ...f, resourcesDone: f.resources.map((r) => r.name) }
          : f
      )
    );
  }

  function clearAllResources(farmId) {
    setFarms((prev) =>
      prev.map((f) => (f.id === farmId ? { ...f, resourcesDone: [] } : f))
    );
  }

  function toggleBuilt(farmId) {
    setFarms((prev) =>
      prev.map((f) => (f.id === farmId ? { ...f, built: !f.built } : f))
    );
  }

  function resetAll() {
    if (!confirm("Reset all progress?")) return;
    setFarms(
      SEED_FARMS.map((f) => ({ ...f, built: false, resourcesDone: [] }))
    );
  }

  // Add custom farm
  function handleAddFarm(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = toTitleCase(String(form.get("name") || "").trim());
    const phaseVal = String(form.get("phase") || "Early");
    const diffVal = String(form.get("difficulty") || "Easy");
    const resourcesRaw = String(form.get("resources") || "");
    const stepsRaw = String(form.get("steps") || "");
    if (farms.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
      alert("A farm with this name already exists!");
      return;
    }
    if (!name) return alert("Please enter a farm name");
    const resources = resourcesRaw
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((line) => {
        const m = line.match(/^(.*?)(\s*x\s*(\d+))?$/i);
        const nm = m?.[1]?.trim() || line;
        const qty = m?.[3] ? Number(m[3]) : 1;
        return { name: toTitleCase(nm), qty };
      });
    const steps = stepsRaw
      .split(/\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const newFarm = {
      id,
      name,
      phase: phaseVal,
      difficulty: diffVal,
      resources,
      steps,
      built: false,
      resourcesDone: [],
    };
    setFarms((prev) => [newFarm, ...prev]);
    setShowAdd(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(farms, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "minecraft-farm-planner.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data)) throw new Error("Invalid file");
        const normalized = data.map((f) => ({
          id:
            f.id ||
            `${(f.name || "farm").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).slice(2)}`,
          name: toTitleCase(f.name || "Unnamed Farm"),
          phase: f.phase || "Early",
          difficulty: f.difficulty || "Easy",
          resources: Array.isArray(f.resources)
            ? f.resources.map((r) => ({
                name: toTitleCase(r.name),
                qty: Number(r.qty) || 1,
              }))
            : [],
          steps: Array.isArray(f.steps) ? f.steps : [],
          built: Boolean(f.built),
          resourcesDone: Array.isArray(f.resourcesDone) ? f.resourcesDone : [],
        }));
        setFarms(normalized);
      } catch (e) {
        alert("Failed to import file");
      }
    };
    reader.readAsText(file);
  }

  function removeFarm(id) {
    if (!confirm("Delete this farm?")) return;
    setFarms((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="min-h-screen text-slate-100 bg-gradient-to-br from-[#0b1f0e] via-[#0c1422] to-[#1a0f0a] px-4 sm:px-6 py-6">
      <div className="w-full">
        <header className="pixel-header p-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-pixel tracking-wider text-[18px] sm:text-[20px]">
              MINECRAFT FARM PLANNER
            </h1>
            <p className="text-slate-300">
              To-do checklist • resources • step-by-step guides • local save
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-3 flex-wrap">
              <button
                title="Add Farm"
                aria-label="Add Farm"
                onClick={() => setShowAdd((v) => !v)}
                className="pixel-btn bg-stone-800 hover:bg-stone-700 p-3 border-2 border-stone-600"
              >
                <Plus className="w-6 h-6 text-emerald-400" />
              </button>
              <button
                title="Reset"
                onClick={resetAll}
                className="pixel-btn bg-stone-800 hover:bg-stone-700 p-3 border-2 border-stone-600"
              >
                <RefreshCw className="w-6 h-6 text-amber-400" />
              </button>
              <div className="relative">
                <button
                  title="Export"
                  onClick={() => setShowExportMenu((v) => !v)}
                  className="pixel-btn bg-stone-800 hover:bg-stone-700 p-3 border-2 border-stone-600"
                >
                  <Download className="w-6 h-6 text-cyan-400" />
                </button>

                {showExportMenu && (
                  <div
                    className="absolute right-0 mt-2 w-44 bg-stone-900 border-2 border-stone-700 shadow-xl z-50"
                    onMouseLeave={() => setShowExportMenu(false)}
                  >
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-stone-800"
                      onClick={() => {
                        exportAsJSON(farms);
                        setShowExportMenu(false);
                      }}
                    >
                      JSON (.json)
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-stone-800"
                      onClick={() => {
                        exportAsCSV(farms);
                        setShowExportMenu(false);
                      }}
                    >
                      Excel (.csv)
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-stone-800"
                      onClick={() => {
                        exportAsRTF(farms);
                        setShowExportMenu(false);
                      }}
                    >
                      Word (.rtf)
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-stone-800"
                      onClick={() => {
                        exportAsPDF(farms);
                        setShowExportMenu(false);
                      }}
                    >
                      PDF (.pdf)
                    </button>
                  </div>
                )}
              </div>
              <label
                title="Import"
                className="pixel-btn bg-stone-800 hover:bg-stone-700 p-3 border-2 border-stone-600 cursor-pointer inline-flex items-center justify-center"
              >
                <Upload className="w-6 h-6 text-violet-400" />
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && importJSON(e.target.files[0])
                  }
                />
              </label>
            </div>
          </div>
        </header>
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="h-1.5 -mt-2 mb-3 bg-gradient-to-r from-lime-600 via-amber-600 to-rose-600" />
            <CardTitle className="text-lg">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Progress value={overallProgress} className="h-3" />
              <span className="text-sm text-slate-300 w-20">
                {overallProgress}%
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 md:grid-cols-4 mb-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search farms or resources…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
            >
              {phases.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-2"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showAdd && (
          <Card className="mb-6 border-emerald-700">
            <CardHeader>
              <CardTitle>Add a Custom Farm</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFarm} className="grid gap-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    name="name"
                    placeholder="Farm name (e.g., Slime Farm)"
                  />
                  <div className="flex gap-2">
                    <select
                      name="phase"
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2"
                    >
                      {phases
                        .filter((p) => p !== "All")
                        .map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                    </select>
                    <select
                      name="difficulty"
                      className="w-full bg-slate-800 border border-slate-700 rounded-md p-2"
                    >
                      {difficulties
                        .filter((d) => d !== "All")
                        .map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <textarea
                    name="resources"
                    rows={5}
                    className="bg-slate-800 border border-slate-700 rounded-md p-2"
                    placeholder={
                      "Resources (one per line). You can add qty like: Hopper x4\nChest x2\nGlass x16"
                    }
                  />
                  <textarea
                    name="steps"
                    rows={5}
                    className="bg-slate-800 border border-slate-700 rounded-md p-2"
                    placeholder={"Steps (one per line)."}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save Farm
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAdd(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((farm) => {
            const resTotal = farm.resources.length;
            const resDone = new Set(farm.resourcesDone || []).size;
            const resourcePct = resTotal
              ? Math.round((resDone / resTotal) * 100)
              : 0;
            return (
              <Card
                key={farm.id}
                className={`relative shadow-lg pixel-card border-2
                ${DIFF_THEME[farm.difficulty]?.border || "border-stone-700"}
                ${DIFF_THEME[farm.difficulty]?.bg || "bg-stone-900/60"}
                ${farm.built ? "ring-2 ring-emerald-500/60" : ""}
                ${farm.difficulty === "Easy" ? "shadow-[0_0_12px_rgba(34,197,94,0.35)]" : ""}
                ${farm.difficulty === "Moderate" ? "shadow-[0_0_12px_rgba(245,158,11,0.35)]" : ""}
                ${farm.difficulty === "Hard" ? "shadow-[0_0_14px_rgba(244,63,94,0.40)]" : ""}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle
                        className={`font-pixel font-pixel-narrow title-tight text-[16px] sm:text-[18px] ${DIFF_THEME[farm.difficulty]?.title || ""}`}
                      >
                        {farm.name}
                      </CardTitle>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge
                          className={`${PHASE_THEME[farm.phase]?.badge || "bg-slate-800 border-slate-700"} px-5 py-2 text-[15px] border-2 rounded-none font-bold tracking-wide`}
                        >
                          {farm.phase}
                        </Badge>
                        <Badge
                          className={`bg-stone-900 border-stone-600 ${DIFF_THEME[farm.difficulty]?.title || ""} px-5 py-2 text-[15px] border-2 rounded-none font-bold tracking-wide`}
                        >
                          {farm.difficulty}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-sm text-slate-300">
                          Resources: {resDone}/{resTotal}
                        </span>
                        <div className="flex-1">
                          <Progress value={resourcePct} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={farm.built ? "secondary" : "default"}
                        onClick={() => toggleBuilt(farm.id)}
                      >
                        {farm.built ? "BUILT" : "MARK BUILT"}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost" // 1) use a lighter variant so our classes win
                        title="Delete"
                        onClick={() => removeFarm(farm.id)}
                        className="
                          group
                          bg-stone-800 border-2 border-stone-600              // 2) give it a real border so the color can change
                          hover:!bg-rose-600/25 hover:!border-rose-500        // 3) force our hover colors to win (the ! makes them important)
                          hover:!ring-1 hover:!ring-rose-500/60               // 4) subtle glow on hover
                          transition-colors
                        "
                      >
                        <Trash2 className="w-4 h-4 text-stone-200 transition-colors group-hover:text-rose-100" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <details
                    className="bg-stone-900/70 p-3 border-2 border-stone-700 rounded-none"
                    open
                  >
                    <summary className="cursor-pointer flex items-center justify-between select-none">
                      <span className="font-medium">Resources Needed</span>
                      <ChevronDown className="w-4 h-4" />
                    </summary>
                    <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {farm.resources.map((r, idx) => {
                        const key = `${farm.id}-${r.name}-${idx}`;
                        const checked = farm.resourcesDone?.includes(r.name);
                        return (
                          <li
                            key={key}
                            className={`flex items-center justify-between gap-2 border-2 rounded-none px-3 py-2 ${checked ? "bg-emerald-900/40 border-emerald-700" : "bg-stone-900/40 border-stone-700"}`}
                          >
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleResource(farm.id, r.name)}
                              />
                              <span>{r.name}</span>
                            </label>
                            <span className="text-sm text-slate-300">
                              x{r.qty}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => markAllResources(farm.id)}
                      >
                        Mark All
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => clearAllResources(farm.id)}
                      >
                        Clear
                      </Button>
                    </div>
                  </details>

                  {farm.steps?.length ? (
                    <details className="bg-stone-900/70 p-3 border-2 border-stone-700 rounded-none">
                      <summary className="cursor-pointer flex items-center justify-between select-none">
                        <span className="font-medium">Build Guide (Steps)</span>
                        <ChevronUp className="w-4 h-4" />
                      </summary>
                      <ol className="mt-3 list-decimal list-inside space-y-1 text-slate-200">
                        {farm.steps.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                    </details>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-slate-300 mt-8">
            No farms match your filters. Try clearing search/filters.
          </p>
        )}

        <footer className="mt-10 text-center text-slate-400 text-sm">
          Tip: Click <span className="text-slate-200">Export</span> to back up
          your plan, and <span className="text-slate-200">Import</span> to
          restore on another device. Data saves to your browser automatically.
        </footer>
      </div>
    </div>
  );
}
