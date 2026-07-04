import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { c as cn } from "./router-DmH5gXcK.js";
import { HelpCircleIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
const AGENT_AVATARS = ["🔍", "✍️", "📝", "🧪", "🎨", "📊", "🛡️", "⚡", "🔬", "🎯"];
const AGENT_AVATAR_COUNT = 10;
const LEGACY_AGENT_AVATAR_INDEX = new Map(
  AGENT_AVATARS.map((avatar, index) => [avatar, index])
);
function normalizeAgentAvatarIndex(value, fallbackIndex = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const normalized = Math.trunc(value);
    if (normalized >= 0) return normalized % AGENT_AVATAR_COUNT;
  }
  if (typeof value === "string") {
    const legacy = LEGACY_AGENT_AVATAR_INDEX.get(value.trim());
    if (legacy !== void 0) return legacy;
  }
  const fallback = Math.trunc(fallbackIndex);
  return (fallback % AGENT_AVATAR_COUNT + AGENT_AVATAR_COUNT) % AGENT_AVATAR_COUNT;
}
function darkenHexColor(color, amount = 0.2) {
  const hex = color.trim();
  const normalized = hex.startsWith("#") ? hex.slice(1) : hex;
  const expanded = normalized.length === 3 ? normalized.split("").map((char) => `${char}${char}`).join("") : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return color;
  const r = Math.round(parseInt(expanded.slice(0, 2), 16) * (1 - amount));
  const g = Math.round(parseInt(expanded.slice(2, 4), 16) * (1 - amount));
  const b = Math.round(parseInt(expanded.slice(4, 6), 16) * (1 - amount));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
function AgentAvatar({
  index,
  color,
  size = 40,
  className
}) {
  const variant = normalizeAgentAvatarIndex(index, 0);
  const shade = darkenHexColor(color, 0.2);
  const outline = darkenHexColor(color, 0.35);
  const eye = "#f8fafc";
  const baseParts = (() => {
    switch (variant) {
      case 2:
        return {
          head: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("rect", { x: "16", y: "9", width: "16", height: "12", fill: color }),
            /* @__PURE__ */ jsx("rect", { x: "14", y: "11", width: "20", height: "8", fill: color }),
            /* @__PURE__ */ jsx("rect", { x: "30", y: "9", width: "2", height: "12", fill: shade }),
            /* @__PURE__ */ jsx("rect", { x: "14", y: "17", width: "20", height: "2", fill: shade }),
            /* @__PURE__ */ jsx("rect", { x: "16", y: "19", width: "16", height: "2", fill: shade })
          ] }),
          body: { x: 14, y: 22, w: 20, h: 14 },
          arms: { leftX: 9, rightX: 35, y: 24, w: 4, h: 10 },
          legs: { y: 36, w: 5, h: 6, leftX: 17, rightX: 26 }
        };
      case 3:
        return {
          head: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("rect", { x: "15", y: "10", width: "18", height: "11", fill: color }),
            /* @__PURE__ */ jsx("rect", { x: "31", y: "10", width: "2", height: "11", fill: shade }),
            /* @__PURE__ */ jsx("rect", { x: "14", y: "19", width: "20", height: "3", fill: shade })
          ] }),
          body: { x: 12, y: 22, w: 24, h: 15 },
          arms: { leftX: 7, rightX: 37, y: 24, w: 5, h: 11 },
          legs: { y: 37, w: 6, h: 5, leftX: 16, rightX: 26 }
        };
      case 4:
        return {
          head: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("rect", { x: "18", y: "9", width: "12", height: "14", fill: color }),
            /* @__PURE__ */ jsx("rect", { x: "28", y: "9", width: "2", height: "14", fill: shade }),
            /* @__PURE__ */ jsx("rect", { x: "18", y: "21", width: "12", height: "2", fill: shade })
          ] }),
          body: { x: 17, y: 23, w: 14, h: 15 },
          arms: { leftX: 12, rightX: 32, y: 25, w: 4, h: 10 },
          legs: { y: 38, w: 4, h: 5, leftX: 19, rightX: 25 }
        };
      case 8:
        return {
          head: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("rect", { x: "17", y: "12", width: "14", height: "11", fill: color }),
            /* @__PURE__ */ jsx("rect", { x: "29", y: "12", width: "2", height: "11", fill: shade }),
            /* @__PURE__ */ jsx("rect", { x: "17", y: "21", width: "14", height: "2", fill: shade })
          ] }),
          body: { x: 16, y: 23, w: 16, h: 12 },
          arms: { leftX: 12, rightX: 32, y: 25, w: 3, h: 8 },
          legs: { y: 35, w: 4, h: 6, leftX: 18, rightX: 25 }
        };
      default:
        return {
          head: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("rect", { x: "16", y: "10", width: "16", height: "12", fill: color }),
            /* @__PURE__ */ jsx("rect", { x: "30", y: "10", width: "2", height: "12", fill: shade }),
            /* @__PURE__ */ jsx("rect", { x: "16", y: "20", width: "16", height: "2", fill: shade })
          ] }),
          body: { x: 14, y: 22, w: 20, h: 14 },
          arms: { leftX: 10, rightX: 34, y: 24, w: 4, h: 10 },
          legs: { y: 36, w: 5, h: 6, leftX: 17, rightX: 26 }
        };
    }
  })();
  const bodyParts = /* @__PURE__ */ jsxs(Fragment, { children: [
    baseParts.head,
    /* @__PURE__ */ jsx("rect", { x: baseParts.body.x, y: baseParts.body.y, width: baseParts.body.w, height: baseParts.body.h, fill: color }),
    /* @__PURE__ */ jsx("rect", { x: baseParts.body.x + baseParts.body.w - 2, y: baseParts.body.y, width: "2", height: baseParts.body.h, fill: shade }),
    /* @__PURE__ */ jsx("rect", { x: baseParts.body.x, y: baseParts.body.y + baseParts.body.h - 2, width: baseParts.body.w, height: "2", fill: shade }),
    /* @__PURE__ */ jsx("rect", { x: baseParts.arms.leftX, y: baseParts.arms.y, width: baseParts.arms.w, height: baseParts.arms.h, fill: color }),
    /* @__PURE__ */ jsx("rect", { x: baseParts.arms.rightX, y: baseParts.arms.y, width: baseParts.arms.w, height: baseParts.arms.h, fill: color }),
    /* @__PURE__ */ jsx("rect", { x: baseParts.arms.leftX + Math.max(0, baseParts.arms.w - 1), y: baseParts.arms.y, width: "1", height: baseParts.arms.h, fill: shade }),
    /* @__PURE__ */ jsx("rect", { x: baseParts.arms.rightX + Math.max(0, baseParts.arms.w - 1), y: baseParts.arms.y, width: "1", height: baseParts.arms.h, fill: shade }),
    /* @__PURE__ */ jsx("rect", { x: baseParts.legs.leftX, y: baseParts.legs.y, width: baseParts.legs.w, height: baseParts.legs.h, fill: color }),
    /* @__PURE__ */ jsx("rect", { x: baseParts.legs.rightX, y: baseParts.legs.y, width: baseParts.legs.w, height: baseParts.legs.h, fill: color }),
    /* @__PURE__ */ jsx("rect", { x: baseParts.legs.leftX + Math.max(0, baseParts.legs.w - 1), y: baseParts.legs.y, width: "1", height: baseParts.legs.h, fill: shade }),
    /* @__PURE__ */ jsx("rect", { x: baseParts.legs.rightX + Math.max(0, baseParts.legs.w - 1), y: baseParts.legs.y, width: "1", height: baseParts.legs.h, fill: shade })
  ] });
  const details = (() => {
    switch (variant) {
      case 0:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("rect", { x: "23", y: "6", width: "2", height: "4", fill: color }),
          /* @__PURE__ */ jsx("circle", { cx: "24", cy: "5", r: "1.5", fill: eye }),
          /* @__PURE__ */ jsx("circle", { cx: "20", cy: "16", r: "1.6", fill: eye }),
          /* @__PURE__ */ jsx("circle", { cx: "28", cy: "16", r: "1.6", fill: eye }),
          /* @__PURE__ */ jsx("rect", { x: "19", y: "20", width: "10", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "18", y: "28", width: "12", height: "2", fill: shade })
        ] });
      case 1:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("rect", { x: "17", y: "14", width: "14", height: "5", fill: eye, opacity: "0.95" }),
          /* @__PURE__ */ jsx("rect", { x: "17", y: "18", width: "14", height: "1", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "19", y: "28", width: "10", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "13", y: "15", width: "3", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "32", y: "15", width: "3", height: "2", fill: shade })
        ] });
      case 2:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("circle", { cx: "19", cy: "16", r: "2.2", fill: eye }),
          /* @__PURE__ */ jsx("circle", { cx: "29", cy: "16", r: "2.2", fill: eye }),
          /* @__PURE__ */ jsx("rect", { x: "20", y: "20", width: "8", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "20", y: "29", width: "8", height: "2", fill: shade })
        ] });
      case 3:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("rect", { x: "18", y: "15", width: "4", height: "2", fill: eye }),
          /* @__PURE__ */ jsx("rect", { x: "26", y: "15", width: "4", height: "2", fill: eye }),
          /* @__PURE__ */ jsx("rect", { x: "16", y: "18", width: "16", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "18", y: "28", width: "12", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "16", y: "31", width: "16", height: "2", fill: shade })
        ] });
      case 4:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("circle", { cx: "21", cy: "16", r: "1.7", fill: eye }),
          /* @__PURE__ */ jsx("circle", { cx: "27", cy: "16", r: "1.7", fill: eye }),
          /* @__PURE__ */ jsx("rect", { x: "22", y: "20", width: "4", height: "1", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "20", y: "29", width: "8", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "21", y: "32", width: "6", height: "1", fill: outline })
        ] });
      case 5:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("rect", { x: "18", y: "5", width: "2", height: "5", fill: color }),
          /* @__PURE__ */ jsx("rect", { x: "28", y: "5", width: "2", height: "5", fill: color }),
          /* @__PURE__ */ jsx("circle", { cx: "19", cy: "4", r: "1.6", fill: eye }),
          /* @__PURE__ */ jsx("circle", { cx: "29", cy: "4", r: "1.6", fill: eye }),
          /* @__PURE__ */ jsx("circle", { cx: "20", cy: "16", r: "1.6", fill: eye }),
          /* @__PURE__ */ jsx("circle", { cx: "28", cy: "16", r: "1.6", fill: eye }),
          /* @__PURE__ */ jsx("rect", { x: "19", y: "20", width: "10", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "18", y: "28", width: "12", height: "2", fill: shade })
        ] });
      case 6:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("circle", { cx: "24", cy: "16", r: "3.2", fill: eye }),
          /* @__PURE__ */ jsx("circle", { cx: "24", cy: "16", r: "1.3", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "18", y: "20", width: "12", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "17", y: "28", width: "2", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "19", y: "30", width: "2", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "21", y: "28", width: "2", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "23", y: "30", width: "2", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "25", y: "28", width: "2", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "27", y: "30", width: "2", height: "2", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "29", y: "28", width: "2", height: "2", fill: shade })
        ] });
      case 7:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("rect", { x: "21", y: "7", width: "6", height: "3", fill: color }),
          /* @__PURE__ */ jsx("rect", { x: "22", y: "5", width: "4", height: "2", fill: color }),
          /* @__PURE__ */ jsx("rect", { x: "18", y: "15", width: "4", height: "2", fill: eye }),
          /* @__PURE__ */ jsx("rect", { x: "26", y: "15", width: "4", height: "2", fill: eye }),
          /* @__PURE__ */ jsx("rect", { x: "17", y: "18", width: "14", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "19", y: "28", width: "10", height: "2", fill: outline })
        ] });
      case 8:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("circle", { cx: "20", cy: "17", r: "2.3", fill: eye }),
          /* @__PURE__ */ jsx("circle", { cx: "28", cy: "17", r: "2.3", fill: eye }),
          /* @__PURE__ */ jsx("rect", { x: "21", y: "21", width: "6", height: "1", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "20", y: "27", width: "8", height: "2", fill: shade })
        ] });
      case 9:
      default:
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("circle", { cx: "19", cy: "16", r: "2.4", fill: eye }),
          /* @__PURE__ */ jsx("circle", { cx: "29", cy: "16", r: "1.4", fill: eye }),
          /* @__PURE__ */ jsx("rect", { x: "17", y: "20", width: "4", height: "1", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "23", y: "20", width: "3", height: "1", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "28", y: "20", width: "2", height: "1", fill: shade }),
          /* @__PURE__ */ jsx("rect", { x: "18", y: "28", width: "2", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "20", y: "30", width: "2", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "22", y: "28", width: "2", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "24", y: "30", width: "2", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "26", y: "28", width: "2", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "28", y: "30", width: "2", height: "2", fill: outline }),
          /* @__PURE__ */ jsx("rect", { x: "31", y: "24", width: "2", height: "4", fill: shade })
        ] });
    }
  })();
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 48 48",
      "aria-hidden": true,
      className,
      shapeRendering: "crispEdges",
      children: [
        /* @__PURE__ */ jsx("rect", { x: "5", y: "5", width: "38", height: "38", fill: color, opacity: "0.08" }),
        /* @__PURE__ */ jsx("rect", { x: "7", y: "7", width: "34", height: "34", fill: "white", opacity: "0.92" }),
        /* @__PURE__ */ jsx("rect", { x: "7", y: "7", width: "34", height: "34", fill: "none", stroke: outline, strokeWidth: "1" }),
        bodyParts,
        details
      ]
    }
  );
}
const AGENT_ACCENT_COLORS = [
  { bar: "bg-orange-500", border: "border-orange-500", avatar: "bg-orange-100", text: "text-orange-600", ring: "ring-orange-500/20" },
  { bar: "bg-blue-500", border: "border-blue-500", avatar: "bg-blue-100", text: "text-blue-600", ring: "ring-blue-500/20" },
  { bar: "bg-violet-500", border: "border-violet-500", avatar: "bg-violet-100", text: "text-violet-600", ring: "ring-violet-500/20" },
  { bar: "bg-emerald-500", border: "border-emerald-500", avatar: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-500/20" },
  { bar: "bg-rose-500", border: "border-rose-500", avatar: "bg-rose-100", text: "text-rose-600", ring: "ring-rose-500/20" },
  { bar: "bg-amber-500", border: "border-amber-500", avatar: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-500/20" },
  { bar: "bg-cyan-500", border: "border-cyan-500", avatar: "bg-cyan-100", text: "text-cyan-600", ring: "ring-cyan-500/20" },
  { bar: "bg-fuchsia-500", border: "border-fuchsia-500", avatar: "bg-fuchsia-100", text: "text-fuchsia-600", ring: "ring-fuchsia-500/20" },
  { bar: "bg-lime-500", border: "border-lime-500", avatar: "bg-lime-100", text: "text-lime-700", ring: "ring-lime-500/20" },
  { bar: "bg-sky-500", border: "border-sky-500", avatar: "bg-sky-100", text: "text-sky-600", ring: "ring-sky-500/20" }
].map((accent, index) => ({
  ...accent,
  hex: ["#f97316", "#3b82f6", "#8b5cf6", "#10b981", "#f43f5e", "#f59e0b", "#06b6d4", "#d946ef", "#84cc16", "#0ea5e9"][index] ?? "#f97316"
}));
const OFFICE_MODEL_LABEL = {
  auto: "Auto",
  opus: "Opus",
  sonnet: "Sonnet",
  codex: "Codex",
  flash: "Flash",
  minimax: "MiniMax",
  "pc1-coder": "PC1 Coder",
  "pc1-planner": "PC1 Planner",
  "pc1-critic": "PC1 Critic"
};
function getOfficeModelLabel(modelId) {
  if (!modelId) return "Unknown";
  return OFFICE_MODEL_LABEL[modelId] ?? modelId.split("/")[1] ?? modelId;
}
function getAgentStatusMeta(status) {
  switch (status) {
    case "active":
      return { label: "Active", className: "text-emerald-600", dotClassName: "bg-emerald-500", pulse: true };
    case "ready":
    case "idle":
      return { label: "Idle", className: "text-neutral-600", dotClassName: "bg-neutral-400" };
    case "error":
      return { label: "Error", className: "text-red-600", dotClassName: "bg-red-500" };
    case "none":
      return { label: "Offline", className: "text-neutral-400", dotClassName: "bg-neutral-400" };
    case "spawning":
      return { label: "Starting", className: "text-blue-600", dotClassName: "bg-blue-500", pulse: true };
    case "paused":
      return { label: "Paused", className: "text-amber-700", dotClassName: "bg-amber-500" };
    default:
      return { label: String(status), className: "text-neutral-600", dotClassName: "bg-neutral-400" };
  }
}
const GRID_DESK_POSITIONS = [
  { x: 120, y: 180 },
  { x: 310, y: 180 },
  { x: 500, y: 180 },
  { x: 690, y: 180 },
  { x: 120, y: 320 },
  { x: 310, y: 320 },
  { x: 500, y: 320 },
  { x: 690, y: 320 },
  { x: 215, y: 460 },
  { x: 405, y: 460 },
  { x: 595, y: 460 },
  { x: 785, y: 460 }
];
const ROUNDTABLE_DESK_POSITIONS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 - 90) * Math.PI / 180;
  const cx = 450;
  const cy = 320;
  const r = 240;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle)
  };
});
const WARROOM_DESK_POSITIONS = [
  { x: 90, y: 200 },
  { x: 228, y: 200 },
  { x: 366, y: 200 },
  { x: 504, y: 200 },
  { x: 642, y: 200 },
  { x: 780, y: 200 },
  { x: 90, y: 420 },
  { x: 228, y: 420 },
  { x: 366, y: 420 },
  { x: 504, y: 420 },
  { x: 642, y: 420 },
  { x: 780, y: 420 }
];
const GRID_SOCIAL_SPOTS = [
  { x: 840, y: 140, type: "coffee" },
  { x: 840, y: 300, type: "water" },
  { x: 60, y: 440, type: "plant" },
  { x: 840, y: 460, type: "snack" }
];
const ROUNDTABLE_SOCIAL_SPOTS = [
  { x: 450, y: 320, type: "plant" },
  { x: 510, y: 320, type: "snack" },
  { x: 870, y: 120, type: "coffee" },
  { x: 870, y: 480, type: "water" }
];
const WARROOM_SOCIAL_SPOTS = [
  { x: 56, y: 300, type: "coffee" },
  { x: 56, y: 350, type: "water" },
  { x: 904, y: 300, type: "snack" },
  { x: 904, y: 350, type: "plant" }
];
const DESK_POSITIONS_BY_TEMPLATE = {
  grid: GRID_DESK_POSITIONS,
  roundtable: ROUNDTABLE_DESK_POSITIONS,
  warroom: WARROOM_DESK_POSITIONS
};
const SOCIAL_SPOTS_BY_TEMPLATE = {
  grid: GRID_SOCIAL_SPOTS,
  roundtable: ROUNDTABLE_SOCIAL_SPOTS,
  warroom: WARROOM_SOCIAL_SPOTS
};
const LAYOUT_TEMPLATE_OPTIONS = [
  { key: "grid", label: "⊞ Grid" },
  { key: "roundtable", label: "○ Roundtable" },
  { key: "warroom", label: "▬▬ War Room" }
];
function truncateSpeech(text, max = 64) {
  const n = text.replace(/\s+/g, " ").trim();
  if (!n) return "";
  return n.length <= max ? n : `${n.slice(0, max - 1).trimEnd()}…`;
}
function getSpeechLine(agent, phase) {
  if (agent.status === "active" && agent.lastLine) return truncateSpeech(agent.lastLine, 60);
  if (agent.currentTask) return `Working on ${truncateSpeech(agent.currentTask, 48)}`;
  if (agent.status === "spawning") return "Booting up...";
  if (agent.status === "paused") return "On break ☕";
  if (agent.status === "error") return "Need help!";
  const socialLines = ["Grabbing coffee ☕", "Checking messages 📱", "Stretching 🙆", "Chatting with team 💬", "Reading docs 📖", "Getting water 💧"];
  if (agent.status === "idle" || agent.status === "ready") {
    return socialLines[Math.floor(phase / 4) % socialLines.length];
  }
  return "";
}
function getStatusDotClass(status) {
  switch (status) {
    case "active":
      return "bg-emerald-500";
    case "idle":
    case "ready":
    case "none":
      return "bg-neutral-400";
    case "spawning":
      return "bg-blue-500";
    case "paused":
      return "bg-amber-500";
    case "error":
      return "bg-red-500";
    default:
      return "bg-neutral-400";
  }
}
function getAgentStatusGlowClass(status) {
  switch (status) {
    case "active":
      return "office-status-glow-active";
    case "spawning":
      return "office-status-glow-starting";
    case "paused":
      return "office-status-glow-paused";
    case "error":
      return "office-status-glow-error";
    default:
      return "office-status-glow-idle";
  }
}
function getAgentStatusGlowColor(status) {
  switch (status) {
    case "active":
      return "#10b981";
    case "spawning":
      return "#3b82f6";
    case "paused":
      return "#f59e0b";
    case "error":
      return "#ef4444";
    default:
      return "#94a3b8";
  }
}
function truncateMonitorText(text, max = 30) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return normalized.length <= max ? normalized : `${normalized.slice(0, max - 1).trimEnd()}…`;
}
function getDeskMonitorText(agent, agentTaskTitle) {
  const taskTitle = agentTaskTitle?.trim();
  if (taskTitle) return truncateMonitorText(taskTitle, 30);
  if (agent.status === "idle" || agent.status === "ready") return "Ready";
  return getAgentStatusMeta(agent.status).label;
}
function getAgentEmoji(agent) {
  const row = agent;
  const emoji = row.emoji?.trim() || row.avatarEmoji?.trim();
  return emoji || null;
}
function DeskSVG({
  x,
  y,
  occupied,
  accent,
  monitorText,
  monitorGlow
}) {
  return /* @__PURE__ */ jsxs("g", { transform: `translate(${x} ${y})`, children: [
    /* @__PURE__ */ jsx("rect", { x: "-40", y: "-8", width: "80", height: "40", rx: "4", fill: occupied ? "#f8fafc" : "#f1f5f9", fillOpacity: occupied ? 0.78 : 0.7, stroke: occupied ? "#dbe4ee" : "#e6edf5", strokeWidth: "1" }),
    /* @__PURE__ */ jsx("rect", { x: "-36", y: "32", width: "4", height: "16", rx: "1", fill: "#a7b4c6" }),
    /* @__PURE__ */ jsx("rect", { x: "32", y: "32", width: "4", height: "16", rx: "1", fill: "#a7b4c6" }),
    occupied ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("rect", { x: "-20", y: "-30", width: "40", height: "24", rx: "3", fill: monitorGlow || "#3b82f6", opacity: "0.2" }),
      /* @__PURE__ */ jsx("rect", { x: "-18", y: "-28", width: "36", height: "22", rx: "3", fill: "#0f172a" }),
      /* @__PURE__ */ jsx("rect", { x: "-15", y: "-25", width: "30", height: "16", rx: "1.5", fill: "#111827", stroke: monitorGlow || accent || "#3b82f6", strokeWidth: "0.9" }),
      monitorText ? /* @__PURE__ */ jsx(
        "text",
        {
          x: "0",
          y: "-14.8",
          fontSize: "4.2",
          fill: "#e2e8f0",
          textAnchor: "middle",
          fontWeight: "600",
          children: monitorText
        }
      ) : null,
      /* @__PURE__ */ jsx("rect", { x: "-3", y: "-6", width: "6", height: "6", rx: "1", fill: "#64748b" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("rect", { x: "-18", y: "-28", width: "36", height: "22", rx: "3", fill: "#e2e8f0", stroke: "#cbd5e1", strokeWidth: "1" }),
      /* @__PURE__ */ jsx("rect", { x: "-3", y: "-6", width: "6", height: "6", rx: "1", fill: "#cbd5e1" })
    ] }),
    /* @__PURE__ */ jsx("ellipse", { cx: "0", cy: "56", rx: "14", ry: "6", fill: occupied ? accent ? `${accent}22` : "#dbeafe" : "#f1f5f9" }),
    /* @__PURE__ */ jsx("rect", { x: "-10", y: "48", width: "20", height: "10", rx: "4", fill: occupied ? "#475569" : "#cbd5e1" })
  ] });
}
function CoffeeMachineSVG({ x, y }) {
  return /* @__PURE__ */ jsxs("g", { transform: `translate(${x} ${y})`, children: [
    /* @__PURE__ */ jsx("rect", { x: "-20", y: "-30", width: "40", height: "50", rx: "5", fill: "#78716c" }),
    /* @__PURE__ */ jsx("rect", { x: "-14", y: "-24", width: "28", height: "20", rx: "3", fill: "#292524" }),
    /* @__PURE__ */ jsx("circle", { cx: "0", cy: "-14", r: "6", fill: "#dc2626", opacity: "0.8" }),
    /* @__PURE__ */ jsx("text", { x: "0", y: "-11", fontSize: "6", fill: "white", textAnchor: "middle", children: "☕" }),
    /* @__PURE__ */ jsx("rect", { x: "-16", y: "20", width: "32", height: "6", rx: "2", fill: "#a8a29e" }),
    /* @__PURE__ */ jsx("text", { x: "0", y: "38", fontSize: "8", fill: "#78716c", textAnchor: "middle", children: "Coffee" })
  ] });
}
function WaterCoolerSVG({ x, y }) {
  return /* @__PURE__ */ jsxs("g", { transform: `translate(${x} ${y})`, children: [
    /* @__PURE__ */ jsx("rect", { x: "-14", y: "-20", width: "28", height: "40", rx: "4", fill: "#e2e8f0", stroke: "#cbd5e1" }),
    /* @__PURE__ */ jsx("circle", { cx: "0", cy: "-26", r: "10", fill: "#bfdbfe", stroke: "#93c5fd", strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx("circle", { cx: "-5", cy: "0", r: "2", fill: "#0ea5e9" }),
    /* @__PURE__ */ jsx("circle", { cx: "5", cy: "0", r: "2", fill: "#ef4444" }),
    /* @__PURE__ */ jsx("text", { x: "0", y: "32", fontSize: "8", fill: "#64748b", textAnchor: "middle", children: "Water" })
  ] });
}
function SnackBarSVG({ x, y }) {
  return /* @__PURE__ */ jsxs("g", { transform: `translate(${x} ${y})`, children: [
    /* @__PURE__ */ jsx("rect", { x: "-24", y: "-16", width: "48", height: "28", rx: "4", fill: "#fef3c7", stroke: "#fbbf24", strokeWidth: "1" }),
    /* @__PURE__ */ jsx("text", { x: "0", y: "2", fontSize: "14", textAnchor: "middle", children: "🍪" }),
    /* @__PURE__ */ jsx("text", { x: "0", y: "24", fontSize: "8", fill: "#92400e", textAnchor: "middle", children: "Snacks" })
  ] });
}
function PlantSVG({ x, y }) {
  return /* @__PURE__ */ jsxs("g", { transform: `translate(${x} ${y})`, children: [
    /* @__PURE__ */ jsx("rect", { x: "-10", y: "6", width: "20", height: "14", rx: "3", fill: "#92400e" }),
    /* @__PURE__ */ jsx("circle", { cx: "0", cy: "-4", r: "14", fill: "#16a34a", opacity: "0.9" }),
    /* @__PURE__ */ jsx("circle", { cx: "-8", cy: "0", r: "8", fill: "#22c55e", opacity: "0.8" }),
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "2", r: "7", fill: "#15803d", opacity: "0.8" })
  ] });
}
function formatRuntime(startedAt, tokenCount) {
  const diffMs = Date.now() - startedAt;
  let time;
  if (diffMs < 6e4) {
    time = `${Math.floor(diffMs / 1e3)}s`;
  } else {
    const mins = Math.floor(diffMs / 6e4);
    time = mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h`;
  }
  const tokens = typeof tokenCount === "number" ? tokenCount : 0;
  return `${time} · ${tokens}t`;
}
function kindLabel(kind) {
  if (kind === "subagent" || kind === "sub-agent") return "Sub-Agent";
  if (kind === "main") return "Main";
  if (kind === "chat") return "Chat";
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}
function RemoteSessionCard({ session, onClick }) {
  const statusColor = session.status === "active" ? "bg-emerald-400 animate-pulse" : session.status === "done" ? "bg-neutral-300 dark:bg-neutral-600" : "bg-amber-400";
  const badgeColorClass = session.kind === "main" ? "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400 border-violet-200 dark:border-violet-800" : session.kind === "subagent" || session.kind === "sub-agent" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800";
  const modelDisplay = session.model ? session.model.split("/").pop()?.replace(/:latest$/, "") ?? null : null;
  const lastMessageSnippet = session.lastMessage ? session.lastMessage.length > 60 ? `${session.lastMessage.slice(0, 60)}…` : session.lastMessage : null;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: "group flex min-h-11 flex-col items-center gap-1.5 rounded-xl border border-neutral-200 bg-white p-3 text-center transition-all hover:border-accent-500 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-lg", children: "🤖" }),
          /* @__PURE__ */ jsx("span", { className: cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-neutral-800", statusColor) })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "w-full truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200", children: session.label }),
        modelDisplay ? /* @__PURE__ */ jsx("span", { className: "w-full truncate text-xs text-neutral-400", children: modelDisplay }) : null,
        lastMessageSnippet ? /* @__PURE__ */ jsx("span", { className: "w-full truncate text-xs italic text-neutral-500 dark:text-neutral-400", children: lastMessageSnippet }) : null,
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 flex-wrap justify-center", children: [
          /* @__PURE__ */ jsx("span", { className: cn("rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest", badgeColorClass), children: kindLabel(session.kind) }),
          session.startedAt ? /* @__PURE__ */ jsx("span", { className: "text-xs text-neutral-400 tabular-nums", children: formatRuntime(session.startedAt, session.tokenCount) }) : null
        ] })
      ]
    }
  );
}
function OfficeView({
  agentRows,
  missionRunning,
  onViewOutput,
  onNewMission,
  selectedOutputAgentId,
  activeTemplateName: _activeTemplateName,
  companyName = "Swarm",
  agentTasks = {},
  remoteSessions = [],
  onViewRemoteOutput,
  containerHeight,
  hideHeader = false
}) {
  const compact = Boolean(containerHeight);
  const [tick, setTick] = useState(0);
  const [layoutPickerOpen, setLayoutPickerOpen] = useState(false);
  const [remoteCollapsed, setRemoteCollapsed] = useState(true);
  const [layoutTemplate, setLayoutTemplate] = useState(() => {
    if (typeof window === "undefined") return "grid";
    const saved = window.localStorage.getItem("clawsuite:office-layout");
    return saved === "roundtable" || saved === "warroom" || saved === "grid" ? saved : "grid";
  });
  const deskPositions = DESK_POSITIONS_BY_TEMPLATE[layoutTemplate];
  const socialSpots = SOCIAL_SPOTS_BY_TEMPLATE[layoutTemplate];
  const socialLabelPosition = layoutTemplate === "roundtable" ? { x: 450, y: 108, text: "Collaboration Ring" } : layoutTemplate === "warroom" ? { x: 480, y: 112, text: "Briefing Lounge" } : { x: 840, y: 110, text: "Break Area" };
  const changeLayout = (nextTemplate) => {
    setLayoutTemplate(nextTemplate);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("clawsuite:office-layout", nextTemplate);
    }
  };
  useEffect(() => {
    if (!layoutPickerOpen) return;
    function onDown(e) {
      const target = e.target;
      if (!target.closest("[data-layout-picker]")) {
        setLayoutPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [layoutPickerOpen]);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((t) => t + 1), 500);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (remoteSessions.length > 0) {
      setRemoteCollapsed(false);
    }
  }, [remoteSessions.length]);
  if (agentRows.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: cn("flex items-center justify-center p-8", compact ? "h-full" : "min-h-[320px]"), children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "mb-3 text-4xl", children: "🏢" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-neutral-600 dark:text-neutral-300", children: "Empty office" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-neutral-500 dark:text-neutral-400", children: "Add agents in Configure to fill the office." })
    ] }) });
  }
  const sceneW = 1040;
  const sceneH = 600;
  const activeCount = agentRows.filter((r) => r.status === "active").length;
  const sessionCount = agentRows.filter((r) => Boolean(r.sessionKey)).length;
  const phase = tick * 0.2;
  const agentPositions = agentRows.map((agent, index) => {
    const desk = deskPositions[index % deskPositions.length];
    const isIdle = agent.status === "idle" || agent.status === "ready";
    const isPaused = agent.status === "paused";
    if (isIdle || isPaused) {
      const wanderCycle = Math.floor((tick + index * 17) / 25) % 4;
      const socialSpot = socialSpots[(index + Math.floor(tick / 60)) % socialSpots.length];
      const t = (tick + index * 17) % 25 / 25;
      if (wanderCycle === 0) {
        return { x: desk.x, y: desk.y - 20, atDesk: true, stationary: true };
      } else if (wanderCycle === 1) {
        return {
          x: desk.x + (socialSpot.x - desk.x) * t,
          y: desk.y - 20 + (socialSpot.y - desk.y + 10) * t,
          atDesk: false,
          stationary: false
        };
      } else if (wanderCycle === 2) {
        const bob = Math.sin(phase + index) * 2;
        return { x: socialSpot.x + (index % 2 === 0 ? -20 : 20), y: socialSpot.y + bob, atDesk: false, stationary: true };
      } else {
        const socialSpotBack = socialSpots[(index + Math.floor(tick / 60)) % socialSpots.length];
        return {
          x: socialSpotBack.x + (desk.x - socialSpotBack.x) * t,
          y: socialSpotBack.y + (desk.y - 20 - socialSpotBack.y) * t,
          atDesk: false,
          stationary: false
        };
      }
    }
    return { x: desk.x, y: desk.y - 20, atDesk: true, stationary: true };
  });
  return /* @__PURE__ */ jsxs("div", { className: cn(
    "flex flex-col",
    compact ? "h-full bg-gradient-to-b from-slate-100 via-slate-50 to-neutral-100 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900" : "min-h-[480px] bg-gradient-to-b from-slate-50 to-neutral-100 dark:from-slate-900 dark:to-slate-800"
  ), children: [
    hideHeader ? null : /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-wrap items-start justify-between gap-2 border-b border-neutral-200 bg-white/80 px-5 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-base font-bold text-neutral-900 dark:text-white", children: "ClawSuite Office" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:text-neutral-400 tabular-nums", children: [
            agentRows.length,
            " agents"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 tabular-nums", children: [
            activeCount,
            " working"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400 tabular-nums", children: [
            sessionCount,
            " sessions"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        missionRunning ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400", children: [
          /* @__PURE__ */ jsxs("span", { className: "relative flex size-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute inset-0 animate-ping rounded-full bg-emerald-400/60" }),
            /* @__PURE__ */ jsx("span", { className: "relative inline-flex size-1.5 rounded-full bg-emerald-500" })
          ] }),
          "Mission Live"
        ] }) : null,
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => onNewMission?.(),
            className: "min-h-11 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-600 sm:px-4 sm:py-2 sm:text-sm",
            children: "+ New Mission"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-3 md:hidden", children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: agentRows.map((agent, index) => {
      const accent = AGENT_ACCENT_COLORS[index % AGENT_ACCENT_COLORS.length];
      const statusMeta = getAgentStatusMeta(agent.status);
      const emoji = getAgentEmoji(agent);
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => onViewOutput(agent.id),
          className: "flex min-h-11 w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900/70",
          children: [
            /* @__PURE__ */ jsx("div", { className: cn("flex size-9 shrink-0 items-center justify-center rounded-full", accent.avatar), children: emoji ? /* @__PURE__ */ jsx("span", { className: "text-base leading-none", "aria-hidden": true, children: emoji }) : /* @__PURE__ */ jsx(AgentAvatar, { index: index % 10, color: accent.hex, size: 22 }) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-neutral-900 dark:text-white", children: agent.name }),
              /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-neutral-500 dark:text-slate-400", children: getOfficeModelLabel(agent.modelId) })
            ] }),
            /* @__PURE__ */ jsx("span", { className: cn("shrink-0 text-xs font-semibold", statusMeta.className), children: statusMeta.label })
          ]
        },
        `${agent.id}-mobile`
      );
    }) }) }),
    /* @__PURE__ */ jsx("div", { className: "hidden shrink-0 justify-end px-3 pb-1 pt-2 md:flex", children: /* @__PURE__ */ jsxs("div", { className: "relative", "data-layout-picker": true, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setLayoutPickerOpen((v) => !v),
          className: "inline-flex min-h-11 items-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-slate-700 dark:bg-slate-800 dark:text-neutral-300 dark:hover:bg-slate-700 sm:px-4 sm:py-2 sm:text-sm",
          title: "Change office layout",
          children: /* @__PURE__ */ jsx("span", { children: "✏️" })
        }
      ),
      layoutPickerOpen && /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-full z-50 mt-1 min-w-[120px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900", children: LAYOUT_TEMPLATE_OPTIONS.map((opt) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            changeLayout(opt.key);
            setLayoutPickerOpen(false);
          },
          className: cn(
            "w-full px-3 py-2 text-left text-[12px] transition-colors hover:bg-neutral-50 dark:hover:bg-slate-800",
            layoutTemplate === opt.key ? "font-medium text-accent-600" : "text-neutral-700 dark:text-slate-300"
          ),
          children: opt.label
        },
        opt.key
      )) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: cn("relative hidden flex-1 md:flex", !compact && "min-h-[440px]"), children: [
      /* @__PURE__ */ jsx("style", { children: `
          @keyframes office-idle-float {
            0%, 100% { transform: translateY(-3px); }
            50% { transform: translateY(3px); }
          }
          @keyframes office-status-glow-green {
            0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.38), 0 0 14px 2px rgba(16, 185, 129, 0.3); }
            50% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0), 0 0 22px 6px rgba(16, 185, 129, 0.38); }
          }
          @keyframes office-status-glow-amber {
            0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.32), 0 0 12px 2px rgba(245, 158, 11, 0.26); }
            50% { box-shadow: 0 0 0 7px rgba(245, 158, 11, 0), 0 0 18px 4px rgba(245, 158, 11, 0.34); }
          }
          @keyframes office-status-glow-blue {
            0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3), 0 0 12px 2px rgba(59, 130, 246, 0.25); }
            50% { box-shadow: 0 0 0 7px rgba(59, 130, 246, 0), 0 0 18px 4px rgba(59, 130, 246, 0.32); }
          }
          @keyframes office-status-glow-neutral {
            0%, 100% { box-shadow: 0 0 0 0 rgba(115, 115, 115, 0.18), 0 0 10px 2px rgba(115, 115, 115, 0.2); }
            50% { box-shadow: 0 0 0 6px rgba(115, 115, 115, 0), 0 0 14px 3px rgba(115, 115, 115, 0.24); }
          }
          @keyframes office-status-glow-red {
            0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.34), 0 0 12px 2px rgba(239, 68, 68, 0.3); }
            50% { box-shadow: 0 0 0 7px rgba(239, 68, 68, 0), 0 0 19px 5px rgba(239, 68, 68, 0.36); }
          }
          .office-agent-stationary {
            animation: office-idle-float 3s ease-in-out infinite;
          }
          .office-status-glow-active {
            animation: office-status-glow-green 2.2s ease-in-out infinite;
          }
          .office-status-glow-idle {
            animation: office-status-glow-neutral 2.6s ease-in-out infinite;
          }
          .office-status-glow-starting {
            animation: office-status-glow-blue 2.4s ease-in-out infinite;
          }
          .office-status-glow-paused {
            animation: office-status-glow-amber 2.6s ease-in-out infinite;
          }
          .office-status-glow-error {
            animation: office-status-glow-red 2.2s ease-in-out infinite;
          }
        ` }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "pointer-events-none absolute inset-0 opacity-30 dark:opacity-20",
          style: {
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.35) 1px, transparent 0)",
            backgroundSize: "26px 26px"
          }
        }
      ),
      /* @__PURE__ */ jsxs(
        "svg",
        {
          viewBox: `0 0 ${sceneW} ${sceneH}`,
          className: "absolute inset-0 h-full w-full",
          preserveAspectRatio: "xMidYMid meet",
          "aria-hidden": true,
          children: [
            /* @__PURE__ */ jsx("rect", { x: "80", y: "140", width: "680", height: "420", rx: "16", fill: "#f8fafc", fillOpacity: "0.34", stroke: "#e4ecf4", strokeWidth: "0.8", className: "dark:fill-slate-800/20 dark:stroke-slate-700/60" }),
            /* @__PURE__ */ jsx("text", { x: socialLabelPosition.x, y: socialLabelPosition.y, fontSize: "9", fill: "#94a3b8", textAnchor: "middle", fontWeight: "600", className: "uppercase", children: socialLabelPosition.text }),
            socialSpots.map((spot, i) => spot.type === "coffee" ? /* @__PURE__ */ jsx(CoffeeMachineSVG, { x: spot.x, y: spot.y }, i) : spot.type === "water" ? /* @__PURE__ */ jsx(WaterCoolerSVG, { x: spot.x, y: spot.y }, i) : spot.type === "snack" ? /* @__PURE__ */ jsx(SnackBarSVG, { x: spot.x, y: spot.y }, i) : /* @__PURE__ */ jsx(PlantSVG, { x: spot.x, y: spot.y }, i)),
            /* @__PURE__ */ jsx(PlantSVG, { x: 60, y: 160 }),
            /* @__PURE__ */ jsx(PlantSVG, { x: 60, y: 560 }),
            deskPositions.map((desk, i) => {
              const occupied = i < agentRows.length;
              const accent = occupied ? AGENT_ACCENT_COLORS[i % AGENT_ACCENT_COLORS.length] : void 0;
              const agent = occupied ? agentRows[i] : void 0;
              const monitorText = agent ? getDeskMonitorText(agent, agentTasks[agent.id]) : void 0;
              const monitorGlow = agent ? getAgentStatusGlowColor(agent.status) : void 0;
              return /* @__PURE__ */ jsx(
                "g",
                {
                  className: "transition-all duration-500",
                  style: {
                    transform: `translate(${desk.x}px, ${desk.y}px)`,
                    transition: "transform 0.5s ease-in-out"
                  },
                  children: /* @__PURE__ */ jsx(
                    DeskSVG,
                    {
                      x: 0,
                      y: 0,
                      occupied,
                      accent: accent?.hex,
                      monitorText,
                      monitorGlow
                    }
                  )
                },
                `desk-${i}`
              );
            })
          ]
        }
      ),
      !compact && !hideHeader ? /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2", children: /* @__PURE__ */ jsx("div", { className: "rounded-md border border-neutral-300/90 bg-[#fdfdf8] px-4 py-2 shadow-[0_2px_8px_rgba(15,23,42,0.15)]", children: /* @__PURE__ */ jsx("span", { className: "block whitespace-nowrap text-center text-sm font-bold tracking-wide text-neutral-800 [font-family:'Bradley_Hand','Marker_Felt','Comic_Sans_MS',cursive]", children: companyName }) }) }) : null,
      agentRows.map((agent, index) => {
        const accent = AGENT_ACCENT_COLORS[index % AGENT_ACCENT_COLORS.length];
        const pos = agentPositions[index];
        const emoji = getAgentEmoji(agent);
        const isSelected = agent.id === selectedOutputAgentId;
        const isActive = agent.status === "active";
        const isIdle = agent.status === "idle" || agent.status === "ready";
        const statusMeta = getAgentStatusMeta(agent.status);
        const speechLine = getSpeechLine(agent, tick + index * 7);
        const showSpeech = !compact && Boolean(speechLine) && agentRows.length <= 8 && (tick + index * 3) % 8 < 6;
        const xPct = pos.x / sceneW * 100;
        const yPct = pos.y / sceneH * 100;
        const movementTransform = `translate(-50%, -50%)`;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => onViewOutput(agent.id),
            className: cn(
              "group absolute z-10 flex flex-col items-center rounded-xl bg-transparent px-1.5 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400",
              isSelected && "ring-2 ring-accent-300/80"
            ),
            style: {
              left: `${xPct}%`,
              top: `${yPct}%`,
              transform: movementTransform,
              transition: "left 0.8s ease-in-out, top 0.8s ease-in-out"
            },
            title: `${agent.name} · ${statusMeta.label}`,
            children: [
              showSpeech ? /* @__PURE__ */ jsxs("span", { className: "pointer-events-none relative mb-2 max-w-[180px] rounded-lg bg-white px-3 py-1.5 text-xs leading-snug text-neutral-700 shadow-lg dark:bg-slate-800 dark:text-slate-200", children: [
                /* @__PURE__ */ jsx("span", { className: "block truncate", children: speechLine }),
                /* @__PURE__ */ jsx("span", { className: "absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white dark:bg-slate-800" })
              ] }) : null,
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: cn(
                    "relative rounded-full transition-transform duration-300 group-hover:scale-105",
                    getAgentStatusGlowClass(agent.status)
                  ),
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: cn(
                          "flex items-center justify-center rounded-full bg-transparent",
                          pos.stationary && "office-agent-stationary"
                        ),
                        style: { width: isActive ? 46 : 40, height: isActive ? 46 : 40 },
                        children: emoji ? /* @__PURE__ */ jsx("span", { className: "select-none leading-none", style: { fontSize: isActive ? 30 : 26 }, "aria-hidden": true, children: emoji }) : /* @__PURE__ */ jsx(
                          AgentAvatar,
                          {
                            index: index % 10,
                            color: accent.hex,
                            size: isActive ? 44 : 38
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: cn(
                      "absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-white dark:border-slate-800",
                      getStatusDotClass(agent.status),
                      statusMeta.pulse && "animate-pulse"
                    ) })
                  ]
                }
              ),
              isActive ? /* @__PURE__ */ jsxs("span", { className: "mt-1 flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", children: [
                /* @__PURE__ */ jsx("span", { className: "size-1 animate-pulse rounded-full bg-emerald-500" }),
                /* @__PURE__ */ jsx("span", { className: "size-1 animate-pulse rounded-full bg-emerald-500 [animation-delay:120ms]" }),
                /* @__PURE__ */ jsx("span", { className: "size-1 animate-pulse rounded-full bg-emerald-500 [animation-delay:240ms]" }),
                /* @__PURE__ */ jsx("span", { className: "ml-0.5", children: "Working" })
              ] }) : isIdle && !pos.atDesk && !compact ? /* @__PURE__ */ jsx("span", { className: "mt-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-400", children: "On break" }) : null,
              /* @__PURE__ */ jsx("span", { className: "mt-1 max-w-full truncate text-[10px] font-semibold text-neutral-800 dark:text-white", children: agent.name }),
              !compact ? /* @__PURE__ */ jsx("span", { className: "max-w-full truncate text-xs text-neutral-500 dark:text-slate-400", children: getOfficeModelLabel(agent.modelId) }) : null
            ]
          },
          agent.id
        );
      })
    ] }),
    remoteSessions.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "border-t border-neutral-200 dark:border-neutral-700 p-3", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setRemoteCollapsed((prev) => !prev),
          className: "mb-2 flex w-full items-center justify-between px-1 text-left",
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-neutral-400", children: "Remote Sessions" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-neutral-400", children: remoteCollapsed ? "Show" : "Hide" })
          ]
        }
      ),
      !remoteCollapsed ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: remoteSessions.map((session) => /* @__PURE__ */ jsx(
        RemoteSessionCard,
        {
          session,
          onClick: () => onViewRemoteOutput?.(session.sessionKey, session.label)
        },
        session.sessionKey
      )) }) : null
    ] }) : null,
    !compact ? /* @__PURE__ */ jsxs("div", { className: "hidden items-center justify-between border-t border-neutral-200 bg-white/80 px-4 py-2 text-xs text-neutral-500 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400 md:flex", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        agentRows.length,
        "/",
        deskPositions.length,
        " desks occupied"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-emerald-500" }),
          " Working"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-neutral-400" }),
          " Idle"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-red-500" }),
          " Error"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-neutral-400" }),
          " Empty"
        ] })
      ] })
    ] }) : null
  ] });
}
function WorkflowHelpModal({
  title,
  eyebrow,
  sections,
  triggerLabel = "How it works",
  compact = false
}) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        className: cn(
          "inline-flex items-center gap-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-card2)]",
          compact ? "px-2.5 py-2 text-xs font-medium" : "px-3 py-2 text-sm font-medium"
        ),
        children: [
          /* @__PURE__ */ jsx(HugeiconsIcon, { icon: HelpCircleIcon, size: compact ? 14 : 16, strokeWidth: 1.8 }),
          /* @__PURE__ */ jsx("span", { children: triggerLabel })
        ]
      }
    ),
    open ? /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[12000] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text)] shadow-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 border-b border-[var(--theme-border)] px-5 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          eyebrow ? /* @__PURE__ */ jsx("p", { className: "mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: eyebrow }) : null,
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: title })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setOpen(false),
            className: "rounded-lg p-2 text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]",
            "aria-label": `Close ${title}`,
            children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Cancel01Icon, size: 18, strokeWidth: 1.8 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5", children: sections.map((section) => /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-[var(--theme-text)]", children: section.title }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1.5 text-sm text-[var(--theme-muted)]", children: section.bullets.map((bullet) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--theme-accent)]" }),
          /* @__PURE__ */ jsx("span", { children: bullet })
        ] }, bullet)) })
      ] }, section.title)) })
    ] }) }) : null
  ] });
}
export {
  OfficeView as O,
  WorkflowHelpModal as W
};
