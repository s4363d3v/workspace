import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { t as toast, c as cn, n as useFeatureAvailable, o as BackendUnavailableState, p as getUnavailableReason } from "./router-DmH5gXcK.js";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Clock01Icon, RefreshIcon, Add01Icon, Search01Icon, PlayIcon, PauseIcon, PencilEdit02Icon, ArrowUp01Icon, ArrowDown01Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import "@tanstack/react-router";
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
const SCHEDULE_PRESETS$1 = [
  { label: "Every 15m", value: "every 15m" },
  { label: "Every 30m", value: "every 30m" },
  { label: "Every 1h", value: "every 1h" },
  { label: "Every 6h", value: "every 6h" },
  { label: "Daily", value: "0 9 * * *" },
  { label: "Weekly", value: "0 9 * * 1" }
];
const DELIVERY_OPTIONS$1 = ["local", "telegram", "discord"];
function getInitialState$1(profile = "default") {
  return {
    profile,
    name: "",
    schedule: "every 30m",
    prompt: "",
    skillsInput: "",
    deliver: ["local"],
    repeatMode: "unlimited",
    repeatCount: "1"
  };
}
function CreateJobDialog({
  open,
  isSubmitting = false,
  profiles,
  onOpenChange,
  onSubmit
}) {
  const activeProfile = profiles.find((profile) => profile.active)?.name ?? profiles[0].name;
  const [form, setForm] = useState(() => getInitialState$1(activeProfile));
  useEffect(() => {
    if (!open) {
      setForm(getInitialState$1(activeProfile));
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange, activeProfile]);
  useEffect(() => {
    if (open) {
      setForm((current) => {
        if (profiles.some((profile) => profile.name === current.profile))
          return current;
        return { ...current, profile: activeProfile };
      });
    }
  }, [activeProfile, open, profiles]);
  function toggleDelivery(target) {
    setForm((current) => {
      const nextDeliver = current.deliver.includes(target) ? current.deliver.filter((item) => item !== target) : [...current.deliver, target];
      return {
        ...current,
        deliver: nextDeliver
      };
    });
  }
  function handleFormSubmit(event) {
    event.preventDefault();
    const skills = form.skillsInput.split(",").map((skill) => skill.trim()).filter(Boolean);
    void onSubmit({
      profile: form.profile,
      name: form.name.trim(),
      schedule: form.schedule.trim(),
      prompt: form.prompt.trim(),
      deliver: form.deliver.length > 0 ? form.deliver : void 0,
      skills: skills.length > 0 ? Array.from(new Set(skills)) : void 0,
      repeat: form.repeatMode === "limited" ? Math.max(1, Number.parseInt(form.repeatCount, 10) || 1) : void 0
    });
  }
  return /* @__PURE__ */ jsx(AnimatePresence, { children: open ? /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center px-4 py-8",
      onClick: (event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0",
            style: { background: "rgba(0, 0, 0, 0.68)" },
            onClick: () => onOpenChange(false)
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.form,
          {
            initial: { opacity: 0, scale: 0.96, y: 16 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.98, y: 10 },
            transition: { duration: 0.18, ease: "easeOut" },
            onSubmit: handleFormSubmit,
            className: "relative z-10 flex max-h-[85vh] w-[min(720px,96vw)] flex-col overflow-hidden rounded-2xl border shadow-2xl",
            style: {
              background: "var(--theme-card)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-text)"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-start justify-between gap-4 border-b px-5 py-4",
                  style: { borderColor: "var(--theme-border)" },
                  children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Create Job" }),
                      /* @__PURE__ */ jsx(
                        "p",
                        {
                          className: "mt-1 text-sm",
                          style: { color: "var(--theme-muted)" },
                          children: "Build a scheduled Hermes task with preset timing options."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onOpenChange(false),
                        className: "rounded-lg p-2 transition-colors",
                        style: { color: "var(--theme-muted)" },
                        "aria-label": "Close create job dialog",
                        children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Cancel01Icon, size: 18 })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-5 overflow-y-auto px-5 py-4", children: [
                /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Profile" }),
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: form.profile,
                      onChange: (event) => setForm((current) => ({
                        ...current,
                        profile: event.target.value
                      })),
                      required: true,
                      className: "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                      style: {
                        background: "var(--theme-input)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text)"
                      },
                      children: profiles.map((profile) => /* @__PURE__ */ jsxs("option", { value: profile.name, children: [
                        profile.name,
                        profile.active ? " (active)" : ""
                      ] }, profile.name))
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: "var(--theme-muted)" }, children: "Cron jobs are stored under the selected Hermes profile." })
                ] }),
                /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Name" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: form.name,
                      onChange: (event) => setForm((current) => ({
                        ...current,
                        name: event.target.value
                      })),
                      placeholder: "Daily research summary",
                      required: true,
                      className: "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                      style: {
                        background: "var(--theme-input)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text)",
                        boxShadow: "0 0 0 0 transparent"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium", children: "Schedule" }),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: "mt-1 text-xs",
                        style: { color: "var(--theme-muted)" },
                        children: "Choose a preset or enter a custom schedule string below."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: SCHEDULE_PRESETS$1.map((preset) => {
                    const isActive = form.schedule === preset.value;
                    return /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setForm((current) => ({
                          ...current,
                          schedule: preset.value
                        })),
                        className: "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        style: {
                          background: isActive ? "var(--theme-accent)" : "var(--theme-card)",
                          borderColor: isActive ? "var(--theme-accent)" : "var(--theme-border)",
                          color: isActive ? "#fff" : "var(--theme-text)"
                        },
                        children: preset.label
                      },
                      preset.label
                    );
                  }) }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Custom schedule" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: form.schedule,
                        onChange: (event) => setForm((current) => ({
                          ...current,
                          schedule: event.target.value
                        })),
                        placeholder: "every 30m or 0 9 * * *",
                        required: true,
                        className: "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                        style: {
                          background: "var(--theme-input)",
                          borderColor: "var(--theme-border)",
                          color: "var(--theme-text)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: "text-xs",
                        style: { color: "var(--theme-muted)" },
                        children: "Advanced users can enter cron expressions directly."
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Prompt" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      value: form.prompt,
                      onChange: (event) => setForm((current) => ({
                        ...current,
                        prompt: event.target.value
                      })),
                      placeholder: "What should Hermes Agent do?",
                      required: true,
                      rows: 5,
                      className: "w-full resize-none rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                      style: {
                        background: "var(--theme-input)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text)"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium", children: "Options" }),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: "mt-1 text-xs",
                        style: { color: "var(--theme-muted)" },
                        children: "Optional routing and repeat controls."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Skills" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: form.skillsInput,
                        onChange: (event) => setForm((current) => ({
                          ...current,
                          skillsInput: event.target.value
                        })),
                        placeholder: "research, writing, synthesis",
                        className: "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                        style: {
                          background: "var(--theme-input)",
                          borderColor: "var(--theme-border)",
                          color: "var(--theme-text)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: "text-xs",
                        style: { color: "var(--theme-muted)" },
                        children: "Comma-separated for now."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Deliver to" }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: DELIVERY_OPTIONS$1.map((option) => {
                      const isActive = form.deliver.includes(option);
                      const needsGateway = option === "telegram" || option === "discord";
                      return /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => toggleDelivery(option),
                          title: needsGateway ? `Requires Hermes Agent gateway with ${option} configured` : void 0,
                          className: "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                          style: {
                            background: isActive ? "var(--theme-accent)" : "var(--theme-card)",
                            borderColor: isActive ? "var(--theme-accent)" : "var(--theme-border)",
                            color: isActive ? "#fff" : needsGateway ? "var(--theme-muted)" : "var(--theme-text)"
                          },
                          children: [
                            option,
                            needsGateway ? " ⚡" : ""
                          ]
                        },
                        option
                      );
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Repeat" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setForm((current) => ({
                            ...current,
                            repeatMode: "unlimited"
                          })),
                          className: "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                          style: {
                            background: form.repeatMode === "unlimited" ? "var(--theme-accent)" : "var(--theme-card)",
                            borderColor: form.repeatMode === "unlimited" ? "var(--theme-accent)" : "var(--theme-border)",
                            color: form.repeatMode === "unlimited" ? "#fff" : "var(--theme-text)"
                          },
                          children: "Unlimited"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setForm((current) => ({
                            ...current,
                            repeatMode: "limited"
                          })),
                          className: "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                          style: {
                            background: form.repeatMode === "limited" ? "var(--theme-accent)" : "var(--theme-card)",
                            borderColor: form.repeatMode === "limited" ? "var(--theme-accent)" : "var(--theme-border)",
                            color: form.repeatMode === "limited" ? "#fff" : "var(--theme-text)"
                          },
                          children: "Set count"
                        }
                      )
                    ] }),
                    form.repeatMode === "limited" ? /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        step: 1,
                        value: form.repeatCount,
                        onChange: (event) => setForm((current) => ({
                          ...current,
                          repeatCount: event.target.value
                        })),
                        className: "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                        style: {
                          background: "var(--theme-input)",
                          borderColor: "var(--theme-border)",
                          color: "var(--theme-text)"
                        }
                      }
                    ) : null
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-end gap-2 border-t px-5 py-4",
                  style: { borderColor: "var(--theme-border)" },
                  children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onOpenChange(false),
                        className: "rounded-xl px-4 py-2 text-sm transition-colors",
                        style: {
                          background: "var(--theme-card)",
                          color: "var(--theme-muted)"
                        },
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        disabled: isSubmitting || !form.name.trim() || !form.schedule.trim() || !form.prompt.trim(),
                        className: "rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50",
                        style: { background: "var(--theme-accent)" },
                        children: isSubmitting ? "Creating..." : "Create"
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    },
    "create-job-dialog"
  ) : null });
}
const SCHEDULE_PRESETS = [
  { label: "Every 15m", value: "every 15m" },
  { label: "Every 30m", value: "every 30m" },
  { label: "Every 1h", value: "every 1h" },
  { label: "Every 6h", value: "every 6h" },
  { label: "Daily", value: "0 9 * * *" },
  { label: "Weekly", value: "0 9 * * 1" }
];
const DELIVERY_OPTIONS = ["local", "telegram", "discord"];
function readScheduleValue(job) {
  if (typeof job.schedule_display === "string" && job.schedule_display.trim()) {
    return job.schedule_display.trim();
  }
  const schedule = job.schedule;
  if (typeof schedule === "object") {
    const record = schedule;
    const candidates = [
      record.expression,
      record.cron,
      record.raw,
      record.value,
      record.schedule
    ];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }
  return "";
}
function getInitialState(job) {
  const repeatTimes = job?.repeat?.times;
  const repeatCompleted = job?.repeat?.completed ?? 0;
  const remainingRepeats = typeof repeatTimes === "number" ? Math.max(1, repeatTimes - repeatCompleted) : null;
  return {
    profile: job?.profile ?? "default",
    name: job?.name ?? "",
    schedule: job ? readScheduleValue(job) : "every 30m",
    prompt: job?.prompt ?? "",
    skillsInput: Array.isArray(job?.skills) ? job.skills.join(", ") : "",
    deliver: Array.isArray(job?.deliver) && job.deliver.length > 0 ? [...job.deliver] : ["local"],
    repeatMode: remainingRepeats === null ? "unlimited" : "limited",
    repeatCount: remainingRepeats === null ? "1" : String(remainingRepeats)
  };
}
function EditJobDialog({
  job,
  open,
  isSubmitting = false,
  profiles,
  onOpenChange,
  onSubmit
}) {
  const [form, setForm] = useState(() => getInitialState(job));
  useEffect(() => {
    if (!open) {
      setForm(getInitialState(job));
      return;
    }
    setForm(getInitialState(job));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [job, open, onOpenChange]);
  function toggleDelivery(target) {
    setForm((current) => {
      const nextDeliver = current.deliver.includes(target) ? current.deliver.filter((item) => item !== target) : [...current.deliver, target];
      return {
        ...current,
        deliver: nextDeliver
      };
    });
  }
  function handleFormSubmit(event) {
    event.preventDefault();
    const skills = form.skillsInput.split(",").map((skill) => skill.trim()).filter(Boolean);
    void onSubmit({
      profile: form.profile,
      name: form.name.trim(),
      schedule: form.schedule.trim(),
      prompt: form.prompt.trim(),
      deliver: form.deliver.length > 0 ? form.deliver : void 0,
      skills: skills.length > 0 ? Array.from(new Set(skills)) : void 0,
      repeat: form.repeatMode === "limited" ? Math.max(1, Number.parseInt(form.repeatCount, 10) || 1) : void 0
    });
  }
  return /* @__PURE__ */ jsx(AnimatePresence, { children: open && job ? /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center px-4 py-8",
      onClick: (event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0",
            style: { background: "rgba(0, 0, 0, 0.68)" },
            onClick: () => onOpenChange(false)
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.form,
          {
            initial: { opacity: 0, scale: 0.96, y: 16 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.98, y: 10 },
            transition: { duration: 0.18, ease: "easeOut" },
            onSubmit: handleFormSubmit,
            className: "relative z-10 flex max-h-[85vh] w-[min(720px,96vw)] flex-col overflow-hidden rounded-2xl border shadow-2xl",
            style: {
              background: "var(--theme-card)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-text)"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-start justify-between gap-4 border-b px-5 py-4",
                  style: { borderColor: "var(--theme-border)" },
                  children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Edit Job" }),
                      /* @__PURE__ */ jsx(
                        "p",
                        {
                          className: "mt-1 text-sm",
                          style: { color: "var(--theme-muted)" },
                          children: "Update the schedule, prompt, and routing for this Hermes task."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onOpenChange(false),
                        className: "rounded-lg p-2 transition-colors",
                        style: { color: "var(--theme-muted)" },
                        "aria-label": "Close edit job dialog",
                        children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Cancel01Icon, size: 18 })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-5 overflow-y-auto px-5 py-4", children: [
                /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Profile" }),
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: form.profile,
                      onChange: (event) => setForm((current) => ({
                        ...current,
                        profile: event.target.value
                      })),
                      required: true,
                      className: "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                      style: {
                        background: "var(--theme-input)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text)"
                      },
                      children: profiles.map((profile) => /* @__PURE__ */ jsxs("option", { value: profile.name, children: [
                        profile.name,
                        profile.active ? " (active)" : ""
                      ] }, profile.name))
                    }
                  ),
                  job.profile && form.profile !== job.profile ? /* @__PURE__ */ jsxs(
                    "p",
                    {
                      className: "text-xs",
                      style: { color: "var(--theme-muted)" },
                      children: [
                        "Saving will recreate this cron job in ",
                        form.profile,
                        " and remove it from ",
                        job.profile,
                        "."
                      ]
                    }
                  ) : /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: "text-xs",
                      style: { color: "var(--theme-muted)" },
                      children: "Cron jobs are stored under the selected Hermes profile."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Name" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: form.name,
                      onChange: (event) => setForm((current) => ({
                        ...current,
                        name: event.target.value
                      })),
                      placeholder: "Daily research summary",
                      required: true,
                      className: "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                      style: {
                        background: "var(--theme-input)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text)",
                        boxShadow: "0 0 0 0 transparent"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium", children: "Schedule" }),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: "mt-1 text-xs",
                        style: { color: "var(--theme-muted)" },
                        children: "Choose a preset or enter a custom schedule string below."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: SCHEDULE_PRESETS.map((preset) => {
                    const isActive = form.schedule === preset.value;
                    return /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setForm((current) => ({
                          ...current,
                          schedule: preset.value
                        })),
                        className: "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                        style: {
                          background: isActive ? "var(--theme-accent)" : "var(--theme-card)",
                          borderColor: isActive ? "var(--theme-accent)" : "var(--theme-border)",
                          color: isActive ? "#fff" : "var(--theme-text)"
                        },
                        children: preset.label
                      },
                      preset.label
                    );
                  }) }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Custom schedule" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: form.schedule,
                        onChange: (event) => setForm((current) => ({
                          ...current,
                          schedule: event.target.value
                        })),
                        placeholder: "every 30m or 0 9 * * *",
                        required: true,
                        className: "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                        style: {
                          background: "var(--theme-input)",
                          borderColor: "var(--theme-border)",
                          color: "var(--theme-text)"
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Prompt" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      value: form.prompt,
                      onChange: (event) => setForm((current) => ({
                        ...current,
                        prompt: event.target.value
                      })),
                      placeholder: "What should Hermes Agent do?",
                      required: true,
                      rows: 5,
                      className: "w-full resize-none rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                      style: {
                        background: "var(--theme-input)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text)"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium", children: "Options" }),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: "mt-1 text-xs",
                        style: { color: "var(--theme-muted)" },
                        children: "Optional routing and repeat controls."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Skills" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: form.skillsInput,
                        onChange: (event) => setForm((current) => ({
                          ...current,
                          skillsInput: event.target.value
                        })),
                        placeholder: "research, writing, synthesis",
                        className: "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                        style: {
                          background: "var(--theme-input)",
                          borderColor: "var(--theme-border)",
                          color: "var(--theme-text)"
                        }
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Deliver to" }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: DELIVERY_OPTIONS.map((option) => {
                      const isActive = form.deliver.includes(option);
                      const needsGateway = option === "telegram" || option === "discord";
                      return /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => toggleDelivery(option),
                          title: needsGateway ? `Requires Hermes Agent gateway with ${option} configured` : void 0,
                          className: "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                          style: {
                            background: isActive ? "var(--theme-accent)" : "var(--theme-card)",
                            borderColor: isActive ? "var(--theme-accent)" : "var(--theme-border)",
                            color: isActive ? "#fff" : needsGateway ? "var(--theme-muted)" : "var(--theme-text)"
                          },
                          children: option
                        },
                        option
                      );
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Repeat" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setForm((current) => ({
                            ...current,
                            repeatMode: "unlimited"
                          })),
                          className: "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                          style: {
                            background: form.repeatMode === "unlimited" ? "var(--theme-accent)" : "var(--theme-card)",
                            borderColor: form.repeatMode === "unlimited" ? "var(--theme-accent)" : "var(--theme-border)",
                            color: form.repeatMode === "unlimited" ? "#fff" : "var(--theme-text)"
                          },
                          children: "Unlimited"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setForm((current) => ({
                            ...current,
                            repeatMode: "limited"
                          })),
                          className: "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                          style: {
                            background: form.repeatMode === "limited" ? "var(--theme-accent)" : "var(--theme-card)",
                            borderColor: form.repeatMode === "limited" ? "var(--theme-accent)" : "var(--theme-border)",
                            color: form.repeatMode === "limited" ? "#fff" : "var(--theme-text)"
                          },
                          children: "Set count"
                        }
                      )
                    ] }),
                    form.repeatMode === "limited" ? /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        step: 1,
                        value: form.repeatCount,
                        onChange: (event) => setForm((current) => ({
                          ...current,
                          repeatCount: event.target.value
                        })),
                        className: "w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1",
                        style: {
                          background: "var(--theme-input)",
                          borderColor: "var(--theme-border)",
                          color: "var(--theme-text)"
                        }
                      }
                    ) : null
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-end gap-2 border-t px-5 py-4",
                  style: { borderColor: "var(--theme-border)" },
                  children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onOpenChange(false),
                        className: "rounded-xl px-4 py-2 text-sm transition-colors",
                        style: {
                          background: "var(--theme-card)",
                          color: "var(--theme-muted)"
                        },
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        disabled: isSubmitting || !form.name.trim() || !form.schedule.trim() || !form.prompt.trim(),
                        className: "rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50",
                        style: { background: "var(--theme-accent)" },
                        children: isSubmitting ? "Saving..." : "Save changes"
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    },
    "edit-job-dialog"
  ) : null });
}
const CLAUDE_API = "/api/claude-jobs";
function normalizeJobsResponse(data) {
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && data !== null && "jobs" in data && Array.isArray(data.jobs)) {
    return data.jobs;
  }
  return [];
}
async function fetchJobs() {
  const res = await fetch(`${CLAUDE_API}?include_disabled=true&profiles=all`);
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
  const data = await res.json();
  return normalizeJobsResponse(data);
}
function errorMessageFromBody(body, fallback) {
  if (typeof body === "string" && body.trim()) return body;
  if (body && typeof body === "object") {
    const detail = body.detail;
    if (typeof detail === "string" && detail.trim()) return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const msg = item.msg ?? item.message;
          if (typeof msg === "string") return msg;
        }
        return JSON.stringify(item);
      }).join("; ");
    }
    if (detail !== void 0) {
      try {
        return JSON.stringify(detail);
      } catch {
      }
    }
    const message = body.message;
    if (typeof message === "string" && message.trim()) return message;
    const error = body.error;
    if (typeof error === "string" && error.trim()) return error;
  }
  return fallback;
}
function serializeDeliveryTargets(deliver) {
  if (typeof deliver === "string") {
    const normalized2 = deliver.trim();
    return normalized2 || void 0;
  }
  if (!Array.isArray(deliver)) return void 0;
  const normalized = deliver.map((value) => value.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized.join(",") : void 0;
}
function buildJobMutationPayload(input) {
  const prompt = typeof input.prompt === "string" ? input.prompt : "";
  const deliver = serializeDeliveryTargets(input.deliver);
  return {
    ...input,
    prompt,
    input: prompt,
    deliver
  };
}
async function createJob(input) {
  const res = await fetch(CLAUDE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildJobMutationPayload(input))
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      errorMessageFromBody(body, `Failed to create job: ${res.status}`)
    );
  }
  return (await res.json()).job;
}
async function updateJob(jobId, updates) {
  const payload = {
    ...updates,
    ...typeof updates.prompt === "string" ? { input: updates.prompt } : {},
    ...Object.prototype.hasOwnProperty.call(updates, "deliver") ? {
      deliver: serializeDeliveryTargets(
        updates.deliver
      )
    } : {}
  };
  const res = await fetch(`${CLAUDE_API}/${jobId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      errorMessageFromBody(body, `Failed to update job: ${res.status}`)
    );
  }
  return (await res.json()).job;
}
async function deleteJob(jobId) {
  const res = await fetch(`${CLAUDE_API}/${jobId}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      errorMessageFromBody(body, `Failed to delete job: ${res.status}`)
    );
  }
}
async function pauseJob(jobId) {
  const res = await fetch(`${CLAUDE_API}/${jobId}?action=pause`, {
    method: "POST"
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      errorMessageFromBody(body, `Failed to pause job: ${res.status}`)
    );
  }
  return (await res.json()).job;
}
async function resumeJob(jobId) {
  const res = await fetch(`${CLAUDE_API}/${jobId}?action=resume`, {
    method: "POST"
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      errorMessageFromBody(body, `Failed to resume job: ${res.status}`)
    );
  }
  return (await res.json()).job;
}
async function triggerJob(jobId) {
  const res = await fetch(`${CLAUDE_API}/${jobId}?action=run`, {
    method: "POST"
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      errorMessageFromBody(body, `Failed to trigger job: ${res.status}`)
    );
  }
  return (await res.json()).job;
}
async function fetchJobProfiles() {
  const res = await fetch("/api/profiles/list");
  if (!res.ok) throw new Error(`Failed to fetch profiles: ${res.status}`);
  const cronProfileNamePattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
  const data = await res.json();
  return Array.isArray(data.profiles) ? data.profiles.map((profile) => ({
    name: typeof profile.name === "string" ? profile.name : "",
    active: profile.active === true,
    exists: profile.exists !== false
  })).filter(
    (profile) => profile.exists && cronProfileNamePattern.test(profile.name)
  ).map(({ name, active }) => ({ name, active })) : [];
}
async function fetchJobOutput(jobId, limit = 10) {
  const res = await fetch(`${CLAUDE_API}/${jobId}?action=output&limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch output: ${res.status}`);
  return (await res.json()).outputs ?? [];
}
const QUERY_KEY = ["claude", "jobs"];
const PROFILES_QUERY_KEY = ["claude", "job-profiles"];
function formatNextRun(nextRun) {
  if (!nextRun) return "—";
  try {
    const d = new Date(nextRun);
    const now = /* @__PURE__ */ new Date();
    const diffMs = d.getTime() - now.getTime();
    if (diffMs < 0) return "overdue";
    if (diffMs < 6e4) return "in < 1m";
    if (diffMs < 36e5) return `in ${Math.round(diffMs / 6e4)}m`;
    if (diffMs < 864e5) return `in ${Math.round(diffMs / 36e5)}h`;
    return d.toLocaleDateString();
  } catch {
    return nextRun;
  }
}
function formatRunTimestamp(value) {
  if (!value) return "Never run";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}
