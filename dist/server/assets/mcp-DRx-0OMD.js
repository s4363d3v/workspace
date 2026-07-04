import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { m as Switch, B as Button, D as DialogRoot, b as DialogContent, d as DialogTitle, e as DialogDescription, S as ScrollAreaRoot, i as ScrollAreaViewport, k as ScrollAreaScrollbar, l as ScrollAreaThumb, t as toast, T as Tabs, f as TabsList, g as TabsTab, h as TabsPanel, n as useFeatureAvailable, o as BackendUnavailableState, p as getUnavailableReason } from "./router-DmH5gXcK.js";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { useState, useCallback, useEffect, useRef } from "react";
import { useQueryClient, useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import "@tanstack/react-router";
import "@hugeicons/react";
import "@hugeicons/core-free-icons";
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
async function postJson(path, body, method = "POST") {
  const init = {
    method,
    headers: { "Content-Type": "application/json" }
  };
  if (method !== "DELETE") init.body = JSON.stringify(body);
  const res = await fetch(path, init);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.ok === false) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  return json;
}
function useTestMcpServer() {
  return useMutation({
    mutationFn: (payload) => postJson("/api/mcp/test", payload)
  });
}
function useDiscoverMcpTools() {
  return useMutation({
    mutationFn: (payload) => postJson("/api/mcp/discover", payload)
  });
}
function useUpsertMcpServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => postJson("/api/mcp", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mcp", "servers"] })
  });
}
function useConfigureMcpServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => postJson("/api/mcp/configure", payload, "PUT"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mcp", "servers"] })
  });
}
function useDeleteMcpServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name }) => postJson(`/api/mcp/${encodeURIComponent(name)}`, null, "DELETE"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mcp", "servers"] })
  });
}
function useMcpCapabilityMode() {
  const query = useQuery({
    queryKey: ["gateway-status", "mcp-mode"],
    queryFn: async () => {
      const res = await fetch("/api/gateway-status");
      if (!res.ok) return "off";
      const body = await res.json();
      const caps = body.capabilities ?? {};
      if (caps.mcp) return "native";
      if (caps.mcpFallback) return "fallback";
      return "off";
    },
    staleTime: 3e4,
    refetchOnWindowFocus: false
  });
  return {
    mode: query.data ?? "off",
    isLoading: query.isLoading
  };
}
const POLL_INTERVAL_MS = 2e3;
const TIMEOUT_MS = 6e4;
function useMcpOauth() {
  const qc = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const start = useCallback(
    async (server) => {
      setIsPending(true);
      setIsError(false);
      setError(null);
      setData(null);
      if (typeof window !== "undefined") {
        const target = server.authorizationUrl || server.url;
        if (target) {
          try {
            window.open(target, "_blank", "noopener,noreferrer");
          } catch {
          }
        }
      }
      const deadline = Date.now() + TIMEOUT_MS;
      try {
        while (Date.now() < deadline) {
          const res = await fetch("/api/mcp/test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: server.name })
          });
          const payload = await res.json().catch(() => ({}));
          if (res.ok && payload.status === "connected") {
            setData(payload);
            setIsPending(false);
            qc.invalidateQueries({ queryKey: ["mcp", "servers"] });
            return payload;
          }
          await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        }
        const timeoutErr = new Error("OAuth reauth timed out after 60s");
        setError(timeoutErr);
        setIsError(true);
        setIsPending(false);
        return null;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        setIsError(true);
        setIsPending(false);
        return null;
      }
    },
    [qc]
  );
  return { start, isPending, isError, error, data };
}
const ANGLE_BRACKET_RE = /^<[^>]+>$/;
const AUTH_ENV_KEY_RE = /(_TOKEN|_KEY|_SECRET|_AUTH|_APIKEY|_API_KEY)$/i;
function isArgPlaceholder(value) {
  if (ANGLE_BRACKET_RE.test(value)) return true;
  if (value.includes("/path/to/")) return true;
  if (value.includes("/your/path")) return true;
  return false;
}
function isUrlPlaceholder(value) {
  if (value.includes("example.com")) return true;
  if (value.includes("<your-host>")) return true;
  if (/<[^>]+>/.test(value)) return true;
  return false;
}
function isEnvPlaceholder(key, value) {
  if (ANGLE_BRACKET_RE.test(value)) return true;
  if (value === "" && AUTH_ENV_KEY_RE.test(key)) return true;
  return false;
}
function detectPlaceholders(template) {
  const found = [];
  if (template.args) {
    template.args.forEach((arg, i) => {
      if (isArgPlaceholder(arg)) {
        found.push({ path: `args[${i}]`, currentValue: arg, kind: "arg" });
      }
    });
  }
  if (template.env) {
    for (const [key, value] of Object.entries(template.env)) {
      if (isEnvPlaceholder(key, value)) {
        found.push({ path: `env.${key}`, currentValue: value, kind: "env" });
      }
    }
  }
  if (template.url && isUrlPlaceholder(template.url)) {
    found.push({ path: "url", currentValue: template.url, kind: "url" });
  }
  return found;
}
function isStillPlaceholder(kind, value) {
  if (!value) return true;
  if (kind === "arg") return isArgPlaceholder(value);
  if (kind === "url") return isUrlPlaceholder(value);
  if (kind === "env") return ANGLE_BRACKET_RE.test(value);
  return false;
}
const STATUS_COLORS = {
  connected: "border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200",
  failed: "border border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200",
  unknown: "border border-primary-200 bg-primary-100/60 text-primary-500"
};
function Badge({
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${className}`,
      children
    }
  );
}
function McpServerCard({ server, onEdit }) {
  const test = useTestMcpServer();
  const configure = useConfigureMcpServer();
  const remove = useDeleteMcpServer();
  const oauth = useMcpOauth();
  const { mode: capabilityMode } = useMcpCapabilityMode();
  const fallbackMode = capabilityMode === "fallback";
  const liveOnlyTitle = fallbackMode ? "Requires hermes-agent /api/mcp runtime endpoint (not available in local fallback mode)." : "";
  const qc = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [testResult, setTestResult] = useState(null);
  return /* @__PURE__ */ jsxs("article", { className: "flex flex-col gap-3 rounded-xl border border-primary-200 bg-primary-50/85 p-4", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "truncate text-sm font-medium text-ink", children: server.name }),
          /* @__PURE__ */ jsx(Badge, { className: STATUS_COLORS[server.status], children: server.status }),
          /* @__PURE__ */ jsx(Badge, { className: "border border-primary-200 bg-primary-100/60 text-primary-500", children: server.transportType })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "truncate font-mono text-xs text-primary-500", children: server.transportType === "http" ? server.url : server.command })
      ] }),
      /* @__PURE__ */ jsx(
        Switch,
        {
          checked: server.enabled,
          disabled: configure.isPending,
          onCheckedChange: (checked) => configure.mutate({ name: server.name, enabled: checked }),
          "aria-label": server.enabled ? "Disable server" : "Enable server"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("dl", { className: "grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-primary-500", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("dt", { children: "Tools:" }),
        /* @__PURE__ */ jsx("dd", { className: "font-medium text-ink tabular-nums", children: server.discoveredToolsCount })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("dt", { children: "Auth:" }),
        /* @__PURE__ */ jsx("dd", { className: "font-medium text-ink", children: server.authType })
      ] })
    ] }),
    server.lastError ? /* @__PURE__ */ jsx("p", { className: "rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200", children: server.lastError }) : null,
    /* @__PURE__ */ jsxs("div", { className: "mt-auto flex flex-wrap items-center gap-1.5 pt-1", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          disabled: test.isPending,
          onClick: async () => {
            const result = await test.mutateAsync({ name: server.name });
            setTestResult(result);
            qc.invalidateQueries({ queryKey: ["mcp", "servers"] });
          },
          children: test.isPending ? "Testing…" : "Test"
        }
      ),
      server.authType === "oauth" ? /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          disabled: oauth.isPending || fallbackMode,
          title: liveOnlyTitle,
          onClick: () => {
            void oauth.start(server);
          },
          children: oauth.isPending ? "Reauth…" : "Reauth"
        }
      ) : null,
      /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => onEdit(server), children: "Edit" }),
      confirmDelete ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "destructive",
            size: "sm",
            disabled: remove.isPending,
            onClick: () => remove.mutate({ name: server.name }),
            children: "Confirm Delete"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => setConfirmDelete(false),
            children: "Cancel"
          }
        )
      ] }) : /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/40",
          onClick: () => setConfirmDelete(true),
          children: "Delete"
        }
      )
    ] }),
    testResult ? /* @__PURE__ */ jsx("p", { className: "text-xs text-primary-500", children: testResult.ok ? `Connected (${testResult.latencyMs ?? "?"}ms, ${testResult.discoveredTools.length} tools)` : `Failed: ${testResult.error || "unknown error"}` }) : null,
    testResult && !testResult.ok && testResult.error ? (() => {
      const stdioErrorRe = /Connection closed|EACCES|ENOENT|exited unexpectedly/i;
      const httpErrorRe = /fetch failed|network error|ENOTFOUND/i;
      const hasStdioPlaceholder = server.transportType === "stdio" && server.args.some((a) => isArgPlaceholder(a));
      const hasHttpPlaceholder = server.transportType === "http" && Boolean(server.url && isUrlPlaceholder(server.url));
      const showHint = stdioErrorRe.test(testResult.error) && hasStdioPlaceholder || httpErrorRe.test(testResult.error) && hasHttpPlaceholder;
      if (!showHint) return null;
      return /* @__PURE__ */ jsx("p", { className: "rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200", children: "Edit server args/url — looks like a placeholder. Click Edit to fix." });
    })() : null,
    oauth.isError && oauth.error ? /* @__PURE__ */ jsxs("p", { className: "text-xs text-red-700 dark:text-red-300", children: [
      "Reauth failed: ",
      oauth.error.message
    ] }) : null,
    oauth.data?.status === "connected" ? /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-700 dark:text-emerald-300", children: "Reauth succeeded." }) : null
  ] });
}
const EMPTY = {
  name: "",
  transportType: "http",
  url: "",
  args: [],
  env: {},
  headers: {},
  authType: "none",
  toolMode: "all"
};
const FIELD$2 = "h-9 w-full rounded-lg border border-primary-200 bg-primary-100/60 px-3 text-sm text-ink outline-none transition-colors focus:border-primary";
const LABEL$1 = "flex flex-col gap-1.5 text-sm text-primary-500";
function fromServer(server) {
  return {
    name: server.name,
    transportType: server.transportType,
    url: server.url,
    command: server.command,
    args: server.args,
    env: {},
    headers: {},
    authType: server.authType,
    toolMode: server.toolMode,
    includeTools: server.includeTools,
    excludeTools: server.excludeTools
  };
}
function isMcpServer(value) {
  return Boolean(value && typeof value === "object" && "discoveredToolsCount" in value);
}
function McpServerDialog({ open, initial, onClose }) {
  const upsert = useUpsertMcpServer();
  const discover = useDiscoverMcpTools();
  const { mode: capabilityMode } = useMcpCapabilityMode();
  const [draft, setDraft] = useState(EMPTY);
  const [bearerToken, setBearerToken] = useState("");
  const [initialHasBearer, setInitialHasBearer] = useState(false);
  const [authEnvRef, setAuthEnvRef] = useState(null);
  useEffect(() => {
    if (!open) return;
    setBearerToken("");
    if (!initial) {
      setDraft(EMPTY);
      setInitialHasBearer(false);
      setAuthEnvRef(null);
    } else if (isMcpServer(initial)) {
      setDraft(fromServer(initial));
      setInitialHasBearer(Boolean(initial.hasBearerToken));
      setAuthEnvRef(initial.authEnvRef ?? null);
    } else {
      setDraft(initial);
      setInitialHasBearer(false);
      setAuthEnvRef(null);
    }
  }, [open, initial]);
  const update = (patch) => setDraft((prev) => ({ ...prev, ...patch }));
  const fallbackMode = capabilityMode === "fallback";
  const discoverDisabledReason = fallbackMode ? "Discover requires hermes-agent /api/mcp runtime endpoint (not available in local fallback mode)." : "";
  return /* @__PURE__ */ jsx(
    DialogRoot,
    {
      open,
      onOpenChange: (next) => {
        if (!next) onClose();
      },
      children: /* @__PURE__ */ jsx(DialogContent, { className: "w-[min(720px,95vw)] border-primary-200 bg-primary-50/95 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex max-h-[85vh] flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-primary-200 px-5 py-4", children: [
          /* @__PURE__ */ jsxs(DialogTitle, { className: "text-balance", children: [
            "🔌 ",
            draft.name || (initial ? "Edit MCP Server" : "Add MCP Server")
          ] }),
          /* @__PURE__ */ jsxs(DialogDescription, { className: "mt-1 text-pretty", children: [
            initial ? "Edit MCP Server" : "Add MCP Server",
            " •",
            " ",
            draft.transportType.toUpperCase(),
            " transport •",
            " ",
            draft.authType || "none",
            " auth"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "rounded-md border border-primary-200 bg-primary-100/50 px-2 py-0.5 text-xs text-primary-500", children: draft.transportType }),
            /* @__PURE__ */ jsxs("span", { className: "rounded-md border border-primary-200 bg-primary-100/50 px-2 py-0.5 text-xs text-primary-500", children: [
              "auth: ",
              draft.authType || "none"
            ] }),
            fallbackMode ? /* @__PURE__ */ jsx("span", { className: "rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200", children: "config-only mode" }) : null
          ] })
        ] }),
        /* @__PURE__ */ jsxs(ScrollAreaRoot, { className: "h-[56vh]", children: [
          /* @__PURE__ */ jsx(ScrollAreaViewport, { className: "px-5 py-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("label", { className: LABEL$1, children: [
              /* @__PURE__ */ jsx("span", { children: "Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: FIELD$2,
                  value: draft.name,
                  onChange: (e) => update({ name: e.target.value }),
                  placeholder: "my-mcp-server"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: LABEL$1, children: [
              /* @__PURE__ */ jsx("span", { children: "Transport" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: FIELD$2,
                  value: draft.transportType,
                  onChange: (e) => update({
                    transportType: e.target.value
                  }),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "http", children: "HTTP" }),
                    /* @__PURE__ */ jsx("option", { value: "stdio", children: "stdio" })
                  ]
                }
              )
            ] }),
            draft.transportType === "http" ? /* @__PURE__ */ jsxs("label", { className: LABEL$1, children: [
              /* @__PURE__ */ jsx("span", { children: "URL" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: FIELD$2,
                  value: draft.url || "",
                  onChange: (e) => update({ url: e.target.value }),
                  placeholder: "https://example.com/mcp"
                }
              )
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("label", { className: LABEL$1, children: [
                /* @__PURE__ */ jsx("span", { children: "Command" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: FIELD$2,
                    value: draft.command || "",
                    onChange: (e) => update({ command: e.target.value }),
                    placeholder: "/usr/local/bin/my-mcp"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("label", { className: LABEL$1, children: [
                /* @__PURE__ */ jsx("span", { children: "Args (one per line)" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: `${FIELD$2} h-auto py-2 font-mono text-xs`,
                    rows: 3,
                    value: (draft.args || []).join("\n"),
                    onChange: (e) => update({
                      args: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                    })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: LABEL$1, children: [
              /* @__PURE__ */ jsx("span", { children: "Auth" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: FIELD$2,
                  value: draft.authType || "none",
                  onChange: (e) => update({
                    authType: e.target.value
                  }),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "none", children: "none" }),
                    /* @__PURE__ */ jsx("option", { value: "bearer", children: "bearer" }),
                    /* @__PURE__ */ jsx("option", { value: "oauth", children: "oauth" })
                  ]
                }
              )
            ] }),
            draft.authType === "bearer" ? /* @__PURE__ */ jsxs("label", { className: LABEL$1, children: [
              /* @__PURE__ */ jsx("span", { children: "Bearer token" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  className: FIELD$2,
                  value: bearerToken,
                  onChange: (e) => setBearerToken(e.target.value),
                  autoComplete: "off",
                  placeholder: initialHasBearer ? "••••••• (currently set — leave blank to keep, type to replace)" : "Enter bearer token"
                }
              ),
              authEnvRef ? /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-amber-700 dark:text-amber-300", children: [
                "Token resolved from env var ",
                /* @__PURE__ */ jsx("code", { className: "font-mono", children: authEnvRef }),
                " — leave blank to keep current, or type to override."
              ] }) : initialHasBearer ? /* @__PURE__ */ jsx("span", { className: "text-[11px] text-emerald-700 dark:text-emerald-300", children: "Token currently set on server. Leave blank to keep existing; type a new value to replace." }) : null
            ] }) : null,
            fallbackMode ? /* @__PURE__ */ jsx("p", { className: "rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200", children: "⚠ Local fallback mode — config-only CRUD. Live tool Discover and connectivity Test require the hermes-agent /api/mcp runtime endpoint." }) : null,
            discover.data ? /* @__PURE__ */ jsxs("p", { className: "text-xs text-primary-500", children: [
              "Discovered ",
              discover.data.tools.length,
              " tools."
            ] }) : null,
            discover.error ? /* @__PURE__ */ jsx("p", { className: "text-xs text-red-700 dark:text-red-300", children: discover.error.message }) : null,
            upsert.error ? /* @__PURE__ */ jsx("p", { className: "text-xs text-red-700 dark:text-red-300", children: upsert.error.message }) : null
          ] }) }),
          /* @__PURE__ */ jsx(ScrollAreaScrollbar, { orientation: "vertical", children: /* @__PURE__ */ jsx(ScrollAreaThumb, {}) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-t border-primary-200 px-5 py-3", children: [
          /* @__PURE__ */ jsxs("p", { className: "min-w-0 flex-1 truncate text-sm text-primary-500 text-pretty", children: [
            "Target:",
            " ",
            /* @__PURE__ */ jsx("code", { className: "inline-code", children: draft.transportType === "http" ? draft.url || "—" : draft.command || "—" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: onClose,
                disabled: upsert.isPending,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: discover.isPending || !draft.name || fallbackMode,
                title: discoverDisabledReason,
                onClick: () => discover.mutate(draft),
                children: discover.isPending ? "Discovering…" : "Discover"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                disabled: upsert.isPending || !draft.name,
                onClick: async () => {
                  const payload = bearerToken ? { ...draft, bearerToken } : draft;
                  try {
                    await upsert.mutateAsync(payload);
                    onClose();
                  } finally {
                    setBearerToken("");
                  }
                },
                children: upsert.isPending ? "Saving…" : "Save"
              }
            )
          ] })
        ] })
      ] }) })
    }
  );
}
const TRUST_PILL$2 = {
  official: {
    label: "Official",
    className: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300"
  },
  community: {
    label: "Community",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
  },
  unverified: {
    label: "Unverified",
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
  }
};
const FIELD$1 = "h-9 w-full rounded-lg border border-primary-200 bg-primary-100/60 px-3 text-sm text-ink outline-none transition-colors focus:border-primary";
function applyOverrides(template, placeholders, overrides) {
  const out = {
    ...template,
    args: template.args ? [...template.args] : [],
    env: template.env ? { ...template.env } : {}
  };
  for (const ph of placeholders) {
    const val = overrides[ph.path];
    if (val === void 0) continue;
    if (ph.kind === "url") {
      out.url = val;
    } else if (ph.kind === "arg") {
      const m = ph.path.match(/^args\[(\d+)\]$/);
      if (m) {
        const idx = parseInt(m[1], 10);
        if (out.args) out.args[idx] = val;
      }
    } else if (ph.kind === "env") {
      const key = ph.path.slice(4);
      if (out.env) out.env[key] = val;
    }
  }
  return out;
}
function InstallConfirmationDialog({ entry, onClose, onInstalled }) {
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState(null);
  const [placeholders, setPlaceholders] = useState(null);
  const [overrides, setOverrides] = useState({});
  const abortControllerRef = useRef(null);
  const open = Boolean(entry);
  function hasUnfilledPlaceholders(phs, ovr) {
    return phs.some((ph) => {
      const val = ovr[ph.path] ?? "";
      return isStillPlaceholder(ph.kind, val);
    });
  }
  async function handleInstall() {
    if (!entry) return;
    const template2 = entry.template;
    if (placeholders === null) {
      const detected = detectPlaceholders(template2);
      if (detected.length > 0) {
        setPlaceholders(detected);
        return;
      }
    } else {
      if (hasUnfilledPlaceholders(placeholders, overrides)) {
        return;
      }
    }
    const resolvedTemplate = placeholders && placeholders.length > 0 ? applyOverrides(template2, placeholders, overrides) : template2;
    const ac = new AbortController();
    abortControllerRef.current = ac;
    setInstalling(true);
    setError(null);
    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resolvedTemplate),
        signal: ac.signal
      });
      const body = await res.json();
      if (!res.ok || body.ok === false) {
        throw new Error(body.error || `Install failed (${res.status})`);
      }
      toast(`Installed ${entry.name}`, { type: "success", icon: "✓" });
      onInstalled?.();
      onClose();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Install failed");
    } finally {
      setInstalling(false);
      abortControllerRef.current = null;
    }
  }
  function handleOpenChange(nextOpen) {
    if (!nextOpen) {
      if (installing) {
        abortControllerRef.current?.abort();
        return;
      }
      setError(null);
      setPlaceholders(null);
      setOverrides({});
      onClose();
    }
  }
  const trustConfig = entry ? TRUST_PILL$2[entry.trust] ?? TRUST_PILL$2.unverified : null;
  const template = entry?.template;
  const envKeys = template?.env ? Object.keys(template.env) : [];
  const installDisabled = installing || placeholders !== null && hasUnfilledPlaceholders(placeholders, overrides);
  return /* @__PURE__ */ jsx(DialogRoot, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsx(DialogContent, { className: "w-[min(640px,95vw)] border-primary-200 bg-primary-50/95 backdrop-blur-sm", children: entry && trustConfig && template ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 p-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-balance text-lg font-medium text-ink", children: entry.name }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `rounded-md border px-2 py-0.5 text-[11px] font-medium ${trustConfig.className}`,
            children: trustConfig.label
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "rounded-md border border-primary-200 bg-primary-100/60 px-2 py-0.5 text-[11px] font-medium text-primary-500", children: template.transportType })
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "text-sm text-primary-500 text-pretty", children: entry.description || "No description provided." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-200 bg-primary-100/40 p-4 space-y-3 text-sm", children: [
      template.command ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-medium uppercase text-primary-400 tracking-wide", children: "Command" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-ink break-all", children: template.command })
      ] }) : null,
      template.args && template.args.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-medium uppercase text-primary-400 tracking-wide", children: "Args" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-0.5", children: template.args.map((arg, i) => /* @__PURE__ */ jsx("li", { className: "font-mono text-ink break-all", children: arg }, i)) })
      ] }) : null,
      template.url ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-medium uppercase text-primary-400 tracking-wide", children: "URL" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-ink break-all", children: template.url })
      ] }) : null,
      envKeys.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 text-xs font-medium uppercase text-primary-400 tracking-wide", children: "Environment Variables" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-0.5", children: envKeys.map((key) => /* @__PURE__ */ jsxs("li", { className: "font-mono text-ink", children: [
          /* @__PURE__ */ jsx("span", { className: "text-primary-600", children: key }),
          /* @__PURE__ */ jsx("span", { className: "text-primary-400", children: " = " }),
          /* @__PURE__ */ jsx("span", { className: "text-primary-400", children: "***" })
        ] }, key)) })
      ] }) : null
    ] }),
    placeholders && placeholders.length > 0 ? /* @__PURE__ */ jsxs(
      "div",
      {
        className: "rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-3 dark:border-amber-700 dark:bg-amber-950/20",
        "data-testid": "placeholder-fill-form",
        children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-amber-700 dark:text-amber-300", children: "This template contains placeholder values. Fill in the fields below before installing." }),
          placeholders.map((ph) => /* @__PURE__ */ jsxs("label", { className: "flex flex-col gap-1 text-sm text-primary-500", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-primary-600", children: [
              ph.path,
              ph.currentValue ? /* @__PURE__ */ jsxs("span", { className: "ml-1 text-primary-400", children: [
                "(was: ",
                ph.currentValue,
                ")"
              ] }) : null
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: FIELD$1,
                value: overrides[ph.path] ?? "",
                onChange: (e) => setOverrides((prev) => ({ ...prev, [ph.path]: e.target.value })),
                placeholder: `Replace ${ph.currentValue || ph.path}`,
                "data-testid": `placeholder-input-${ph.path}`
              }
            )
          ] }, ph.path))
        ]
      }
    ) : null,
    /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-xs text-primary-500", children: [
      entry.homepage ? /* @__PURE__ */ jsxs("p", { children: [
        "Homepage:",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: entry.homepage,
            target: "_blank",
            rel: "noreferrer",
            className: "underline decoration-border underline-offset-4 hover:decoration-primary",
            children: entry.homepage
          }
        )
      ] }) : null,
      /* @__PURE__ */ jsxs("p", { children: [
        "Source:",
        " ",
        /* @__PURE__ */ jsx("span", { className: "font-medium text-ink", children: entry.source })
      ] })
    ] }),
    error ? /* @__PURE__ */ jsx("p", { className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300", children: error }) : null,
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 border-t border-primary-200 pt-3", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, disabled: installing, children: "Cancel" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "sm",
          disabled: installDisabled,
          onClick: handleInstall,
          "data-testid": "install-confirm-btn",
          children: installing ? "Installing…" : "Install"
        }
      )
    ] })
  ] }) : null }) });
}
function useMcpServers(params) {
  return useQuery({
    queryKey: ["mcp", "servers", params],
    queryFn: async () => {
      const url = new URL("/api/mcp", window.location.origin);
      if (params.search) url.searchParams.set("search", params.search);
      if (params.category && params.category !== "All") {
        url.searchParams.set("category", params.category);
      }
      const res = await fetch(url.toString().replace(window.location.origin, ""));
      if (!res.ok) throw new Error(`MCP list failed (${res.status})`);
      const body = await res.json();
      return {
        servers: body.servers ?? [],
        total: body.total ?? 0,
        categories: body.categories ?? ["All"]
      };
    },
    staleTime: 3e4,
    refetchOnWindowFocus: true
  });
}
const PAGE_SIZE = 50;
function useMcpHub(searchInput) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchInput);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 250);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);
  const infinite = useInfiniteQuery({
    queryKey: ["mcp", "hub-search", debouncedQuery],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.set("q", debouncedQuery);
      params.set("source", "all");
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(pageParam));
      const res = await fetch(`/api/mcp/hub-search?${params.toString()}`);
      if (!res.ok && res.status !== 200) {
        throw new Error(`MCP hub search failed (${res.status})`);
      }
      const body = await res.json();
      return {
        ok: body.ok ?? false,
        results: body.results ?? [],
        source: body.source ?? "unknown",
        total: body.total ?? 0,
        warnings: body.warnings,
        error: body.error
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.results.length, 0);
      return loaded < lastPage.total ? loaded : void 0;
    },
    staleTime: 5 * 60 * 1e3,
    refetchOnWindowFocus: false
  });
  const flattened = infinite.data ? {
    ok: infinite.data.pages[0]?.ok ?? false,
    source: infinite.data.pages[0]?.source ?? "unknown",
    total: infinite.data.pages[0]?.total ?? 0,
    warnings: infinite.data.pages[0]?.warnings,
    error: infinite.data.pages[0]?.error,
    results: infinite.data.pages.flatMap((p) => p.results)
  } : void 0;
  return {
    ...infinite,
    data: flattened,
    fetchNextPage: infinite.fetchNextPage,
    hasNextPage: infinite.hasNextPage,
    isFetchingNextPage: infinite.isFetchingNextPage
  };
}
const QUERY_KEY = ["mcp", "hub-sources"];
async function fetchSources() {
  const res = await fetch("/api/mcp/hub-sources");
  if (!res.ok && res.status !== 200) {
    throw new Error(`hub-sources fetch failed (${res.status})`);
  }
  const body = await res.json();
  return {
    ok: body.ok ?? false,
    sources: body.sources ?? [],
    source: body.source ?? "unknown",
    error: body.error,
    validationErrors: body.validationErrors
  };
}
function useMcpHubSources() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchSources,
    staleTime: 3e4,
    refetchOnWindowFocus: false
  });
}
function useAddHubSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await fetch("/api/mcp/hub-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      const body = await res.json();
      if (!body.ok) {
        throw { errors: body.errors ?? [{ path: "", message: "Unknown error" }] };
      }
      return { ok: true, sources: body.sources ?? [] };
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEY });
      void qc.invalidateQueries({ queryKey: ["mcp", "hub-search"] });
    }
  });
}
function useUpdateHubSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }) => {
      const res = await fetch(`/api/mcp/hub-sources/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      const body = await res.json();
      if (!body.ok) {
        throw { errors: body.errors ?? [{ path: "", message: "Unknown error" }] };
      }
      return { ok: true, sources: body.sources ?? [] };
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEY });
      void qc.invalidateQueries({ queryKey: ["mcp", "hub-search"] });
    }
  });
}
function useDeleteHubSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/mcp/hub-sources/${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      const body = await res.json();
      if (!body.ok) {
        throw { errors: body.errors ?? [{ path: "", message: "Unknown error" }] };
      }
      return { ok: true, sources: body.sources ?? [] };
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEY });
      void qc.invalidateQueries({ queryKey: ["mcp", "hub-search"] });
    }
  });
}
const TRUST_OPTIONS = ["official", "community", "unverified"];
const FORMAT_OPTIONS = ["smithery", "generic-json"];
const EMPTY_FORM = {
  id: "",
  name: "",
  url: "",
  trust: "community",
  format: "generic-json",
  enabled: true
};
const FIELD = "h-9 w-full rounded-lg border border-primary-200 bg-primary-100/60 px-3 text-sm text-ink outline-none transition-colors focus:border-primary";
const LABEL = "flex flex-col gap-1 text-sm text-primary-500";
const ERROR_TEXT = "mt-0.5 text-xs text-red-600 dark:text-red-400";
function fieldError(errors, path) {
  return errors.find((e) => e.path === path)?.message;
}
function SourceForm({ initial, isEdit, onSave, onCancel, saving, serverErrors }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const [localErrors, setLocalErrors] = useState({});
  function validate() {
    const errs = {};
    if (!form.id.match(/^[a-z][a-z0-9_-]{0,63}$/)) {
      errs.id = "id must match /^[a-z][a-z0-9_-]{0,63}$/";
    }
    if (form.name.trim().length < 1) errs.name = "name is required";
    if (!form.url) {
      errs.url = "url is required";
    } else {
      try {
        const u = new URL(form.url);
        if (u.protocol !== "https:") errs.url = "url must use https://";
      } catch {
        errs.url = "url is not valid";
      }
    }
    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  }
  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setLocalErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }
  const idErr = localErrors.id ?? fieldError(serverErrors, "id");
  const nameErr = localErrors.name ?? fieldError(serverErrors, "name");
  const urlErr = localErrors.url ?? fieldError(serverErrors, "url");
  const trustErr = fieldError(serverErrors, "trust");
  const formatErr = fieldError(serverErrors, "format");
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: LABEL, children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Source ID ",
        /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: FIELD,
          value: form.id,
          onChange: (e) => set("id", e.target.value),
          disabled: isEdit || saving,
          placeholder: "internal",
          autoFocus: true
        }
      ),
      idErr ? /* @__PURE__ */ jsx("p", { className: ERROR_TEXT, children: idErr }) : null,
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-primary-400", children: "Lowercase, alphanumeric + _ -. Cannot be changed after creation." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: LABEL, children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Name ",
        /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: FIELD,
          value: form.name,
          onChange: (e) => set("name", e.target.value),
          disabled: saving,
          placeholder: "Internal Catalog"
        }
      ),
      nameErr ? /* @__PURE__ */ jsx("p", { className: ERROR_TEXT, children: nameErr }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: LABEL, children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "URL ",
        /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: FIELD,
          value: form.url,
          onChange: (e) => set("url", e.target.value),
          disabled: saving,
          placeholder: "https://corp.local/mcp.json",
          type: "url"
        }
      ),
      urlErr ? /* @__PURE__ */ jsx("p", { className: ERROR_TEXT, children: urlErr }) : null,
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-primary-400", children: "HTTPS only. Must return JSON." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: LABEL, children: [
        /* @__PURE__ */ jsx("span", { children: "Trust" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            className: FIELD,
            value: form.trust,
            onChange: (e) => set("trust", e.target.value),
            disabled: saving,
            children: TRUST_OPTIONS.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
          }
        ),
        trustErr ? /* @__PURE__ */ jsx("p", { className: ERROR_TEXT, children: trustErr }) : null
      ] }),
      /* @__PURE__ */ jsxs("div", { className: LABEL, children: [
        /* @__PURE__ */ jsx("span", { children: "Format" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            className: FIELD,
            value: form.format,
            onChange: (e) => set("format", e.target.value),
            disabled: saving,
            children: FORMAT_OPTIONS.map((f) => /* @__PURE__ */ jsx("option", { value: f, children: f }, f))
          }
        ),
        formatErr ? /* @__PURE__ */ jsx("p", { className: ERROR_TEXT, children: formatErr }) : null
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "enabled-toggle",
          type: "checkbox",
          checked: form.enabled,
          onChange: (e) => set("enabled", e.target.checked),
          disabled: saving,
          className: "h-4 w-4 rounded border-primary-200 text-primary accent-primary"
        }
      ),
      /* @__PURE__ */ jsx("label", { htmlFor: "enabled-toggle", className: "text-sm text-ink cursor-pointer", children: "Enabled" })
    ] }),
    serverErrors.filter((e) => !e.path).map((e, i) => /* @__PURE__ */ jsx("p", { className: ERROR_TEXT, children: e.message }, i)),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 pt-1", children: [
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: onCancel, disabled: saving, children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { type: "submit", size: "sm", disabled: saving, children: saving ? "Saving…" : isEdit ? "Save Changes" : "Add Source" })
    ] })
  ] });
}
const TRUST_PILL$1 = {
  official: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300",
  community: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  unverified: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
};
function SourceRow({ source, onEdit, onDelete, deleting }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 rounded-lg border border-primary-200 bg-primary-100/40 px-3 py-2.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-0.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink truncate", children: source.name }),
        /* @__PURE__ */ jsx("span", { className: `rounded border px-1.5 py-0.5 text-[10px] font-medium ${TRUST_PILL$1[source.trust] ?? TRUST_PILL$1.unverified}`, children: source.trust }),
        source.builtin ? /* @__PURE__ */ jsx("span", { className: "rounded border border-primary-200 bg-primary-100/50 px-1.5 py-0.5 text-[10px] text-primary-500", children: "built-in" }) : null,
        !source.enabled ? /* @__PURE__ */ jsx("span", { className: "rounded border border-primary-200 bg-primary-100/50 px-1.5 py-0.5 text-[10px] text-primary-400", children: "disabled" }) : null
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-primary-400 truncate", children: source.url }),
      /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-primary-400", children: [
        source.format,
        " · ",
        source.id
      ] })
    ] }),
    !source.builtin ? /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => onEdit(source),
          disabled: deleting,
          className: "h-7 px-2 text-xs",
          children: "Edit"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => onDelete(source.id),
          disabled: deleting,
          className: "h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30",
          children: deleting ? "…" : "Remove"
        }
      )
    ] }) : null
  ] });
}
function SourcesManagerDialog({ open, onClose }) {
  const [mode, setMode] = useState("list");
  const [editingSource, setEditingSource] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const query = useMcpHubSources();
  const addMutation = useAddHubSource();
  const updateMutation = useUpdateHubSource();
  const deleteMutation = useDeleteHubSource();
  const sources = query.data?.sources ?? [];
  function handleClose() {
    setMode("list");
    setEditingSource(null);
    setServerErrors([]);
    onClose();
  }
  function handleEdit(source) {
    setEditingSource(source);
    setServerErrors([]);
    setMode("edit");
  }
  function handleDelete(id) {
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setDeletingId(null);
        toast("Source removed", { type: "success" });
      },
      onError: (err) => {
        setDeletingId(null);
        const errors = err.errors ?? [];
        setServerErrors(errors);
        toast("Failed to remove source", { type: "error" });
      }
    });
  }
  function handleAdd(data) {
    setServerErrors([]);
    addMutation.mutate(data, {
      onSuccess: () => {
        setMode("list");
        toast("Source added", { type: "success" });
      },
      onError: (err) => {
        const errors = err.errors ?? [];
        setServerErrors(errors);
      }
    });
  }
  function handleUpdate(data) {
    if (!editingSource) return;
    setServerErrors([]);
    updateMutation.mutate(
      { id: editingSource.id, input: data },
      {
        onSuccess: () => {
          setMode("list");
          setEditingSource(null);
          toast("Source updated", { type: "success" });
        },
        onError: (err) => {
          const errors = err.errors ?? [];
          setServerErrors(errors);
        }
      }
    );
  }
  const title = mode === "add" ? "Add Source" : mode === "edit" ? "Edit Source" : "Marketplace Sources";
  const saving = addMutation.isPending || updateMutation.isPending;
  return /* @__PURE__ */ jsx(DialogRoot, { open, onOpenChange: (o) => {
    if (!o) handleClose();
  }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[min(560px,95vw)] border-primary-200 bg-primary-50/95 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "border-b border-primary-200 px-5 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        mode !== "list" ? /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setMode("list");
              setEditingSource(null);
              setServerErrors([]);
            },
            className: "text-sm text-primary-500 hover:text-ink transition-colors",
            children: "← Back"
          }
        ) : null,
        /* @__PURE__ */ jsx(DialogTitle, { className: "text-base font-semibold text-ink flex-1", children: title })
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "mt-0.5 text-xs text-primary-400", children: mode === "list" ? "Built-in sources are read-only. User-defined sources can be added, edited, or removed." : mode === "add" ? "Add a new HTTPS catalog source that returns JSON." : `Editing "${editingSource?.name ?? ""}"` })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5 py-4", children: mode === "list" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
      query.isLoading ? /* @__PURE__ */ jsx("p", { className: "text-sm text-primary-400", children: "Loading sources…" }) : query.error ? /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: "Failed to load sources." }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        sources.map((source) => /* @__PURE__ */ jsx(
          SourceRow,
          {
            source,
            onEdit: handleEdit,
            onDelete: handleDelete,
            deleting: deletingId === source.id
          },
          source.id
        )),
        sources.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-primary-400", children: "No sources found." }) : null
      ] }),
      serverErrors.length > 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300", children: serverErrors.map((e, i) => /* @__PURE__ */ jsx("p", { children: e.message }, i)) }) : null,
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-1 border-t border-primary-200", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            onClick: () => {
              setServerErrors([]);
              setMode("add");
            },
            children: "Add Source"
          }
        ),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: handleClose, children: "Done" })
      ] })
    ] }) : mode === "add" ? /* @__PURE__ */ jsx(
      SourceForm,
      {
        onSave: handleAdd,
        onCancel: () => {
          setMode("list");
          setServerErrors([]);
        },
        saving,
        serverErrors
      }
    ) : /* @__PURE__ */ jsx(
      SourceForm,
      {
        initial: {
          id: editingSource?.id ?? "",
          name: editingSource?.name ?? "",
          url: editingSource?.url ?? "",
          trust: editingSource?.trust ?? "community",
          format: editingSource?.format ?? "generic-json",
          enabled: editingSource?.enabled ?? true
        },
        isEdit: true,
        onSave: handleUpdate,
        onCancel: () => {
          setMode("list");
          setEditingSource(null);
          setServerErrors([]);
        },
        saving,
        serverErrors
      }
    ) })
  ] }) });
}
const TOOLBAR_FIELD = "h-9 w-full min-w-0 rounded-lg border border-primary-200 bg-primary-100/60 px-3 text-sm text-ink outline-none transition-colors focus:border-primary sm:min-w-[220px]";
function McpScreen() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("installed");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(
    null
  );
  const [installEntry, setInstallEntry] = useState(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const { mode: capabilityMode } = useMcpCapabilityMode();
  const serverListTab = tab === "marketplace" ? "installed" : tab;
  const query = useMcpServers({ tab: serverListTab, category, search });
  const servers = query.data?.servers ?? [];
  const categories = query.data?.categories ?? ["All"];
  const hubQuery = useMcpHub(tab === "marketplace" ? search : "");
  function handleTabChange(next) {
    if (next === "installed" || next === "marketplace") {
      setTab(next);
      setSearch("");
    }
  }
  const totalLabel = tab === "marketplace" ? `${(hubQuery.data?.total ?? 0).toLocaleString()} results` : `${servers.length.toLocaleString()} servers`;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-full overflow-y-auto bg-surface text-ink", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-4 py-6 pb-[calc(var(--tabbar-h,80px)+1.5rem)] sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border border-primary-200 bg-primary-50/85 p-4 backdrop-blur-xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase text-primary-500 tabular-nums", children: "Hermes Workspace · MCP" }),
            /* @__PURE__ */ jsx("h1", { className: "text-2xl font-medium text-ink text-balance sm:text-3xl", children: "MCP Servers" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-primary-500 text-pretty sm:text-base", children: "Discover, install, and manage Model Context Protocol servers exposed to Hermes Agent." })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                setEditing(null);
                setDialogOpen(true);
              },
              children: "Add Server"
            }
          )
        ] }),
        capabilityMode === "fallback" ? /* @__PURE__ */ jsx(
          "div",
          {
            role: "status",
            className: "mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200",
            children: "⚠ Local fallback mode — using config.yaml. Test, Discover, and Logs require the new hermes-agent /api/mcp endpoints."
          }
        ) : null
      ] }),
      /* @__PURE__ */ jsx("section", { className: "rounded-2xl border border-primary-200 bg-primary-50/80 p-3 backdrop-blur-xl sm:p-4", children: /* @__PURE__ */ jsxs(Tabs, { value: tab, onValueChange: handleTabChange, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            TabsList,
            {
              className: "rounded-xl border border-primary-200 bg-primary-100/60 p-1",
              variant: "default",
              children: [
                /* @__PURE__ */ jsx(TabsTab, { value: "installed", className: "min-w-[110px]", children: "Installed" }),
                /* @__PURE__ */ jsx(TabsTab, { value: "marketplace", className: "min-w-[120px]", children: "Marketplace" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: tab === "marketplace" ? "Search MCP catalog…" : "Search servers by name",
              className: `${TOOLBAR_FIELD} flex-1`
            }
          ),
          tab === "installed" ? /* @__PURE__ */ jsx(
            "select",
            {
              value: category,
              onChange: (event) => setCategory(event.target.value),
              className: "h-9 rounded-lg border border-primary-200 bg-primary-100/60 px-3 text-sm text-ink outline-none",
              children: categories.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c))
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsx(TabsPanel, { value: "installed", className: "pt-3", children: /* @__PURE__ */ jsx(
          ServerList,
          {
            query,
            onEdit: (s) => {
              setEditing(s);
              setDialogOpen(true);
            }
          }
        ) }),
        /* @__PURE__ */ jsxs(TabsPanel, { value: "marketplace", className: "pt-3 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            hubQuery.data?.source ? /* @__PURE__ */ jsxs("div", { className: "text-xs text-primary-500", children: [
              "Source: ",
              hubQuery.data.source
            ] }) : /* @__PURE__ */ jsx("div", {}),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "h-7 px-2 text-xs",
                onClick: () => setSourcesOpen(true),
                children: "Sources"
              }
            )
          ] }),
          hubQuery.data?.warnings && hubQuery.data.warnings.length > 0 ? hubQuery.data.results && hubQuery.data.results.length > 0 ? /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-300", children: [
            "⚠ One or more sources unavailable; showing local results.",
            /* @__PURE__ */ jsxs("span", { className: "ml-1 text-[11px] text-primary-500", children: [
              "(",
              hubQuery.data.warnings[0],
              ")"
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200", children: hubQuery.data.warnings[0] }) : null,
          hubQuery.error ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200", children: hubQuery.error instanceof Error ? hubQuery.error.message : "Failed to load marketplace." }) : null,
          /* @__PURE__ */ jsx(
            MarketplaceGrid,
            {
              entries: (hubQuery.data?.results ?? []).filter(
                (e) => !e.installed
              ),
              loading: hubQuery.isPending,
              onInstall: setInstallEntry
            }
          ),
          hubQuery.hasNextPage ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center pt-4", children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: hubQuery.isFetchingNextPage,
              onClick: () => hubQuery.fetchNextPage(),
              children: hubQuery.isFetchingNextPage ? "Loading…" : `Load more (${(hubQuery.data?.results.length ?? 0).toLocaleString()} of ${(hubQuery.data?.total ?? 0).toLocaleString()})`
            }
          ) }) : null
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("footer", { className: "flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50/80 px-3 py-2.5 text-sm text-primary-500 tabular-nums", children: [
        /* @__PURE__ */ jsx("span", { children: totalLabel }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs", children: [
          "mode: ",
          capabilityMode === "fallback" ? "config fallback" : "native"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      McpServerDialog,
      {
        open: dialogOpen,
        initial: editing,
        onClose: () => setDialogOpen(false)
      }
    ),
    /* @__PURE__ */ jsx(
      InstallConfirmationDialog,
      {
        entry: installEntry,
        onClose: () => setInstallEntry(null),
        onInstalled: () => {
          queryClient.invalidateQueries({ queryKey: ["mcp", "servers"] });
          queryClient.invalidateQueries({ queryKey: ["mcp", "hub-search"] });
        }
      }
    ),
    /* @__PURE__ */ jsx(
      SourcesManagerDialog,
      {
        open: sourcesOpen,
        onClose: () => setSourcesOpen(false)
      }
    )
  ] });
}
function ServerList({ query, onEdit }) {
  const servers = query.data?.servers ?? [];
  if (query.isLoading) {
    return /* @__PURE__ */ jsx(
      EmptyCard,
      {
        title: "Loading servers…",
        description: "Fetching MCP servers from Hermes Agent."
      }
    );
  }
  if (query.isError) {
    return /* @__PURE__ */ jsx(
      EmptyCard,
      {
        title: "Failed to load servers",
        description: query.error.message,
        tone: "danger"
      }
    );
  }
  if (servers.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyCard,
      {
        title: "No MCP servers configured",
        description: "Add a server from the My Presets tab or click Add Server above."
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3", children: servers.map((server) => /* @__PURE__ */ jsx(McpServerCard, { server, onEdit }, server.id)) });
}
function EmptyCard({ title, description, tone = "neutral" }) {
  const toneClasses = tone === "danger" ? "border-red-200 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200" : "border-primary-200 bg-primary-50/80 text-primary-500";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `rounded-xl border border-dashed px-4 py-10 text-center ${toneClasses}`,
      children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-ink", children: title }),
        description ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-primary-500", children: description }) : null
      ]
    }
  );
}
const TRUST_PILL = {
  official: {
    label: "Official",
    className: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300"
  },
  community: {
    label: "Community",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
  },
  unverified: {
    label: "Unverified",
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
  }
};
const SOURCE_LABEL = {
  "mcp-get": "mcp.run",
  local: "Local"
};
function MarketplaceGrid({
  entries,
  loading,
  onInstall
}) {
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "animate-pulse rounded-2xl border border-primary-200 bg-primary-50/70 p-4 min-h-[160px]",
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-3 h-4 w-2/5 rounded-md bg-primary-100" }),
          /* @__PURE__ */ jsx("div", { className: "mb-2 h-3 w-3/4 rounded-md bg-primary-100" }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-1/2 rounded-md bg-primary-100" }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 h-8 w-1/3 rounded-md bg-primary-100" })
        ]
      },
      i
    )) });
  }
  if (entries.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyCard,
      {
        title: "No results",
        description: "Try a different search term. The registry may be unavailable — local presets are used as fallback."
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3", children: /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: entries.map((entry) => {
    const trust = TRUST_PILL[entry.trust] ?? TRUST_PILL.unverified;
    const sourceLabel = SOURCE_LABEL[entry.source] ?? entry.source;
    return /* @__PURE__ */ jsxs(
      motion.article,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.18 },
        className: "flex flex-col gap-2 rounded-xl border border-primary-200 bg-primary-50/85 p-4",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-medium text-ink text-balance line-clamp-1", children: entry.name }),
              entry.installed ? /* @__PURE__ */ jsx(
                "span",
                {
                  className: "shrink-0 rounded-md border border-primary/40 bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary",
                  "aria-label": "Installed",
                  children: "Installed"
                }
              ) : null
            ] }),
            /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-xs text-primary-500 text-pretty", children: entry.description || "No description." })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `rounded-md border px-2 py-0.5 text-[11px] font-medium ${trust.className}`,
                children: trust.label
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "rounded-md border border-primary-200 bg-primary-100/60 px-2 py-0.5 text-[11px] font-medium text-primary-500", children: sourceLabel }),
            entry.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsx(
              "span",
              {
                className: "rounded-md border border-primary-200 bg-primary-100/50 px-2 py-0.5 text-[11px] text-primary-500",
                children: tag
              },
              tag
            ))
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto flex items-center justify-end gap-2 pt-2", children: entry.installed ? /* @__PURE__ */ jsx("span", { className: "text-xs text-primary-500", children: "Already installed" }) : /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => onInstall(entry),
              children: "Install"
            }
          ) })
        ]
      },
      entry.id
    );
  }) }) });
}
function McpRoute() {
  usePageTitle("MCP Servers");
  const native = useFeatureAvailable("mcp");
  const fallback = useFeatureAvailable("mcpFallback");
  if (!native && !fallback) {
    return /* @__PURE__ */ jsx(BackendUnavailableState, { feature: "MCP Servers", description: getUnavailableReason("mcp") });
  }
  return /* @__PURE__ */ jsx(McpScreen, {});
}
export {
  McpRoute as component
};
