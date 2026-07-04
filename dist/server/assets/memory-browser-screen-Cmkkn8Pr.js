import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { HugeiconsIcon } from "@hugeicons/react";
import { BrainIcon, Search01Icon, ArrowUp01Icon, ArrowDown01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useDeferredValue, useRef, useMemo, useEffect } from "react";
import { c as cn, t as toast } from "./router-DmH5gXcK.js";
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
function formatModified(value) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Intl.DateTimeFormat(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(parsed);
}
function isDailyMemoryPath(pathValue) {
  return /^memories?\/\d{4}-\d{2}-\d{2}\.md$/.test(pathValue);
}
function splitFiles(files) {
  const rootMemory = files.find((file) => file.path === "MEMORY.md") || null;
  const memoryFiles = files.filter(
    (file) => file.path.startsWith("memory/") || file.path.startsWith("memories/")
  ).sort((a, b) => {
    if (isDailyMemoryPath(a.path) && isDailyMemoryPath(b.path)) {
      return b.path.localeCompare(a.path);
    }
    return Date.parse(b.modified) - Date.parse(a.modified) || a.path.localeCompare(b.path);
  });
  return { rootMemory, memoryFiles };
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
function MemoryBrowserScreen() {
  const [selectedPath, setSelectedPath] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = useDeferredValue(searchInput);
  const [mobileFilesOpen, setMobileFilesOpen] = useState(true);
  const [focusLine, setFocusLine] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const lineRefs = useRef({});
  const queryClient = useQueryClient();
  const searchTerm = deferredSearch.trim();
  const filesQuery = useQuery({
    queryKey: ["memory", "list"],
    queryFn: () => readJson("/api/memory/list")
  });
  const files = filesQuery.data?.files ?? [];
  const { rootMemory, memoryFiles } = useMemo(() => splitFiles(files), [files]);
  useEffect(() => {
    if (selectedPath) return;
    if (rootMemory) {
      setSelectedPath(rootMemory.path);
      return;
    }
    if (memoryFiles[0]) setSelectedPath(memoryFiles[0].path);
  }, [selectedPath, rootMemory, memoryFiles]);
  const contentQuery = useQuery({
    queryKey: ["memory", "read", selectedPath],
    queryFn: () => readJson(
      `/api/memory/read?path=${encodeURIComponent(selectedPath || "")}`
    ),
    enabled: Boolean(selectedPath)
  });
  const searchEnabled = searchTerm.length > 0;
  const searchQuery = useQuery({
    queryKey: ["memory", "search", searchTerm],
    queryFn: () => readJson(
      `/api/memory/search?q=${encodeURIComponent(searchTerm)}`
    ),
    enabled: searchEnabled
  });
  const content = contentQuery.data?.content || "";
  const lines = useMemo(() => content.split(/\r?\n/), [content]);
  useEffect(() => {
    if (isEditing) return;
    setDraftContent(content);
    setHasUnsavedChanges(false);
  }, [content, isEditing, selectedPath]);
  useEffect(() => {
    if (!focusLine) return;
    const target = lineRefs.current[focusLine];
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusLine, lines, selectedPath]);
  const fileItems = useMemo(() => {
    const items = [];
    if (rootMemory) items.push(rootMemory);
    items.push(...memoryFiles);
    return items;
  }, [rootMemory, memoryFiles]);
  const selectedFileMeta = useMemo(
    () => fileItems.find((file) => file.path === selectedPath) ?? null,
    [fileItems, selectedPath]
  );
  const searchResults = searchQuery.data?.results ?? [];
  function trySelectFile(nextPath, nextFocusLine) {
    if (nextPath !== selectedPath && isEditing && hasUnsavedChanges) {
      const confirmed = typeof window === "undefined" ? true : window.confirm(
        "You have unsaved changes. Discard them and switch files?"
      );
      if (!confirmed) return false;
    }
    if (nextPath !== selectedPath && isEditing) {
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setDraftContent("");
    }
    setSelectedPath(nextPath);
    setFocusLine(nextFocusLine ?? null);
    return true;
  }
  function handleStartEditing() {
    setDraftContent(content);
    setHasUnsavedChanges(false);
    setIsEditing(true);
  }
  function handleCancelEditing() {
    setDraftContent(content);
    setHasUnsavedChanges(false);
    setIsEditing(false);
  }
  async function handleSaveEditing() {
    if (!selectedPath || isSaving) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/memory/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: selectedPath, content: draftContent })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || `Save failed (${response.status})`);
      }
      await queryClient.invalidateQueries({ queryKey: ["memory"] });
      setIsEditing(false);
      setHasUnsavedChanges(false);
      toast("Saved ✓", { type: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save file";
      toast(message, { type: "warning" });
    } finally {
      setIsSaving(false);
    }
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex h-full min-h-0 flex-col",
      style: { backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "px-3 py-3 md:px-4",
            style: {
              borderBottom: "1px solid var(--theme-border)",
              backgroundColor: "var(--theme-bg)"
            },
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
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
              /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
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
                    placeholder: "Search memory files",
                    className: "w-full rounded-xl py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-accent-500",
                    style: {
                      border: "1px solid var(--theme-border)",
                      backgroundColor: "var(--theme-card)",
                      color: "var(--theme-text)"
                    }
                  }
                )
              ] }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 md:grid-cols-3 md:p-4", children: [
          /* @__PURE__ */ jsxs("aside", { className: "flex min-h-0 flex-col rounded-2xl border border-primary-200 bg-primary-50 dark:border-neutral-800 dark:bg-neutral-950 md:col-span-1", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "flex items-center justify-between px-3 py-2 text-left md:cursor-default",
                onClick: () => setMobileFilesOpen((value) => !value),
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold uppercase tracking-wide text-primary-500 dark:text-neutral-400", children: [
                    "Memory Files (",
                    fileItems.length,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "md:hidden text-primary-500 dark:text-neutral-400", children: /* @__PURE__ */ jsx(
                    HugeiconsIcon,
                    {
                      icon: mobileFilesOpen ? ArrowUp01Icon : ArrowDown01Icon,
                      size: 16,
                      strokeWidth: 1.7
                    }
                  ) })
                ]
              }
            ),
            searchEnabled ? /* @__PURE__ */ jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto px-2 pb-2", children: [
              /* @__PURE__ */ jsx("div", { className: "mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-primary-400 dark:text-neutral-500", children: "Search Results" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-1", children: searchQuery.isLoading ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-primary-200 bg-primary-50/80 px-3 py-2 text-xs text-primary-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-500", children: "Searching..." }) : searchResults.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-primary-200 bg-primary-50/80 px-3 py-2 text-xs text-primary-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-500", children: "No matches" }) : searchResults.map((result, index) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (trySelectFile(result.path, result.line)) {
                      setMobileFilesOpen(false);
                    }
                  },
                  className: "w-full rounded-lg border border-primary-200 bg-primary-50/80 px-2.5 py-2 text-left hover:border-primary-300 hover:bg-primary-100 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-900",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "truncate text-[11px] text-primary-500 dark:text-neutral-400", children: [
                      result.path,
                      ":",
                      result.line
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "mt-0.5 line-clamp-2 text-xs text-primary-700 dark:text-neutral-200", children: highlightMatch(result.text, searchTerm).map(
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
                  !mobileFilesOpen && "hidden md:block"
                ),
                children: /* @__PURE__ */ jsxs("div", { className: "max-h-72 space-y-1 overflow-y-auto pr-1 md:h-full md:max-h-none", children: [
                  rootMemory ? /* @__PURE__ */ jsx(
                    FileRow,
                    {
                      file: rootMemory,
                      selected: selectedPath === rootMemory.path,
                      onSelect: (pathValue) => {
                        trySelectFile(pathValue);
                      }
                    }
                  ) : null,
                  /* @__PURE__ */ jsx("div", { className: "px-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-primary-400 dark:text-neutral-500", children: "memory/ or memories/" }),
                  memoryFiles.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-primary-200 bg-primary-50/80 px-3 py-2 text-xs text-primary-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-500", children: "No files in memory/ or memories/" }) : memoryFiles.map((file) => /* @__PURE__ */ jsx(
                    FileRow,
                    {
                      file,
                      selected: selectedPath === file.path,
                      onSelect: (pathValue) => {
                        trySelectFile(pathValue);
                      }
                    },
                    file.path
                  ))
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "min-h-0 rounded-2xl border border-primary-200 bg-primary-50 dark:border-neutral-800 dark:bg-neutral-950 md:col-span-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-primary-200 px-3 py-2 dark:border-neutral-800", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "truncate font-mono text-sm text-primary-900 dark:text-neutral-100", children: selectedPath || "Select a file" }),
                selectedPath ? /* @__PURE__ */ jsx("div", { className: "text-xs text-primary-400 dark:text-neutral-500", children: selectedFileMeta?.size != null ? `${formatBytes(selectedFileMeta.size)} · ${formatModified(selectedFileMeta.modified)}` : "Loading metadata..." }) : null
              ] }),
              selectedPath ? /* @__PURE__ */ jsx("div", { className: "ml-3 flex items-center gap-2", children: isEditing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    disabled: isSaving,
                    onClick: handleSaveEditing,
                    className: "rounded-md bg-[var(--theme-accent)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50",
                    children: isSaving ? "Saving..." : "Save"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    disabled: isSaving,
                    onClick: handleCancelEditing,
                    className: "rounded-md border border-primary-200 px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary-300 hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-800",
                    children: "Cancel"
                  }
                ),
                hasUnsavedChanges ? /* @__PURE__ */ jsx(
                  "span",
                  {
                    title: "Unsaved changes",
                    className: "inline-block size-2 rounded-full bg-amber-400"
                  }
                ) : null
              ] }) : /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleStartEditing,
                  className: "relative inline-flex items-center gap-1.5 rounded-md border border-primary-200 px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary-300 hover:bg-primary-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800",
                  children: [
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: PencilEdit02Icon,
                        size: 14,
                        strokeWidth: 1.7
                      }
                    ),
                    "Edit",
                    hasUnsavedChanges ? /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 size-2 rounded-full bg-amber-400" }) : null
                  ]
                }
              ) }) : null
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "h-full p-2 md:p-3",
                  isEditing ? "overflow-hidden" : "overflow-auto"
                ),
                children: filesQuery.isLoading ? /* @__PURE__ */ jsx(StateBox, { label: "Loading memory files..." }) : filesQuery.error instanceof Error ? /* @__PURE__ */ jsx(StateBox, { label: filesQuery.error.message, error: true }) : !selectedPath ? /* @__PURE__ */ jsx(StateBox, { label: "No memory files found" }) : contentQuery.isLoading ? /* @__PURE__ */ jsx(StateBox, { label: "Loading file..." }) : contentQuery.error instanceof Error ? /* @__PURE__ */ jsx(StateBox, { label: contentQuery.error.message, error: true }) : isEditing ? /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full rounded-xl p-2",
                    style: {
                      border: "1px solid var(--theme-border)",
                      backgroundColor: "var(--theme-card)"
                    },
                    children: /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        value: draftContent,
                        onChange: (event) => {
                          const nextValue = event.target.value;
                          setDraftContent(nextValue);
                          setHasUnsavedChanges(nextValue !== content);
                        },
                        className: "h-full w-full resize-none rounded-lg px-3 py-2 font-mono text-[13px] outline-none ring-0",
                        style: {
                          border: "1px solid var(--theme-border)",
                          backgroundColor: "var(--theme-bg)",
                          color: "var(--theme-text)"
                        },
                        spellCheck: false
                      }
                    )
                  }
                ) : /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "rounded-xl",
                    style: {
                      border: "1px solid var(--theme-border)",
                      backgroundColor: "var(--theme-card)"
                    },
                    children: /* @__PURE__ */ jsx("div", { className: "font-mono text-xs", children: lines.map((line, index) => {
                      const lineNumber = index + 1;
                      const highlighted = focusLine === lineNumber;
                      return /* @__PURE__ */ jsxs(
                        "div",
                        {
                          ref: (node) => {
                            lineRefs.current[lineNumber] = node;
                          },
                          className: cn(
                            "grid grid-cols-[56px_1fr] gap-0 border-b border-primary-200/80 last:border-b-0 dark:border-neutral-900/80",
                            highlighted && "bg-yellow-300/10"
                          ),
                          children: [
                            /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: cn(
                                  "select-none border-r border-primary-200 px-2 py-0.5 text-right text-primary-400 dark:border-neutral-800 dark:text-neutral-600",
                                  highlighted && "text-yellow-200"
                                ),
                                children: lineNumber
                              }
                            ),
                            /* @__PURE__ */ jsx("pre", { className: "overflow-x-auto whitespace-pre-wrap break-words px-3 py-0.5 text-primary-800 dark:text-neutral-200", children: line || " " })
                          ]
                        },
                        lineNumber
                      );
                    }) })
                  }
                )
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function FileRow({
  file,
  selected,
  onSelect
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: () => onSelect(file.path),
      className: cn(
        "w-full rounded-lg border px-2.5 py-2 text-left transition-colors",
        selected ? "border-accent-500/70 bg-accent-500/10" : "border-primary-200 bg-primary-50/80 hover:border-primary-300 hover:bg-primary-100 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "truncate font-mono text-xs text-primary-900 dark:text-neutral-100", children: file.path }),
        /* @__PURE__ */ jsxs("div", { className: "mt-0.5 text-[11px] text-primary-400 dark:text-neutral-500", children: [
          formatBytes(file.size),
          " · ",
          formatModified(file.modified)
        ] })
      ]
    }
  );
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
  MemoryBrowserScreen
};
