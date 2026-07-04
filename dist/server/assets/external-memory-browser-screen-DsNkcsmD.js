import { jsx, jsxs } from "react/jsx-runtime";
import { HugeiconsIcon } from "@hugeicons/react";
import { BrainIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useDeferredValue, useEffect, useMemo } from "react";
import { c as cn } from "./router-DmH5gXcK.js";
import "@tanstack/react-router";
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
const MEMORY_STATES = [
  "candidate",
  "approved",
  "rejected",
  "all"
];
async function mutateCandidate(options) {
  const response = options.action === "delete" ? await fetch(
    `/api/external-memory/candidates?provider=${encodeURIComponent(options.provider)}&id=${encodeURIComponent(options.id)}`,
    { method: "DELETE" }
  ) : await fetch("/api/external-memory/candidates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options)
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || `Action failed (${response.status})`);
  }
}
async function readJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed (${response.status})`);
  }
  return await response.json();
}
function formatTimestamp(value) {
  if (!value) return "Unknown";
  const millis = value < 1e10 ? value * 1e3 : value;
  return new Intl.DateTimeFormat(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(millis));
}
function stateClasses(state) {
  if (state === "approved")
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (state === "rejected")
    return "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300";
  return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
}
function metadataPreview(metadata) {
  const entries = Object.entries(metadata).slice(0, 4);
  if (entries.length === 0) return "No metadata";
  return entries.map(([key, value]) => `${key}: ${String(value)}`).join(" · ");
}
function formatStateFilterLabel(state, counts) {
  const count = counts[state];
  return typeof count === "number" ? `${state} (${count})` : state;
}
function candidateActionLabels(candidate) {
  const labels = ["Edit"];
  if (candidate.state !== "approved") labels.push("Approve");
  if (candidate.state !== "rejected") labels.push("Reject");
  labels.push("Delete");
  return labels;
}
async function readStateCounts(providerId) {
  const entries = await Promise.all(
    MEMORY_STATES.map(async (state) => {
      const response = await readJson(
        `/api/external-memory/candidates?provider=${encodeURIComponent(providerId)}&state=${encodeURIComponent(state)}&limit=1`
      );
      return [state, response.total];
    })
  );
  return Object.fromEntries(entries);
}
function ExternalMemoryBrowserScreen() {
  const queryClient = useQueryClient();
  const [providerId, setProviderId] = useState("");
  const [state, setState] = useState("candidate");
  const [searchInput, setSearchInput] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const deferredSearch = useDeferredValue(searchInput);
  const searchTerm = deferredSearch.trim();
  const providersQuery = useQuery({
    queryKey: ["external-memory", "providers"],
    queryFn: () => readJson("/api/external-memory/providers")
  });
  const providers = providersQuery.data?.providers ?? [];
  useEffect(() => {
    if (providerId || providers.length === 0) return;
    setProviderId(providersQuery.data?.active || providers[0]?.id || "");
  }, [providerId, providers, providersQuery.data?.active]);
  const listQuery = useQuery({
    queryKey: ["external-memory", "candidates", providerId, state],
    queryFn: () => readJson(
      `/api/external-memory/candidates?provider=${encodeURIComponent(providerId)}&state=${encodeURIComponent(state)}`
    ),
    enabled: Boolean(providerId) && !searchTerm
  });
  const countsQuery = useQuery({
    queryKey: ["external-memory", "candidate-counts", providerId],
    queryFn: () => readStateCounts(providerId),
    enabled: Boolean(providerId) && !searchTerm
  });
  const searchQuery = useQuery({
    queryKey: ["external-memory", "search", providerId, searchTerm],
    queryFn: () => readJson(
      `/api/external-memory/search?provider=${encodeURIComponent(providerId)}&q=${encodeURIComponent(searchTerm)}`
    ),
    enabled: Boolean(providerId) && Boolean(searchTerm)
  });
  const candidates = searchTerm ? searchQuery.data?.results ?? [] : listQuery.data?.candidates ?? [];
  const stateCounts = listQuery.data?.counts ?? countsQuery.data ?? {};
  useEffect(() => {
    if (selectedId && candidates.some((candidate) => candidate.id === selectedId))
      return;
    setSelectedId(candidates[0]?.id ?? null);
  }, [candidates, selectedId]);
  const selected = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedId) ?? null,
    [candidates, selectedId]
  );
  const activeProvider = providers.find((provider) => provider.id === providerId) ?? null;
  const isLoading = providersQuery.isLoading || listQuery.isLoading || searchQuery.isLoading;
  const error = providersQuery.error || listQuery.error || searchQuery.error;
  async function refreshCandidates() {
    await queryClient.invalidateQueries({ queryKey: ["external-memory"] });
  }
  async function runAction(action) {
    if (!selected) return;
    let text;
    let reason;
    if (action === "edit") {
      text = window.prompt("Edit memory candidate", selected.text) || "";
      if (!text.trim() || text === selected.text) return;
    }
    if (action === "reject") {
      reason = window.prompt("Reason for rejection", "") || "";
    }
    if (action === "delete" && !window.confirm("Delete this external memory row?")) {
      return;
    }
    await mutateCandidate({
      action,
      provider: selected.provider,
      id: selected.id,
      text,
      reason
    });
    if (action === "delete") setSelectedId(null);
    await refreshCandidates();
  }
  if (!providersQuery.isLoading && providers.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl rounded-2xl border border-primary-200 bg-primary-50 p-6 text-center dark:border-neutral-800 dark:bg-neutral-950", children: [
      /* @__PURE__ */ jsx(
        HugeiconsIcon,
        {
          icon: BrainIcon,
          className: "mx-auto mb-3 size-8 text-primary-500"
        }
      ),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-primary-900 dark:text-neutral-100", children: "No external memory providers" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-primary-600 dark:text-neutral-400", children: "Register providers in $HERMES_HOME/external_memory_providers.json to inspect external memory review queues here." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "grid h-full min-h-0 grid-cols-1 gap-0 lg:grid-cols-[380px_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxs("aside", { className: "flex min-h-0 flex-col border-b border-primary-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:border-r lg:border-b-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 border-b border-primary-200 p-4 dark:border-neutral-800", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-primary-900 dark:text-neutral-100", children: "External memory" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-primary-500 dark:text-neutral-400", children: "Review queues backed by custom providers." })
        ] }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: providerId,
            onChange: (event) => setProviderId(event.target.value),
            className: "w-full rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm text-primary-900 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
            children: providers.map((provider) => /* @__PURE__ */ jsx("option", { value: provider.id, children: provider.label }, provider.id))
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            HugeiconsIcon,
            {
              icon: Search01Icon,
              className: "pointer-events-none absolute top-2.5 left-3 size-4 text-primary-400"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: searchInput,
              onChange: (event) => setSearchInput(event.target.value),
              placeholder: "Search text, metadata, source...",
              className: "w-full rounded-xl border border-primary-200 bg-white py-2 pr-3 pl-9 text-sm text-primary-900 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-1 text-xs", children: MEMORY_STATES.map((item) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setState(item),
            disabled: Boolean(searchTerm),
            className: cn(
              "rounded-lg border px-2 py-1.5 capitalize transition disabled:opacity-40",
              state === item ? "border-primary-500 bg-primary-100 text-primary-900 dark:border-blue-500 dark:bg-blue-500/15 dark:text-blue-100" : "border-primary-200 text-primary-600 hover:bg-primary-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
            ),
            children: formatStateFilterLabel(item, stateCounts)
          },
          item
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto p-3", children: [
        isLoading ? /* @__PURE__ */ jsx("p", { className: "p-3 text-sm text-primary-500 dark:text-neutral-400", children: "Loading..." }) : null,
        error ? /* @__PURE__ */ jsx("p", { className: "p-3 text-sm text-rose-600", children: error instanceof Error ? error.message : String(error) }) : null,
        !isLoading && candidates.length === 0 ? /* @__PURE__ */ jsx("p", { className: "p-3 text-sm text-primary-500 dark:text-neutral-400", children: "No memory rows found." }) : null,
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: candidates.map((candidate) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setSelectedId(candidate.id),
            className: cn(
              "w-full rounded-xl border p-3 text-left transition",
              selectedId === candidate.id ? "border-primary-500 bg-primary-50 dark:border-blue-500 dark:bg-blue-500/10" : "border-primary-200 bg-white hover:bg-primary-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
            ),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "truncate font-mono text-xs text-primary-500 dark:text-neutral-400", children: candidate.id }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: cn(
                      "rounded-full border px-2 py-0.5 text-[11px] capitalize",
                      stateClasses(candidate.state)
                    ),
                    children: candidate.state
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "line-clamp-3 text-sm text-primary-900 dark:text-neutral-100", children: candidate.text }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-primary-500 dark:text-neutral-500", children: formatTimestamp(candidate.updatedAt) })
            ]
          },
          candidate.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "min-h-0 overflow-y-auto bg-primary-50 p-4 dark:bg-neutral-950/80", children: selected ? /* @__PURE__ */ jsxs("article", { className: "mx-auto max-w-4xl space-y-4 rounded-2xl border border-primary-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3 border-b border-primary-100 pb-4 dark:border-neutral-800", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-primary-500 dark:text-neutral-400", children: selected.id }),
          /* @__PURE__ */ jsx("h1", { className: "mt-1 text-xl font-semibold text-primary-950 dark:text-neutral-50", children: activeProvider?.label || selected.provider })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                "rounded-full border px-3 py-1 text-xs capitalize",
                stateClasses(selected.state)
              ),
              children: selected.state
            }
          ),
          candidateActionLabels(selected).map((label) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => runAction(label.toLowerCase()),
              className: cn(
                "rounded-lg border px-3 py-1 text-xs transition",
                label === "Delete" ? "border-rose-500/40 text-rose-600 hover:bg-rose-500/10 dark:text-rose-300" : "border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
              ),
              children: label
            },
            label
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm leading-7 whitespace-pre-wrap text-primary-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100", children: selected.text }),
      /* @__PURE__ */ jsxs("dl", { className: "grid gap-3 text-sm md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dt", { className: "text-xs uppercase tracking-wide text-primary-400 dark:text-neutral-500", children: "Source" }),
          /* @__PURE__ */ jsx("dd", { className: "mt-1 text-primary-900 dark:text-neutral-100", children: selected.source })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dt", { className: "text-xs uppercase tracking-wide text-primary-400 dark:text-neutral-500", children: "Updated" }),
          /* @__PURE__ */ jsx("dd", { className: "mt-1 text-primary-900 dark:text-neutral-100", children: formatTimestamp(selected.updatedAt) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-xs uppercase tracking-wide text-primary-400 dark:text-neutral-500", children: "Metadata" }),
          /* @__PURE__ */ jsx("dd", { className: "mt-1 text-primary-900 dark:text-neutral-100", children: metadataPreview(selected.metadata) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsx("dt", { className: "text-xs uppercase tracking-wide text-primary-400 dark:text-neutral-500", children: "SHA-256" }),
          /* @__PURE__ */ jsx("dd", { className: "mt-1 break-all font-mono text-xs text-primary-700 dark:text-neutral-300", children: selected.contentSha256 })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-sm text-primary-500 dark:text-neutral-400", children: "Select a memory row." }) })
  ] });
}
export {
  ExternalMemoryBrowserScreen,
  candidateActionLabels,
  formatStateFilterLabel
};
