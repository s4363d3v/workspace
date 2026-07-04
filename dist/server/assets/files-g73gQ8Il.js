import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Editor } from "@monaco-editor/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon, ExternalLink, Download01Icon } from "@hugeicons/core-free-icons";
import { x as useSettings, y as resolveTheme, F as FileExplorerSidebar, S as ScrollAreaRoot, i as ScrollAreaViewport, j as Markdown, k as ScrollAreaScrollbar, l as ScrollAreaThumb, z as ScrollAreaCorner } from "./router-DmH5gXcK.js";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import "@tanstack/react-router";
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
const PLACEHOLDER_VALUE = `// Files workspace
// Click a file in the tree to load it into this editor.
`;
const LANGUAGE_BY_EXT = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  md: "markdown",
  markdown: "markdown",
  yml: "yaml",
  yaml: "yaml",
  toml: "ini",
  ini: "ini",
  css: "css",
  scss: "scss",
  html: "html",
  htm: "html",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  py: "python",
  rb: "ruby",
  go: "go",
  rs: "rust",
  java: "java",
  c: "c",
  cpp: "cpp",
  h: "cpp",
  hpp: "cpp",
  sql: "sql",
  xml: "xml",
  dockerfile: "dockerfile",
  env: "plaintext",
  log: "plaintext",
  txt: "plaintext"
};
const IMAGE_EXTS = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);
function getExt(name) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}
function languageFor(name) {
  if (/^Dockerfile$/i.test(name)) return "dockerfile";
  return LANGUAGE_BY_EXT[getExt(name)] ?? "plaintext";
}
function FilesRoute() {
  usePageTitle("Files");
  const {
    settings
  } = useSettings();
  const [isMobile, setIsMobile] = useState(false);
  const [fileExplorerCollapsed, setFileExplorerCollapsed] = useState(false);
  const [loaded, setLoaded] = useState(null);
  const [renderMarkdown, setRenderMarkdown] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const resolvedTheme = resolveTheme(settings.theme);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!isMobile) return;
    setFileExplorerCollapsed(true);
  }, [isMobile]);
  const handleInsertReference = useCallback(() => {
  }, []);
  const handleOpenFile = useCallback(async (entry) => {
    const ext = getExt(entry.name);
    const isImage2 = IMAGE_EXTS.has(ext);
    setLoaded({
      path: entry.path,
      name: entry.name,
      language: languageFor(entry.name),
      content: "",
      imageDataUrl: null,
      loading: true,
      error: null,
      dirty: false
    });
    try {
      const res = await fetch(`/api/files?action=read&path=${encodeURIComponent(entry.path)}`);
      if (!res.ok) throw new Error(`Failed to read file (${res.status})`);
      const data = await res.json();
      setLoaded({
        path: entry.path,
        name: entry.name,
        language: languageFor(entry.name),
        content: data.type === "text" ? data.content : "",
        imageDataUrl: data.type === "image" || isImage2 ? data.content || null : null,
        loading: false,
        error: null,
        dirty: false
      });
    } catch (err) {
      setLoaded((prev) => prev && prev.path === entry.path ? {
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : String(err)
      } : prev);
    }
  }, []);
  const handleDownload = useCallback(() => {
    if (!loaded) return;
    const url = `/api/files?action=download&path=${encodeURIComponent(loaded.path)}`;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = loaded.name;
    anchor.click();
  }, [loaded]);
  const handleOpenInTab = useCallback(() => {
    if (!loaded) return;
    const url = `/api/files?action=view&path=${encodeURIComponent(loaded.path)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [loaded]);
  const handleSave = useCallback(async () => {
    if (!loaded || !loaded.dirty || loaded.imageDataUrl) return;
    setSaving(true);
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          action: "write",
          path: loaded.path,
          content: loaded.content
        })
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      setLoaded((prev) => prev ? {
        ...prev,
        dirty: false
      } : prev);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 1500);
    } catch (err) {
      setLoaded((prev) => prev ? {
        ...prev,
        error: err instanceof Error ? err.message : String(err)
      } : prev);
    } finally {
      setSaving(false);
    }
  }, [loaded]);
  const isMarkdown = loaded?.language === "markdown";
  const isImage = Boolean(loaded?.imageDataUrl);
  const editorValue = loaded?.content ?? PLACEHOLDER_VALUE;
  const editorLanguage = useMemo(() => loaded ? loaded.language : "plaintext", [loaded]);
  return /* @__PURE__ */ jsx("div", { className: "h-full min-h-0 overflow-hidden bg-surface text-primary-900", children: /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 overflow-hidden", children: [
    /* @__PURE__ */ jsx(FileExplorerSidebar, { collapsed: fileExplorerCollapsed, onToggle: () => setFileExplorerCollapsed((prev) => !prev), onInsertReference: handleInsertReference, onOpenFile: handleOpenFile, activePath: loaded?.path ?? null }),
    /* @__PURE__ */ jsxs("main", { className: "flex min-w-0 flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex items-center gap-3 border-b border-primary-200 px-3 py-2 md:px-4 md:py-3", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFileExplorerCollapsed((prev) => !prev), className: "rounded-lg p-1.5 text-primary-600 hover:bg-primary-100 transition-colors", "aria-label": fileExplorerCollapsed ? "Show files" : "Hide files", title: fileExplorerCollapsed ? "Show files" : "Hide files", children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Folder01Icon, size: 20, strokeWidth: 1.5 }) }),
        /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: loaded ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("h1", { className: "truncate text-base font-medium md:text-lg", title: loaded.path, children: loaded.name }),
          /* @__PURE__ */ jsxs("p", { className: "hidden truncate text-xs text-primary-500 sm:block", children: [
            loaded.path,
            loaded.dirty && /* @__PURE__ */ jsx("span", { className: "ml-2 text-accent-500", children: "· unsaved changes" }),
            savedFlash && /* @__PURE__ */ jsx("span", { className: "ml-2 text-emerald-600", children: "· saved" })
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-base font-medium md:text-lg", children: "Files" }),
          /* @__PURE__ */ jsx("p", { className: "hidden text-sm text-primary-600 sm:block", children: "Click a file in the sidebar to load it into the editor." })
        ] }) }),
        loaded ? /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
          isMarkdown && !isImage ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setRenderMarkdown((v) => !v), className: "rounded-md border border-primary-200 px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100", children: renderMarkdown ? "Edit" : "Preview" }) : null,
          !isImage ? /* @__PURE__ */ jsx("button", { type: "button", onClick: handleSave, disabled: !loaded.dirty || saving, className: "rounded-md bg-accent-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-accent-600 disabled:opacity-50", children: saving ? "Saving…" : "Save" }) : null,
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleOpenInTab, className: "inline-flex items-center gap-1 rounded-md border border-primary-200 px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100", title: "Open this file in a new browser tab", children: [
            /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ExternalLink, size: 14, strokeWidth: 1.6 }),
            "Open"
          ] }),
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: handleDownload, className: "inline-flex items-center gap-1 rounded-md border border-primary-200 px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100", title: "Download this file to your computer", children: [
            /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Download01Icon, size: 14, strokeWidth: 1.6 }),
            "Download"
          ] })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "min-h-0 flex-1 pb-24 md:pb-0", children: loaded?.loading ? /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-sm text-primary-500", children: "Loading…" }) : loaded?.error ? /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center p-6 text-sm text-red-600", children: loaded.error }) : isImage && loaded?.imageDataUrl ? /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center overflow-auto p-6", children: /* @__PURE__ */ jsx("img", { src: loaded.imageDataUrl, alt: loaded.name, className: "max-h-full max-w-full rounded-lg border border-primary-200 shadow-sm object-contain" }) }) : isMarkdown && renderMarkdown && loaded ? /* @__PURE__ */ jsxs(ScrollAreaRoot, { className: "h-full", children: [
        /* @__PURE__ */ jsx(ScrollAreaViewport, { children: /* @__PURE__ */ jsx("div", { className: "markdown-preview mx-auto max-w-4xl px-6 py-5 text-sm text-primary-900", children: /* @__PURE__ */ jsx(Markdown, { className: "gap-3", children: loaded.content }) }) }),
        /* @__PURE__ */ jsx(ScrollAreaScrollbar, { orientation: "vertical", children: /* @__PURE__ */ jsx(ScrollAreaThumb, {}) }),
        /* @__PURE__ */ jsx(ScrollAreaCorner, {})
      ] }) : /* @__PURE__ */ jsx(Editor, { height: "100%", theme: resolvedTheme === "dark" ? "vs-dark" : "vs-light", language: editorLanguage, value: editorValue, onChange: (value) => {
        if (!loaded) return;
        setLoaded({
          ...loaded,
          content: value ?? "",
          dirty: (value ?? "") !== loaded.content
        });
      }, options: {
        minimap: {
          enabled: settings.editorMinimap
        },
        fontSize: settings.editorFontSize,
        scrollBeyondLastLine: false,
        wordWrap: settings.editorWordWrap ? "on" : "off",
        readOnly: !loaded
      } }) })
    ] })
  ] }) });
}
export {
  FilesRoute as component
};
