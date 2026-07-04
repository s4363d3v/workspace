import { jsx, jsxs } from "react/jsx-runtime";
import { HugeiconsIcon } from "@hugeicons/react";
import { BrainIcon, Search01Icon, Link01Icon, Settings01Icon, Folder01Icon, CodeIcon, ArrowUp01Icon, ArrowDown01Icon, Message01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useDeferredValue, useMemo } from "react";
import { D as DialogRoot, a4 as DialogTrigger, b as DialogContent, d as DialogTitle, e as DialogDescription, c as cn, j as Markdown } from "./router-DmH5gXcK.js";
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
async function readJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed (${response.status})`);
  }
  return await response.json();
}
function formatBytes(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
function formatDate(value) {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Intl.DateTimeFormat(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(parsed);
}
function highlightMatch(text, query) {
  const needle = query.trim();
  if (!needle) return [{ text, hit: false }];
  const lower = text.toLowerCase();
  const matchLower = needle.toLowerCase();
  const parts = [];
  let cursor = 0;
  while (cursor < text.length) {
    const index = lower.indexOf(matchLower, cursor);
    if (index < 0) {
      parts.push({ text: text.slice(cursor), hit: false });
      break;
    }
    if (index > cursor) {
      parts.push({ text: text.slice(cursor, index), hit: false });
    }
    parts.push({ text: text.slice(index, index + needle.length), hit: true });
    cursor = index + needle.length;
  }
  return parts.length > 0 ? parts : [{ text, hit: false }];
}
function normalizeWikiToken(value) {
  return value.trim().toLowerCase().replace(/\\/g, "/").replace(/\.md$/i, "");
}
function preprocessWikiMarkdown(content) {
  return content.replace(/\[\[([^\]]+)\]\]/g, (_match, rawLink) => {
    const parts = String(rawLink).split("|");
    const target = parts[0]?.trim() ?? "";
    const label = parts[1]?.trim() || target;
    return `[${label}](wiki:${encodeURIComponent(target)})`;
  });
}
function buildKnowledgeTree(pages) {
  const root = { name: "root", path: "", folders: [], pages: [] };
  for (const page of pages) {
    const parts = page.path.split("/").filter(Boolean);
    const folderParts = parts.slice(0, -1);
    let cursor = root;
    for (const folder of folderParts) {
      let child = cursor.folders.find((entry) => entry.name === folder);
      if (!child) {
        child = {
          name: folder,
          path: cursor.path ? `${cursor.path}/${folder}` : folder,
          folders: [],
          pages: []
        };
        cursor.folders.push(child);
      }
      cursor = child;
    }
    cursor.pages.push(page);
  }
  function sortNode(node) {
    node.folders.sort((a, b) => a.name.localeCompare(b.name));
    node.pages.sort((a, b) => a.title.localeCompare(b.title));
    node.folders.forEach(sortNode);
  }
  sortNode(root);
  return root;
}
function GraphCanvas({
  nodes,
  edges,
  onSelect
}) {
  const layout = useMemo(() => {
    if (nodes.length === 0) return [];
    const width = 900;
    const height = 520;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(140, Math.min(width, height) / 2 - 72);
    return nodes.map((node, index) => {
      const angle = Math.PI * 2 * index / Math.max(nodes.length, 1);
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });
  }, [nodes]);
  const byId = useMemo(
    () => new Map(layout.map((node) => [node.id, node])),
    [layout]
  );
  return /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-primary-200 bg-primary-50 dark:border-neutral-800 dark:bg-neutral-950", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 900 520", className: "h-[520px] w-full", children: [
    edges.map((edge, index) => {
      const source = byId.get(edge.source);
      const target = byId.get(edge.target);
      if (!source || !target) return null;
      return /* @__PURE__ */ jsx(
        "line",
        {
          x1: source.x,
          y1: source.y,
          x2: target.x,
          y2: target.y,
          stroke: "rgba(148, 163, 184, 0.45)",
          strokeWidth: "1.25"
        },
        `${edge.source}:${edge.target}:${index}`
      );
    }),
    layout.map((node) => /* @__PURE__ */ jsxs(
      "g",
      {
        onClick: () => onSelect(node.id),
        className: "cursor-pointer",
        children: [
          /* @__PURE__ */ jsx(
            "circle",
            {
              cx: node.x,
              cy: node.y,
              r: "16",
              fill: "rgba(59, 130, 246, 0.16)",
              stroke: "rgba(59, 130, 246, 0.65)",
              strokeWidth: "1.5"
            }
          ),
          /* @__PURE__ */ jsx(
            "text",
            {
              x: node.x,
              y: node.y + 34,
              textAnchor: "middle",
              fontSize: "11",
              fill: "currentColor",
              children: node.title
            }
          )
        ]
      },
      node.id
    ))
  ] }) });
}
function KnowledgeBrowserScreen() {
  const [selectedPath, setSelectedPath] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [focusLine, setFocusLine] = useState(null);
  const [focusedResult, setFocusedResult] = useState(null);
  const [mobileTreeOpen, setMobileTreeOpen] = useState(true);
  const [graphOpen, setGraphOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSource, setSettingsSource] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!settingsOpen) return;
    fetch("/api/knowledge/config").then((r) => r.json()).then((data) => {
      if (data.config?.source) {
        setSettingsSource(data.config.source);
      }
    }).catch(() => {
    });
  }, [settingsOpen]);
  const deferredSearch = useDeferredValue(searchInput);
  const searchTerm = deferredSearch.trim();
  const listQuery = useQuery({
    queryKey: ["knowledge", "list"],
    queryFn: () => readJson("/api/knowledge/list")
  });
  const pages = listQuery.data?.pages ?? [];
  const knowledgeRoot = listQuery.data?.knowledgeRoot ?? "~/.hermes/knowledge/";
  const knowledgeExists = listQuery.data?.exists ?? false;
  const pageLookup = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const page2 of pages) {
      map.set(normalizeWikiToken(page2.path), page2.path);
      map.set(normalizeWikiToken(page2.name), page2.path);
      map.set(normalizeWikiToken(page2.title), page2.path);
      map.set(normalizeWikiToken(page2.name.replace(/\.md$/i, "")), page2.path);
      const basename = page2.path.split("/").pop() || page2.name;
      map.set(normalizeWikiToken(basename), page2.path);
      map.set(normalizeWikiToken(basename.replace(/\.md$/i, "")), page2.path);
    }
    return map;
  }, [pages]);
  const filteredPages = useMemo(() => {
    if (!selectedTag) return pages;
    return pages.filter((page2) => page2.tags.includes(selectedTag));
  }, [pages, selectedTag]);
  const tree = useMemo(() => buildKnowledgeTree(filteredPages), [filteredPages]);
  const popularTags = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const page2 of pages) {
      for (const tag of page2.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 16);
  }, [pages]);
  useEffect(() => {
    if (!pages.length) return;
    if (selectedPath && pages.some((page2) => page2.path === selectedPath)) return;
    setSelectedPath(pages[0]?.path ?? null);
  }, [pages, selectedPath]);
  const readQuery = useQuery({
    queryKey: ["knowledge", "read", selectedPath],
    queryFn: () => readJson(
      `/api/knowledge/read?path=${encodeURIComponent(selectedPath || "")}`
    ),
    enabled: Boolean(selectedPath)
  });
  const searchQuery = useQuery({
    queryKey: ["knowledge", "search", searchTerm],
    queryFn: () => readJson(
      `/api/knowledge/search?q=${encodeURIComponent(searchTerm)}`
    ),
    enabled: searchTerm.length > 0
  });
  const graphQuery = useQuery({
    queryKey: ["knowledge", "graph"],
    queryFn: () => readJson("/api/knowledge/graph"),
    enabled: graphOpen
  });
  const page = readQuery.data?.page ?? null;
  const content = readQuery.data?.content ?? "";
  const backlinks = readQuery.data?.backlinks ?? [];
  const processedContent = useMemo(
    () => preprocessWikiMarkdown(content),
    [content]
  );
  const askUrl = `/chat?message=${encodeURIComponent(
    `Tell me about: ${page?.title || selectedPath || "this page"}

Context:
${content.slice(0, 500)}`
  )}`;
  const searchResults = searchQuery.data?.results ?? [];
  function resolveWikiPath(rawValue) {
    const decoded = decodeURIComponent(rawValue);
    return pageLookup.get(normalizeWikiToken(decoded)) ?? null;
  }
  function handleSelectPath(pathValue, nextLine, result) {
    setSelectedPath(pathValue);
    setFocusLine(nextLine ?? null);
    setFocusedResult(result ?? null);
    setMobileTreeOpen(false);
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-full overflow-y-auto bg-surface text-ink", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "mx-auto flex w-full max-w-[1200px] min-h-0 flex-col px-4 py-6 sm:px-6 lg:px-8",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "px-3 py-3 md:px-4",
            style: {
              borderBottom: "1px solid var(--theme-border)",
              backgroundColor: "var(--theme-bg)"
            },
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "inline-flex size-9 items-center justify-center rounded-xl",
                    style: {
                      border: "1px solid var(--theme-border)",
                      backgroundColor: "var(--theme-card)",
                      color: "var(--theme-text)"
                    },
                    children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: BrainIcon, size: 18, strokeWidth: 1.6 })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "relative min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx(
                    HugeiconsIcon,
                    {
                      icon: Search01Icon,
                      size: 16,
                      strokeWidth: 1.7,
                      className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
                      style: { color: "var(--theme-muted)" }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: searchInput,
                      onChange: (event) => setSearchInput(event.target.value),
                      placeholder: "Search knowledge",
                      className: "w-full rounded-xl py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-accent-500",
                      style: {
                        border: "1px solid var(--theme-border)",
                        backgroundColor: "var(--theme-card)",
                        color: "var(--theme-text)"
                      }
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setGraphOpen(true),
                  className: "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-100 dark:hover:bg-neutral-900",
                  style: {
                    border: "1px solid var(--theme-border)",
                    backgroundColor: "var(--theme-card)",
                    color: "var(--theme-text)"
                  },
                  children: [
                    /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Link01Icon, size: 16, strokeWidth: 1.7 }),
                    "Graph view"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(DialogRoot, { open: settingsOpen, onOpenChange: setSettingsOpen, children: [
                /* @__PURE__ */ jsxs(
                  DialogTrigger,
                  {
                    className: "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-100 dark:hover:bg-neutral-900",
                    style: {
                      border: "1px solid var(--theme-border)",
                      backgroundColor: "var(--theme-card)",
                      color: "var(--theme-text)"
                    },
                    title: "Knowledge base settings",
                    children: [
                      /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Settings01Icon, size: 16, strokeWidth: 1.7 }),
                      /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Settings" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  DialogContent,
                  {
                    className: "sm:max-w-md",
                    style: {
                      backgroundColor: "var(--theme-bg)",
                      color: "var(--theme-text)",
                      border: "1px solid var(--theme-border)"
                    },
                    children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(DialogTitle, { className: "text-base font-semibold", children: "Knowledge Base Settings" }),
                        /* @__PURE__ */ jsx(DialogDescription, { className: "mt-1 text-sm", style: { color: "var(--theme-muted)" }, children: "Choose where your knowledge base is located. Changes take effect immediately." })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Source type" }),
                        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                          /* @__PURE__ */ jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => setSettingsSource((prev) => ({
                                type: "local",
                                path: prev?.type === "local" ? prev.path : ""
                              })),
                              className: "flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                              style: {
                                borderColor: settingsSource?.type === "local" ? "var(--accent-color, #f97316)" : "var(--theme-border)",
                                backgroundColor: settingsSource?.type === "local" ? "var(--theme-card)" : "transparent",
                                color: "var(--theme-text)"
                              },
                              children: [
                                /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Folder01Icon, size: 16, strokeWidth: 1.7 }),
                                "Local folder"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => setSettingsSource((prev) => ({
                                type: "github",
                                repo: prev?.type === "github" ? prev.repo : "",
                                branch: prev?.type === "github" ? prev.branch : "main",
                                path: prev?.type === "github" ? prev.path : ""
                              })),
                              className: "flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                              style: {
                                borderColor: settingsSource?.type === "github" ? "var(--accent-color, #f97316)" : "var(--theme-border)",
                                backgroundColor: settingsSource?.type === "github" ? "var(--theme-card)" : "transparent",
                                color: "var(--theme-text)"
                              },
                              children: [
                                /* @__PURE__ */ jsx(HugeiconsIcon, { icon: CodeIcon, size: 16, strokeWidth: 1.7 }),
                                "GitHub repo"
                              ]
                            }
                          )
                        ] })
                      ] }),
                      settingsSource?.type === "local" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", htmlFor: "kb-local-path", children: "Folder path" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            id: "kb-local-path",
                            type: "text",
                            value: settingsSource.path,
                            onChange: (e) => setSettingsSource(
                              (prev) => prev?.type === "local" ? { ...prev, path: e.target.value } : prev
                            ),
                            placeholder: "~/my-wiki or /absolute/path",
                            className: "w-full rounded-xl border px-3 py-2 text-sm outline-none",
                            style: {
                              borderColor: "var(--theme-border)",
                              backgroundColor: "var(--theme-card)",
                              color: "var(--theme-text)"
                            }
                          }
                        )
                      ] }),
                      settingsSource?.type === "github" && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", htmlFor: "kb-gh-repo", children: "Repository" }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              id: "kb-gh-repo",
                              type: "text",
                              value: settingsSource.repo,
                              onChange: (e) => setSettingsSource(
                                (prev) => prev?.type === "github" ? { ...prev, repo: e.target.value } : prev
                              ),
                              placeholder: "owner/repo (e.g. dontcallmejames/my-wiki)",
                              className: "w-full rounded-xl border px-3 py-2 text-sm outline-none",
                              style: {
                                borderColor: "var(--theme-border)",
                                backgroundColor: "var(--theme-card)",
                                color: "var(--theme-text)"
                              }
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1.5", children: [
                            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", htmlFor: "kb-gh-branch", children: "Branch" }),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                id: "kb-gh-branch",
                                type: "text",
                                value: settingsSource.branch,
                                onChange: (e) => setSettingsSource(
                                  (prev) => prev?.type === "github" ? { ...prev, branch: e.target.value } : prev
                                ),
                                placeholder: "main",
                                className: "w-full rounded-xl border px-3 py-2 text-sm outline-none",
                                style: {
                                  borderColor: "var(--theme-border)",
                                  backgroundColor: "var(--theme-card)",
                                  color: "var(--theme-text)"
                                }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1.5", children: [
                            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", htmlFor: "kb-gh-path", children: "Sub-folder" }),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                id: "kb-gh-path",
                                type: "text",
                                value: settingsSource.path,
                                onChange: (e) => setSettingsSource(
                                  (prev) => prev?.type === "github" ? { ...prev, path: e.target.value } : prev
                                ),
                                placeholder: "wiki (optional)",
                                className: "w-full rounded-xl border px-3 py-2 text-sm outline-none",
                                style: {
                                  borderColor: "var(--theme-border)",
                                  backgroundColor: "var(--theme-card)",
                                  color: "var(--theme-text)"
                                }
                              }
                            )
                          ] })
                        ] }),
                        syncError && /* @__PURE__ */ jsx("p", { className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400", children: syncError })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
                        settingsSource?.type === "github" && /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: async () => {
                              if (!settingsSource || settingsSource.type !== "github") return;
                              setSyncing(true);
                              setSyncError(null);
                              try {
                                const res = await fetch("/api/knowledge/sync", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    source: settingsSource
                                  })
                                });
                                const data = await res.json();
                                if (data.error) {
                                  setSyncError(data.error);
                                } else {
                                  queryClient.invalidateQueries({ queryKey: ["knowledge", "list"] });
                                }
                              } catch (err) {
                                setSyncError(
                                  err instanceof Error ? err.message : "Sync failed"
                                );
                              } finally {
                                setSyncing(false);
                              }
                            },
                            disabled: syncing || !settingsSource.repo,
                            className: "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-100 disabled:opacity-50 dark:hover:bg-neutral-900",
                            style: {
                              borderColor: "var(--theme-border)",
                              color: "var(--theme-text)"
                            },
                            children: syncing ? "Syncing…" : "Sync now"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: async () => {
                              if (!settingsSource) return;
                              const source = settingsSource.type === "local" ? { type: "local", path: settingsSource.path } : {
                                type: "github",
                                repo: settingsSource.repo,
                                branch: settingsSource.branch || "main",
                                path: settingsSource.path || ""
                              };
                              await fetch("/api/knowledge/config", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ source })
                              });
                              queryClient.invalidateQueries({ queryKey: ["knowledge", "list"] });
                              setSettingsOpen(false);
                            },
                            className: "inline-flex items-center gap-2 rounded-xl bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-600",
                            children: "Save"
                          }
                        )
                      ] })
                    ] })
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 md:grid-cols-[320px_minmax(0,1fr)] md:p-4", children: [
          /* @__PURE__ */ jsxs("aside", { className: "flex min-h-0 flex-col rounded-2xl border border-primary-200 bg-primary-50 dark:border-neutral-800 dark:bg-neutral-950", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "flex items-center justify-between px-3 py-2 text-left md:cursor-default",
                onClick: () => setMobileTreeOpen((value) => !value),
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold uppercase tracking-wide text-primary-500 dark:text-neutral-400", children: [
                    "Knowledge Pages (",
                    filteredPages.length,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-500 dark:text-neutral-400 md:hidden", children: /* @__PURE__ */ jsx(
                    HugeiconsIcon,
                    {
                      icon: mobileTreeOpen ? ArrowUp01Icon : ArrowDown01Icon,
                      size: 16,
                      strokeWidth: 1.7
                    }
                  ) })
                ]
              }
            ),
            !knowledgeExists && !listQuery.isLoading ? /* @__PURE__ */ jsx("div", { className: "px-3 pb-3", children: /* @__PURE__ */ jsx(EmptyKnowledgeState, { knowledgeRoot }) }) : searchTerm ? /* @__PURE__ */ jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto px-2 pb-2", children: [
              /* @__PURE__ */ jsx("div", { className: "mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-primary-400 dark:text-neutral-500", children: "Search Results" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1", children: searchQuery.isLoading ? /* @__PURE__ */ jsx(StateBox, { label: "Searching knowledge..." }) : searchResults.length === 0 ? /* @__PURE__ */ jsx(StateBox, { label: "No matches found" }) : searchResults.map((result, index) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleSelectPath(result.path, result.line, result),
                  className: "w-full rounded-lg border border-primary-200 bg-primary-50/80 px-2.5 py-2 text-left hover:border-primary-300 hover:bg-primary-100 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-900",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "truncate text-[11px] text-primary-500 dark:text-neutral-400", children: [
                      result.title || result.path,
                      ":",
                      result.line
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "mt-0.5 line-clamp-3 text-xs text-primary-700 dark:text-neutral-200", children: highlightMatch(result.text, searchTerm).map(
                      (part, partIndex) => /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: part.hit ? "rounded bg-yellow-300/30 px-0.5 text-yellow-200" : void 0,
                          children: part.text || " "
                        },
                        partIndex
                      )
                    ) })
                  ]
                },
                `${result.path}:${result.line}:${index}`
              )) })
            ] }) : /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "min-h-0 flex-1 px-2 pb-2",
                  !mobileTreeOpen && "hidden md:block"
                ),
                children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 overflow-y-auto pr-1 md:h-full", children: [
                  /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-primary-200 bg-primary-50/80 p-2 dark:border-neutral-800 dark:bg-neutral-900/60", children: [
                    /* @__PURE__ */ jsx("div", { className: "mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-primary-400 dark:text-neutral-500", children: "Tags" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
                      /* @__PURE__ */ jsx(
                        TagPill,
                        {
                          label: "All",
                          count: pages.length,
                          active: selectedTag == null,
                          onClick: () => setSelectedTag(null)
                        }
                      ),
                      popularTags.map(([tag, count]) => /* @__PURE__ */ jsx(
                        TagPill,
                        {
                          label: tag,
                          count,
                          active: selectedTag === tag,
                          onClick: () => setSelectedTag(tag)
                        },
                        tag
                      ))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("section", { className: "rounded-xl border border-primary-200 bg-primary-50/80 p-1 dark:border-neutral-800 dark:bg-neutral-900/60", children: listQuery.isLoading ? /* @__PURE__ */ jsx(StateBox, { label: "Loading knowledge pages..." }) : listQuery.error instanceof Error ? /* @__PURE__ */ jsx(StateBox, { label: listQuery.error.message, error: true }) : filteredPages.length === 0 ? /* @__PURE__ */ jsx(
                    StateBox,
                    {
                      label: selectedTag ? "No pages match this tag" : "No markdown pages found"
                    }
                  ) : /* @__PURE__ */ jsx(
                    TreeSection,
                    {
                      node: tree,
                      selectedPath,
                      onSelectPath: (pathValue) => handleSelectPath(pathValue)
                    }
                  ) })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "min-h-0 rounded-2xl border border-primary-200 bg-primary-50 dark:border-neutral-800 dark:bg-neutral-950", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-primary-200 px-3 py-2 dark:border-neutral-800", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-semibold text-primary-900 dark:text-neutral-100", children: page?.title || selectedPath || "Select a page" }),
                page ? /* @__PURE__ */ jsxs("div", { className: "text-xs text-primary-400 dark:text-neutral-500", children: [
                  page.path,
                  " · ",
                  formatBytes(page.size),
                  " ·",
                  " ",
                  formatDate(page.updated || page.modified)
                ] }) : null
              ] }),
              page ? /* @__PURE__ */ jsxs(
                "a",
                {
                  href: askUrl,
                  className: "inline-flex items-center gap-1.5 rounded-md border border-primary-200 px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary-300 hover:bg-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800",
                  children: [
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: Message01Icon,
                        size: 14,
                        strokeWidth: 1.7
                      }
                    ),
                    "Ask agent about this"
                  ]
                }
              ) : null
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-full overflow-auto p-2 md:p-3", children: listQuery.isLoading ? /* @__PURE__ */ jsx(StateBox, { label: "Loading knowledge base..." }) : listQuery.error instanceof Error ? /* @__PURE__ */ jsx(StateBox, { label: listQuery.error.message, error: true }) : !knowledgeExists ? /* @__PURE__ */ jsx(EmptyKnowledgeState, { knowledgeRoot }) : !selectedPath ? /* @__PURE__ */ jsx(StateBox, { label: "Select a page to start browsing" }) : readQuery.isLoading ? /* @__PURE__ */ jsx(StateBox, { label: "Loading page..." }) : readQuery.error instanceof Error ? /* @__PURE__ */ jsx(StateBox, { label: readQuery.error.message, error: true }) : !page ? /* @__PURE__ */ jsx(StateBox, { label: "Page not found", error: true }) : /* @__PURE__ */ jsx(
              "div",
              {
                className: "rounded-xl",
                style: {
                  border: "1px solid var(--theme-border)",
                  backgroundColor: "var(--theme-card)"
                },
                children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_260px]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-4", children: [
                    focusedResult && focusedResult.path === page.path ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-yellow-300/40 bg-yellow-300/10 px-3 py-2 text-sm text-primary-900 dark:text-yellow-50", children: [
                      /* @__PURE__ */ jsxs("div", { className: "font-medium", children: [
                        "Search hit at line ",
                        focusLine
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs opacity-80", children: focusedResult.text })
                    ] }) : null,
                    page.summary ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-primary-200 bg-primary-50/70 px-3 py-2 text-sm text-primary-700 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300", children: page.summary }) : null,
                    /* @__PURE__ */ jsx(
                      Markdown,
                      {
                        className: "gap-3",
                        components: {
                          a: function KnowledgeLink({ children, href }) {
                            if (href?.startsWith("wiki:")) {
                              const resolvedPath = resolveWikiPath(
                                href.slice("wiki:".length)
                              );
                              return /* @__PURE__ */ jsxs(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => {
                                    if (resolvedPath)
                                      handleSelectPath(resolvedPath);
                                  },
                                  className: "inline-flex items-center gap-1 text-primary-950 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-950 hover:decoration-primary-500 dark:text-neutral-100",
                                  children: [
                                    /* @__PURE__ */ jsx(
                                      HugeiconsIcon,
                                      {
                                        icon: Link01Icon,
                                        size: 14,
                                        strokeWidth: 1.7
                                      }
                                    ),
                                    /* @__PURE__ */ jsx("span", { children })
                                  ]
                                }
                              );
                            }
                            return /* @__PURE__ */ jsx(
                              "a",
                              {
                                href,
                                className: "text-primary-950 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-950 hover:decoration-primary-500",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children
                              }
                            );
                          }
                        },
                        children: processedContent
                      }
                    ),
                    /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-primary-200 bg-primary-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60", children: [
                      /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2 text-sm font-semibold text-primary-900 dark:text-neutral-100", children: [
                        /* @__PURE__ */ jsx(
                          HugeiconsIcon,
                          {
                            icon: Link01Icon,
                            size: 16,
                            strokeWidth: 1.7
                          }
                        ),
                        "Backlinks"
                      ] }),
                      backlinks.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-sm text-primary-500 dark:text-neutral-400", children: "No pages link here yet." }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: backlinks.map((backlink) => {
                        const backlinkPath = resolveWikiPath(backlink) || backlink;
                        return /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleSelectPath(backlinkPath),
                            className: "rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:border-primary-300 hover:bg-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-900",
                            children: backlink
                          },
                          backlink
                        );
                      }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("aside", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsx(MetadataCard, { label: "Type", value: page.type }),
                    /* @__PURE__ */ jsx(MetadataCard, { label: "Domain", value: page.domain }),
                    /* @__PURE__ */ jsx(MetadataCard, { label: "Status", value: page.status }),
                    /* @__PURE__ */ jsx(
                      MetadataCard,
                      {
                        label: "Created",
                        value: formatDate(page.created)
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      MetadataCard,
                      {
                        label: "Updated",
                        value: formatDate(page.updated || page.modified)
                      }
                    ),
                    /* @__PURE__ */ jsx(MetadataCard, { label: "Size", value: formatBytes(page.size) }),
                    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-200 bg-primary-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-primary-500 dark:text-neutral-400", children: "Tags" }),
                      /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: page.tags.length === 0 ? /* @__PURE__ */ jsx("span", { className: "text-sm text-primary-500 dark:text-neutral-400", children: "No tags" }) : page.tags.map((tag) => /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setSelectedTag(tag),
                          className: "rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:border-primary-300 hover:bg-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-900",
                          children: [
                            "#",
                            tag
                          ]
                        },
                        tag
                      )) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-200 bg-primary-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60", children: [
                      /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-500 dark:text-neutral-400", children: [
                        /* @__PURE__ */ jsx(
                          HugeiconsIcon,
                          {
                            icon: CodeIcon,
                            size: 14,
                            strokeWidth: 1.7
                          }
                        ),
                        "Wikilinks"
                      ] }),
                      page.wikilinks.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-sm text-primary-500 dark:text-neutral-400", children: "No outbound links" }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: page.wikilinks.map((link) => {
                        const linkPath = resolveWikiPath(link) || link;
                        return /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleSelectPath(linkPath),
                            className: "rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:border-primary-300 hover:bg-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-900",
                            children: link
                          },
                          link
                        );
                      }) })
                    ] })
                  ] })
                ] })
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(DialogRoot, { open: graphOpen, onOpenChange: setGraphOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[min(980px,94vw)] max-w-none p-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "border-b border-primary-200 px-5 py-4 dark:border-neutral-800", children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: "Knowledge graph" }),
            /* @__PURE__ */ jsx(DialogDescription, { children: "Page relationships from wiki links. Click any node to open that page." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-5", children: graphQuery.isLoading ? /* @__PURE__ */ jsx(StateBox, { label: "Loading graph..." }) : graphQuery.error instanceof Error ? /* @__PURE__ */ jsx(StateBox, { label: graphQuery.error.message, error: true }) : (graphQuery.data?.nodes?.length ?? 0) === 0 ? /* @__PURE__ */ jsx(StateBox, { label: "No graph data yet" }) : /* @__PURE__ */ jsx(
            GraphCanvas,
            {
              nodes: graphQuery.data?.nodes ?? [],
              edges: graphQuery.data?.edges ?? [],
              onSelect: (pathValue) => {
                setGraphOpen(false);
                handleSelectPath(pathValue);
              }
            }
          ) })
        ] }) })
      ]
    }
  ) });
}
function TreeSection({
  node,
  selectedPath,
  onSelectPath,
  depth = 0
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("space-y-1", depth > 0 && "mt-1"), children: [
    node.path ? /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-primary-500 dark:text-neutral-400",
        style: { paddingLeft: `${depth * 12 + 8}px` },
        children: [
          /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Folder01Icon, size: 14, strokeWidth: 1.7 }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: node.name })
        ]
      }
    ) : null,
    node.pages.map((page) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onSelectPath(page.path),
        className: cn(
          "block w-full rounded-lg border px-2.5 py-2 text-left transition-colors",
          selectedPath === page.path ? "border-accent-500/70 bg-accent-500/10" : "border-primary-200 bg-primary-50/80 hover:border-primary-300 hover:bg-primary-100 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
        ),
        style: { marginLeft: depth > 0 ? depth * 12 : 0 },
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx(
            HugeiconsIcon,
            {
              icon: File01Icon,
              size: 16,
              strokeWidth: 1.7,
              className: "mt-0.5 shrink-0"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-medium text-primary-900 dark:text-neutral-100", children: page.title }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap gap-1.5", children: [
              page.type ? /* @__PURE__ */ jsx(InlineBadge, { label: page.type }) : null,
              page.status ? /* @__PURE__ */ jsx(InlineBadge, { label: page.status }) : null
            ] })
          ] })
        ] })
      },
      page.path
    )),
    node.folders.map((child) => /* @__PURE__ */ jsx(
      TreeSection,
      {
        node: child,
        selectedPath,
        onSelectPath,
        depth: depth + 1
      },
      child.path
    ))
  ] });
}
function InlineBadge({ label }) {
  return /* @__PURE__ */ jsx("span", { className: "rounded-full border border-primary-200 bg-primary-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300", children: label });
}
function TagPill({
  label,
  count,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active ? "border-accent-500/70 bg-accent-500/10 text-primary-900 dark:text-neutral-100" : "border-primary-200 bg-primary-50 text-primary-600 hover:border-primary-300 hover:bg-primary-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
      ),
      children: [
        label,
        " ",
        /* @__PURE__ */ jsx("span", { className: "opacity-70", children: count })
      ]
    }
  );
}
function MetadataCard({
  label,
  value
}) {
  if (!value) return null;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-200 bg-primary-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-primary-500 dark:text-neutral-400", children: label }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-primary-900 dark:text-neutral-100", children: value })
  ] });
}
function EmptyKnowledgeState({ knowledgeRoot }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-32 flex-col justify-center rounded-xl border border-primary-200 bg-primary-50 px-4 py-5 text-sm text-primary-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300", children: [
    /* @__PURE__ */ jsx("div", { className: "text-base font-semibold text-primary-900 dark:text-neutral-100", children: "No knowledge base found" }),
    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-pretty", children: [
      "Create markdown files in ",
      /* @__PURE__ */ jsx("code", { children: knowledgeRoot }),
      " to get started."
    ] }),
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: "https://karpathy.ai/",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary-900 underline decoration-primary-300 underline-offset-4 hover:decoration-primary-500 dark:text-neutral-100",
        children: [
          /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Link01Icon, size: 14, strokeWidth: 1.7 }),
          "See the Karpathy LLM wiki pattern"
        ]
      }
    )
  ] });
}
function StateBox({ label, error }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "flex min-h-32 items-center justify-center rounded-xl border px-4 text-sm",
        error ? "border-red-300 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300" : "border-primary-200 bg-primary-50 text-primary-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
      ),
      children: label
    }
  );
}
export {
  KnowledgeBrowserScreen
};
