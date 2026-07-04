import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { useState } from "react";
import { c as cn } from "./router-DmH5gXcK.js";
import "@tanstack/react-router";
import "@tanstack/react-query";
import "@hugeicons/react";
import "@hugeicons/core-free-icons";
import "motion/react";
import "react-dom";
import "@base-ui/react/merge-props";
import "@base-ui/react/use-render";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "zustand";
import "@base-ui/react/dialog";
import "@base-ui/react/menu";
import "zustand/middleware";
import "@base-ui/react/input";
import "@base-ui/react/switch";
import "@base-ui/react/tabs";
import "@base-ui/react/alert-dialog";
import "@base-ui/react/collapsible";
import "@base-ui/react/scroll-area";
import "@base-ui/react/tooltip";
import "shiki";
import "marked";
import "react-markdown";
import "rehype-raw";
import "rehype-sanitize";
import "remark-breaks";
import "remark-gfm";
import "@base-ui/react/preview-card";
import "@base-ui/react/autocomplete";
import "react-joyride";
import "zod";
import "node:os";
import "node:path";
import "node:fs/promises";
import "yaml";
import "node:crypto";
import "node:fs";
import "node:child_process";
import "node:url";
import "node:events";
import "node:timers/promises";
import "node:util";
import "node:dns/promises";
const QUICK_TEMPLATES = [
  { id: "analytics", label: "Analytics Dashboard", icon: "</>" },
  { id: "system", label: "System Monitor", icon: "☰" },
  { id: "chat", label: "Chat Analytics", icon: "💬" }
];
const DEFAULT_PROMPT = "Describe the UI you want: charts, tables, KPIs, filters, real-time updates... Example: 'A dashboard with a line graph showing tool usage over time, a period selector (week/month), top 3 KPI cards for most used tools, a live counter for active calls, and a detailed table below with project, tool name, count, date, and status columns.'";
function EchoStudioScreen() {
  const [tab, setTab] = useState("create");
  const [pageId, setPageId] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [creating, setCreating] = useState(false);
  const [screensCreated, setScreensCreated] = useState(0);
  const [widgetsActive, setWidgetsActive] = useState(0);
  const [apiEndpoints, setApiEndpoints] = useState(0);
  const handleCreate = async () => {
    if (!pageId.trim() || !pageTitle.trim() || !prompt.trim()) return;
    setCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    setScreensCreated((c) => c + 1);
    setApiEndpoints((c) => c + 1);
    setPageId("");
    setPageTitle("");
    setPrompt("");
    setCreating(false);
  };
  const handleTemplate = (id) => {
    const templates = {
      analytics: {
        id: "tool-analytics",
        title: "Tool Analytics",
        prompt: "A dashboard with a line graph showing tool usage over time, a period selector (week/month), top 3 KPI cards for most used tools, a live counter for active calls, and a detailed table below with project, tool name, count, date, and status columns."
      },
      system: {
        id: "system-monitor",
        title: "System Monitor",
        prompt: "A system monitoring dashboard with CPU/RAM/Disk gauges, a real-time process list, uptime counter, and alert history table. Include a dark theme and auto-refresh every 30 seconds."
      },
      chat: {
        id: "chat-analytics",
        title: "Chat Analytics",
        prompt: "A chat analytics dashboard showing messages per day as a bar chart, top users table, average response time trend, sentiment breakdown pie chart, and a searchable message log."
      }
    };
    const t = templates[id];
    if (t) {
      setPageId(t.id);
      setPageTitle(t.title);
      setPrompt(t.prompt);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-full overflow-y-auto bg-surface text-ink", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Echo Studio" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-primary-500", children: "Describe what you want. I'll build the full page with backend API." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex gap-1 rounded-lg border border-primary-200 bg-primary-50/85 p-1 backdrop-blur-xl", children: ["create", "manage", "theme"].map((t) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setTab(t),
        className: cn(
          "flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors",
          tab === t ? "bg-primary-100 text-ink shadow-sm dark:bg-neutral-800" : "text-primary-500 hover:text-ink"
        ),
        children: t
      },
      t
    )) }),
    tab === "create" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-primary-200 bg-primary-50/50 p-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500", children: "Page ID (URL Slug)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: pageId,
              onChange: (e) => setPageId(e.target.value),
              placeholder: "e.g. tool-analytics",
              className: "w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-primary-400 focus:border-accent-500 dark:bg-neutral-900"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500", children: "Page Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: pageTitle,
              onChange: (e) => setPageTitle(e.target.value),
              placeholder: "e.g. Tool Analytics",
              className: "w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-primary-400 focus:border-accent-500 dark:bg-neutral-900"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500", children: "What should this page do?" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              placeholder: DEFAULT_PROMPT,
              rows: 5,
              className: "w-full resize-y rounded-xl border border-primary-200 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-primary-400 focus:border-accent-500 dark:bg-neutral-900"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleCreate,
            disabled: !pageId.trim() || !pageTitle.trim() || !prompt.trim() || creating,
            className: cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all",
              creating || !pageId.trim() || !pageTitle.trim() || !prompt.trim() ? "cursor-not-allowed bg-primary-300 opacity-60" : "bg-accent-500 hover:bg-accent-600 active:scale-[0.98]"
            ),
            children: creating ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" }),
              "Creating..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { children: "✨" }),
              "Create Full Page + API"
            ] })
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500", children: "Quick Templates" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: QUICK_TEMPLATES.map((t) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => handleTemplate(t.id),
            className: "inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50/50 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent-500 hover:bg-accent-50/50 dark:hover:bg-accent-900/20",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-base", children: t.icon }),
              t.label
            ]
          },
          t.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsx(StatCard, { label: "Screens Created", value: screensCreated }),
        /* @__PURE__ */ jsx(StatCard, { label: "Widgets Active", value: widgetsActive }),
        /* @__PURE__ */ jsx(StatCard, { label: "API Endpoints", value: apiEndpoints })
      ] })
    ] }),
    tab === "manage" && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-primary-200 bg-primary-50/50 p-8 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg text-primary-500", children: "No screens created yet." }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-primary-400", children: "Use the Create tab to build your first dashboard." })
    ] }),
    tab === "theme" && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-primary-200 bg-primary-50/50 p-8 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg text-primary-500", children: "Theme customization coming soon." }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-primary-400", children: "Choose from light, dark, and custom color schemes for your dashboards." })
    ] })
  ] }) });
}
function StatCard({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-200 bg-primary-50/50 p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-500", children: label }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xl font-semibold tracking-tight text-ink", children: value })
  ] });
}
const SplitComponent = function EchoStudioRoute() {
  usePageTitle("Echo Studio");
  return /* @__PURE__ */ jsx(EchoStudioScreen, {});
};
export {
  SplitComponent as component
};