function getOutputPreview(content) {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (normalized.length <= 200) return normalized;
  return `${normalized.slice(0, 200).trimEnd()}…`;
}
function getLastRunStatus(job) {
  if (!job.last_run_at) {
    return {
      label: "Never run",
      color: "var(--theme-muted)"
    };
  }
  if (job.last_run_success === true) {
    return {
      label: "Last run succeeded",
      color: "var(--theme-success)"
    };
  }
  if (job.last_run_success === false) {
    return {
      label: "Last run failed",
      color: "var(--theme-danger)"
    };
  }
  return {
    label: "Last run unknown",
    color: "var(--theme-muted)"
  };
}
function JobCard({
  job,
  onPause,
  onResume,
  onTrigger,
  onDelete,
  onEdit
}) {
  const [expanded, setExpanded] = useState(false);
  const isPaused = job.state === "paused" || !job.enabled;
  const isCompleted = job.state === "completed";
  const lastRunStatus = getLastRunStatus(job);
  const outputQuery = useQuery({
    queryKey: ["claude", "jobs", job.id, "output"],
    queryFn: () => fetchJobOutput(job.id),
    enabled: expanded,
    staleTime: 3e4
  });
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
      className: cn(
        "rounded-xl border p-4 transition-colors",
        "bg-[var(--theme-card)] border-[var(--theme-border)]",
        isPaused && "opacity-60"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "inline-block h-2 w-2 shrink-0 rounded-full",
                  style: {
                    background: isPaused ? "var(--theme-muted)" : isCompleted ? "var(--theme-accent)" : "var(--theme-text)"
                  }
                }
              ),
              /* @__PURE__ */ jsx("h3", { className: "truncate text-sm font-medium text-[var(--theme-text)]", children: job.name || "(unnamed)" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mb-2 line-clamp-2 text-xs text-[var(--theme-muted)]", children: job.prompt }),
            /* @__PURE__ */ jsxs("div", { className: "mb-2 flex flex-wrap items-center gap-3 text-[10px] text-[var(--theme-muted)]", children: [
              job.profile && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "rounded-md border border-[var(--theme-border)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--theme-text)]", children: job.profile }),
                /* @__PURE__ */ jsx("span", { children: "·" })
              ] }),
              /* @__PURE__ */ jsx("span", { children: job.schedule_display || "custom" }),
              /* @__PURE__ */ jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Next: ",
                formatNextRun(job.next_run_at)
              ] }),
              /* @__PURE__ */ jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Last: ",
                formatRunTimestamp(job.last_run_at)
              ] }),
              job.skills && job.skills.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { children: "·" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  job.skills.length,
                  " skill",
                  job.skills.length !== 1 ? "s" : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[11px] text-[var(--theme-muted)]", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "inline-block h-2.5 w-2.5 rounded-full",
                  style: { background: lastRunStatus.color }
                }
              ),
              /* @__PURE__ */ jsx("span", { children: lastRunStatus.label })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onTrigger(job.id),
                className: "rounded-lg p-1.5 transition-colors hover:bg-[var(--theme-hover)]",
                title: "Run now",
                children: /* @__PURE__ */ jsx(
                  HugeiconsIcon,
                  {
                    icon: PlayIcon,
                    size: 14,
                    className: "text-[var(--theme-accent)]"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => isPaused ? onResume(job.id) : onPause(job.id),
                className: "rounded-lg p-1.5 transition-colors hover:bg-[var(--theme-hover)]",
                title: isPaused ? "Resume" : "Pause",
                children: /* @__PURE__ */ jsx(
                  HugeiconsIcon,
                  {
                    icon: isPaused ? PlayIcon : PauseIcon,
                    size: 14,
                    className: "text-[var(--theme-muted)]"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onEdit(job),
                className: "rounded-lg p-1.5 transition-colors hover:bg-[var(--theme-hover)]",
                title: "Edit",
                children: /* @__PURE__ */ jsx(
                  HugeiconsIcon,
                  {
                    icon: PencilEdit02Icon,
                    size: 14,
                    className: "text-[var(--theme-muted)]"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setExpanded((current) => !current),
                className: "rounded-lg p-1.5 transition-colors hover:bg-[var(--theme-hover)]",
                title: expanded ? "Hide run history" : "Show run history",
                children: /* @__PURE__ */ jsx(
                  HugeiconsIcon,
                  {
                    icon: expanded ? ArrowUp01Icon : ArrowDown01Icon,
                    size: 14,
                    className: "text-[var(--theme-muted)]"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onDelete(job.id),
                className: "rounded-lg p-1.5 transition-colors hover:bg-[var(--theme-hover)]",
                title: "Delete",
                children: /* @__PURE__ */ jsx(
                  HugeiconsIcon,
                  {
                    icon: Delete01Icon,
                    size: 14,
                    style: { color: "var(--theme-danger)" }
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: expanded ? /* @__PURE__ */ jsx(
          motion.div,
          {
            layout: true,
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxs("div", { className: "mt-3 border-t border-[var(--theme-border)] pt-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-[var(--theme-text)]", children: "Run history" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--theme-muted)]", children: "Showing recent outputs" })
              ] }),
              outputQuery.isLoading ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-3 text-xs text-[var(--theme-muted)]", children: "Loading outputs..." }) : outputQuery.isError ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-3 text-xs text-[var(--theme-muted)]", children: "Failed to load outputs." }) : outputQuery.data && outputQuery.data.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: outputQuery.data.map((output) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-3",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center justify-between gap-2 text-[10px] text-[var(--theme-muted)]", children: [
                      /* @__PURE__ */ jsx("span", { children: formatRunTimestamp(output.timestamp) }),
                      /* @__PURE__ */ jsx("span", { className: "truncate", children: output.filename })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-[var(--theme-text)]", children: getOutputPreview(output.content) || "No output content" })
                  ]
                },
                `${output.filename}-${output.timestamp}`
              )) }) : /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-3 text-xs text-[var(--theme-muted)]", children: "No run outputs yet." })
            ] })
          }
        ) : null })
      ]
    }
  );
}
function JobsScreen() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const jobsQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchJobs,
    refetchInterval: 3e4
  });
  const profilesQuery = useQuery({
    queryKey: PROFILES_QUERY_KEY,
    queryFn: fetchJobProfiles,
    staleTime: 6e4
  });
  const profiles = useMemo(
    () => profilesQuery.data?.length ? profilesQuery.data : [{ name: "default", active: true }],
    [profilesQuery.data]
  );
  const pauseMutation = useMutation({
    mutationFn: pauseJob,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast("Job paused");
    }
  });
  const resumeMutation = useMutation({
    mutationFn: resumeJob,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast("Job resumed");
    }
  });
  const triggerMutation = useMutation({
    mutationFn: triggerJob,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast("Job triggered");
    }
  });
  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast("Job deleted");
    }
  });
  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast("Job created");
      setShowCreate(false);
    },
    onError: (error) => {
      toast(error instanceof Error ? error.message : "Failed to create job", {
        type: "error"
      });
    }
  });
  const updateMutation = useMutation({
    mutationFn: async (payload) => updateJob(payload.jobId, payload.updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast("Job updated");
      setEditingJob(null);
    },
    onError: (error) => {
      toast(error instanceof Error ? error.message : "Failed to update job", {
        type: "error"
      });
    }
  });
  const filteredJobs = useMemo(() => {
    const jobs = jobsQuery.data ?? [];
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) => j.name.toLowerCase().includes(q) || j.prompt.toLowerCase().includes(q) || j.profile?.toLowerCase().includes(q)
    );
  }, [jobsQuery.data, search]);
  const handleCreate = useCallback(
    async (input) => {
      await createMutation.mutateAsync(input);
    },
    [createMutation]
  );
  return /* @__PURE__ */ jsx("div", { className: "min-h-full overflow-y-auto bg-surface text-ink", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-4 py-6 pb-[calc(var(--tabbar-h,80px)+1.5rem)] sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("header", { className: "rounded-2xl border border-primary-200 bg-primary-50/85 p-4 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          HugeiconsIcon,
          {
            icon: Clock01Icon,
            size: 18,
            className: "text-[var(--theme-accent)]"
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-base font-semibold text-[var(--theme-text)]", children: "Jobs" }),
        jobsQuery.data && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs text-[var(--theme-muted)]", children: [
          "(",
          jobsQuery.data.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => void queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
            className: "rounded-lg p-1.5 transition-colors hover:bg-[var(--theme-hover)]",
            title: "Refresh",
            children: /* @__PURE__ */ jsx(
              HugeiconsIcon,
              {
                icon: RefreshIcon,
                size: 16,
                className: "text-[var(--theme-muted)]"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowCreate(true),
            className: "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90",
            style: { background: "var(--theme-accent)" },
            children: [
              /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Add01Icon, size: 14 }),
              "New Job"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-primary-200 bg-primary-50/85 p-4 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          HugeiconsIcon,
          {
            icon: Search01Icon,
            size: 14,
            className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--theme-muted)]"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search jobs...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "w-full rounded-lg border border-[var(--theme-border)] bg-[var(--theme-input)] py-1.5 pl-8 pr-3 text-xs text-[var(--theme-text)] placeholder:text-[var(--theme-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]"
          }
        )
      ] }),
      profilesQuery.isError ? /* @__PURE__ */ jsx(
        "p",
        {
          className: "mt-2 text-xs",
          style: { color: "var(--theme-warning)" },
          children: "Profile list failed to load. New jobs will default to the default profile until profiles refresh."
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 space-y-2 overflow-y-auto px-4 py-3", children: jobsQuery.isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12 text-sm text-[var(--theme-muted)]", children: "Loading jobs..." }) : jobsQuery.isError ? /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center justify-center py-12 text-sm",
        style: { color: "var(--theme-danger)" },
        children: [
          "Failed to load jobs:",
          " ",
          jobsQuery.error instanceof Error ? jobsQuery.error.message : "Unknown error"
        ]
      }
    ) : filteredJobs.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-[var(--theme-muted)]", children: [
      /* @__PURE__ */ jsx(
        HugeiconsIcon,
        {
          icon: Clock01Icon,
          size: 32,
          className: "mb-3 opacity-40"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "No scheduled jobs" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs", children: "No cron jobs found across Hermes profiles" })
    ] }) : /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: filteredJobs.map((job) => /* @__PURE__ */ jsx(
      JobCard,
      {
        job,
        onPause: (id) => pauseMutation.mutate(id),
        onResume: (id) => resumeMutation.mutate(id),
        onTrigger: (id) => triggerMutation.mutate(id),
        onEdit: (selectedJob) => setEditingJob(selectedJob),
        onDelete: (id) => {
          if (confirm(`Delete job "${job.name}"?`)) {
            deleteMutation.mutate(id);
          }
        }
      },
      job.id
    )) }) }),
    /* @__PURE__ */ jsx(
      CreateJobDialog,
      {
        open: showCreate,
        profiles,
        onOpenChange: setShowCreate,
        onSubmit: handleCreate,
        isSubmitting: createMutation.isPending
      }
    ),
    /* @__PURE__ */ jsx(
      EditJobDialog,
      {
        job: editingJob,
        open: editingJob !== null,
        profiles,
        onOpenChange: (open) => {
          if (!open) setEditingJob(null);
        },
        onSubmit: async (updates) => {
          if (!editingJob) return;
          await updateMutation.mutateAsync({
            jobId: editingJob.id,
            updates
          });
        },
        isSubmitting: updateMutation.isPending
      }
    )
  ] }) });
}
const SplitComponent = function JobsRoute() {
  usePageTitle("Jobs");
  if (!useFeatureAvailable("jobs")) {
    return /* @__PURE__ */ jsx(BackendUnavailableState, { feature: "Jobs", description: getUnavailableReason("Jobs") });
  }
  return /* @__PURE__ */ jsx(JobsScreen, {});
};
export {
  SplitComponent as component
};
