import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useCallback, useEffect } from "react";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon, Add01Icon, CheckmarkCircle02Icon, Clock01Icon, SparklesIcon, Folder01Icon, Edit02Icon, Delete02Icon, Copy01Icon, ArrowRight01Icon, Key01Icon, RefreshIcon, Wifi01Icon, WifiOffIcon, CheckListIcon } from "@hugeicons/core-free-icons";
import { B as Button, c as cn, D as DialogRoot, b as DialogContent, d as DialogTitle, I as Input, t as toast } from "./router-DmH5gXcK.js";
import { useNavigate } from "@tanstack/react-router";
import { u as useCrewStatus, g as getOnlineStatus } from "./use-crew-status-R2z-b9IQ.js";
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
function formatDate(value) {
  if (!value) return "—";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Intl.DateTimeFormat(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(parsed);
}
function ProfileStat({
  label,
  value,
  truncate
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-2.5 px-1", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "text-sm font-bold text-primary-900 dark:text-neutral-100",
          truncate && "max-w-[72px] truncate text-xs"
        ),
        children: value
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-400 dark:text-neutral-500", children: label })
  ] });
}
function ProfilesScreen() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsName, setDetailsName] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [wizardStep, setWizardStep] = useState(1);
  const [cloneFrom, setCloneFrom] = useState("");
  const [wizardProvider, setWizardProvider] = useState("");
  const [wizardModel, setWizardModel] = useState("");
  const [allModels, setAllModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [busyName, setBusyName] = useState(null);
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [savingDescription, setSavingDescription] = useState(false);
  const profilesQuery = useQuery({
    queryKey: ["profiles", "list"],
    queryFn: () => readJson(
      "/api/profiles/list"
    )
  });
  const detailQuery = useQuery({
    queryKey: ["profiles", "read", detailsName],
    queryFn: () => readJson(
      `/api/profiles/read?name=${encodeURIComponent(detailsName || "")}`
    ),
    enabled: Boolean(detailsName)
  });
  const profiles = profilesQuery.data?.profiles ?? [];
  const activeProfile = profilesQuery.data?.activeProfile ?? "default";
  const sorted = useMemo(() => profiles, [profiles]);
  async function refreshProfiles() {
    await queryClient.invalidateQueries({ queryKey: ["profiles"] });
  }
  async function postJson(url, body) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.error) {
      throw new Error(payload?.error || `Request failed (${response.status})`);
    }
    return payload;
  }
  const fetchAllModels = useCallback(async () => {
    setLoadingModels(true);
    try {
      const res = await fetch("/api/models");
      if (res.ok) {
        const result = await res.json();
        setAllModels(result.models || []);
      }
    } catch {
    }
    setLoadingModels(false);
  }, []);
  useEffect(() => {
    if (createOpen && wizardStep === 2 && allModels.length === 0) {
      void fetchAllModels();
    }
  }, [createOpen, wizardStep, allModels.length, fetchAllModels]);
  useEffect(() => {
    setDescriptionDraft(detailQuery.data?.profile?.description ?? "");
  }, [detailQuery.data?.profile?.description, detailsName]);
  const nameValid = /^[A-Za-z0-9_-]+$/.test(newProfileName.trim()) && newProfileName.trim() !== "default";
  function resetWizard() {
    setNewProfileName("");
    setCloneFrom("");
    setWizardProvider("");
    setWizardModel("");
    setWizardStep(1);
    setAllModels([]);
  }
  async function handleCreate() {
    if (!newProfileName.trim()) return;
    setBusyName("__create__");
    try {
      await postJson("/api/profiles/create", {
        name: newProfileName.trim(),
        ...cloneFrom ? { cloneFrom } : {},
        ...wizardModel ? { model: wizardModel } : {},
        ...wizardProvider ? { provider: wizardProvider } : {}
      });
      toast(`Created profile ${newProfileName.trim()}`, { type: "success" });
      setCreateOpen(false);
      resetWizard();
      await refreshProfiles();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to create profile",
        { type: "error" }
      );
    } finally {
      setBusyName(null);
    }
  }
  async function handleActivate(name) {
    setBusyName(name);
    try {
      await postJson("/api/profiles/activate", { name });
      toast(`Activated profile ${name}`, { type: "success" });
      await refreshProfiles();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to activate profile",
        { type: "error" }
      );
    } finally {
      setBusyName(null);
    }
  }
  async function handleDelete(name) {
    if (typeof window !== "undefined" && !window.confirm(`Delete profile ${name}?`))
      return;
    setBusyName(name);
    try {
      await postJson("/api/profiles/delete", { name });
      toast(`Deleted profile ${name}`, { type: "success" });
      await refreshProfiles();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to delete profile",
        { type: "error" }
      );
    } finally {
      setBusyName(null);
    }
  }
  async function handleRename() {
    if (!renameTarget || !renameValue.trim()) return;
    setBusyName(renameTarget.name);
    try {
      await postJson("/api/profiles/rename", {
        oldName: renameTarget.name,
        newName: renameValue.trim()
      });
      toast(`Renamed ${renameTarget.name} → ${renameValue.trim()}`, {
        type: "success"
      });
      setRenameTarget(null);
      setRenameValue("");
      await refreshProfiles();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to rename profile",
        { type: "error" }
      );
    } finally {
      setBusyName(null);
    }
  }
  async function handleSaveDescription() {
    if (!detailsName) return;
    setSavingDescription(true);
    try {
      await postJson("/api/profiles/update", {
        name: detailsName,
        patch: { description: descriptionDraft.trim() || null }
      });
      toast(`Saved description for ${detailsName}`, { type: "success" });
      await Promise.all([
        refreshProfiles(),
        queryClient.invalidateQueries({ queryKey: ["profiles", "read", detailsName] })
      ]);
      await detailQuery.refetch();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to save description",
        { type: "error" }
      );
    } finally {
      setSavingDescription(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 md:px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-2xl border border-primary-200 bg-primary-50/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(HugeiconsIcon, { icon: UserGroupIcon, size: 22, strokeWidth: 1.7 }),
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-primary-900", children: "Profiles" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-primary-600", children: [
          "Browse and manage Hermes profiles stored under",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-mono", children: "~/.hermes/profiles" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => setCreateOpen(true), className: "gap-2", children: [
        /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Add01Icon, size: 16, strokeWidth: 1.8 }),
        "Create profile"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: sorted.map((profile) => {
      const busy = busyName === profile.name;
      return /* @__PURE__ */ jsxs(
        "article",
        {
          className: "group relative overflow-hidden rounded-2xl border border-primary-200 bg-primary-50/80 shadow-sm dark:border-neutral-800 dark:bg-neutral-950",
          children: [
            profile.active && /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-accent-500 to-emerald-400" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center pt-6 pb-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: cn(
                      "rounded-full p-1",
                      profile.active ? "bg-gradient-to-br from-emerald-400 via-accent-500 to-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-gradient-to-br from-primary-200 to-primary-300 dark:from-neutral-700 dark:to-neutral-600"
                    ),
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: "/claude-avatar.webp",
                        alt: profile.name,
                        className: cn(
                          "size-20 rounded-full border-2 object-cover",
                          profile.active ? "border-white dark:border-neutral-950" : "border-primary-50 dark:border-neutral-950"
                        ),
                        style: {
                          filter: profile.active ? "none" : "grayscale(0.5) brightness(0.9)"
                        }
                      }
                    )
                  }
                ),
                profile.active && /* @__PURE__ */ jsxs("div", { className: "absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border-2 border-white bg-emerald-500 px-2 py-0.5 dark:border-neutral-950", children: [
                  /* @__PURE__ */ jsx(
                    HugeiconsIcon,
                    {
                      icon: CheckmarkCircle02Icon,
                      size: 10,
                      strokeWidth: 2.5,
                      className: "text-white"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold uppercase tracking-wider text-white", children: "Active" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("h2", { className: "mt-3 text-center text-lg font-bold text-primary-900 dark:text-neutral-100", children: profile.name }),
              /* @__PURE__ */ jsx("span", { className: "mt-1 inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-[11px] font-medium text-primary-600 dark:bg-neutral-800 dark:text-neutral-400", children: profile.provider || "no provider" }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 line-clamp-2 min-h-[2.5rem] px-6 text-center text-xs text-primary-500 dark:text-neutral-400", children: profile.description?.trim() || "No description yet" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mx-4 mt-4 grid grid-cols-4 divide-x divide-primary-200 rounded-xl border border-primary-200 bg-primary-100/50 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50", children: [
              /* @__PURE__ */ jsx(ProfileStat, { label: "Skills", value: profile.skillCount }),
              /* @__PURE__ */ jsx(ProfileStat, { label: "Sessions", value: profile.sessionCount }),
              /* @__PURE__ */ jsx(
                ProfileStat,
                {
                  label: "Model",
                  value: profile.model || "—",
                  truncate: true
                }
              ),
              /* @__PURE__ */ jsx(
                ProfileStat,
                {
                  label: "Env",
                  value: profile.hasEnv ? "✓" : "—"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mx-4 mt-3 flex items-center justify-center gap-1.5 text-xs text-primary-400 dark:text-neutral-500", children: [
              /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Clock01Icon, size: 12, strokeWidth: 1.7 }),
              formatDate(profile.updatedAt)
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex border-t border-primary-200 dark:border-neutral-800", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => void handleActivate(profile.name),
                  disabled: profile.active || busy,
                  className: cn(
                    "flex flex-1 items-center justify-center gap-1.5 border-r border-primary-200 py-2.5 text-xs font-semibold transition-colors dark:border-neutral-800",
                    profile.active ? "cursor-default text-primary-300 dark:text-neutral-600" : "text-primary-700 hover:bg-primary-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  ),
                  children: [
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: SparklesIcon,
                        size: 13,
                        strokeWidth: 1.8
                      }
                    ),
                    " ",
                    "Activate"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setDetailsName(profile.name),
                  className: "flex flex-1 items-center justify-center gap-1.5 border-r border-primary-200 py-2.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900",
                  children: [
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: Folder01Icon,
                        size: 13,
                        strokeWidth: 1.8
                      }
                    ),
                    " ",
                    "Details"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setRenameTarget(profile);
                    setRenameValue(profile.name);
                  },
                  className: "flex flex-1 items-center justify-center gap-1.5 border-r border-primary-200 py-2.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900",
                  children: [
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: Edit02Icon,
                        size: 13,
                        strokeWidth: 1.8
                      }
                    ),
                    " ",
                    "Rename"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => void handleDelete(profile.name),
                  disabled: profile.active || busy,
                  className: cn(
                    "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors",
                    profile.active ? "cursor-default text-primary-300 dark:text-neutral-600" : "text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  ),
                  children: [
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: Delete02Icon,
                        size: 13,
                        strokeWidth: 1.8
                      }
                    ),
                    " ",
                    "Delete"
                  ]
                }
              )
            ] })
          ]
        },
        profile.name
      );
    }) }),
    sorted.length === 0 && !profilesQuery.isLoading ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-primary-200 bg-primary-50/70 p-8 text-center text-sm text-primary-600", children: [
      "No named profiles found yet. The active profile is",
      " ",
      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: activeProfile }),
      "."
    ] }) : null,
    /* @__PURE__ */ jsx(
      DialogRoot,
      {
        open: createOpen,
        onOpenChange: (open) => {
          setCreateOpen(open);
          if (!open) resetWizard();
        },
        children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[min(560px,94vw)] max-w-none p-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "border-b border-primary-200 px-6 pb-4 pt-5 dark:border-neutral-800", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "inline-flex size-10 items-center justify-center rounded-xl border border-primary-200 bg-primary-100/70 dark:border-neutral-700 dark:bg-neutral-900", children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Add01Icon, size: 20, strokeWidth: 1.7 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(DialogTitle, { className: "text-base font-semibold", children: "Create profile" }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-primary-500 dark:text-neutral-400", children: wizardStep === 1 ? "Name & template" : wizardStep === 2 ? "Choose model" : "Review & create" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 flex items-center gap-2", children: [1, 2, 3].map((step) => /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    wizardStep > step ? "bg-emerald-500 text-white" : wizardStep === step ? "bg-accent-500 text-white" : "border border-primary-200 bg-primary-100 text-primary-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500"
                  ),
                  children: wizardStep > step ? /* @__PURE__ */ jsx(
                    HugeiconsIcon,
                    {
                      icon: CheckmarkCircle02Icon,
                      size: 16,
                      strokeWidth: 2
                    }
                  ) : step
                }
              ),
              step < 3 && /* @__PURE__ */ jsx(
                "div",
                {
                  className: cn(
                    "h-0.5 flex-1 rounded-full transition-colors",
                    wizardStep > step ? "bg-emerald-400" : "bg-primary-200 dark:bg-neutral-700"
                  )
                }
              )
            ] }, step)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-6 py-5", children: [
            wizardStep === 1 && /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-neutral-400", children: "Profile name" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: newProfileName,
                    onChange: (e) => setNewProfileName(e.target.value),
                    placeholder: "e.g. builder, researcher, ops",
                    className: "h-11 text-sm",
                    autoFocus: true
                  }
                ),
                newProfileName.trim() && !nameValid ? /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: 'Use letters, numbers, underscores, or hyphens. Cannot be "default".' }) : newProfileName.trim() && nameValid ? /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-600", children: "✓ Valid name" }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-primary-400 dark:text-neutral-500", children: "Choose a short, memorable identifier" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-neutral-400", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(
                    HugeiconsIcon,
                    {
                      icon: Copy01Icon,
                      size: 13,
                      strokeWidth: 1.8
                    }
                  ),
                  "Clone from existing"
                ] }) }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: cloneFrom,
                    onChange: (e) => setCloneFrom(e.target.value),
                    className: "h-11 w-full rounded-xl border border-primary-200 bg-primary-50 px-3 text-sm text-primary-900 outline-none transition-colors focus:border-accent-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Start fresh — empty config" }),
                      profiles.map((p) => /* @__PURE__ */ jsxs("option", { value: p.name, children: [
                        p.name,
                        " ",
                        p.model ? `(${p.model})` : "",
                        " ",
                        p.active ? "• active" : ""
                      ] }, p.name))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-primary-400 dark:text-neutral-500", children: "Copies config, skills path, and env from the selected profile" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-primary-200 bg-primary-50/60 p-3 dark:border-neutral-800 dark:bg-neutral-900/40", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-primary-500 dark:text-neutral-400", children: [
                "Profiles are stored under",
                " ",
                /* @__PURE__ */ jsx("code", { className: "rounded bg-primary-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-800", children: "~/.hermes/profiles/<name>/" }),
                " ",
                "with their own config, skills, sessions, and env."
              ] }) })
            ] }),
            wizardStep === 2 && /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-neutral-400", children: "Default model" }),
                loadingModels ? /* @__PURE__ */ jsx("div", { className: "flex h-11 items-center rounded-xl border border-primary-200 bg-primary-50 px-3 text-sm text-primary-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500", children: "Loading configured models…" }) : allModels.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300", children: "No models found. Make sure Hermes Agent is running and has models configured." }) : /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: wizardModel,
                    onChange: (e) => {
                      const modelId = e.target.value;
                      setWizardModel(modelId);
                      const matched = allModels.find((m) => m.id === modelId);
                      setWizardProvider(matched?.provider || "");
                    },
                    className: "h-11 w-full rounded-xl border border-primary-200 bg-primary-50 px-3 text-sm text-primary-900 outline-none transition-colors focus:border-accent-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Skip — configure later" }),
                      allModels.map((m) => /* @__PURE__ */ jsxs("option", { value: m.id, children: [
                        m.name || m.id,
                        m.provider ? ` (${m.provider})` : ""
                      ] }, m.id))
                    ]
                  }
                ),
                wizardModel && /* @__PURE__ */ jsxs("p", { className: "text-xs text-emerald-600 dark:text-emerald-400", children: [
                  "✓ ",
                  wizardModel,
                  wizardProvider ? ` via ${wizardProvider}` : ""
                ] })
              ] }),
              !wizardModel && !loadingModels && allModels.length > 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-primary-200 bg-primary-50/60 p-3 dark:border-neutral-800 dark:bg-neutral-900/40", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-primary-500 dark:text-neutral-400", children: "Select a model or skip to configure later from profile details or config.yaml." }) })
            ] }),
            wizardStep === 3 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-primary-200 bg-primary-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/60", children: [
                /* @__PURE__ */ jsx("h3", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-neutral-400", children: "Profile summary" }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsx(SummaryField, { label: "Name", value: newProfileName.trim() }),
                  /* @__PURE__ */ jsx(
                    SummaryField,
                    {
                      label: "Template",
                      value: cloneFrom || "Fresh start"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    SummaryField,
                    {
                      label: "Model",
                      value: wizardModel ? `${wizardModel}${wizardProvider ? ` (${wizardProvider})` : ""}` : "Not set",
                      muted: !wizardModel
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-emerald-700 dark:text-emerald-300", children: [
                "This will create",
                " ",
                /* @__PURE__ */ jsxs("code", { className: "rounded bg-emerald-100 px-1 py-0.5 font-mono text-[11px] dark:bg-emerald-900/40", children: [
                  "~/.hermes/profiles/",
                  newProfileName.trim(),
                  "/"
                ] }),
                " ",
                "with config.yaml",
                cloneFrom ? ` cloned from ${cloneFrom}` : "",
                ", skills/, and sessions/ directories."
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-primary-200 px-6 py-4 dark:border-neutral-800", children: [
            /* @__PURE__ */ jsx("div", { children: wizardStep > 1 && /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setWizardStep((s) => s - 1),
                children: "Back"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => {
                    setCreateOpen(false);
                    resetWizard();
                  },
                  children: "Cancel"
                }
              ),
              wizardStep < 3 ? /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  onClick: () => setWizardStep((s) => s + 1),
                  disabled: wizardStep === 1 && !nameValid,
                  className: "gap-1.5",
                  children: [
                    "Next",
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: ArrowRight01Icon,
                        size: 14,
                        strokeWidth: 1.8
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  onClick: () => void handleCreate(),
                  disabled: busyName === "__create__",
                  className: "gap-1.5",
                  children: [
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: SparklesIcon,
                        size: 14,
                        strokeWidth: 1.8
                      }
                    ),
                    "Create Profile"
                  ]
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      DialogRoot,
      {
        open: Boolean(renameTarget),
        onOpenChange: (open) => {
          if (!open) {
            setRenameTarget(null);
            setRenameValue("");
          }
        },
        children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[min(440px,94vw)] max-w-none p-0", children: [
          /* @__PURE__ */ jsx("div", { className: "border-b border-primary-200 px-6 pb-4 pt-5 dark:border-neutral-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-flex size-10 items-center justify-center rounded-xl border border-primary-200 bg-primary-100/70 dark:border-neutral-700 dark:bg-neutral-900", children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Edit02Icon, size: 20, strokeWidth: 1.7 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(DialogTitle, { className: "text-base font-semibold", children: "Rename profile" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-0.5 text-xs text-primary-500 dark:text-neutral-400", children: [
                "Renaming",
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-primary-700 dark:text-neutral-200", children: renameTarget?.name })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "px-6 py-5 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-neutral-400", children: "New name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: renameValue,
                onChange: (e) => setRenameValue(e.target.value),
                placeholder: "new-profile-name",
                className: "h-11 text-sm",
                autoFocus: true
              }
            ),
            renameValue.trim() && !/^[A-Za-z0-9_-]+$/.test(renameValue.trim()) && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500", children: "Use letters, numbers, underscores, or hyphens." })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 border-t border-primary-200 px-6 py-3 dark:border-neutral-800", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => {
                  setRenameTarget(null);
                  setRenameValue("");
                },
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                onClick: () => void handleRename(),
                disabled: !renameTarget || !renameValue.trim() || !/^[A-Za-z0-9_-]+$/.test(renameValue.trim()),
                children: "Rename"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      DialogRoot,
      {
        open: Boolean(detailsName),
        onOpenChange: (open) => !open && setDetailsName(null),
        children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[min(640px,94vw)] max-w-none p-0 max-h-[85vh] flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "shrink-0 border-b border-primary-200 px-6 pb-4 pt-5 dark:border-neutral-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/claude-avatar.webp",
                  alt: detailsName || "",
                  className: "size-12 rounded-full border-2 border-primary-200 object-cover dark:border-neutral-700"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx(DialogTitle, { className: "text-base font-semibold", children: detailsName }),
                /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-primary-500 dark:text-neutral-400", children: "Profile details & configuration" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => void detailQuery.refetch(),
                disabled: detailQuery.isFetching,
                children: detailQuery.isFetching ? "Refreshing…" : "Refresh"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-6 py-5", children: detailQuery.data?.profile ? /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsx(
                DetailField,
                {
                  label: "Name",
                  value: detailQuery.data.profile.name
                }
              ),
              /* @__PURE__ */ jsx(
                DetailField,
                {
                  label: "Active",
                  value: detailQuery.data.profile.active ? "Yes" : "No",
                  accent: detailQuery.data.profile.active
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              DetailField,
              {
                label: "Path",
                value: detailQuery.data.profile.path,
                mono: true
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
              /* @__PURE__ */ jsx(
                DetailField,
                {
                  label: "Env file",
                  value: detailQuery.data.profile.envPath || "Not set",
                  mono: true,
                  muted: !detailQuery.data.profile.envPath
                }
              ),
              /* @__PURE__ */ jsx(
                DetailField,
                {
                  label: "Sessions",
                  value: detailQuery.data.profile.sessionsDir || "Not set",
                  mono: true,
                  muted: !detailQuery.data.profile.sessionsDir
                }
              ),
              /* @__PURE__ */ jsx(
                DetailField,
                {
                  label: "Skills",
                  value: detailQuery.data.profile.skillsDir || "Not set",
                  mono: true,
                  muted: !detailQuery.data.profile.skillsDir
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-200 bg-primary-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/60", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-neutral-400", children: "Description" }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    onClick: () => void handleSaveDescription(),
                    disabled: savingDescription,
                    children: savingDescription ? "Saving…" : "Save"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: descriptionDraft,
                  onChange: (event) => setDescriptionDraft(event.target.value),
                  placeholder: "What this profile is for, how it should behave, or what makes it different",
                  className: "min-h-[96px] w-full rounded-lg border border-primary-200 bg-primary-100/70 p-3 text-sm text-primary-900 outline-none transition-colors focus:border-accent-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-primary-400 dark:text-neutral-500", children: "Saved into the profile config, so manual file edits show up here after refresh." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-200 bg-primary-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/60", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-500 dark:text-neutral-400", children: [
                /* @__PURE__ */ jsx(
                  HugeiconsIcon,
                  {
                    icon: Key01Icon,
                    size: 14,
                    strokeWidth: 1.8
                  }
                ),
                " ",
                "Config"
              ] }),
              /* @__PURE__ */ jsx("pre", { className: "max-h-48 overflow-auto rounded-lg border border-primary-200 bg-primary-100/70 p-3 text-xs leading-relaxed text-primary-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200", children: JSON.stringify(detailQuery.data.profile.config, null, 2) })
            ] })
          ] }) : detailQuery.isLoading ? /* @__PURE__ */ jsx("div", { className: "flex min-h-[120px] items-center justify-center text-sm text-primary-500 dark:text-neutral-400", children: "Loading profile\\u2026" }) : /* @__PURE__ */ jsx("div", { className: "flex min-h-[120px] items-center justify-center text-sm text-red-500", children: "Failed to load profile." }) }),
          /* @__PURE__ */ jsx("div", { className: "shrink-0 flex justify-end border-t border-primary-200 px-6 py-3 dark:border-neutral-800", children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setDetailsName(null),
              children: "Close"
            }
          ) })
        ] })
      }
    )
  ] });
}
function SummaryField({
  label,
  value,
  muted
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-primary-200 bg-primary-100/60 p-2.5 dark:border-neutral-700 dark:bg-neutral-800/60", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary-400 dark:text-neutral-500", children: label }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "mt-0.5 text-sm font-medium",
          muted ? "text-primary-400 dark:text-neutral-500" : "text-primary-900 dark:text-neutral-100"
        ),
        children: value
      }
    )
  ] });
}
function DetailField({
  label,
  value,
  mono,
  muted,
  accent,
  full
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "rounded-xl border border-primary-200 bg-primary-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-900/60",
        full && "sm:col-span-2"
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary-400 dark:text-neutral-500", children: label }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "mt-1 text-sm break-all",
              mono && "font-mono text-xs",
              muted ? "text-primary-400 dark:text-neutral-500" : accent ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-primary-900 dark:text-neutral-100"
            ),
            children: value
          }
        )
      ]
    }
  );
}
function formatNumber(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
function formatTokens(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}
function formatCost(n) {
  if (n === null) return "—";
  return `$${n.toFixed(2)}`;
}
function formatRelativeTime(unixSeconds) {
  if (!unixSeconds) return "Never";
  const diffMs = Date.now() - unixSeconds * 1e3;
  const diffMins = Math.floor(diffMs / 6e4);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
function formatUpdatedAgo(fetchedAt) {
  if (!fetchedAt) return "";
  const diffSec = Math.floor((Date.now() - fetchedAt) / 1e3);
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  return `${Math.floor(diffSec / 60)}m ago`;
}
function StatusDot({ status }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: cn(
          "inline-block size-2 rounded-full",
          status === "online" && "bg-green-500",
          status === "offline" && "bg-red-500",
          status === "unknown" && "bg-gray-500"
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "span",
      {
        className: cn(
          "text-[10px] font-semibold uppercase tracking-widest",
          status === "online" && "text-green-400",
          status === "offline" && "text-red-400",
          status === "unknown" && "text-gray-500"
        ),
        children: status
      }
    )
  ] });
}
function SkeletonCard() {
  return /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] overflow-hidden animate-pulse", children: /* @__PURE__ */ jsxs("div", { className: "border-l-[3px] border-l-[#B87333] p-4 h-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-2.5 bg-[var(--theme-hover)] rounded w-16" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-[var(--theme-hover)] rounded w-20" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-7 bg-[var(--theme-hover)] rounded w-28 mb-1" }),
    /* @__PURE__ */ jsx("div", { className: "h-3 bg-[var(--theme-hover)] rounded w-36 mb-4" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 mb-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx("div", { className: "rounded border border-[var(--theme-border)] bg-[var(--theme-hover)] h-14" }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-[var(--theme-hover)] rounded w-20" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-[var(--theme-hover)] rounded w-20" })
    ] })
  ] }) });
}
function AgentCard({ member }) {
  const navigate = useNavigate();
  const status = getOnlineStatus(member);
  const telegramPlatform = member.platforms.telegram;
  const borderColor = status === "online" ? "#B87333" : status === "offline" ? "#ef4444" : "#6b7280";
  const handleViewTasks = () => {
    void navigate({ to: "/tasks", search: { assignee: member.id } });
  };
  const handleViewJobs = () => {
    void navigate({ to: "/jobs", search: { agent: member.id } });
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] overflow-hidden",
        "transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]",
        status === "offline" && "opacity-70"
      ),
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "border-l-[3px] p-4 h-full flex flex-col gap-3",
          style: { borderLeftColor: borderColor },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsx(StatusDot, { status }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-medium text-[var(--theme-muted)] uppercase tracking-wider text-right bg-[var(--theme-hover)] border border-[var(--theme-border)] px-1.5 py-0.5 rounded-sm", children: member.role })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold tracking-tight", style: { color: "#f59e0b" }, children: member.displayName || member.id }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-[var(--theme-muted)] mt-0.5", children: [
                member.model,
                " · ",
                member.provider
              ] }),
              telegramPlatform && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                /* @__PURE__ */ jsx(
                  HugeiconsIcon,
                  {
                    icon: telegramPlatform.state === "connected" ? Wifi01Icon : WifiOffIcon,
                    size: 10,
                    className: cn(
                      telegramPlatform.state === "connected" ? "text-green-400" : "text-gray-500"
                    )
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[var(--theme-muted)]", children: [
                  "Telegram: ",
                  telegramPlatform.state
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[var(--theme-muted)]", children: [
                "Last active: ",
                /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-text)]", children: formatRelativeTime(member.lastSessionAt) })
              ] }),
              member.lastSessionTitle && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[var(--theme-muted)] italic truncate mt-0.5", children: [
                '"',
                member.lastSessionTitle,
                '"'
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: [
              { label: "Sessions", value: formatNumber(member.sessionCount) },
              { label: "Messages", value: formatNumber(member.messageCount) },
              { label: "Tools", value: formatNumber(member.toolCallCount) }
            ].map(({ label, value }) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded border border-[var(--theme-border)] bg-[var(--theme-hover)] px-2 py-2 text-center",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", style: { color: "#f59e0b" }, children: value }),
                  /* @__PURE__ */ jsx("div", { className: "text-[9px] text-[var(--theme-muted)] uppercase tracking-widest mt-0.5", children: label })
                ]
              },
              label
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[11px]", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[var(--theme-muted)]", children: [
                "Tokens: ",
                /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-text)]", children: formatTokens(member.totalTokens) })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[var(--theme-muted)]", children: [
                "Est. cost: ",
                /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-text)]", children: formatCost(member.estimatedCostUsd) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[11px]", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[var(--theme-muted)]", children: [
                "Crons: ",
                /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-text)]", children: member.cronJobCount })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[var(--theme-muted)]", children: [
                "Tasks: ",
                /* @__PURE__ */ jsxs("span", { className: "text-[var(--theme-text)]", children: [
                  member.assignedTaskCount,
                  " assigned"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--theme-border)]" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleViewTasks,
                  className: "flex items-center gap-1 text-[11px] text-[var(--theme-muted)] hover:text-[#B87333] hover:bg-[var(--theme-hover)] px-2 py-1 rounded transition-colors -ml-2",
                  children: [
                    /* @__PURE__ */ jsx(HugeiconsIcon, { icon: CheckListIcon, size: 12 }),
                    "Tasks"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleViewJobs,
                  className: "flex items-center gap-1 text-[11px] text-[var(--theme-muted)] hover:text-[#B87333] hover:bg-[var(--theme-hover)] px-2 py-1 rounded transition-colors -mr-2",
                  children: [
                    /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Clock01Icon, size: 12 }),
                    "Cron Jobs"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function useUpdatedAgo(fetchedAt) {
  const [label, setLabel] = useState(formatUpdatedAgo(fetchedAt));
  useEffect(() => {
    setLabel(formatUpdatedAgo(fetchedAt));
    const interval = setInterval(() => {
      setLabel(formatUpdatedAgo(fetchedAt));
    }, 5e3);
    return () => clearInterval(interval);
  }, [fetchedAt]);
  return label;
}
function CrewScreen() {
  const { crew, lastUpdated, isLoading, isError, refetch } = useCrewStatus();
  const updatedAgo = useUpdatedAgo(lastUpdated);
  const displayCrew = [...crew].sort((a, b) => {
    const rank = (member) => {
      const status = getOnlineStatus(member);
      if (status === "online") return 0;
      if (status === "offline") return 1;
      return 2;
    };
    const rankDiff = rank(a) - rank(b);
    if (rankDiff !== 0) return rankDiff;
    return (a.displayName || a.id).localeCompare(b.displayName || b.id);
  });
  const onlineCount = displayCrew.filter((m) => getOnlineStatus(m) === "online").length;
  const assignedTaskCount = displayCrew.reduce((sum, member) => sum + member.assignedTaskCount, 0);
  const runningCronCount = displayCrew.reduce((sum, member) => sum + member.cronJobCount, 0);
  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col gap-6 overflow-auto p-4 md:p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-px", style: { background: "linear-gradient(to right, #B87333, transparent)" } }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-3xl space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "h1",
              {
                className: "text-2xl font-bold tracking-[0.18em] uppercase",
                style: { color: "#f59e0b" },
                children: "Crew Status"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm leading-6 text-[var(--theme-muted)]", children: "Live agent health across profiles, recent session activity, assigned tasks, and cron coverage." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em]", children: [
            /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-1 text-[var(--theme-muted)]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-text)]", children: displayCrew.length }),
              " crew"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-300", children: [
              onlineCount,
              " online"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-1 text-[var(--theme-muted)]", children: [
              assignedTaskCount,
              " assigned tasks"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-1 text-[var(--theme-muted)]", children: [
              runningCronCount,
              " cron jobs"
            ] }),
            updatedAgo ? /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-1 text-[var(--theme-muted)]", children: [
              "Updated ",
              updatedAgo
            ] }) : null
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleRefresh,
            disabled: isLoading,
            className: cn(
              "inline-flex items-center gap-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-2 text-xs font-medium text-[var(--theme-muted)] shadow-sm transition-all",
              "hover:border-[#B87333]/40 hover:text-[#f59e0b] hover:shadow-[0_0_0_1px_rgba(184,115,51,0.12)]",
              "disabled:cursor-not-allowed disabled:opacity-40"
            ),
            children: [
              /* @__PURE__ */ jsx(
                HugeiconsIcon,
                {
                  icon: RefreshIcon,
                  size: 13,
                  className: isLoading ? "animate-spin" : ""
                }
              ),
              "Refresh manifest"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-px", style: { background: "linear-gradient(to right, #B87333, transparent)" } })
    ] }),
    isError && !isLoading && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-red-800/40 bg-red-900/10 p-4 text-sm text-red-400", children: [
      "Failed to load crew status.",
      " ",
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleRefresh,
          className: "underline hover:text-red-300",
          children: "Retry"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", children: isLoading ? Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx(SkeletonCard, {}, i)) : displayCrew.map((member) => /* @__PURE__ */ jsx(AgentCard, { member }, member.id)) })
  ] });
}
function ProfilesRoute() {
  usePageTitle("Profiles");
  const [tab, setTab] = useState("profiles");
  return /* @__PURE__ */ jsx("div", { className: "min-h-full overflow-y-auto bg-surface text-ink", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-5 flex gap-1 rounded-lg border border-primary-200 bg-primary-50/85 p-1 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => setTab("profiles"), className: `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === "profiles" ? "bg-primary-100 text-ink shadow-sm dark:bg-neutral-800" : "text-primary-500 hover:text-ink"}`, children: "Profiles" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setTab("monitoring"), className: `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === "monitoring" ? "bg-primary-100 text-ink shadow-sm dark:bg-neutral-800" : "text-primary-500 hover:text-ink"}`, children: "Monitoring" })
    ] }),
    tab === "profiles" ? /* @__PURE__ */ jsx(ProfilesScreen, {}) : /* @__PURE__ */ jsx(CrewScreen, {})
  ] }) });
}
export {
  ProfilesRoute as component
};
