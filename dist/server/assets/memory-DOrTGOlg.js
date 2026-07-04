import { jsx, jsxs } from "react/jsx-runtime";
import { useState, Suspense, lazy } from "react";
import { n as useFeatureAvailable, T as Tabs, f as TabsList, g as TabsTab, h as TabsPanel, o as BackendUnavailableState, p as getUnavailableReason } from "./router-DmH5gXcK.js";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
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
const MemoryBrowserScreen = lazy(async () => {
  const module = await import("./memory-browser-screen-Cmkkn8Pr.js");
  return {
    default: module.MemoryBrowserScreen
  };
});
const KnowledgeBrowserScreen = lazy(async () => {
  const module = await import("./knowledge-browser-screen-ffKZfbax.js");
  return {
    default: module.KnowledgeBrowserScreen
  };
});
const ExternalMemoryBrowserScreen = lazy(async () => {
  const module = await import("./external-memory-browser-screen-DsNkcsmD.js");
  return {
    default: module.ExternalMemoryBrowserScreen
  };
});
function RouteLoadingState({
  label
}) {
  return /* @__PURE__ */ jsx("div", { className: "flex h-full min-h-[240px] items-center justify-center px-4 text-sm text-primary-500 dark:text-neutral-400", children: label });
}
const SplitComponent = function MemoryRoute() {
  const [tab, setTab] = useState("memory");
  const memoryAvailable = useFeatureAvailable("memory");
  usePageTitle("Memory");
  return /* @__PURE__ */ jsx("div", { className: "flex h-full min-h-0 flex-col", children: /* @__PURE__ */ jsxs(Tabs, { value: tab, onValueChange: (value) => setTab(value), className: "h-full min-h-0 gap-0", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-primary-200 px-3 pt-3 dark:border-neutral-800 md:px-4 md:pt-4", children: /* @__PURE__ */ jsxs(TabsList, { variant: "underline", className: "w-full justify-start gap-1", children: [
      /* @__PURE__ */ jsx(TabsTab, { value: "memory", children: "Memory" }),
      /* @__PURE__ */ jsx(TabsTab, { value: "knowledge", children: "Knowledge" }),
      /* @__PURE__ */ jsx(TabsTab, { value: "external", children: "External providers" })
    ] }) }),
    /* @__PURE__ */ jsx(TabsPanel, { value: "memory", className: "min-h-0 flex-1", children: tab === "memory" ? /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(RouteLoadingState, { label: "Loading memory browser..." }), children: memoryAvailable ? /* @__PURE__ */ jsx(MemoryBrowserScreen, {}) : /* @__PURE__ */ jsx(BackendUnavailableState, { feature: "Memory", description: getUnavailableReason("Memory") }) }) : null }),
    /* @__PURE__ */ jsx(TabsPanel, { value: "knowledge", className: "min-h-0 flex-1", children: tab === "knowledge" ? /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(RouteLoadingState, { label: "Loading knowledge browser..." }), children: /* @__PURE__ */ jsx(KnowledgeBrowserScreen, {}) }) : null }),
    /* @__PURE__ */ jsx(TabsPanel, { value: "external", className: "min-h-0 flex-1", children: tab === "external" ? /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(RouteLoadingState, { label: "Loading external memory providers..." }), children: /* @__PURE__ */ jsx(ExternalMemoryBrowserScreen, {}) }) : null })
  ] }) });
};
export {
  SplitComponent as component
};
