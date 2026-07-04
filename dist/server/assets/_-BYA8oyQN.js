import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { H as buttonVariants } from "./router-DmH5gXcK.js";
import "react";
import "@tanstack/react-query";
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
function NotFoundPage() {
  usePageTitle("404 — Not Found");
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center min-h-screen p-6 text-center bg-primary-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "text-8xl font-bold text-accent-500/20 select-none", children: "404" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-accent-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-4xl", children: "🔍" }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-primary-900 mb-2", children: "Page Not Found" }),
    /* @__PURE__ */ jsx("p", { className: "text-primary-600 mb-8", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => window.history.back(), className: buttonVariants({
        variant: "outline",
        size: "default"
      }), children: [
        /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ArrowLeft01Icon, size: 18, strokeWidth: 1.5 }),
        "Go Back"
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/chat", className: buttonVariants({
        variant: "default",
        size: "default"
      }), children: [
        /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Home01Icon, size: 18, strokeWidth: 1.5 }),
        "Chat"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-primary-200", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-primary-500 mb-3", children: "Quick Links" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-4 text-sm", children: [
        /* @__PURE__ */ jsx(Link, { to: "/chat", className: "text-accent-500 hover:text-accent-600 hover:underline", children: "Chat" }),
        /* @__PURE__ */ jsx(Link, { to: "/files", className: "text-accent-500 hover:text-accent-600 hover:underline", children: "Files" }),
        /* @__PURE__ */ jsx(Link, { to: "/memory", className: "text-accent-500 hover:text-accent-600 hover:underline", children: "Memory" }),
        /* @__PURE__ */ jsx(Link, { to: "/skills", className: "text-accent-500 hover:text-accent-600 hover:underline", children: "Skills" })
      ] })
    ] })
  ] }) });
}
export {
  NotFoundPage as component
};
