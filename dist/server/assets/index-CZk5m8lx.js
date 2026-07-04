import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { HugeiconsIcon } from "@hugeicons/react";
import { PaintBoardIcon, Settings02Icon, SourceCodeSquareIcon, Notification03Icon, Link01Icon, MessageMultiple01Icon, VolumeHighIcon, Mic01Icon, SparklesIcon, CloudIcon, UserIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { useState, useEffect, useCallback } from "react";
import { x as useSettings, R as Route, J as SettingsSidebar, K as SettingsMobilePills, m as Switch, L as LOCALE_LABELS, N as setLocale, O as getLocale, B as Button, c as cn, Q as getTheme, U as THEMES, V as useChatSettingsStore, I as Input, W as STT_PROVIDER_OPTIONS, X as GROQ_STT_MODELS, Y as setTheme, Z as isDarkTheme } from "./router-DmH5gXcK.js";
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
function PageThemeSwatch({
  colors
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-10 w-full overflow-hidden rounded-md border", style: {
    borderColor: colors.border,
    backgroundColor: colors.bg
  }, children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-full w-4 flex-col gap-0.5 p-0.5", style: {
      backgroundColor: colors.panel
    }, children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full rounded-sm", style: {
      backgroundColor: colors.border
    } }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-0.5 p-1", children: [
      /* @__PURE__ */ jsx("div", { className: "h-1.5 w-3/4 rounded", style: {
        backgroundColor: colors.text,
        opacity: 0.8
      } }),
      /* @__PURE__ */ jsx("div", { className: "h-1 w-1/2 rounded", style: {
        backgroundColor: colors.text,
        opacity: 0.3
      } }),
      /* @__PURE__ */ jsx("div", { className: "mt-0.5 h-1.5 w-6 rounded-full", style: {
        backgroundColor: colors.accent
      } })
    ] })
  ] });
}
const THEME_PREVIEWS = {
  "claude-nous": {
    bg: "#031a1a",
    panel: "#082224",
    border: "rgba(255,255,255,0.12)",
    accent: "#ffac02",
    text: "#f8f1e3"
  },
  "claude-nous-light": {
    bg: "#F8FAF8",
    panel: "#FBFDFB",
    border: "rgba(30,74,92,0.18)",
    accent: "#2557B7",
    text: "#16315F"
  },
  "claude-official": {
    bg: "#0A0E1A",
    panel: "#11182A",
    border: "#24304A",
    accent: "#6366F1",
    text: "#E6EAF2"
  },
  "claude-official-light": {
    bg: "#F7F7F1",
    panel: "#FAFBF6",
    border: "#CDD5DA",
    accent: "#2557B7",
    text: "#16315F"
  },
  "claude-classic": {
    bg: "#0d0f12",
    panel: "#1a1f26",
    border: "#2a313b",
    accent: "#b98a44",
    text: "#eceff4"
  },
  "claude-slate": {
    bg: "#0d1117",
    panel: "#1c2128",
    border: "#30363d",
    accent: "#7eb8f6",
    text: "#c9d1d9"
  },
  "claude-classic-light": {
    bg: "#F5F2ED",
    panel: "#FFFFFF",
    border: "#D9D0C4",
    accent: "#b98a44",
    text: "#1a1f26"
  },
  "matrix": {
    bg: "#020804",
    panel: "#07130A",
    border: "rgba(0,255,65,0.28)",
    accent: "#00FF41",
    text: "#D8FFE3"
  },
  "matrix-light": {
    bg: "#F4FFF6",
    panel: "#FFFFFF",
    border: "rgba(0,126,34,0.2)",
    accent: "#008F2D",
    text: "#062A12"
  },
  "claude-slate-light": {
    bg: "#F6F8FA",
    panel: "#FFFFFF",
    border: "#D0D7DE",
    accent: "#3b82f6",
    text: "#1F2328"
  },
  "scifi": {
    bg: "#060b18",
    panel: "#0a1628",
    border: "#1a3a5c",
    accent: "#00f0ff",
    text: "#e0f7fa"
  },
  "scifi-light": {
    bg: "#EEF1F5",
    panel: "#FFFFFF",
    border: "#B0BEC5",
    accent: "#0097A7",
    text: "#0A1628"
  }
};
function WorkspaceThemePicker() {
  const {
    updateSettings
  } = useSettings();
  const [current, setCurrent] = useState(() => getTheme());
  function applyWorkspaceTheme(id) {
    setTheme(id);
    updateSettings({
      theme: isDarkTheme(id) ? "dark" : "light"
    });
    setCurrent(id);
  }
  return /* @__PURE__ */ jsx("div", { className: "grid w-full grid-cols-2 gap-3 lg:grid-cols-4", children: THEMES.map((t) => {
    const isActive = current === t.id;
    return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => applyWorkspaceTheme(t.id), className: cn("flex min-h-[112px] flex-col gap-2.5 rounded-xl border p-3.5 text-left transition-all", isActive ? "border-[var(--theme-accent)] bg-[var(--theme-accent-subtle)] text-[var(--theme-text)] shadow-sm" : "border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text)] hover:-translate-y-0.5 hover:bg-[var(--theme-card2)]"), children: [
      /* @__PURE__ */ jsx(PageThemeSwatch, { colors: THEME_PREVIEWS[t.id] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs", children: t.icon }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: t.label }),
        isActive && /* @__PURE__ */ jsx("span", { className: "ml-auto text-[9px] font-bold uppercase tracking-wide text-[var(--theme-accent)]", children: "Active" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] leading-tight text-[var(--theme-muted)]", children: t.description })
    ] }, t.id);
  }) });
}
function SettingsSection({
  title,
  description,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-primary-200 bg-primary-50/80 p-4 shadow-sm backdrop-blur-xl md:p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "inline-flex size-9 items-center justify-center rounded-xl border border-primary-200 bg-primary-100/70", children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon, size: 20, strokeWidth: 1.5 }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-base font-medium text-primary-900 text-balance", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-primary-600 text-pretty", children: description })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children })
  ] });
}
function SettingsRow({
  label,
  description,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary-900 text-balance", children: label }),
      description ? /* @__PURE__ */ jsx("p", { className: "text-xs text-primary-600 text-pretty", children: description }) : null
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex w-full items-center gap-2 md:w-auto md:justify-end", children })
  ] });
}
function SettingsRoute() {
  usePageTitle("Settings");
  const {
    settings,
    updateSettings
  } = useSettings();
  const [availableModels, setAvailableModels] = useState([]);
  const [modelsError, setModelsError] = useState(false);
  useEffect(() => {
    async function fetchModels() {
      setModelsError(false);
      try {
        const res = await fetch("/api/models");
        if (!res.ok) {
          setModelsError(true);
          return;
        }
        const data = await res.json();
        const models = Array.isArray(data.models) ? data.models : [];
        setAvailableModels(models.map((m) => ({
          id: m.id || "",
          label: m.id?.split("/").pop() || m.id || ""
        })));
      } catch {
        setModelsError(true);
      }
    }
    void fetchModels();
  }, []);
  const {
    section
  } = Route.useSearch();
  const activeSection = section ?? "claude";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-surface text-primary-900", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-0 bg-radial from-primary-400/20 via-transparent to-transparent" }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-0 bg-gradient-to-br from-primary-100/25 via-transparent to-primary-300/20" }),
    /* @__PURE__ */ jsxs("main", { className: "relative mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-6 pb-24 sm:px-6 md:flex-row md:gap-6 md:pb-8 lg:pt-8", children: [
      /* @__PURE__ */ jsx(SettingsSidebar, { activeId: activeSection }),
      /* @__PURE__ */ jsx(SettingsMobilePills, { activeId: activeSection }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-4", children: [
        activeSection === "connection" && /* @__PURE__ */ jsx(ConnectionSection, {}),
        activeSection === "claude" && /* @__PURE__ */ jsx(ClaudeConfigSection, { activeView: "claude" }),
        activeSection === "agent" && /* @__PURE__ */ jsx(ClaudeConfigSection, { activeView: "agent" }),
        activeSection === "routing" && /* @__PURE__ */ jsx(ClaudeConfigSection, { activeView: "routing" }),
        activeSection === "voice" && /* @__PURE__ */ jsx(ClaudeConfigSection, { activeView: "voice" }),
        activeSection === "display" && /* @__PURE__ */ jsx(ClaudeConfigSection, { activeView: "display" }),
        activeSection === "appearance" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(SettingsSection, { title: "Appearance", description: "Choose a workspace theme and accent color.", icon: PaintBoardIcon, children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary-900", children: "Theme" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-primary-600 text-pretty", children: "Choose the workspace palette. Light and dark variants are both available." })
            ] }),
            /* @__PURE__ */ jsx(WorkspaceThemePicker, {}),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 pt-3 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "mb-1 block font-medium text-primary-900", children: "Interface font" }),
                /* @__PURE__ */ jsxs("select", { value: settings.interfaceFont, onChange: (event) => updateSettings({
                  interfaceFont: event.target.value
                }), className: "w-full rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary-900 outline-none", children: [
                  /* @__PURE__ */ jsx("option", { value: "system", children: "System sans" }),
                  /* @__PURE__ */ jsx("option", { value: "inter", children: "Inter-style sans" }),
                  /* @__PURE__ */ jsx("option", { value: "serif", children: "Serif" }),
                  /* @__PURE__ */ jsx("option", { value: "mono", children: "Monospace" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "mb-1 block font-medium text-primary-900", children: "Spacing density" }),
                /* @__PURE__ */ jsxs("select", { value: settings.interfaceDensity, onChange: (event) => updateSettings({
                  interfaceDensity: event.target.value
                }), className: "w-full rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary-900 outline-none", children: [
                  /* @__PURE__ */ jsx("option", { value: "compact", children: "Compact" }),
                  /* @__PURE__ */ jsx("option", { value: "comfortable", children: "Comfortable" }),
                  /* @__PURE__ */ jsx("option", { value: "spacious", children: "Spacious" })
                ] })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(SettingsSection, { title: "Labs (experimental)", description: "Early/unfinished features. May change or be removed. Off by default.", icon: Settings02Icon, children: /* @__PURE__ */ jsx(SettingsRow, { label: "Echo Studio", description: "Show the Echo Studio dashboard builder (scaffold) in the nav. Experimental.", children: /* @__PURE__ */ jsx(Switch, { checked: settings.experimentalEchoStudio, onCheckedChange: (checked) => updateSettings({
            experimentalEchoStudio: checked
          }), "aria-label": "Enable Echo Studio (experimental)" }) }) })
        ] }),
        activeSection === "chat" && /* @__PURE__ */ jsx(ChatDisplaySection, {}),
        activeSection === "editor" && /* @__PURE__ */ jsxs(SettingsSection, { title: "Editor", description: "Configure Monaco defaults for the files workspace.", icon: SourceCodeSquareIcon, children: [
          /* @__PURE__ */ jsx(SettingsRow, { label: "Font size", description: "Adjust editor font size between 12 and 20.", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center gap-2 md:max-w-xs", children: [
            /* @__PURE__ */ jsx("input", { type: "range", min: 12, max: 20, value: settings.editorFontSize, onChange: (e) => updateSettings({
              editorFontSize: Number(e.target.value)
            }), className: "w-full accent-primary-900 dark:accent-primary-400", "aria-label": `Editor font size: ${settings.editorFontSize} pixels`, "aria-valuemin": 12, "aria-valuemax": 20, "aria-valuenow": settings.editorFontSize }),
            /* @__PURE__ */ jsxs("span", { className: "w-12 text-right text-sm tabular-nums text-primary-700", children: [
              settings.editorFontSize,
              "px"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(SettingsRow, { label: "Word wrap", description: "Wrap long lines in the editor by default.", children: /* @__PURE__ */ jsx(Switch, { checked: settings.editorWordWrap, onCheckedChange: (checked) => updateSettings({
            editorWordWrap: checked
          }), "aria-label": "Word wrap" }) }),
          /* @__PURE__ */ jsx(SettingsRow, { label: "Minimap", description: "Show minimap preview in Monaco editor.", children: /* @__PURE__ */ jsx(Switch, { checked: settings.editorMinimap, onCheckedChange: (checked) => updateSettings({
            editorMinimap: checked
          }), "aria-label": "Show minimap" }) })
        ] }),
        activeSection === "language" && /* @__PURE__ */ jsx(SettingsSection, { title: "Language", description: "Choose the display language for the workspace UI.", icon: Settings02Icon, children: /* @__PURE__ */ jsx(SettingsRow, { label: "Interface Language", description: "Translates navigation, labels, and buttons. Content from the agent remains in the agent's language.", children: /* @__PURE__ */ jsx("select", { value: getLocale(), onChange: (e) => {
          setLocale(e.target.value);
          window.location.reload();
        }, className: "h-9 w-full rounded-lg border border-primary-200 dark:border-gray-600 bg-primary-50 dark:bg-gray-800 px-3 text-sm text-primary-900 dark:text-gray-100 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 md:max-w-xs", children: Object.entries(LOCALE_LABELS).map(([id, label]) => /* @__PURE__ */ jsx("option", { value: id, children: label }, id)) }) }) }),
        activeSection === "notifications" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(SettingsSection, { title: "Notifications", description: "Control alert delivery and usage warning threshold.", icon: Notification03Icon, children: [
            /* @__PURE__ */ jsx(SettingsRow, { label: "Enable alerts", description: "Show usage and system alert notifications.", children: /* @__PURE__ */ jsx(Switch, { checked: settings.notificationsEnabled, onCheckedChange: (checked) => updateSettings({
              notificationsEnabled: checked
            }), "aria-label": "Enable alerts" }) }),
            /* @__PURE__ */ jsx(SettingsRow, { label: "Usage threshold", description: "Set usage warning trigger between 50% and 100%.", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center gap-2 md:max-w-xs", children: [
              /* @__PURE__ */ jsx("input", { type: "range", min: 50, max: 100, value: settings.usageThreshold, onChange: (e) => updateSettings({
                usageThreshold: Number(e.target.value)
              }), className: "w-full accent-primary-900 dark:accent-primary-400 disabled:opacity-50 disabled:cursor-not-allowed", disabled: !settings.notificationsEnabled, "aria-label": `Usage threshold: ${settings.usageThreshold} percent`, "aria-valuemin": 50, "aria-valuemax": 100, "aria-valuenow": settings.usageThreshold }),
              /* @__PURE__ */ jsxs("span", { className: "w-12 text-right text-sm tabular-nums text-primary-700", children: [
                settings.usageThreshold,
                "%"
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(SettingsSection, { title: "Smart Suggestions", description: "Get proactive model suggestions to optimize cost and quality.", icon: Settings02Icon, children: [
            /* @__PURE__ */ jsx(SettingsRow, { label: "Enable smart suggestions", description: "Suggest cheaper models for simple tasks or better models for complex work.", children: /* @__PURE__ */ jsx(Switch, { checked: settings.smartSuggestionsEnabled, onCheckedChange: (checked) => updateSettings({
              smartSuggestionsEnabled: checked
            }), "aria-label": "Enable smart suggestions" }) }),
            /* @__PURE__ */ jsx(SettingsRow, { label: "Preferred budget model", description: "Default model for cheaper suggestions (leave empty for auto-detect).", children: /* @__PURE__ */ jsxs("select", { value: settings.preferredBudgetModel, onChange: (e) => updateSettings({
              preferredBudgetModel: e.target.value
            }), className: "h-9 w-full rounded-lg border border-primary-200 dark:border-gray-600 bg-primary-50 dark:bg-gray-800 px-3 text-sm text-primary-900 dark:text-gray-100 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-500 md:max-w-xs", "aria-label": "Preferred budget model", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Auto-detect" }),
              modelsError && /* @__PURE__ */ jsx("option", { disabled: true, children: "Failed to load models" }),
              availableModels.map((model) => /* @__PURE__ */ jsx("option", { value: model.id, children: model.label }, model.id))
            ] }) }),
            /* @__PURE__ */ jsx(SettingsRow, { label: "Preferred premium model", description: "Default model for upgrade suggestions (leave empty for auto-detect).", children: /* @__PURE__ */ jsxs("select", { value: settings.preferredPremiumModel, onChange: (e) => updateSettings({
              preferredPremiumModel: e.target.value
            }), className: "h-9 w-full rounded-lg border border-primary-200 dark:border-gray-600 bg-primary-50 dark:bg-gray-800 px-3 text-sm text-primary-900 dark:text-gray-100 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-500 md:max-w-xs", "aria-label": "Preferred premium model", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Auto-detect" }),
              modelsError && /* @__PURE__ */ jsx("option", { disabled: true, children: "Failed to load models" }),
              availableModels.map((model) => /* @__PURE__ */ jsx("option", { value: model.id, children: model.label }, model.id))
            ] }) }),
            /* @__PURE__ */ jsx(SettingsRow, { label: "Only suggest cheaper models", description: "Never suggest upgrades, only suggest cheaper alternatives.", children: /* @__PURE__ */ jsx(Switch, { checked: settings.onlySuggestCheaper, onCheckedChange: (checked) => updateSettings({
              onlySuggestCheaper: checked
            }), "aria-label": "Only suggest cheaper models" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("footer", { className: "mt-auto pt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-2xl border border-primary-200 bg-primary-50/70 p-3 text-sm text-primary-600 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Settings02Icon, size: 20, strokeWidth: 1.5 }),
          /* @__PURE__ */ jsx("span", { className: "text-pretty", children: "Changes are saved automatically to local storage." })
        ] }) })
      ] })
    ] })
  ] });
}
function ChatDisplaySection() {
  const {
    settings: chatSettings,
    updateSettings: updateChatSettings
  } = useChatSettingsStore();
  const {
    settings,
    updateSettings
  } = useSettings();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(SettingsSection, { title: "Chat Display", description: "Control what's visible in chat messages.", icon: MessageMultiple01Icon, children: [
    /* @__PURE__ */ jsx(SettingsRow, { label: "Show tool messages", description: "Display tool call details when the agent uses tools.", children: /* @__PURE__ */ jsx(Switch, { checked: chatSettings.showToolMessages, onCheckedChange: (checked) => updateChatSettings({
      showToolMessages: checked
    }), "aria-label": "Show tool messages" }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Show reasoning blocks", description: "Display model thinking and reasoning process.", children: /* @__PURE__ */ jsx(Switch, { checked: chatSettings.showReasoningBlocks, onCheckedChange: (checked) => updateChatSettings({
      showReasoningBlocks: checked
    }), "aria-label": "Show reasoning blocks" }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Sound on response complete", description: "Play a short sound in the browser when the agent finishes replying.", children: /* @__PURE__ */ jsx(Switch, { checked: chatSettings.soundOnChatComplete, onCheckedChange: (checked) => updateChatSettings({
      soundOnChatComplete: checked
    }), "aria-label": "Sound on response complete" }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Enter key behavior", description: chatSettings.enterBehavior === "newline" ? "Enter inserts a newline. Use ⌘/Ctrl+Enter to send." : "Enter sends the message. Use Shift+Enter for a newline.", children: /* @__PURE__ */ jsx(Switch, { checked: chatSettings.enterBehavior === "newline", onCheckedChange: (checked) => updateChatSettings({
      enterBehavior: checked ? "newline" : "send"
    }), "aria-label": "Enter inserts newline instead of sending" }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Chat content width", description: "Controls the max-width of the message column on wide screens.", children: /* @__PURE__ */ jsxs("select", { value: chatSettings.chatWidth, onChange: (e) => updateChatSettings({
      chatWidth: e.target.value
    }), className: "h-8 rounded-md border border-primary-200 bg-primary-50 px-2 text-sm text-primary-900 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-400", "aria-label": "Chat content width", children: [
      /* @__PURE__ */ jsx("option", { value: "comfortable", children: "Comfortable (900px)" }),
      /* @__PURE__ */ jsx("option", { value: "wide", children: "Wide (1200px)" }),
      /* @__PURE__ */ jsx("option", { value: "full", children: "Full width" })
    ] }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Expand sidebar on hover", description: chatSettings.sidebarHoverExpand ? "Collapsed sidebar expands temporarily when you hover over it." : "Collapsed sidebar stays at 48px. Click the toggle to open (default).", children: /* @__PURE__ */ jsx(Switch, { checked: chatSettings.sidebarHoverExpand, onCheckedChange: (checked) => updateChatSettings({
      sidebarHoverExpand: checked
    }), "aria-label": "Expand sidebar on hover" }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Show usage meter", description: "Show the floating usage/provider pill in chat. Off by default to keep the composer clean.", children: /* @__PURE__ */ jsx(Switch, { checked: settings.showUsageMeter, onCheckedChange: (checked) => updateSettings({
      showUsageMeter: checked
    }), "aria-label": "Show usage meter" }) })
  ] }) });
}
process.env.HERMES_API_URL || process.env.CLAUDE_API_URL || "http://127.0.0.1:8642";
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function resolveCustomBaseUrlFromConfig(config, activeProvider) {
  const providersConfig = config.providers;
  const customBlock = providersConfig?.manifest || providersConfig?.custom;
  let url = typeof customBlock?.base_url === "string" ? customBlock.base_url.trim() : "";
  if (!url && Array.isArray(config.custom_providers)) {
    const aid = activeProvider.trim().toLowerCase();
    for (const e of config.custom_providers) {
      if (!e || typeof e !== "object" || Array.isArray(e)) continue;
      const rec = e;
      const name = String(rec.name ?? "").trim().toLowerCase();
      if (name && name === aid && typeof rec.base_url === "string") {
        url = rec.base_url.trim();
        break;
      }
    }
  }
  if (!url && typeof config.base_url === "string") {
    const top = config.base_url.trim();
    if (top) url = top;
  }
  return url;
}
function readFallbackInputsFromConfig(config) {
  const fb = config.fallback_model;
  if (!fb || typeof fb !== "object" || Array.isArray(fb)) {
    return {
      provider: "",
      model: "",
      baseUrl: ""
    };
  }
  const o = fb;
  return {
    provider: typeof o.provider === "string" ? o.provider : "",
    model: typeof o.model === "string" ? o.model : "",
    baseUrl: typeof o.base_url === "string" ? o.base_url : ""
  };
}
function normalizeCustomProviderEntry(entry) {
  const name = typeof entry.name === "string" ? entry.name.trim() : "";
  const title = typeof entry.title === "string" ? entry.title.trim() : "";
  const base_url = typeof entry.base_url === "string" ? entry.base_url.trim() : "";
  const api_key = typeof entry.api_key === "string" ? entry.api_key : void 0;
  const api_mode = typeof entry.api_mode === "string" ? entry.api_mode : void 0;
  return {
    name,
    title,
    base_url,
    api_key,
    api_mode
  };
}
function urlNormForDedupe(url) {
  return url.trim().toLowerCase().replace(/\/+$/, "");
}
function entryCoveredByCustomProviderList(name, baseUrl, list) {
  const n = name.trim().toLowerCase();
  const u = baseUrl.trim() ? urlNormForDedupe(baseUrl) : "";
  for (const raw of list) {
    const e = normalizeCustomProviderEntry(raw);
    const en = e.name.toLowerCase();
    const eu = e.base_url ? urlNormForDedupe(e.base_url) : "";
    if (n && en && n === en) return true;
    if (u && eu && u === eu) return true;
  }
  return false;
}
function readManifestBlockBaseUrl(config) {
  const providersConfig = config.providers;
  const customBlock = providersConfig?.manifest || providersConfig?.custom;
  return typeof customBlock?.base_url === "string" ? customBlock.base_url.trim() : "";
}
function deriveCustomProviderNameFromBaseUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/[^a-zA-Z0-9-]+/g, "-");
    return host ? `ep-${host}` : "custom-endpoint";
  } catch {
    return "custom-endpoint";
  }
}
function suggestCustomProviderTitle(model, baseUrl) {
  let modelPart = (model || "").trim();
  const lastSeg = modelPart.includes("/") ? modelPart.split("/").pop() || modelPart : modelPart;
  modelPart = (lastSeg || "model").replace(/\.gguf$/i, "");
  const dashIdx = modelPart.indexOf("-");
  if (dashIdx > 0) modelPart = modelPart.slice(0, dashIdx);
  modelPart = modelPart.replace(/[^a-zA-Z0-9.]/g, "") || "Model";
  let hostPart = "Host";
  try {
    const h = new URL(baseUrl.trim()).hostname;
    hostPart = h.split(".")[0] || h;
  } catch {
  }
  const capHost = hostPart ? hostPart.charAt(0).toUpperCase() + hostPart.slice(1).toLowerCase() : "Host";
  return `${modelPart}.${capHost}`;
}
function slugifyCustomProviderId(title, baseUrl) {
  const t = title.trim();
  if (t) {
    let s = t.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (s.length > 56) s = s.slice(0, 56);
    if (s) return s;
  }
  return deriveCustomProviderNameFromBaseUrl(baseUrl || "http://127.0.0.1");
}
function mergeModelForManifestSave(config, modelInputTrimmed) {
  const existing = config.model;
  if (typeof existing === "object" && existing !== null && !Array.isArray(existing)) {
    const o = {
      ...existing
    };
    o.provider = "manifest";
    if (typeof o.default !== "string" || !o.default.trim()) {
      if (modelInputTrimmed) o.default = modelInputTrimmed;
    }
    return o;
  }
  if (typeof existing === "string" && existing.trim()) {
    return {
      default: existing.trim(),
      provider: "manifest"
    };
  }
  if (modelInputTrimmed) {
    return {
      default: modelInputTrimmed,
      provider: "manifest"
    };
  }
  return {
    provider: "manifest"
  };
}
function ClaudeConfigSection({
  activeView = "claude"
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [keyInput, setKeyInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [providerInput, setProviderInput] = useState("");
  const [baseUrlInput, setBaseUrlInput] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");
  const [customBaseUrl, setCustomBaseUrl] = useState("");
  const [editingCustomKey, setEditingCustomKey] = useState(false);
  const [editingCustomBaseUrl, setEditingCustomBaseUrl] = useState(false);
  const [addCpTitle, setAddCpTitle] = useState("");
  const [addCpProviderId, setAddCpProviderId] = useState("");
  const [addCpBaseUrl, setAddCpBaseUrl] = useState("");
  const [addCpYamlKey, setAddCpYamlKey] = useState("");
  const [fallbackProviderInput, setFallbackProviderInput] = useState("");
  const [fallbackModelInput, setFallbackModelInput] = useState("");
  const [fallbackBaseUrlInput, setFallbackBaseUrlInput] = useState("");
  const [showFallbackRow, setShowFallbackRow] = useState(false);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const syncInputsFromData = useCallback((configData) => {
    const cfg = configData.config;
    setModelInput(configData.activeModel || "");
    setProviderInput(configData.activeProvider || "");
    setBaseUrlInput(cfg.base_url || "");
    const fb = readFallbackInputsFromConfig(cfg);
    setFallbackProviderInput(fb.provider);
    setFallbackModelInput(fb.model);
    setFallbackBaseUrlInput(fb.baseUrl);
    setShowFallbackRow(Boolean(fb.provider || fb.model || fb.baseUrl));
    setCustomBaseUrl(readManifestBlockBaseUrl(cfg));
  }, []);
  const fetchConfig = useCallback(async () => {
    const res = await fetch("/api/claude-config");
    const configData = await res.json();
    setData(configData);
    syncInputsFromData(configData);
    return configData;
  }, [syncInputsFromData]);
  const fetchModelsForProvider = useCallback(async (provider) => {
    if (!provider) {
      setAvailableModels([]);
      return;
    }
    setLoadingModels(true);
    try {
      const res = await fetch(`/api/claude-proxy/api/available-models?provider=${encodeURIComponent(provider)}`);
      if (res.ok) {
        const result = await res.json();
        setAvailableModels(result.models);
        if (result.providers.length > 0) setAvailableProviders(result.providers);
      }
    } catch {
    }
    setLoadingModels(false);
  }, []);
  useEffect(() => {
    fetchConfig().then((configData) => {
      setLoading(false);
      if (configData.activeProvider) {
        void fetchModelsForProvider(configData.activeProvider);
      }
    }).catch(() => setLoading(false));
  }, [fetchConfig, fetchModelsForProvider]);
  const saveConfig = async (updates) => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/claude-config", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      });
      const result = await res.json();
      setSaveMessage(result.message || "Saved");
      const refreshData = await fetchConfig();
      if (refreshData.activeProvider) {
        void fetchModelsForProvider(refreshData.activeProvider);
      }
      setTimeout(() => setSaveMessage(null), 3e3);
    } catch {
      setSaveMessage("Failed to save");
    }
    setSaving(false);
  };
  const selectClassName = "h-9 w-full rounded-lg border border-primary-200 bg-primary-50 px-3 text-sm text-primary-900 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 md:max-w-sm";
  const readNumber = (value, fallback) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const readBoolean = (value, fallback) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value === "true";
    return fallback;
  };
  const saveNumberField = (section, field, rawValue, fallback) => {
    const value = rawValue === "" ? fallback : Number(rawValue);
    if (!Number.isFinite(value)) return;
    void saveConfig({
      config: {
        [section]: {
          [field]: value
        }
      }
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsx(SettingsSection, { title: "Hermes Agent", description: "Loading configuration...", icon: Settings02Icon, children: /* @__PURE__ */ jsx("div", { className: "h-20 animate-pulse rounded-lg", style: {
      backgroundColor: "var(--theme-panel)"
    } }) });
  }
  if (!data) {
    return /* @__PURE__ */ jsx(SettingsSection, { title: "Hermes Agent", description: "Could not load Hermes configuration.", icon: Settings02Icon, children: /* @__PURE__ */ jsx("p", { className: "text-sm", style: {
      color: "var(--theme-muted)"
    }, children: "Make sure Hermes Agent is running on localhost:8642" }) });
  }
  const memoryConfig = asRecord(data.config.memory);
  const terminalConfig = asRecord(data.config.terminal);
  const displayConfig = asRecord(data.config.display);
  const agentConfig = asRecord(data.config.agent);
  const smartRouting = asRecord(data.config.smart_model_routing);
  const ttsConfig = asRecord(data.config.tts);
  const sttConfig = asRecord(data.config.stt);
  const customProviders = Array.isArray(data.config.custom_providers) ? data.config.custom_providers : [];
  const resolvedCustomBaseUrl = resolveCustomBaseUrlFromConfig(data.config, data.activeProvider);
  const customProviderCatalogEntry = data.providers.find((p) => p.id === "custom");
  const customApiKeyConfigured = Boolean(customProviderCatalogEntry?.configured);
  const customEndpointConfigured = customApiKeyConfigured || Boolean(resolvedCustomBaseUrl);
  const manifestBlockOnlyUrl = readManifestBlockBaseUrl(data.config);
  const primaryConfigBaseUrl = typeof data.config.base_url === "string" ? data.config.base_url.trim() : "";
  const primaryConfigProvider = (data.activeProvider || "").trim();
  const extraPrimaryNotInList = primaryConfigProvider && primaryConfigBaseUrl && !entryCoveredByCustomProviderList(primaryConfigProvider, primaryConfigBaseUrl, customProviders) ? {
    name: primaryConfigProvider,
    base_url: primaryConfigBaseUrl
  } : null;
  const extraManifestNotInList = manifestBlockOnlyUrl && !entryCoveredByCustomProviderList("", manifestBlockOnlyUrl, customProviders) && urlNormForDedupe(manifestBlockOnlyUrl) !== urlNormForDedupe(primaryConfigBaseUrl || "") && !(extraPrimaryNotInList && urlNormForDedupe(manifestBlockOnlyUrl) === urlNormForDedupe(extraPrimaryNotInList.base_url)) ? {
    base_url: manifestBlockOnlyUrl
  } : null;
  function persistCustomProviderRow(name, base_url, opts) {
    const n = name.trim();
    const u = base_url.trim();
    if (!n || !u) {
      setSaveMessage("Provider id and base URL are both required to save a row.");
      setTimeout(() => setSaveMessage(null), 4e3);
      return;
    }
    const others = customProviders.filter((e) => String(e.name ?? "").trim() !== n);
    const prev = customProviders.find((e) => String(e.name ?? "").trim() === n);
    const api_mode = prev && typeof prev.api_mode === "string" && prev.api_mode ? prev.api_mode : "chat_completions";
    let rowApi;
    if (opts && "yamlApiKey" in opts) {
      const trimmed = opts.yamlApiKey?.trim() ?? "";
      rowApi = trimmed || void 0;
    } else if (prev && typeof prev.api_key === "string" && prev.api_key) {
      rowApi = prev.api_key;
    } else if (n === "ollama" || n === "atomic-chat") {
      rowApi = n;
    }
    const row = {
      name: n,
      base_url: u,
      api_mode
    };
    if (opts?.title?.trim()) row.title = opts.title.trim();
    else if (prev && typeof prev.title === "string" && prev.title.trim()) {
      row.title = prev.title.trim();
    }
    if (rowApi) row.api_key = rowApi;
    void saveConfig({
      config: {
        custom_providers: [row, ...others]
      }
    });
  }
  function submitAddCustomProviderForm() {
    const title = addCpTitle.trim();
    const url = addCpBaseUrl.trim();
    if (!title) {
      setSaveMessage("Add a title so you can recognize this endpoint (e.g. Qwen3.6.Eclipse).");
      setTimeout(() => setSaveMessage(null), 4e3);
      return;
    }
    if (!url) {
      setSaveMessage("Base URL is required.");
      setTimeout(() => setSaveMessage(null), 4e3);
      return;
    }
    const id = addCpProviderId.trim() || slugifyCustomProviderId(title, url);
    persistCustomProviderRow(id, url, {
      title,
      yamlApiKey: addCpYamlKey
    });
    setAddCpTitle("");
    setAddCpProviderId("");
    setAddCpBaseUrl("");
    setAddCpYamlKey("");
  }
  function saveCurrentToCustomProvidersList() {
    if (!providerInput.trim() || !baseUrlInput.trim()) {
      setSaveMessage("Enter both provider and base URL in Model & Provider, then try again.");
      setTimeout(() => setSaveMessage(null), 4e3);
      return;
    }
    const bu = baseUrlInput.trim();
    persistCustomProviderRow(providerInput.trim(), bu, {
      title: suggestCustomProviderTitle(modelInput, bu)
    });
  }
  function applyCustomProviderFromList(entry) {
    const n = normalizeCustomProviderEntry(entry);
    if (!n.name) return;
    setProviderInput(n.name);
    setBaseUrlInput(n.base_url);
    void fetchModelsForProvider(n.name);
  }
  function removeCustomProviderAt(index) {
    const next = customProviders.filter((_, i) => i !== index);
    void saveConfig({
      config: {
        custom_providers: next
      }
    });
  }
  const ttsProvider = ttsConfig.provider || "edge";
  const ttsEdge = asRecord(ttsConfig.edge);
  const ttsElevenLabs = asRecord(ttsConfig.elevenlabs);
  const ttsOpenAi = asRecord(ttsConfig.openai);
  const sttProvider = sttConfig.provider || "local";
  const sttLocal = asRecord(sttConfig.local);
  const sttGroq = asRecord(sttConfig.groq);
  const manifestBaseUrlOnly = readManifestBlockBaseUrl(data.config);
  const renderClaudeOverview = () => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(SettingsSection, { title: "Model & Provider", description: "Configure the default AI model for Hermes Agent.", icon: SourceCodeSquareIcon, children: [
      /* @__PURE__ */ jsx(SettingsRow, { label: "Provider", description: "Select the inference provider.", children: /* @__PURE__ */ jsx("div", { className: "flex w-full max-w-sm gap-2", children: availableProviders.length > 0 ? /* @__PURE__ */ jsx("select", { value: providerInput, onChange: (e) => {
        const newProvider = e.target.value;
        setProviderInput(newProvider);
        setModelInput("");
        void fetchModelsForProvider(newProvider);
      }, className: selectClassName, children: availableProviders.map((p) => /* @__PURE__ */ jsxs("option", { value: p.id, children: [
        p.label,
        p.authenticated ? " ✓" : ""
      ] }, p.id)) }) : /* @__PURE__ */ jsx(Input, { value: providerInput, onChange: (e) => setProviderInput(e.target.value), placeholder: "e.g. ollama, anthropic, openai-codex", className: "flex-1" }) }) }),
      /* @__PURE__ */ jsx(SettingsRow, { label: "Model", description: "The model Claude uses for conversations.", children: /* @__PURE__ */ jsx("div", { className: "flex w-full max-w-sm gap-2", children: availableModels.length > 0 ? /* @__PURE__ */ jsxs("select", { value: modelInput, onChange: (e) => setModelInput(e.target.value), className: `${selectClassName} font-mono`, children: [
        !availableModels.some((m) => m.id === modelInput) && modelInput && /* @__PURE__ */ jsxs("option", { value: modelInput, children: [
          modelInput,
          " (current)"
        ] }),
        availableModels.map((m) => /* @__PURE__ */ jsxs("option", { value: m.id, children: [
          m.id,
          m.description ? ` — ${m.description}` : ""
        ] }, m.id))
      ] }) : /* @__PURE__ */ jsx(Input, { value: modelInput, onChange: (e) => setModelInput(e.target.value), placeholder: loadingModels ? "Loading models..." : "e.g. qwen3.5:35b", className: "flex-1 font-mono" }) }) }),
      /* @__PURE__ */ jsx(SettingsRow, { label: "Base URL", description: "For local providers (Ollama, LM Studio, MLX). Leave blank for cloud.", children: /* @__PURE__ */ jsx("div", { className: "flex w-full max-w-sm gap-2", children: /* @__PURE__ */ jsx(Input, { value: baseUrlInput, onChange: (e) => setBaseUrlInput(e.target.value), placeholder: "e.g. http://localhost:11434/v1", className: "flex-1 font-mono text-sm" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-200 bg-white/80 px-3 py-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary-900", children: "Fallback model (optional)" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-primary-600", children: "Used only if the primary model fails. Keep empty to disable — avoids mixing this up with your main provider (for example OpenRouter only here, local primary above)." })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "outline", className: "shrink-0", onClick: () => setShowFallbackRow((v) => !v), children: showFallbackRow ? "Hide fallback fields" : "Show fallback fields" })
        ] }),
        showFallbackRow ? /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-3 border-t border-primary-200 pt-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-primary-600", children: "Fallback provider" }),
              /* @__PURE__ */ jsx(Input, { value: fallbackProviderInput, onChange: (e) => setFallbackProviderInput(e.target.value), placeholder: "e.g. openrouter", className: "font-mono text-sm" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-primary-600", children: "Fallback model id" }),
              /* @__PURE__ */ jsx(Input, { value: fallbackModelInput, onChange: (e) => setFallbackModelInput(e.target.value), placeholder: "provider/model or model id", className: "font-mono text-sm" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-primary-600", children: "Fallback base URL" }),
            /* @__PURE__ */ jsx(Input, { value: fallbackBaseUrlInput, onChange: (e) => setFallbackBaseUrlInput(e.target.value), placeholder: "Leave blank for hosted APIs", className: "font-mono text-sm" })
          ] })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsx(Button, { size: "sm", disabled: saving, onClick: () => {
        const hasFallback = fallbackProviderInput.trim() || fallbackModelInput.trim() || fallbackBaseUrlInput.trim();
        const configUpdate = {
          model: modelInput.trim(),
          provider: providerInput.trim(),
          base_url: baseUrlInput.trim() || null
        };
        if (hasFallback) {
          configUpdate.fallback_model = {
            provider: fallbackProviderInput.trim(),
            model: fallbackModelInput.trim(),
            base_url: fallbackBaseUrlInput.trim() || null
          };
        } else {
          configUpdate.fallback_model = null;
        }
        void saveConfig({
          config: configUpdate
        });
      }, children: saving ? "Saving..." : "Save Model" }) })
    ] }),
    /* @__PURE__ */ jsx(SettingsSection, { title: "API Keys", description: "Manage provider API keys stored in ~/.hermes/.env", icon: CloudIcon, children: data.providers.filter((p) => p.envKeys.length > 0 && p.id !== "custom").map((provider) => /* @__PURE__ */ jsx(SettingsRow, { label: provider.name, description: provider.configured ? "✅ Configured" : "❌ Not configured", children: /* @__PURE__ */ jsx("div", { className: "flex w-full max-w-sm items-center gap-2", children: provider.envKeys.map((envKey) => /* @__PURE__ */ jsx("div", { className: "flex-1", children: editingKey === envKey ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(Input, { type: "password", value: keyInput, onChange: (e) => setKeyInput(e.target.value), placeholder: `Enter ${envKey}`, className: "flex-1" }),
      /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => {
        void saveConfig({
          env: {
            [envKey]: keyInput
          }
        });
        setEditingKey(null);
        setKeyInput("");
      }, children: "Save" }),
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
        setEditingKey(null);
        setKeyInput("");
      }, children: "✕" })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-mono", style: {
        color: "var(--theme-muted)"
      }, children: provider.maskedKeys[envKey] || "Not set" }),
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
        setEditingKey(envKey);
        setKeyInput("");
      }, children: provider.configured ? "Change" : "Add" })
    ] }) }, envKey)) }) }, provider.id)) }),
    /* @__PURE__ */ jsxs(SettingsSection, { title: "Memory", description: "Configure Hermes Agent memory and user profiles.", icon: UserIcon, children: [
      /* @__PURE__ */ jsx(SettingsRow, { label: "Memory enabled", description: "Store and recall memories across sessions.", children: /* @__PURE__ */ jsx(Switch, { checked: memoryConfig.memory_enabled !== false, onCheckedChange: (checked) => void saveConfig({
        config: {
          memory: {
            memory_enabled: checked
          }
        }
      }) }) }),
      /* @__PURE__ */ jsx(SettingsRow, { label: "User profile", description: "Remember user preferences and context.", children: /* @__PURE__ */ jsx(Switch, { checked: memoryConfig.user_profile_enabled !== false, onCheckedChange: (checked) => void saveConfig({
        config: {
          memory: {
            user_profile_enabled: checked
          }
        }
      }) }) })
    ] }),
    /* @__PURE__ */ jsxs(SettingsSection, { title: "Terminal", description: "Shell execution settings.", icon: SourceCodeSquareIcon, children: [
      /* @__PURE__ */ jsx(SettingsRow, { label: "Backend", description: "Terminal execution backend.", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-mono", style: {
        color: "var(--theme-muted)"
      }, children: terminalConfig.backend || "local" }) }),
      /* @__PURE__ */ jsx(SettingsRow, { label: "Timeout", description: "Max seconds for terminal commands.", children: /* @__PURE__ */ jsx(Input, { type: "number", min: 10, value: readNumber(terminalConfig.timeout, 180), onChange: (e) => saveNumberField("terminal", "timeout", e.target.value, 180), className: "md:w-28" }) })
    ] }),
    /* @__PURE__ */ jsxs(SettingsSection, { title: "Custom Providers", description: "Configure a custom OpenAI-compatible endpoint. Add named rows (with a title like Qwen3.6.Eclipse) to custom_providers; optional manifest env key and URL below only apply if you use that path.", icon: CloudIcon, children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-xl border border-primary-200 bg-primary-50/80 p-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary-900", children: "Add custom provider" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-primary-600", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Title" }),
            " is for your list only (e.g.",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: "Qwen3.6.Eclipse" }),
            " = model + host).",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Provider id" }),
            " is the config name Hermes uses — leave blank to derive a safe id from the title. Optional row API key is stored on this provider entry, not in .env."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "space-y-1 md:col-span-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-primary-600", children: "Title" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center", children: [
              /* @__PURE__ */ jsx(Input, { value: addCpTitle, onChange: (e) => setAddCpTitle(e.target.value), placeholder: "e.g. Qwen3.6.Eclipse", className: "font-mono text-sm sm:flex-1" }),
              /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", className: "shrink-0", onClick: () => setAddCpTitle(suggestCustomProviderTitle(modelInput, addCpBaseUrl.trim() || baseUrlInput)), children: "Suggest from model + URL" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-primary-600", children: "Provider id (optional)" }),
            /* @__PURE__ */ jsx(Input, { value: addCpProviderId, onChange: (e) => setAddCpProviderId(e.target.value), placeholder: "e.g. ECLIPSE", className: "font-mono text-sm" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-primary-600", children: "Base URL" }),
            /* @__PURE__ */ jsx(Input, { value: addCpBaseUrl, onChange: (e) => setAddCpBaseUrl(e.target.value), placeholder: "http://host:11434/v1", className: "font-mono text-sm" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "h-auto px-0 py-0 text-xs text-primary-700 underline", onClick: () => {
            setAddCpBaseUrl(baseUrlInput.trim());
            setAddCpTitle((t) => t.trim() ? t : suggestCustomProviderTitle(modelInput, baseUrlInput.trim()));
          }, children: "Prefill from Model & Provider above" }) }),
          /* @__PURE__ */ jsxs("label", { className: "space-y-1 md:col-span-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-primary-600", children: "Optional API key (this row only)" }),
            /* @__PURE__ */ jsx(Input, { type: "password", value: addCpYamlKey, onChange: (e) => setAddCpYamlKey(e.target.value), placeholder: "Leave blank if the server needs no key", className: "font-mono text-sm" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", disabled: saving, onClick: () => submitAddCustomProviderForm(), children: "Add to custom providers list" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-x-auto rounded-xl border border-primary-200 bg-white/90", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 border-b border-primary-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-primary-700", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-primary-900", children: "Saved & detected endpoints" }),
            /* @__PURE__ */ jsxs("span", { className: "text-primary-600", children: [
              " ",
              "(",
              customProviders.length + (extraPrimaryNotInList ? 1 : 0) + (extraManifestNotInList ? 1 : 0),
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "outline", disabled: saving, onClick: () => saveCurrentToCustomProvidersList(), children: "Save current model setup to list" })
        ] }),
        /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[720px] border-collapse text-sm", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-primary-200 bg-primary-100/70 text-left text-[11px] font-semibold uppercase tracking-wide text-primary-600", children: [
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Source" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Title" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Provider id" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Base URL" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            customProviders.length === 0 && !extraPrimaryNotInList && !extraManifestNotInList ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 5, className: "px-3 py-4 text-xs leading-relaxed text-primary-600", children: [
              "No rows in ",
              /* @__PURE__ */ jsx("span", { className: "font-mono", children: "custom_providers" }),
              " yet, and no primary base URL or manifest URL was detected. Use",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Add custom provider" }),
              ', or set Model & Provider and click "Save current model setup to list".'
            ] }) }) : null,
            customProviders.map((raw, index) => {
              const entry = normalizeCustomProviderEntry(raw);
              const key = entry.name || `idx-${index}`;
              return /* @__PURE__ */ jsxs("tr", { className: "border-b border-primary-100 odd:bg-primary-50/40", children: [
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 align-top text-xs text-primary-600", children: "Saved" }),
                /* @__PURE__ */ jsx("td", { className: "max-w-[160px] px-3 py-2 align-top text-xs font-medium text-primary-900 break-words", children: entry.title || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 align-top font-mono text-xs text-primary-800", children: entry.name || "—" }),
                /* @__PURE__ */ jsx("td", { className: "max-w-[240px] px-3 py-2 align-top font-mono text-xs text-primary-700 break-all", children: entry.base_url || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 align-top text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-end gap-1.5", children: [
                  /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "outline", disabled: saving || !entry.name, onClick: () => applyCustomProviderFromList(raw), children: "Apply" }),
                  /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "ghost", className: "text-red-700 hover:text-red-800", disabled: saving, onClick: () => removeCustomProviderAt(index), "aria-label": `Remove ${entry.name || "custom provider"}`, children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Delete02Icon, size: 16, strokeWidth: 1.5 }) })
                ] }) })
              ] }, `saved-${key}-${index}`);
            }),
            extraPrimaryNotInList ? /* @__PURE__ */ jsxs("tr", { className: "border-b border-primary-100 bg-amber-50/50", children: [
              /* @__PURE__ */ jsx("td", { className: "px-3 py-2 align-top text-xs text-amber-900", children: "Active (not in list)" }),
              /* @__PURE__ */ jsx("td", { className: "max-w-[160px] px-3 py-2 align-top text-xs text-primary-800 break-words", children: suggestCustomProviderTitle(modelInput, extraPrimaryNotInList.base_url) }),
              /* @__PURE__ */ jsx("td", { className: "px-3 py-2 align-top font-mono text-xs font-medium text-primary-900", children: extraPrimaryNotInList.name }),
              /* @__PURE__ */ jsx("td", { className: "max-w-[240px] px-3 py-2 align-top font-mono text-xs text-primary-700 break-all", children: extraPrimaryNotInList.base_url }),
              /* @__PURE__ */ jsx("td", { className: "px-3 py-2 align-top text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-end gap-1.5", children: [
                /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "outline", disabled: saving, onClick: () => {
                  setProviderInput(extraPrimaryNotInList.name);
                  setBaseUrlInput(extraPrimaryNotInList.base_url);
                  void fetchModelsForProvider(extraPrimaryNotInList.name);
                }, children: "Apply" }),
                /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "outline", disabled: saving, onClick: () => persistCustomProviderRow(extraPrimaryNotInList.name, extraPrimaryNotInList.base_url, {
                  title: suggestCustomProviderTitle(modelInput, extraPrimaryNotInList.base_url)
                }), children: "Add to list" })
              ] }) })
            ] }) : null,
            extraManifestNotInList ? /* @__PURE__ */ jsxs("tr", { className: "border-b border-primary-100 bg-sky-50/50", children: [
              /* @__PURE__ */ jsx("td", { className: "px-3 py-2 align-top text-xs text-sky-900", children: "Manifest block" }),
              /* @__PURE__ */ jsx("td", { className: "max-w-[160px] px-3 py-2 align-top text-xs text-primary-800 break-words", children: (() => {
                try {
                  const h = new URL(extraManifestNotInList.base_url).hostname;
                  const short = h.split(".")[0] || h;
                  return `Manifest.${short.charAt(0).toUpperCase()}${short.slice(1).toLowerCase()}`;
                } catch {
                  return "Manifest";
                }
              })() }),
              /* @__PURE__ */ jsx("td", { className: "px-3 py-2 align-top font-mono text-xs text-primary-600", children: "(env key path)" }),
              /* @__PURE__ */ jsx("td", { className: "max-w-[240px] px-3 py-2 align-top font-mono text-xs text-primary-700 break-all", children: extraManifestNotInList.base_url }),
              /* @__PURE__ */ jsx("td", { className: "px-3 py-2 align-top text-right", children: /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "outline", disabled: saving, onClick: () => {
                const u = extraManifestNotInList.base_url;
                persistCustomProviderRow(deriveCustomProviderNameFromBaseUrl(u), u, {
                  title: (() => {
                    try {
                      const h = new URL(u).hostname;
                      const short = h.split(".")[0] || h;
                      return `Manifest.${short.charAt(0).toUpperCase()}${short.slice(1).toLowerCase()}`;
                    } catch {
                      return "Manifest";
                    }
                  })()
                });
              }, children: "Add to list" }) })
            ] }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(SettingsRow, { label: "Manifest: CUSTOM_API_KEY", description: customApiKeyConfigured ? "✅ Saved in ~/.hermes/.env for the manifest OpenAI provider." : customEndpointConfigured ? "○ Not set — optional when your endpoint is local or needs no env key." : "○ Optional. Leave blank if you do not use providers.manifest + CUSTOM_API_KEY.", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full max-w-sm flex-col gap-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-primary-500", children: "Leave blank if unused. Add only when your manifest integration requires this key." }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("div", { className: "flex-1", children: editingCustomKey ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(Input, { type: "password", value: customApiKey, onChange: (e) => setCustomApiKey(e.target.value), placeholder: "Leave blank to clear saved key", className: "min-w-[12rem] flex-1" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => {
            void saveConfig({
              env: {
                CUSTOM_API_KEY: customApiKey.trim() ? customApiKey.trim() : null
              }
            });
            setEditingCustomKey(false);
          }, children: "Save" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => setEditingCustomKey(false), children: "✕" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-mono", style: {
            color: "var(--theme-muted)"
          }, children: customApiKeyConfigured ? customProviderCatalogEntry.maskedKeys["CUSTOM_API_KEY"] || "Set" : "Not set" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
            setEditingCustomKey(true);
            setCustomApiKey("");
          }, children: customApiKeyConfigured ? "Change" : "Add" })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(SettingsRow, { label: "Manifest: base URL", description: manifestBaseUrlOnly ? `✅ ${manifestBaseUrlOnly}` : "○ Optional — only if you use providers.manifest (separate from primary base URL).", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full max-w-sm flex-col gap-1", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-primary-500", children: [
          "This updates ",
          /* @__PURE__ */ jsx("span", { className: "font-mono", children: "providers.manifest" }),
          " only. Primary model base URL stays under Model & Provider."
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("div", { className: "flex-1", children: editingCustomBaseUrl ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(Input, { value: customBaseUrl, onChange: (e) => setCustomBaseUrl(e.target.value), placeholder: "http://127.0.0.1:8080/v1", className: "min-w-[12rem] flex-1 font-mono text-sm" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => {
            const u = customBaseUrl.trim();
            if (!u) {
              setSaveMessage("Enter a manifest base URL, or cancel.");
              setTimeout(() => setSaveMessage(null), 3e3);
              return;
            }
            void saveConfig({
              config: {
                model: mergeModelForManifestSave(data.config, modelInput.trim()),
                providers: {
                  manifest: {
                    type: "openai",
                    base_url: u,
                    key_env: "CUSTOM_API_KEY"
                  }
                }
              }
            });
            setEditingCustomBaseUrl(false);
          }, children: "Save" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
            setEditingCustomBaseUrl(false);
            setCustomBaseUrl(manifestBaseUrlOnly);
          }, children: "✕" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-mono", style: {
            color: "var(--theme-muted)"
          }, children: manifestBaseUrlOnly || "Not set" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
            setCustomBaseUrl(manifestBaseUrlOnly);
            setEditingCustomBaseUrl(true);
          }, children: manifestBaseUrlOnly ? "Edit" : "Add" })
        ] }) }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(SettingsSection, { title: "About", description: "Hermes Agent runtime information.", icon: Notification03Icon, children: [
      /* @__PURE__ */ jsx(SettingsRow, { label: "Config location", description: "Where Claude stores its configuration.", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-mono", style: {
        color: "var(--theme-muted)"
      }, children: data.claudeHome }) }),
      /* @__PURE__ */ jsx(SettingsRow, { label: "Active provider", description: "Current inference provider.", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", style: {
        color: "var(--theme-accent)"
      }, children: data.providers.find((p) => p.id === data.activeProvider)?.name || data.activeProvider }) })
    ] })
  ] });
  const renderAgentBehavior = () => /* @__PURE__ */ jsxs(SettingsSection, { title: "Agent Behavior", description: "Control agent execution limits and tool access.", icon: Settings02Icon, children: [
    /* @__PURE__ */ jsx(SettingsRow, { label: "Max turns", description: "Maximum agent turns per request (1-100).", children: /* @__PURE__ */ jsx(Input, { type: "number", min: 1, max: 100, value: readNumber(agentConfig.max_turns, 50), onChange: (e) => saveNumberField("agent", "max_turns", e.target.value, 50), className: "md:w-28" }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Gateway timeout", description: "Seconds before gateway times out a request.", children: /* @__PURE__ */ jsx(Input, { type: "number", min: 10, max: 600, value: readNumber(agentConfig.gateway_timeout, 120), onChange: (e) => saveNumberField("agent", "gateway_timeout", e.target.value, 120), className: "md:w-28" }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Tool use enforcement", description: "Whether the agent must use tools when available.", children: /* @__PURE__ */ jsxs("select", { value: agentConfig.tool_use_enforcement || "auto", onChange: (e) => void saveConfig({
      config: {
        agent: {
          tool_use_enforcement: e.target.value
        }
      }
    }), className: selectClassName, children: [
      /* @__PURE__ */ jsx("option", { value: "auto", children: "auto" }),
      /* @__PURE__ */ jsx("option", { value: "required", children: "required" }),
      /* @__PURE__ */ jsx("option", { value: "none", children: "none" })
    ] }) })
  ] });
  const renderSmartRouting = () => /* @__PURE__ */ jsxs(SettingsSection, { title: "Smart Model Routing", description: "Automatically route simple queries to cheaper models.", icon: SparklesIcon, children: [
    /* @__PURE__ */ jsx(SettingsRow, { label: "Enable smart routing", description: "Route simple queries to a cheaper model automatically.", children: /* @__PURE__ */ jsx(Switch, { checked: readBoolean(smartRouting.enabled, false), onCheckedChange: (checked) => void saveConfig({
      config: {
        smart_model_routing: {
          enabled: checked
        }
      }
    }) }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Cheap model", description: "Model to use for simple queries.", children: /* @__PURE__ */ jsxs("select", { value: smartRouting.cheap_model || "", onChange: (e) => void saveConfig({
      config: {
        smart_model_routing: {
          cheap_model: e.target.value
        }
      }
    }), className: selectClassName, children: [
      /* @__PURE__ */ jsx("option", { value: "", children: "Select model" }),
      availableModels.map((model) => /* @__PURE__ */ jsx("option", { value: model.id, children: model.id }, model.id))
    ] }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Max simple chars", description: "Messages shorter than this use the cheap model.", children: /* @__PURE__ */ jsx(Input, { type: "number", min: 1, value: readNumber(smartRouting.max_simple_chars, 500), onChange: (e) => saveNumberField("smart_model_routing", "max_simple_chars", e.target.value, 500), className: "md:w-32" }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Max simple words", description: "Messages with fewer words use the cheap model.", children: /* @__PURE__ */ jsx(Input, { type: "number", min: 1, value: readNumber(smartRouting.max_simple_words, 80), onChange: (e) => saveNumberField("smart_model_routing", "max_simple_words", e.target.value, 80), className: "md:w-32" }) })
  ] });
  const renderVoice = () => /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs(SettingsSection, { title: "Text-to-Speech", description: "Configure voice output for agent responses.", icon: VolumeHighIcon, children: [
      /* @__PURE__ */ jsx(SettingsRow, { label: "TTS provider", description: "Which TTS engine to use.", children: /* @__PURE__ */ jsxs("select", { value: ttsProvider, onChange: (e) => void saveConfig({
        config: {
          tts: {
            provider: e.target.value
          }
        }
      }), className: selectClassName, children: [
        /* @__PURE__ */ jsx("option", { value: "edge", children: "Edge TTS (free)" }),
        /* @__PURE__ */ jsx("option", { value: "elevenlabs", children: "ElevenLabs" }),
        /* @__PURE__ */ jsx("option", { value: "openai", children: "OpenAI TTS" }),
        /* @__PURE__ */ jsx("option", { value: "neutts", children: "NeuTTS" })
      ] }) }),
      ttsProvider === "edge" && /* @__PURE__ */ jsx(SettingsRow, { label: "Voice", description: "Edge voice name.", children: /* @__PURE__ */ jsx(Input, { value: ttsEdge.voice || "", onChange: (e) => void saveConfig({
        config: {
          tts: {
            edge: {
              voice: e.target.value
            }
          }
        }
      }), placeholder: "en-US-AriaNeural", className: "md:w-64" }) }),
      ttsProvider === "elevenlabs" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(SettingsRow, { label: "Voice ID", description: "ElevenLabs voice_id.", children: /* @__PURE__ */ jsx(Input, { value: ttsElevenLabs.voice_id || "", onChange: (e) => void saveConfig({
          config: {
            tts: {
              elevenlabs: {
                voice_id: e.target.value
              }
            }
          }
        }), className: "md:w-64" }) }),
        /* @__PURE__ */ jsx(SettingsRow, { label: "Model", description: "ElevenLabs model name.", children: /* @__PURE__ */ jsx(Input, { value: ttsElevenLabs.model || "", onChange: (e) => void saveConfig({
          config: {
            tts: {
              elevenlabs: {
                model: e.target.value
              }
            }
          }
        }), className: "md:w-64" }) })
      ] }),
      ttsProvider === "openai" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(SettingsRow, { label: "Voice", description: "alloy, echo, fable, onyx, nova, shimmer", children: /* @__PURE__ */ jsx("select", { value: ttsOpenAi.voice || "alloy", onChange: (e) => void saveConfig({
          config: {
            tts: {
              openai: {
                voice: e.target.value
              }
            }
          }
        }), className: selectClassName, children: ["alloy", "echo", "fable", "onyx", "nova", "shimmer"].map((voice) => /* @__PURE__ */ jsx("option", { value: voice, children: voice }, voice)) }) }),
        /* @__PURE__ */ jsx(SettingsRow, { label: "Model", description: "OpenAI TTS model.", children: /* @__PURE__ */ jsx(Input, { value: ttsOpenAi.model || "", onChange: (e) => void saveConfig({
          config: {
            tts: {
              openai: {
                model: e.target.value
              }
            }
          }
        }), placeholder: "tts-1", className: "md:w-64" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(SettingsSection, { title: "Speech-to-Text", description: "Configure voice input recognition.", icon: Mic01Icon, children: [
      /* @__PURE__ */ jsx(SettingsRow, { label: "Enable STT", description: "Turn on voice input.", children: /* @__PURE__ */ jsx(Switch, { checked: readBoolean(sttConfig.enabled, false), onCheckedChange: (checked) => void saveConfig({
        config: {
          stt: {
            enabled: checked
          }
        }
      }) }) }),
      /* @__PURE__ */ jsx(SettingsRow, { label: "STT provider", description: "Which speech engine to use.", children: /* @__PURE__ */ jsx("select", { value: sttProvider, onChange: (e) => void saveConfig({
        config: {
          stt: {
            provider: e.target.value
          }
        }
      }), className: selectClassName, children: STT_PROVIDER_OPTIONS.map((provider) => /* @__PURE__ */ jsx("option", { value: provider.value, children: provider.label }, provider.value)) }) }),
      sttProvider === "local" && /* @__PURE__ */ jsx(SettingsRow, { label: "Model size", description: "tiny, base, small, medium, large", children: /* @__PURE__ */ jsx("select", { value: sttLocal.model_size || "base", onChange: (e) => void saveConfig({
        config: {
          stt: {
            local: {
              model_size: e.target.value
            }
          }
        }
      }), className: selectClassName, children: ["tiny", "base", "small", "medium", "large"].map((size) => /* @__PURE__ */ jsx("option", { value: size, children: size }, size)) }) }),
      sttProvider === "groq" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(SettingsRow, { label: "Groq model", description: "Choose the Whisper model Groq should run.", children: /* @__PURE__ */ jsx("select", { value: sttGroq.model || GROQ_STT_MODELS[0], onChange: (e) => void saveConfig({
          config: {
            stt: {
              groq: {
                ...sttGroq,
                model: e.target.value
              }
            }
          }
        }), className: selectClassName, children: GROQ_STT_MODELS.map((model) => /* @__PURE__ */ jsx("option", { value: model, children: model }, model)) }) }),
        /* @__PURE__ */ jsx(SettingsRow, { label: "Language", description: "Optional BCP-47 code, e.g. en or en-US. Leave blank for auto-detect.", children: /* @__PURE__ */ jsx(Input, { value: sttConfig.language || "", onChange: (e) => void saveConfig({
          config: {
            stt: {
              language: e.target.value
            }
          }
        }), placeholder: "auto", className: "md:w-64" }) })
      ] })
    ] })
  ] });
  const renderDisplay = () => /* @__PURE__ */ jsxs(SettingsSection, { title: "Display", description: "CLI display preferences reflected in the agent UI.", icon: PaintBoardIcon, children: [
    /* @__PURE__ */ jsx(SettingsRow, { label: "Personality", description: "Agent response style.", children: /* @__PURE__ */ jsx("select", { value: displayConfig.personality || "default", onChange: (e) => void saveConfig({
      config: {
        display: {
          personality: e.target.value
        }
      }
    }), className: selectClassName, children: ["default", "concise", "verbose", "creative"].map((value) => /* @__PURE__ */ jsx("option", { value, children: value }, value)) }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Streaming", description: "Stream tokens as they arrive.", children: /* @__PURE__ */ jsx(Switch, { checked: readBoolean(displayConfig.streaming, true), onCheckedChange: (checked) => void saveConfig({
      config: {
        display: {
          streaming: checked
        }
      }
    }) }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Show reasoning", description: "Expose model reasoning blocks in the UI.", children: /* @__PURE__ */ jsx(Switch, { checked: readBoolean(displayConfig.show_reasoning, false), onCheckedChange: (checked) => void saveConfig({
      config: {
        display: {
          show_reasoning: checked
        }
      }
    }) }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Show cost", description: "Display usage cost metadata.", children: /* @__PURE__ */ jsx(Switch, { checked: readBoolean(displayConfig.show_cost, false), onCheckedChange: (checked) => void saveConfig({
      config: {
        display: {
          show_cost: checked
        }
      }
    }) }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Compact", description: "Use a denser display layout.", children: /* @__PURE__ */ jsx(Switch, { checked: readBoolean(displayConfig.compact, false), onCheckedChange: (checked) => void saveConfig({
      config: {
        display: {
          compact: checked
        }
      }
    }) }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Skin", description: "CLI theme skin.", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-mono", style: {
      color: "var(--theme-muted)"
    }, children: displayConfig.skin || "default" }) })
  ] });
  const sectionContent = {
    claude: renderClaudeOverview(),
    agent: renderAgentBehavior(),
    routing: renderSmartRouting(),
    voice: renderVoice(),
    display: renderDisplay()
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    saveMessage && /* @__PURE__ */ jsx("div", { className: "rounded-lg px-3 py-2 text-sm font-medium", style: {
      backgroundColor: saveMessage.includes("Failed") ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
      color: saveMessage.includes("Failed") ? "#ef4444" : "#22c55e"
    }, children: saveMessage }),
    sectionContent[activeView]
  ] });
}
function ConnectionSection() {
  const [current, setCurrent] = useState(null);
  const [gatewayInput, setGatewayInput] = useState("");
  const [dashboardInput, setDashboardInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/connection-settings");
      if (!res.ok) return;
      const data = await res.json();
      setCurrent(data);
      setGatewayInput(data.gateway);
      setDashboardInput(data.dashboard);
    } catch {
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const save = async () => {
    setSaving(true);
    setMessage(null);
    setIsError(false);
    try {
      const res = await fetch("/api/connection-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gateway: gatewayInput.trim(),
          dashboard: dashboardInput.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setCurrent(data);
      setMessage("Saved. Connection updated — no restart needed.");
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 6e3);
    }
  };
  const reset = async () => {
    setGatewayInput("");
    setDashboardInput("");
    setSaving(true);
    try {
      const res = await fetch("/api/connection-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gateway: "",
          dashboard: ""
        })
      });
      const data = await res.json();
      setCurrent(data);
      setGatewayInput(data.gateway);
      setDashboardInput(data.dashboard);
      setMessage("Reset to env / default URLs.");
    } catch {
      setIsError(true);
      setMessage("Reset failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 6e3);
    }
  };
  const inputClass = "h-9 w-full rounded-lg border border-primary-200 bg-primary-50 px-3 text-sm text-primary-900 font-mono outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-400";
  const sourceLabel = {
    override: "Runtime override (saved in workspace-overrides.json)",
    env: "From HERMES_API_URL / HERMES_DASHBOARD_URL env vars",
    default: "Defaults — no override set"
  };
  return /* @__PURE__ */ jsxs(SettingsSection, { title: "Connection", description: "Point the workspace at your Hermes Agent services. Useful for Tailscale, LAN, or remote-server setups (#101).", icon: Link01Icon, children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs text-primary-600", children: current ? sourceLabel[current.source] : "Loading…" }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Gateway URL", description: "Core chat + completions + health. Default http://127.0.0.1:8645.", children: /* @__PURE__ */ jsx("input", { className: inputClass, value: gatewayInput, onChange: (e) => setGatewayInput(e.target.value), placeholder: "http://100.x.y.z:8642", spellCheck: false, autoCorrect: "off", autoCapitalize: "off" }) }),
    /* @__PURE__ */ jsx(SettingsRow, { label: "Dashboard URL", description: "Extended APIs — sessions, skills, config, jobs. Default http://127.0.0.1:9119.", children: /* @__PURE__ */ jsx("input", { className: inputClass, value: dashboardInput, onChange: (e) => setDashboardInput(e.target.value), placeholder: "http://100.x.y.z:9119", spellCheck: false, autoCorrect: "off", autoCapitalize: "off" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2", children: [
      /* @__PURE__ */ jsx(Button, { size: "sm", onClick: save, disabled: saving, children: saving ? "Saving…" : "Save & reprobe" }),
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: reset, disabled: saving || current?.source === "default", children: "Reset to defaults" }),
      message ? /* @__PURE__ */ jsx("span", { className: cn("text-xs", isError ? "text-red-500" : "text-emerald-600"), children: message }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-lg border border-primary-200 bg-primary-100/50 p-3 text-xs text-primary-600", children: [
      /* @__PURE__ */ jsx("strong", { className: "font-semibold", children: "Tailscale / remote tip:" }),
      " Set the gateway to its Tailscale IP (e.g. ",
      /* @__PURE__ */ jsx("code", { children: "http://100.x.y.z:8642" }),
      ") and ensure the gateway listens on ",
      /* @__PURE__ */ jsx("code", { children: "0.0.0.0" }),
      " (set",
      " ",
      /* @__PURE__ */ jsx("code", { children: "API_SERVER_HOST=0.0.0.0" }),
      " in the agent-side ",
      /* @__PURE__ */ jsx("code", { children: ".env" }),
      "). No workspace restart needed — capabilities reprobe on save."
    ] })
  ] });
}
export {
  SettingsRoute as component
};
