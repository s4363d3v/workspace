import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { Award01Icon, CancelIcon, ChartLineData01Icon, ConsoleIcon, AlertCircleIcon, Idea01Icon, Refresh01Icon, ChartBarLineIcon, Sun02Icon, Moon02Icon, BubbleChatAddIcon, PuzzleIcon, CheckmarkCircle02Icon, Edit02Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useCallback } from "react";
import { a as formatModelName, b as formatSkillName } from "./formatters-6LLYcQeb.js";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar } from "recharts";
import { c as cn, n as useFeatureAvailable, p as getUnavailableReason, C as useSettingsStore, E as openHamburgerMenu, G as applyTheme } from "./router-DmH5gXcK.js";
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
const TIER_COLORS = {
  Copper: "#b45309",
  Silver: "#9ca3af",
  Gold: "#facc15",
  Diamond: "#22d3ee",
  Olympian: "#f472b6"
};
function tierColor(tier) {
  if (!tier) return "var(--theme-muted)";
  return TIER_COLORS[tier] ?? "var(--theme-muted)";
}
function relativeTime$1(unlockedAtSeconds) {
  if (!unlockedAtSeconds) return "";
  const diff = Date.now() / 1e3 - unlockedAtSeconds;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
function AchievementRow({
  unlock,
  compact = false
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex items-center gap-2 rounded border px-2 py-1.5",
      style: { borderColor: "var(--theme-border)" },
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            className: "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-base",
            style: {
              background: "color-mix(in srgb, var(--theme-accent) 12%, transparent)",
              color: tierColor(unlock.tier)
            },
            children: "🏆"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "truncate text-[11px] font-semibold",
              style: { color: "var(--theme-text)" },
              children: unlock.name
            }
          ),
          !compact ? /* @__PURE__ */ jsx(
            "div",
            {
              className: "truncate text-[10px]",
              style: { color: "var(--theme-muted)" },
              children: unlock.description || unlock.category
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          unlock.tier ? /* @__PURE__ */ jsx(
            "span",
            {
              className: "block text-[9px] font-mono uppercase tracking-[0.1em]",
              style: { color: tierColor(unlock.tier) },
              children: unlock.tier
            }
          ) : null,
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "block text-[9px] font-mono",
              style: { color: "var(--theme-muted)" },
              children: relativeTime$1(unlock.unlockedAt)
            }
          )
        ] })
      ]
    }
  );
}
function AchievementsCard({
  achievements
}) {
  const [showAll, setShowAll] = useState(false);
  const [allUnlocks, setAllUnlocks] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const [allError, setAllError] = useState(null);
  if (!achievements) return null;
  const openModal = async () => {
    setShowAll(true);
    if (allUnlocks !== null) return;
    setLoadingAll(true);
    setAllError(null);
    try {
      const res = await fetch("/api/dashboard/overview?achievements=12");
      if (!res.ok) throw new Error(`overview ${res.status}`);
      const data = await res.json();
      setAllUnlocks(data.achievements?.recentUnlocks ?? []);
    } catch (err) {
      setAllError(err instanceof Error ? err.message : "failed to load");
    } finally {
      setLoadingAll(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative overflow-hidden rounded-xl border p-3",
        style: {
          background: "linear-gradient(150deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
          borderColor: "var(--theme-border)"
        },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": true,
              className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
              style: {
                background: "linear-gradient(90deg, #facc15, color-mix(in srgb, #facc15 40%, transparent), transparent)"
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                HugeiconsIcon,
                {
                  icon: Award01Icon,
                  size: 14,
                  strokeWidth: 1.5,
                  style: { color: "var(--theme-muted)" }
                }
              ),
              /* @__PURE__ */ jsx(
                "h3",
                {
                  className: "text-[10px] font-semibold uppercase tracking-[0.18em]",
                  style: { color: "var(--theme-text)" },
                  children: "Achievements"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: openModal,
                className: "font-mono text-[9px] uppercase tracking-[0.15em] transition-colors hover:text-[var(--theme-accent)]",
                style: { color: "var(--theme-muted)" },
                children: [
                  achievements.totalUnlocked,
                  " unlocked · view all →"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: achievements.recentUnlocks.length === 0 ? /* @__PURE__ */ jsx(
            "div",
            {
              className: "py-3 text-center text-[11px]",
              style: { color: "var(--theme-muted)" },
              children: "No unlocks yet — keep working."
            }
          ) : (
            // Render every unlock the aggregator returns so the card
            // grows to consume vertical space (Eric's iter-007 ask).
            // Default count is now 5 so the rail has more presence.
            achievements.recentUnlocks.map((unlock) => /* @__PURE__ */ jsx(AchievementRow, { unlock }, unlock.id))
          ) })
        ]
      }
    ),
    showAll ? /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8",
        role: "dialog",
        "aria-modal": "true",
        onClick: () => setShowAll(false),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg border bg-[var(--theme-card)]",
            style: { borderColor: "var(--theme-border)" },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between border-b px-4 py-3",
                  style: { borderColor: "var(--theme-border)" },
                  children: [
                    /* @__PURE__ */ jsx(
                      "h2",
                      {
                        className: "text-sm font-semibold uppercase tracking-[0.15em]",
                        style: { color: "var(--theme-text)" },
                        children: "Achievement Ribbon"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowAll(false),
                        "aria-label": "Close",
                        className: "rounded p-1 hover:bg-[var(--theme-card)]/80",
                        children: /* @__PURE__ */ jsx(
                          HugeiconsIcon,
                          {
                            icon: CancelIcon,
                            size: 16,
                            strokeWidth: 1.5,
                            style: { color: "var(--theme-muted)" }
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "max-h-[64vh] overflow-y-auto p-4", children: loadingAll ? /* @__PURE__ */ jsx(
                "div",
                {
                  className: "py-8 text-center text-[11px]",
                  style: { color: "var(--theme-muted)" },
                  children: "Loading…"
                }
              ) : allError ? /* @__PURE__ */ jsx(
                "div",
                {
                  className: "py-8 text-center text-[11px]",
                  style: { color: "var(--theme-danger)" },
                  children: allError
                }
              ) : /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: (allUnlocks ?? achievements.recentUnlocks).map((unlock) => /* @__PURE__ */ jsx(AchievementRow, { unlock }, unlock.id)) }) })
            ]
          }
        )
      }
    ) : null
  ] });
}
function formatCount$1(n) {
  if (!n || n <= 0) return "0";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}
function ActiveModelKpi({
  modelInfo,
  analytics
}) {
  const connected = !!modelInfo;
  const display = modelInfo ? formatModelName(modelInfo.model) : "—";
  const provider = modelInfo?.provider ?? "—";
  const share = (() => {
    if (!modelInfo || !analytics) return null;
    if (analytics.totalApiCalls <= 0) return null;
    const match = analytics.topModels.find((m) => m.id === modelInfo.model);
    if (!match) return null;
    return Math.round(match.calls / analytics.totalApiCalls * 100);
  })();
  const sessionsForModel = (() => {
    if (!modelInfo || !analytics) return null;
    const match = analytics.topModels.find((m) => m.id === modelInfo.model);
    return match?.sessions ?? null;
  })();
  const tone = connected ? "var(--theme-success)" : "var(--theme-danger)";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex flex-col gap-2 overflow-hidden rounded-xl border px-4 pb-3 pt-4",
      style: {
        background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: {
              background: `linear-gradient(90deg, ${tone}, ${tone}55, transparent)`
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-25 blur-2xl",
            style: { background: tone }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "text-[10px] font-semibold uppercase tracking-[0.18em]",
              style: { color: "var(--theme-muted)" },
              children: "Active Model"
            }
          ),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              style: {
                background: connected ? "color-mix(in srgb, var(--theme-success) 14%, transparent)" : "color-mix(in srgb, var(--theme-danger) 14%, transparent)",
                color: tone
              },
              children: [
                /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full", style: { background: tone } }),
                connected ? "Online" : "Offline"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-2", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "font-mono text-2xl font-bold leading-none tracking-tight",
              style: { color: "var(--theme-text)" },
              title: modelInfo?.model,
              children: display
            }
          ),
          share !== null ? /* @__PURE__ */ jsxs(
            "span",
            {
              className: "rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
              style: {
                background: "color-mix(in srgb, var(--theme-accent) 12%, transparent)",
                color: "var(--theme-accent)"
              },
              title: "Share of API calls in the analytics window.",
              children: [
                share,
                "% calls"
              ]
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 text-[10px]", children: [
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "truncate font-mono uppercase tracking-[0.12em]",
              style: { color: "var(--theme-muted)" },
              children: [
                provider,
                sessionsForModel !== null ? ` · ${formatCount$1(sessionsForModel)} sessions` : ""
              ]
            }
          ),
          modelInfo?.effectiveContextLength ? /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono uppercase tracking-[0.12em]",
              style: { color: "var(--theme-muted)" },
              children: [
                "ctx ",
                formatCount$1(modelInfo.effectiveContextLength)
              ]
            }
          ) : null
        ] })
      ]
    }
  );
}
const PERIODS = [7, 14, 30];
function formatTokens$7(n) {
  if (!n || n <= 0) return "0";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
function formatCost$1(usd) {
  if (!usd || usd <= 0) return "$0";
  if (usd < 0.01) return "<$0.01";
  if (usd < 1) return `$${usd.toFixed(3)}`;
  if (usd < 100) return `$${usd.toFixed(2)}`;
  return `$${Math.round(usd).toLocaleString()}`;
}
function shortDay(day) {
  const ts = Date.parse(day);
  if (!Number.isFinite(ts)) return day;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}
function AnalyticsChartCard({
  analytics,
  insights,
  period,
  onPeriodChange,
  loading
}) {
  const [showModal, setShowModal] = useState(false);
  const data = useMemo(() => {
    if (!analytics) return [];
    return analytics.daily.map((d) => ({
      day: d.day,
      label: shortDay(d.day),
      tokens: d.inputTokens + d.outputTokens,
      input: d.inputTokens,
      output: d.outputTokens,
      cache: d.cacheReadTokens,
      reasoning: d.reasoningTokens,
      sessions: d.sessions,
      cost: d.estimatedCost
    }));
  }, [analytics]);
  if (!analytics) return null;
  const hasData = analytics.source === "analytics" && data.length > 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative flex flex-col gap-3 overflow-hidden rounded-xl border p-4",
        style: {
          background: "linear-gradient(150deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 90%, transparent))",
          borderColor: "var(--theme-border)"
        },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": true,
              className: "pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl",
              style: { background: "var(--theme-accent)" }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                HugeiconsIcon,
                {
                  icon: ChartLineData01Icon,
                  size: 16,
                  strokeWidth: 1.5,
                  style: { color: "var(--theme-accent)" }
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "h3",
                  {
                    className: "text-[11px] font-semibold uppercase tracking-[0.18em]",
                    style: { color: "var(--theme-text)" },
                    children: [
                      "Usage trend · ",
                      period,
                      "d"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "p",
                  {
                    className: "font-mono text-[10px] uppercase tracking-[0.1em]",
                    style: { color: "var(--theme-muted)" },
                    children: [
                      formatTokens$7(analytics.totalTokens),
                      " tokens ·",
                      " ",
                      analytics.totalApiCalls.toLocaleString(),
                      " calls ·",
                      " ",
                      formatCost$1(analytics.estimatedCostUsd ?? 0),
                      loading ? " · refreshing…" : ""
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(
                PeriodSwitch,
                {
                  value: period,
                  onChange: onPeriodChange
                }
              ),
              hasData ? /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowModal(true),
                  className: "ml-1 rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors hover:bg-[var(--theme-card)]/80",
                  style: {
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-muted)"
                  },
                  children: "Expand →"
                }
              ) : null
            ] })
          ] }),
          insights.length > 0 ? /* @__PURE__ */ jsx(
            "ul",
            {
              className: "flex flex-col gap-1 rounded-md border p-2 text-[11px]",
              style: {
                borderColor: "var(--theme-border)",
                background: "color-mix(in srgb, var(--theme-card) 92%, transparent)"
              },
              children: insights.map((line, i) => {
                const tone = line.tone === "positive" ? "var(--theme-success)" : line.tone === "warn" ? "var(--theme-warning)" : "var(--theme-accent)";
                return /* @__PURE__ */ jsxs(
                  "li",
                  {
                    className: "flex items-center gap-2",
                    style: { color: "var(--theme-text)" },
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          "aria-hidden": true,
                          className: "size-1.5 shrink-0 rounded-full",
                          style: { background: tone }
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: line.text })
                    ]
                  },
                  i
                );
              })
            }
          ) : null,
          hasData ? /* @__PURE__ */ jsx("div", { className: "h-[200px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
            AreaChart,
            {
              data,
              margin: { top: 4, right: 4, left: -22, bottom: 0 },
              children: [
                /* @__PURE__ */ jsxs("defs", { children: [
                  /* @__PURE__ */ jsxs("linearGradient", { id: "atok", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsx(
                      "stop",
                      {
                        offset: "0%",
                        stopColor: "var(--theme-accent)",
                        stopOpacity: 0.45
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "stop",
                      {
                        offset: "100%",
                        stopColor: "var(--theme-accent)",
                        stopOpacity: 0
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("linearGradient", { id: "acache", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsx(
                      "stop",
                      {
                        offset: "0%",
                        stopColor: "var(--theme-accent-secondary)",
                        stopOpacity: 0.25
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "stop",
                      {
                        offset: "100%",
                        stopColor: "var(--theme-accent-secondary)",
                        stopOpacity: 0
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  CartesianGrid,
                  {
                    strokeDasharray: "2 4",
                    stroke: "var(--theme-border)",
                    opacity: 0.4
                  }
                ),
                /* @__PURE__ */ jsx(
                  XAxis,
                  {
                    dataKey: "label",
                    tick: { fontSize: 9, fill: "var(--theme-muted)" },
                    axisLine: false,
                    tickLine: false,
                    interval: "preserveStartEnd",
                    minTickGap: 20
                  }
                ),
                /* @__PURE__ */ jsx(
                  YAxis,
                  {
                    tick: { fontSize: 9, fill: "var(--theme-muted)" },
                    axisLine: false,
                    tickLine: false,
                    width: 40,
                    tickFormatter: (v) => formatTokens$7(v)
                  }
                ),
                /* @__PURE__ */ jsx(
                  Tooltip,
                  {
                    contentStyle: {
                      background: "var(--theme-card)",
                      border: "1px solid var(--theme-border)",
                      borderRadius: 8,
                      fontSize: 11
                    },
                    labelStyle: {
                      color: "var(--theme-muted)",
                      fontSize: 10
                    },
                    formatter: (value, name) => [
                      formatTokens$7(value),
                      name
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Area,
                  {
                    type: "monotone",
                    dataKey: "cache",
                    name: "cache",
                    stroke: "var(--theme-accent-secondary)",
                    fill: "url(#acache)",
                    strokeWidth: 1,
                    dot: false
                  }
                ),
                /* @__PURE__ */ jsx(
                  Area,
                  {
                    type: "monotone",
                    dataKey: "tokens",
                    name: "tokens",
                    stroke: "var(--theme-accent)",
                    fill: "url(#atok)",
                    strokeWidth: 1.6,
                    dot: false
                  }
                )
              ]
            }
          ) }) }) : /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex h-[120px] items-center justify-center rounded-md border border-dashed text-[11px]",
              style: {
                borderColor: "var(--theme-border)",
                color: "var(--theme-muted)"
              },
              children: [
                "No analytics usage in the last ",
                analytics.windowDays,
                "d."
              ]
            }
          ),
          hasData ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-[10px]", children: [
            /* @__PURE__ */ jsx(Legend, { tone: "var(--theme-accent)", label: "tokens (in+out)" }),
            /* @__PURE__ */ jsx(
              Legend,
              {
                tone: "var(--theme-accent-secondary)",
                label: "cache reads"
              }
            )
          ] }) : null
        ]
      }
    ),
    showModal && hasData ? /* @__PURE__ */ jsx(
      AnalyticsModal,
      {
        analytics,
        data,
        period,
        onClose: () => setShowModal(false)
      }
    ) : null
  ] });
}
function PeriodSwitch({
  value,
  onChange
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "inline-flex items-center overflow-hidden rounded border",
      style: { borderColor: "var(--theme-border)" },
      role: "tablist",
      "aria-label": "Analytics period",
      children: PERIODS.map((p) => {
        const active = p === value;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": active,
            onClick: () => onChange(p),
            className: "px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors",
            style: {
              background: active ? "color-mix(in srgb, var(--theme-accent) 18%, transparent)" : "transparent",
              color: active ? "var(--theme-accent)" : "var(--theme-muted)",
              borderRight: p !== PERIODS[PERIODS.length - 1] ? "1px solid var(--theme-border)" : "none"
            },
            children: [
              p,
              "d"
            ]
          },
          p
        );
      })
    }
  );
}
function Legend({ tone, label }) {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: "flex items-center gap-1.5",
      style: { color: "var(--theme-muted)" },
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "size-2 rounded-full",
            style: { background: tone },
            "aria-hidden": true
          }
        ),
        label
      ]
    }
  );
}
function AnalyticsModal({
  analytics,
  data,
  period,
  onClose
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-6",
      role: "dialog",
      "aria-modal": "true",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border bg-[var(--theme-card)]",
          style: { borderColor: "var(--theme-border)" },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center justify-between border-b px-5 py-3",
                style: { borderColor: "var(--theme-border)" },
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs(
                      "h2",
                      {
                        className: "text-sm font-semibold uppercase tracking-[0.18em]",
                        style: { color: "var(--theme-text)" },
                        children: [
                          "Usage trend · last ",
                          period,
                          "d"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "p",
                      {
                        className: "font-mono text-[10px] uppercase tracking-[0.1em]",
                        style: { color: "var(--theme-muted)" },
                        children: [
                          formatTokens$7(analytics.totalTokens),
                          " tokens ·",
                          " ",
                          analytics.totalSessions.toLocaleString(),
                          " sessions ·",
                          " ",
                          analytics.totalApiCalls.toLocaleString(),
                          " calls ·",
                          " ",
                          formatCost$1(analytics.estimatedCostUsd ?? 0)
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      "aria-label": "Close",
                      className: "rounded p-1 hover:bg-[var(--theme-card)]/80",
                      children: /* @__PURE__ */ jsx(
                        HugeiconsIcon,
                        {
                          icon: CancelIcon,
                          size: 18,
                          strokeWidth: 1.5,
                          style: { color: "var(--theme-muted)" }
                        }
                      )
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-5 lg:grid-cols-12", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8", children: [
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: "mb-2 text-[10px] font-semibold uppercase tracking-[0.15em]",
                    style: { color: "var(--theme-muted)" },
                    children: "Daily token mix"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "h-[260px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
                  BarChart,
                  {
                    data,
                    margin: { top: 8, right: 8, left: -10, bottom: 0 },
                    children: [
                      /* @__PURE__ */ jsx(
                        CartesianGrid,
                        {
                          strokeDasharray: "2 4",
                          stroke: "var(--theme-border)",
                          opacity: 0.4
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        XAxis,
                        {
                          dataKey: "label",
                          tick: { fontSize: 10, fill: "var(--theme-muted)" },
                          axisLine: false,
                          tickLine: false,
                          minTickGap: 20
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        YAxis,
                        {
                          tick: { fontSize: 10, fill: "var(--theme-muted)" },
                          axisLine: false,
                          tickLine: false,
                          width: 48,
                          tickFormatter: (v) => formatTokens$7(v)
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Tooltip,
                        {
                          contentStyle: {
                            background: "var(--theme-card)",
                            border: "1px solid var(--theme-border)",
                            borderRadius: 8,
                            fontSize: 11
                          },
                          formatter: (value, name) => [
                            formatTokens$7(value),
                            name
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Bar,
                        {
                          dataKey: "input",
                          name: "input",
                          stackId: "t",
                          fill: "var(--theme-accent)",
                          radius: [2, 2, 0, 0]
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Bar,
                        {
                          dataKey: "output",
                          name: "output",
                          stackId: "t",
                          fill: "var(--theme-success)",
                          radius: [2, 2, 0, 0]
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Bar,
                        {
                          dataKey: "reasoning",
                          name: "reasoning",
                          stackId: "t",
                          fill: "var(--theme-warning)",
                          radius: [2, 2, 0, 0]
                        }
                      )
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-4 text-[10px]", children: [
                  /* @__PURE__ */ jsx(Legend, { tone: "var(--theme-accent)", label: "input" }),
                  /* @__PURE__ */ jsx(Legend, { tone: "var(--theme-success)", label: "output" }),
                  /* @__PURE__ */ jsx(Legend, { tone: "var(--theme-warning)", label: "reasoning" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4", children: [
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: "mb-2 text-[10px] font-semibold uppercase tracking-[0.15em]",
                    style: { color: "var(--theme-muted)" },
                    children: "Models · ranked by tokens"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "space-y-2", children: analytics.topModels.map((m, i) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "rounded border px-3 py-2",
                    style: { borderColor: "var(--theme-border)" },
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxs(
                          "span",
                          {
                            className: "font-mono text-[12px] font-semibold",
                            style: { color: "var(--theme-text)" },
                            children: [
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: "mr-1.5 inline-block w-4 text-right tabular-nums",
                                  style: { color: "var(--theme-muted)" },
                                  children: i + 1
                                }
                              ),
                              formatModelName(m.id)
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: "font-mono text-[10px] tabular-nums",
                            style: { color: "var(--theme-muted)" },
                            children: formatTokens$7(m.tokens)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "mt-1 truncate font-mono text-[10px]",
                          style: { color: "var(--theme-muted)" },
                          title: m.id,
                          children: m.id
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-3 text-[10px]", children: [
                        /* @__PURE__ */ jsxs("span", { style: { color: "var(--theme-muted)" }, children: [
                          "sessions",
                          " ",
                          /* @__PURE__ */ jsx("span", { style: { color: "var(--theme-text)" }, children: m.sessions.toLocaleString() })
                        ] }),
                        /* @__PURE__ */ jsxs("span", { style: { color: "var(--theme-muted)" }, children: [
                          "calls",
                          " ",
                          /* @__PURE__ */ jsx("span", { style: { color: "var(--theme-text)" }, children: m.calls.toLocaleString() })
                        ] }),
                        /* @__PURE__ */ jsxs("span", { style: { color: "var(--theme-muted)" }, children: [
                          "cost",
                          " ",
                          /* @__PURE__ */ jsx("span", { style: { color: "var(--theme-text)" }, children: formatCost$1(m.cost) })
                        ] })
                      ] })
                    ]
                  },
                  m.id
                )) })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
const SOURCE_GLYPH = {
  cron: "⏰",
  platform: "🔌",
  log: "📜",
  config: "⚙️",
  gateway: "🛰️"
};
const SEVERITY_COLOR = {
  warn: "var(--theme-warning)",
  error: "var(--theme-danger)",
  info: "var(--theme-muted)"
};
function AttentionMarquee({
  overview
}) {
  const navigate = useNavigate();
  const items = overview?.incidents ?? [];
  if (items.length === 0) return null;
  const tracks = [...items, ...items];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group relative flex items-center gap-2 overflow-hidden rounded-md border px-2 py-1",
      style: {
        background: "linear-gradient(90deg, color-mix(in srgb, var(--theme-warning) 10%, transparent), transparent 70%)",
        borderColor: "color-mix(in srgb, var(--theme-warning) 35%, transparent)"
      },
      title: `${items.length} item${items.length === 1 ? "" : "s"} need attention`,
      children: [
        /* @__PURE__ */ jsxs(
          "span",
          {
            className: "z-10 shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em]",
            style: {
              background: "color-mix(in srgb, var(--theme-warning) 18%, transparent)",
              color: "var(--theme-warning)"
            },
            children: [
              "⚠️ Attention · ",
              items.length
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-y-0 right-0 z-10 w-12",
            style: {
              background: "linear-gradient(90deg, transparent, var(--theme-card))"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex min-w-0 flex-1 overflow-hidden whitespace-nowrap",
            style: { maskImage: "linear-gradient(90deg, black 96%, transparent)" },
            children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "oc-marquee-track flex shrink-0 items-center gap-6 pl-3 will-change-transform",
                children: tracks.map((item, idx) => {
                  const handleClick = () => {
                    if (item.href) {
                      if (item.href.startsWith("http://") || item.href.startsWith("https://")) {
                        window.open(item.href, "_blank", "noopener,noreferrer");
                        return;
                      }
                      window.location.assign(item.href);
                      return;
                    }
                    if (item.source === "cron") navigate({ to: "/jobs" });
                    else if (item.source === "config")
                      navigate({ to: "/settings", search: {} });
                    else navigate({ to: "/jobs" });
                  };
                  return /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: handleClick,
                      className: "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] hover:underline",
                      style: { color: SEVERITY_COLOR[item.severity] },
                      children: [
                        /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "text-[12px]", children: SOURCE_GLYPH[item.source] ?? "•" }),
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--theme-text)" }, children: item.label }),
                        item.detail ? /* @__PURE__ */ jsxs("span", { style: { color: "var(--theme-muted)" }, children: [
                          "· ",
                          item.detail
                        ] }) : null
                      ]
                    },
                    `${item.id}-${idx}`
                  );
                })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("style", { children: `
        @keyframes oc-attention-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .oc-marquee-track {
          animation: oc-attention-marquee 32s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .oc-marquee-track { animation: none; }
        }
        .group:hover .oc-marquee-track {
          animation-play-state: paused;
        }
      ` })
      ]
    }
  );
}
function formatTokens$6(n) {
  if (!n || n <= 0) return "0";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
function CacheEfficiencyCard({
  analytics
}) {
  if (!analytics || analytics.source !== "analytics") return null;
  const cache = analytics.cacheReadTokens;
  const input = analytics.inputTokens;
  const denom = cache + input;
  const dailyRates = useMemo(() => {
    return analytics.daily.map((d) => {
      const sum = d.cacheReadTokens + d.inputTokens;
      return sum > 0 ? d.cacheReadTokens / sum * 100 : 0;
    });
  }, [analytics.daily]);
  if (denom === 0) return null;
  const ratePct = cache / denom * 100;
  const max = Math.max(...dailyRates, 1);
  const ratio = input > 0 ? cache / input : 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex flex-col gap-2.5 overflow-hidden rounded-xl border p-3",
      style: {
        background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: {
              background: "linear-gradient(90deg, var(--theme-success), color-mix(in srgb, var(--theme-success) 40%, transparent), transparent)"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-25 blur-2xl",
            style: { background: "var(--theme-success)" }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-[10px] font-semibold uppercase tracking-[0.18em]",
              style: { color: "var(--theme-text)" },
              children: "Cache efficiency"
            }
          ),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono text-[9px] uppercase tracking-[0.15em]",
              style: { color: "var(--theme-muted)" },
              children: [
                analytics.windowDays,
                "d"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono text-2xl font-bold leading-none tracking-tight tabular-nums",
              style: { color: "var(--theme-text)" },
              children: [
                ratePct.toFixed(1),
                "%"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "font-mono text-[10px] uppercase tracking-[0.1em]",
              style: { color: "var(--theme-muted)" },
              title: "Cache reads divided by (cache reads + first-pass input).",
              children: "hit rate"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-2", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "font-mono text-[10px] leading-snug",
              style: { color: "var(--theme-muted)" },
              children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--theme-text)" }, children: formatTokens$6(cache) }),
                " ",
                "cache /",
                " ",
                /* @__PURE__ */ jsx("span", { style: { color: "var(--theme-text)" }, children: formatTokens$6(input) }),
                " ",
                "input",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: "font-mono",
                    title: "How many cache tokens per fresh input token.",
                    children: [
                      ratio.toFixed(1),
                      "× ratio"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex items-end gap-[2px]",
              style: { height: 28, width: 96 },
              "aria-hidden": true,
              children: dailyRates.map((rate, idx) => {
                const heightPct = max > 0 ? Math.max(6, rate / max * 100) : 6;
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "flex-1 rounded-sm",
                    style: {
                      height: `${heightPct}%`,
                      background: rate === 0 ? "color-mix(in srgb, var(--theme-border) 35%, transparent)" : `color-mix(in srgb, var(--theme-success) ${Math.max(35, heightPct)}%, transparent)`
                    },
                    title: `${analytics.daily[idx]?.day ?? ""} · ${rate.toFixed(1)}%`
                  },
                  idx
                );
              })
            }
          )
        ] })
      ]
    }
  );
}
const SUBSCRIPTION_PATTERNS = [
  /(^|[\s\-:/])codex(\b|[-/])/i,
  /anthropic[-_]?oauth/i,
  /^claude-(opus|sonnet|haiku)/i,
  /minimax/i,
  /ollama/i,
  /lmstudio/i,
  /^pc1-/i,
  /^pc2-/i,
  /^gemma/i,
  /^llama/i,
  /^qwen/i
];
function isSubscription(modelId) {
  return SUBSCRIPTION_PATTERNS.some((re) => re.test(modelId));
}
function formatTokens$5(n) {
  if (!n || n <= 0) return "0";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
function formatCostUsd(usd) {
  if (usd <= 0) return "$0";
  if (usd < 0.01) return "<$0.01";
  if (usd < 1) return `$${usd.toFixed(3)}`;
  if (usd < 100) return `$${usd.toFixed(2)}`;
  return `$${Math.round(usd).toLocaleString()}`;
}
function CostLedgerCard({
  analytics
}) {
  const rows = useMemo(() => {
    if (!analytics || analytics.source !== "analytics") return [];
    return analytics.topModels.map((m) => ({
      ...m,
      included: isSubscription(m.id)
    })).sort((a, b) => {
      if (a.included !== b.included) return a.included ? 1 : -1;
      if (!a.included && !b.included) return b.cost - a.cost;
      return b.tokens - a.tokens;
    });
  }, [analytics]);
  if (rows.length === 0) return null;
  const paidTotal = rows.filter((r) => !r.included).reduce((a, r) => a + r.cost, 0);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex flex-col gap-2 overflow-hidden rounded-xl border p-3",
      style: {
        background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: {
              background: "linear-gradient(90deg, var(--theme-warning), color-mix(in srgb, var(--theme-warning) 40%, transparent), transparent)"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-[10px] font-semibold uppercase tracking-[0.18em]",
              style: { color: "var(--theme-text)" },
              children: "Cost ledger"
            }
          ),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono text-[9px] uppercase tracking-[0.15em]",
              style: { color: "var(--theme-muted)" },
              title: "Total billed across non-subscription rows.",
              children: [
                formatCostUsd(paidTotal),
                " paid"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1", children: rows.slice(0, 6).map((row) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "flex items-center justify-between gap-2 text-[10px]",
            style: { color: "var(--theme-muted)" },
            children: [
              /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 items-center gap-1.5 truncate", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": true,
                    className: "inline-block size-1.5 shrink-0 rounded-full",
                    style: {
                      background: row.included ? "var(--theme-success)" : "var(--theme-warning)"
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "truncate font-mono uppercase tracking-[0.08em]",
                    style: { color: "var(--theme-text)" },
                    title: row.id,
                    children: row.id
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "shrink-0 font-mono tabular-nums",
                  style: { color: "var(--theme-text)" },
                  children: row.included ? /* @__PURE__ */ jsxs("span", { title: `${row.sessions} sessions`, children: [
                    formatTokens$5(row.tokens),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "ml-1",
                        style: { color: "var(--theme-muted)" },
                        children: "incl"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsx("span", { title: `${row.sessions} sessions · ${row.tokens.toLocaleString()} tokens`, children: formatCostUsd(row.cost) })
                }
              )
            ]
          },
          row.id
        )) })
      ]
    }
  );
}
const STORAGE_KEY$1 = "dashboard.layout.v1";
const WIDGET_CATALOG = [
  {
    id: "analytics_chart",
    label: "Analytics chart",
    description: "Tokens/sessions/calls trend with period switcher.",
    column: "main",
    hideable: true
  },
  {
    id: "top_models",
    label: "Top models",
    description: "Routing share by model in the analytics window.",
    column: "main",
    hideable: true
  },
  {
    id: "provider_mix",
    label: "Provider mix",
    description: "Token share by provider family (anthropic / openai / local / etc).",
    column: "main",
    hideable: true
  },
  {
    id: "cache_efficiency",
    label: "Cache efficiency",
    description: "Cache-hit rate with daily sparkline. Higher = lower cost.",
    column: "main",
    hideable: true
  },
  {
    id: "velocity",
    label: "Velocity",
    description: "Sessions/day average + delta vs prior period + sparkline.",
    column: "main",
    hideable: true
  },
  {
    id: "cost_ledger",
    label: "Cost ledger",
    description: "Per-model cost split between paid providers and subscription/local.",
    column: "main",
    hideable: true
  },
  {
    id: "sessions_intelligence",
    label: "Sessions intelligence",
    description: "Recent sessions with token / tool / status badges.",
    column: "main",
    hideable: true
  },
  {
    id: "logs_tail",
    label: "Live logs",
    description: "Tail of the gateway log stream. Off by default in iter 006 — enable here when triaging.",
    column: "main",
    hideable: true
  },
  {
    id: "operator_tip",
    label: "Operator tip",
    description: "Context-aware tip that adapts to the live overview (cache, cron, drift, etc.).",
    column: "main",
    hideable: true
  },
  {
    id: "skills_usage",
    label: "Skills usage",
    description: "Top-5 used skills as a bar chart.",
    column: "rail",
    hideable: true
  },
  {
    id: "achievements",
    label: "Achievements",
    description: "Recent unlocks & progress.",
    column: "rail",
    hideable: true
  },
  {
    id: "mix_rhythm",
    label: "Mix & rhythm",
    description: "Token mix + hour-of-day activity strip.",
    column: "rail",
    hideable: true
  }
];
const DEFAULT_HIDDEN = [
  "logs_tail",
  "provider_mix",
  "velocity",
  "cost_ledger",
  "operator_tip"
];
const STORAGE_VERSION = 4;
function readLayout() {
  if (typeof window === "undefined") {
    return { hidden: [...DEFAULT_HIDDEN] };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY$1);
    if (!raw) return { hidden: [...DEFAULT_HIDDEN] };
    const parsed = JSON.parse(raw);
    const valid = new Set(WIDGET_CATALOG.map((w) => w.id));
    const incoming = Array.isArray(parsed.hidden) ? parsed.hidden : [];
    const filtered = incoming.filter(
      (id) => valid.has(id)
    );
    const storedVersion = parsed.version ?? 0;
    if (storedVersion < STORAGE_VERSION) {
      const merged = new Set(filtered);
      for (const id of DEFAULT_HIDDEN) merged.add(id);
      return { hidden: Array.from(merged) };
    }
    return { hidden: filtered };
  } catch {
    return { hidden: [...DEFAULT_HIDDEN] };
  }
}
function writeLayout(layout) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY$1,
      JSON.stringify({ ...layout, version: STORAGE_VERSION })
    );
  } catch {
  }
}
function useDashboardLayout() {
  const [editMode, setEditMode] = useState(false);
  const [hidden, setHidden] = useState(
    () => new Set(readLayout().hidden)
  );
  useEffect(() => {
    writeLayout({ hidden: Array.from(hidden) });
  }, [hidden]);
  const toggleEdit = useCallback(() => setEditMode((v) => !v), []);
  const hide = useCallback((id) => {
    setHidden((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);
  const show = useCallback((id) => {
    setHidden((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);
  const reset = useCallback(
    () => setHidden(new Set(DEFAULT_HIDDEN)),
    []
  );
  const isVisible = useCallback(
    (id) => !hidden.has(id),
    [hidden]
  );
  const counts = useMemo(() => {
    const total = WIDGET_CATALOG.length;
    return {
      total,
      visible: total - hidden.size,
      hidden: hidden.size
    };
  }, [hidden]);
  return {
    editMode,
    toggleEdit,
    setEditMode,
    hidden,
    hide,
    show,
    reset,
    isVisible,
    counts
  };
}
function EditModePanel({ layout }) {
  if (!layout.editMode) return null;
  const main = WIDGET_CATALOG.filter((w) => w.column === "main");
  const rail = WIDGET_CATALOG.filter((w) => w.column === "rail");
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex flex-col gap-3 overflow-hidden rounded-xl border p-3",
      style: {
        background: "linear-gradient(120deg, color-mix(in srgb, var(--theme-accent) 6%, var(--theme-card)), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-accent)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]",
                style: {
                  background: "color-mix(in srgb, var(--theme-accent) 18%, transparent)",
                  color: "var(--theme-accent)"
                },
                children: "Edit mode"
              }
            ),
            /* @__PURE__ */ jsxs(
              "span",
              {
                className: "font-mono text-[10px] uppercase tracking-[0.15em]",
                style: { color: "var(--theme-muted)" },
                children: [
                  layout.counts.visible,
                  " of ",
                  layout.counts.total,
                  " widgets shown"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: layout.reset,
                className: "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-[var(--theme-card)]",
                style: {
                  background: "var(--theme-card)",
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text)"
                },
                title: "Show every widget again",
                children: "Reset"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => layout.setEditMode(false),
                className: "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors",
                style: {
                  background: "linear-gradient(135deg, var(--theme-accent), color-mix(in srgb, var(--theme-accent) 60%, transparent))",
                  color: "var(--theme-on-accent, white)"
                },
                title: "Exit edit mode",
                children: "Done"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsx(Group, { title: "Main column", layout, widgets: main }),
          /* @__PURE__ */ jsx(Group, { title: "Side rail", layout, widgets: rail })
        ] })
      ]
    }
  );
}
function Group({
  title,
  layout,
  widgets
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: "font-mono text-[9px] uppercase tracking-[0.18em]",
        style: { color: "var(--theme-muted)" },
        children: title
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: widgets.map((w) => {
      const visible = layout.isVisible(w.id);
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => visible ? layout.hide(w.id) : layout.show(w.id),
          className: "group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all",
          style: {
            background: visible ? "color-mix(in srgb, var(--theme-success) 14%, transparent)" : "transparent",
            border: `1px ${visible ? "solid" : "dashed"} ${visible ? "color-mix(in srgb, var(--theme-success) 60%, transparent)" : "var(--theme-border)"}`,
            color: visible ? "var(--theme-success)" : "var(--theme-muted)"
          },
          title: w.description,
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "inline-block size-1.5 rounded-full",
                style: {
                  background: visible ? "var(--theme-success)" : "var(--theme-muted)"
                }
              }
            ),
            w.label
          ]
        },
        w.id
      );
    }) })
  ] });
}
function formatTokens$4(n) {
  if (!n || n <= 0) return "0";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
function formatCount(n) {
  if (!n || n <= 0) return "0";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}
function deltaPct(current, previous) {
  if (!previous) return null;
  const delta = (current - previous) / previous * 100;
  if (!Number.isFinite(delta)) return null;
  return delta;
}
function Spark({
  values,
  tone,
  height = 28,
  width = 96
}) {
  if (values.length === 0) {
    return /* @__PURE__ */ jsx("div", { style: { width, height } });
  }
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = width / Math.max(values.length - 1, 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - (v - min) / range * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: "none",
      "aria-hidden": true,
      children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: `spark-grad-${tone.replace("#", "")}`, x1: "0", x2: "0", y1: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: tone, stopOpacity: 0.35 }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: tone, stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsx(
          "polygon",
          {
            points: areaPoints,
            fill: `url(#spark-grad-${tone.replace("#", "")})`
          }
        ),
        /* @__PURE__ */ jsx(
          "polyline",
          {
            points,
            stroke: tone,
            strokeWidth: 1.5,
            fill: "none",
            strokeLinejoin: "round",
            strokeLinecap: "round"
          }
        )
      ]
    }
  );
}
function HeroTile({ label, value, sub, delta, spark, tone, icon }) {
  const deltaText2 = (() => {
    if (delta === null || delta === void 0) return null;
    const sign = delta > 0 ? "+" : "";
    const tone2 = Math.abs(delta) < 1 ? "var(--theme-muted)" : delta > 0 ? "var(--theme-success)" : "var(--theme-warning)";
    return { text: `${sign}${delta.toFixed(0)}%`, tone: tone2 };
  })();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex flex-col gap-2 overflow-hidden rounded-xl border px-4 pb-3 pt-4",
      style: {
        background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: {
              background: `linear-gradient(90deg, ${tone}, ${tone}55, transparent)`
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-25 blur-2xl",
            style: { background: tone }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "text-[10px] font-semibold uppercase tracking-[0.18em]",
              style: { color: "var(--theme-muted)" },
              children: label
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "flex size-7 items-center justify-center rounded-md text-sm",
              style: {
                background: `color-mix(in srgb, ${tone} 14%, transparent)`,
                color: tone
              },
              "aria-hidden": true,
              children: icon
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-2", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "font-mono text-3xl font-bold tabular-nums leading-none tracking-tight",
              style: { color: "var(--theme-text)" },
              children: value
            }
          ),
          spark ? /* @__PURE__ */ jsx(Spark, { values: spark, tone }) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 text-[10px]", children: [
          sub ? /* @__PURE__ */ jsx(
            "span",
            {
              className: "truncate font-mono uppercase tracking-[0.12em]",
              style: { color: "var(--theme-muted)" },
              children: sub
            }
          ) : /* @__PURE__ */ jsx("span", {}),
          deltaText2 ? /* @__PURE__ */ jsx(
            "span",
            {
              className: "rounded px-1.5 py-0.5 font-mono uppercase tracking-[0.1em]",
              style: {
                background: `color-mix(in srgb, ${deltaText2.tone} 12%, transparent)`,
                color: deltaText2.tone
              },
              children: deltaText2.text
            }
          ) : null
        ] })
      ]
    }
  );
}
function HeroMetrics({
  analytics,
  fallback,
  extraTile
}) {
  const useAnalytics = !!analytics && analytics.source === "analytics";
  const dailyTokens = useAnalytics ? analytics.daily.map((d) => d.inputTokens + d.outputTokens) : [];
  const dailySessions = useAnalytics ? analytics.daily.map((d) => d.sessions) : [];
  const dailyCalls = useAnalytics ? analytics.daily.map((d) => d.apiCalls) : [];
  const splitSum = (arr) => {
    if (arr.length < 2) return [arr.reduce((a, b) => a + b, 0), 0];
    const mid = Math.floor(arr.length / 2);
    const prev = arr.slice(0, mid).reduce((a, b) => a + b, 0);
    const curr = arr.slice(mid).reduce((a, b) => a + b, 0);
    return [curr, prev];
  };
  const [sessCurr, sessPrev] = splitSum(dailySessions);
  const [tokCurr, tokPrev] = splitSum(dailyTokens);
  const tokensTotal = useAnalytics ? analytics.totalTokens : fallback.tokens;
  const sessionsTotal = useAnalytics ? analytics.totalSessions : fallback.sessions;
  const apiCalls = useAnalytics ? analytics.totalApiCalls : fallback.toolCalls;
  const window2 = useAnalytics ? `${analytics.windowDays}d` : "all time";
  const tiles = useMemo(
    () => [
      {
        label: "Sessions",
        value: formatCount(sessionsTotal),
        sub: window2,
        delta: useAnalytics ? deltaPct(sessCurr, sessPrev) : null,
        spark: useAnalytics ? dailySessions : void 0,
        tone: "var(--theme-accent)",
        icon: "💬"
      },
      {
        label: "Tokens",
        value: formatTokens$4(tokensTotal),
        sub: useAnalytics ? `${formatTokens$4(analytics.cacheReadTokens)} cached` : "Hermes ledger",
        delta: useAnalytics ? deltaPct(tokCurr, tokPrev) : null,
        spark: useAnalytics ? dailyTokens : void 0,
        tone: "var(--theme-accent-secondary)",
        icon: "⚡"
      },
      {
        label: "API Calls",
        value: formatCount(apiCalls),
        sub: useAnalytics ? `${window2} window` : "tool calls",
        delta: null,
        spark: useAnalytics ? dailyCalls : void 0,
        tone: "var(--theme-success)",
        icon: "🔧"
      }
    ],
    [
      analytics,
      apiCalls,
      dailyCalls,
      dailySessions,
      dailyTokens,
      sessCurr,
      sessPrev,
      sessionsTotal,
      tokCurr,
      tokPrev,
      tokensTotal,
      useAnalytics,
      window2
    ]
  );
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
    tiles.map((t) => /* @__PURE__ */ jsx(HeroTile, { ...t }, t.label)),
    extraTile
  ] });
}
const TerminalIcon = ConsoleIcon;
const ERROR_RX = /\b(error|exception|traceback|failed|fatal)\b/i;
const WARN_RX = /\b(warn|warning|deprecated)\b/i;
function lineTone(line) {
  if (ERROR_RX.test(line) || line.toLowerCase().includes("errno")) {
    return "var(--theme-danger)";
  }
  if (WARN_RX.test(line)) return "var(--theme-warning)";
  return "var(--theme-text)";
}
function LogsTailCard({
  logs
}) {
  const [showModal, setShowModal] = useState(false);
  if (!logs) return null;
  const previewLines = logs.lines.slice(-6);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative flex flex-col gap-2 overflow-hidden rounded-xl border p-3",
        style: {
          background: "linear-gradient(150deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
          borderColor: "var(--theme-border)"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                HugeiconsIcon,
                {
                  icon: TerminalIcon,
                  size: 14,
                  strokeWidth: 1.5,
                  style: { color: "var(--theme-muted)" }
                }
              ),
              /* @__PURE__ */ jsxs(
                "h3",
                {
                  className: "text-[10px] font-semibold uppercase tracking-[0.15em]",
                  style: { color: "var(--theme-muted)" },
                  children: [
                    "Logs · ",
                    logs.file
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px]", children: [
              logs.errorCount > 0 ? /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono uppercase tracking-[0.1em]",
                  style: {
                    background: "color-mix(in srgb, var(--theme-danger) 15%, transparent)",
                    color: "var(--theme-danger)"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: AlertCircleIcon,
                        size: 10,
                        strokeWidth: 1.5
                      }
                    ),
                    logs.errorCount
                  ]
                }
              ) : null,
              logs.warnCount > 0 ? /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono uppercase tracking-[0.1em]",
                  style: {
                    background: "color-mix(in srgb, var(--theme-warning) 15%, transparent)",
                    color: "var(--theme-warning)"
                  },
                  children: [
                    logs.warnCount,
                    " warn"
                  ]
                }
              ) : null,
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowModal(true),
                  className: "rounded border px-2 py-0.5 font-mono uppercase tracking-[0.15em] transition-colors hover:bg-[var(--theme-card)]/80",
                  style: {
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-muted)"
                  },
                  children: "Tail →"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "rounded border p-2 font-mono text-[10px] leading-snug",
              style: {
                borderColor: "var(--theme-border)",
                background: "color-mix(in srgb, var(--theme-card) 88%, transparent)",
                maxHeight: 96,
                overflow: "hidden"
              },
              children: previewLines.length === 0 ? /* @__PURE__ */ jsx("span", { style: { color: "var(--theme-muted)" }, children: "no recent log lines." }) : previewLines.map((line, i) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "truncate",
                  style: { color: lineTone(line) },
                  title: line,
                  children: line.replace(/\n+$/, "")
                },
                i
              ))
            }
          )
        ]
      }
    ),
    showModal ? /* @__PURE__ */ jsx(LogsModal, { initial: logs, onClose: () => setShowModal(false) }) : null
  ] });
}
function LogsModal({
  initial,
  onClose
}) {
  const [logs, setLogs] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/overview?logs=200");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.logs) setLogs(data.logs);
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    tick();
    const interval = setInterval(tick, 3e3);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
  const filtered = logs.lines.filter((line) => {
    if (filter === "errors") {
      return ERROR_RX.test(line) || line.toLowerCase().includes("errno");
    }
    if (filter === "warns") return WARN_RX.test(line);
    return true;
  });
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-6",
      role: "dialog",
      "aria-modal": "true",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border bg-[var(--theme-card)]",
          style: { borderColor: "var(--theme-border)" },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center justify-between border-b px-4 py-3",
                style: { borderColor: "var(--theme-border)" },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: TerminalIcon,
                        size: 16,
                        strokeWidth: 1.5,
                        style: { color: "var(--theme-text)" }
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs(
                        "h2",
                        {
                          className: "text-sm font-semibold uppercase tracking-[0.18em]",
                          style: { color: "var(--theme-text)" },
                          children: [
                            "Live tail · ",
                            logs.file
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "p",
                        {
                          className: "font-mono text-[10px] uppercase tracking-[0.1em]",
                          style: { color: "var(--theme-muted)" },
                          children: [
                            logs.lines.length,
                            " lines · ",
                            logs.errorCount,
                            " errors ·",
                            " ",
                            logs.warnCount,
                            " warns",
                            loading ? " · refreshing…" : ""
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    ["all", "errors", "warns"].map((opt) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setFilter(opt),
                        className: "rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors",
                        style: {
                          borderColor: "var(--theme-border)",
                          background: filter === opt ? "color-mix(in srgb, var(--theme-accent) 18%, transparent)" : "transparent",
                          color: filter === opt ? "var(--theme-accent)" : "var(--theme-muted)"
                        },
                        children: opt
                      },
                      opt
                    )),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: onClose,
                        "aria-label": "Close",
                        className: "rounded p-1 hover:bg-[var(--theme-card)]/80",
                        children: /* @__PURE__ */ jsx(
                          HugeiconsIcon,
                          {
                            icon: CancelIcon,
                            size: 16,
                            strokeWidth: 1.5,
                            style: { color: "var(--theme-muted)" }
                          }
                        )
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed",
                style: {
                  background: "color-mix(in srgb, var(--theme-card) 88%, transparent)"
                },
                children: filtered.length === 0 ? /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "py-6 text-center text-[11px]",
                    style: { color: "var(--theme-muted)" },
                    children: "No matching log lines."
                  }
                ) : filtered.map((line, i) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "whitespace-pre-wrap",
                    style: { color: lineTone(line) },
                    children: line.replace(/\n+$/, "")
                  },
                  i
                ))
              }
            )
          ]
        }
      )
    }
  );
}
const TIPS = [
  {
    id: "cache-low",
    title: "Cache hit rate is low",
    body: "Reusable system prompts get cached on most providers. Pin shared scaffolding (skills, persona, tools) into a stable preamble so the next request hits cache instead of paying for fresh input.",
    tone: "warn",
    cta: "Open analytics",
    href: "/analytics",
    score: (o) => {
      const a = o?.analytics;
      if (!a || a.source !== "analytics") return 0;
      const denom = a.cacheReadTokens + a.inputTokens;
      if (denom === 0) return 0;
      const rate = a.cacheReadTokens / denom * 100;
      return rate < 30 ? 70 : 0;
    }
  },
  {
    id: "cache-high",
    title: "Cache hit rate looks great",
    body: "Cache reads are doing the heavy lifting. Worth checking if any *cold* sessions are skipping your shared preamble — those usually represent untapped savings.",
    tone: "positive",
    score: (o) => {
      const a = o?.analytics;
      if (!a || a.source !== "analytics") return 0;
      const denom = a.cacheReadTokens + a.inputTokens;
      if (denom === 0) return 0;
      const rate = a.cacheReadTokens / denom * 100;
      return rate >= 60 ? 50 : 0;
    }
  },
  {
    id: "stale-cron",
    title: "You have stale cron jobs",
    body: "Cron jobs that haven't run in 7+ days are usually a sign of a paused integration or a misconfigured schedule. Worth a quick triage so you don't lose silent automation.",
    tone: "warn",
    cta: "Open jobs",
    href: "/jobs",
    score: (o) => {
      const cron = o?.cron;
      if (!cron) return 0;
      const next = cron.nextRunAt ? Date.parse(cron.nextRunAt) : NaN;
      if (!Number.isFinite(next)) return 60;
      const overdue = Date.now() - next > 7 * 864e5;
      return overdue ? 80 : 0;
    }
  },
  {
    id: "config-drift",
    title: "Gateway config has drift",
    body: "There are pending diffs between your local gateway config and the latest committed version. Apply or reject them so your live behavior matches what the repo says.",
    tone: "warn",
    cta: "Open settings",
    href: "/settings",
    score: (o) => {
      const s = o?.status;
      if (!s) return 0;
      if (s.configVersion !== null && s.latestConfigVersion !== null && s.latestConfigVersion > s.configVersion) {
        return 65;
      }
      return 0;
    }
  },
  {
    id: "restart-pending",
    title: "Gateway restart pending",
    body: "Some config or plugin change wants a gateway restart to take effect. Best to do it during a quiet window — long-running sessions handle it gracefully.",
    tone: "warn",
    cta: "Open settings",
    href: "/settings",
    score: (o) => o?.status?.restartRequested ? 75 : 0
  },
  {
    id: "achievements-momentum",
    title: "Achievement momentum",
    body: "You unlocked something recently — keep going. The Hermes achievements track real workflows, so the next tier usually drops out of normal usage rather than grinding.",
    tone: "positive",
    cta: "View all",
    score: (o) => {
      const ach = o?.achievements;
      if (!ach || ach.recentUnlocks.length === 0) return 0;
      const last = ach.recentUnlocks[0]?.unlockedAt;
      if (!last) return 0;
      const ageH = (Date.now() / 1e3 - last) / 3600;
      return ageH < 12 ? 40 : 0;
    }
  },
  {
    id: "sessions-low",
    title: "Things have been quiet",
    body: "Session count is below the prior period — could be intentional, could be silent breakage. Worth scanning recent logs and reviewing your cron / heartbeat schedule.",
    tone: "info",
    cta: "Open sessions",
    href: "/sessions",
    score: (o) => {
      const a = o?.analytics;
      if (!a || a.source !== "analytics") return 0;
      const dailyS = a.daily.map((d) => d.sessions);
      if (dailyS.length < 4) return 0;
      const mid = Math.floor(dailyS.length / 2);
      const recent = dailyS.slice(mid).reduce((x, y) => x + y, 0);
      const prior = dailyS.slice(0, mid).reduce((x, y) => x + y, 0);
      if (prior === 0) return 0;
      const drop = (prior - recent) / prior;
      return drop > 0.3 ? 55 : 0;
    }
  },
  {
    id: "top-model-share",
    title: "One model is doing all the work",
    body: "Concentration risk: if your top model is handling >70% of calls, an outage or pricing change hits hard. Worth setting up a fallback even if you never use it.",
    tone: "info",
    cta: "Open models",
    href: "/models",
    score: (o) => {
      const a = o?.analytics;
      if (!a || a.source !== "analytics") return 0;
      const total = a.topModels.reduce((x, m) => x + m.calls, 0);
      if (total === 0) return 0;
      const top = a.topModels[0];
      if (!top) return 0;
      return top.calls / total > 0.7 ? 45 : 0;
    }
  },
  // Evergreen tips. Always score low so they only surface when
  // nothing context-specific is more relevant.
  {
    id: "edit-mode",
    title: "Customize this dashboard",
    body: "Use the pencil icon in the header to enter edit mode. You can hide widgets you don't care about and reveal extras (Provider Mix, Velocity, Cost Ledger, Live Logs) from the picker.",
    tone: "info",
    score: () => 5
  },
  {
    id: "skills-shortcut",
    title: "Skills are first-class",
    body: "Hermes loads skills into context on demand. Click any row in Skills Usage to jump to that skill's page and edit its SKILL.md — every change is hot-reloaded.",
    tone: "info",
    cta: "Open skills",
    href: "/skills",
    score: () => 4
  },
  {
    id: "new-chat",
    title: "Pick the right model up-front",
    body: "Hitting New Chat without a model in mind is fine, but Hermes routes faster when you set a default in Settings → Models for your common task types.",
    tone: "info",
    cta: "New chat",
    href: "/chat/new",
    score: () => 3
  }
];
const TONE_COLORS = {
  info: "var(--theme-accent)",
  positive: "var(--theme-success)",
  warn: "var(--theme-warning)"
};
const STORAGE_KEY = "dashboard.tipIndex.v1";
function OperatorTipCard({
  overview
}) {
  const navigate = useNavigate();
  const ranked = useMemo(() => {
    const scored = TIPS.map((t) => ({ tip: t, score: t.score(overview) }));
    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.tip);
  }, [overview]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 0) setIndex(n % Math.max(1, ranked.length));
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, String(index));
  }, [index]);
  if (ranked.length === 0) return null;
  const tip = ranked[index % ranked.length];
  const tone = TONE_COLORS[tip.tone ?? "info"];
  const handleNext = () => setIndex((i) => (i + 1) % ranked.length);
  const handleCta = () => {
    if (!tip.href) return;
    if (tip.href.startsWith("http")) {
      window.open(tip.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (tip.href === "/chat/new") {
      navigate({ to: "/chat/$sessionKey", params: { sessionKey: "new" } });
      return;
    }
    navigate({ to: tip.href });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex items-stretch gap-3 overflow-hidden rounded-xl border p-3",
      style: {
        background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: {
              background: `linear-gradient(90deg, ${tone}, color-mix(in srgb, ${tone} 40%, transparent), transparent)`
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-15 blur-3xl",
            style: { background: tone }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex size-9 shrink-0 items-center justify-center rounded-lg border",
            style: {
              background: `color-mix(in srgb, ${tone} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${tone} 35%, transparent)`,
              color: tone
            },
            children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Idea01Icon, size: 18, strokeWidth: 1.7 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs(
              "span",
              {
                className: "font-mono text-[9px] uppercase tracking-[0.18em]",
                style: { color: tone },
                children: [
                  "Tip · ",
                  index + 1,
                  "/",
                  ranked.length
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              tip.href ? /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleCta,
                  className: "rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-all hover:scale-[1.03] hover:bg-[var(--theme-card)]/70",
                  style: {
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-text)"
                  },
                  children: [
                    tip.cta ?? "Open",
                    " →"
                  ]
                }
              ) : null,
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: handleNext,
                  "aria-label": "Next tip",
                  title: "Next tip",
                  className: "inline-flex size-6 items-center justify-center rounded-full border transition-all hover:scale-[1.05] hover:bg-[var(--theme-card)]/70",
                  style: {
                    borderColor: "var(--theme-border)",
                    color: "var(--theme-muted)"
                  },
                  children: /* @__PURE__ */ jsx(
                    HugeiconsIcon,
                    {
                      icon: Refresh01Icon,
                      size: 11,
                      strokeWidth: 1.8
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-[12px] font-semibold leading-tight",
              style: { color: "var(--theme-text)" },
              children: tip.title
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-[11px] leading-snug",
              style: { color: "var(--theme-muted)" },
              children: tip.body
            }
          )
        ] })
      ]
    }
  );
}
function formatPulse(iso) {
  if (!iso) return "—";
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return "—";
  const diff = Date.now() - ms;
  if (diff < 0) return "just now";
  if (diff < 6e4) return "<1m ago";
  if (diff < 36e5) return `${Math.round(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.round(diff / 36e5)}h ago`;
  return `${Math.round(diff / 864e5)}d ago`;
}
const PLATFORM_GLYPH = {
  api_server: "🌐",
  telegram: "✈️",
  discord: "🎮",
  whatsapp: "🟢",
  slack: "💼",
  signal: "🔵",
  matrix: "#",
  nostr: "⚡",
  imessage: "💬",
  bluebubbles: "🫧",
  mattermost: "🔷",
  feishu: "🪶",
  line: "💚",
  zalo: "⭐",
  twitch: "🎬",
  qqbot: "🐧",
  msteams: "🟦",
  irc: "#"
};
const STATE_TONE = {
  connected: "var(--theme-success)",
  running: "var(--theme-success)",
  ok: "var(--theme-success)",
  connecting: "var(--theme-warning)",
  starting: "var(--theme-warning)",
  error: "var(--theme-danger)",
  disconnected: "var(--theme-danger)",
  failed: "var(--theme-danger)"
};
function platformTone(state) {
  return STATE_TONE[state.toLowerCase()] ?? "var(--theme-muted)";
}
function formatNextRun(iso) {
  if (!iso) return { text: "no schedule", tone: "var(--theme-muted)" };
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return { text: "no schedule", tone: "var(--theme-muted)" };
  const diff = ms - Date.now();
  if (diff < -7 * 864e5) {
    return { text: "stale", tone: "var(--theme-muted)" };
  }
  if (diff < 0) return { text: "overdue", tone: "var(--theme-warning)" };
  if (diff < 6e4) return { text: "<1m", tone: "var(--theme-text)" };
  if (diff < 36e5)
    return { text: `${Math.round(diff / 6e4)}m`, tone: "var(--theme-text)" };
  if (diff < 864e5)
    return { text: `${Math.round(diff / 36e5)}h`, tone: "var(--theme-text)" };
  return { text: `${Math.round(diff / 864e5)}d`, tone: "var(--theme-text)" };
}
function OpsStrip({
  status,
  cron,
  kanban,
  platforms
}) {
  const navigate = useNavigate();
  if (!status) return null;
  const ok = status.gatewayState === "running" || status.gatewayState === "connected" || status.gatewayState === "ok";
  const drift = status.configVersion !== null && status.latestConfigVersion !== null && status.latestConfigVersion > status.configVersion ? status.latestConfigVersion - status.configVersion : 0;
  const next = cron ? formatNextRun(cron.nextRunAt) : null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex flex-col gap-2 rounded-md border bg-[var(--theme-card)]/50 px-3 py-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4",
      style: { borderColor: "var(--theme-border)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 text-[11px]", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "inline-flex h-1.5 w-1.5 rounded-full",
                  ok ? "animate-pulse" : ""
                ),
                style: {
                  background: ok ? "var(--theme-success)" : "var(--theme-warning)"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "font-mono uppercase tracking-[0.15em]",
                style: { color: "var(--theme-muted)" },
                children: ok ? "gateway" : `gateway ${status.gatewayState}`
              }
            )
          ] }),
          status.version ? /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono text-[10px] uppercase tracking-[0.1em]",
              style: { color: "var(--theme-muted)" },
              children: [
                "v",
                status.version
              ]
            }
          ) : null,
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono uppercase tracking-[0.15em]",
              style: { color: "var(--theme-muted)" },
              children: [
                "· ",
                status.activeAgents,
                " active",
                " ",
                status.activeAgents === 1 ? "run" : "runs"
              ]
            }
          ),
          status.lastHeartbeatAt ? /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono text-[9px] uppercase tracking-[0.15em]",
              style: { color: "var(--theme-muted)" },
              title: `Last gateway heartbeat: ${status.lastHeartbeatAt}`,
              children: [
                "· pulse ",
                formatPulse(status.lastHeartbeatAt)
              ]
            }
          ) : null,
          status.restartRequested ? /* @__PURE__ */ jsx(
            "span",
            {
              className: "rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em]",
              style: {
                background: "color-mix(in srgb, var(--theme-warning) 15%, transparent)",
                color: "var(--theme-warning)",
                border: "1px solid color-mix(in srgb, var(--theme-warning) 35%, transparent)"
              },
              children: "restart pending"
            }
          ) : null,
          drift > 0 ? /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/settings", search: {} }),
              className: "rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors hover:bg-[var(--theme-card)]/80",
              style: {
                background: "color-mix(in srgb, var(--theme-warning) 12%, transparent)",
                color: "var(--theme-warning)",
                border: "1px solid color-mix(in srgb, var(--theme-warning) 30%, transparent)"
              },
              title: `Local config v${status.configVersion} · latest v${status.latestConfigVersion}`,
              children: [
                drift,
                " config diff",
                drift === 1 ? "" : "s"
              ]
            }
          ) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 text-[11px]", children: [
          platforms.length > 0 ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: platforms.map((platform) => /* @__PURE__ */ jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]",
              style: {
                borderColor: "var(--theme-border)",
                color: platformTone(platform.state)
              },
              title: platform.errorMessage ? `${platform.name}: ${platform.errorMessage}` : `${platform.name} · ${platform.state}`,
              children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": true, children: PLATFORM_GLYPH[platform.name] ?? "🔌" }),
                platform.name.replace("_", " ")
              ]
            },
            platform.name
          )) }) : null,
          kanban ? /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/swarm2" }),
              className: "inline-flex items-center gap-2 rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors hover:bg-[var(--theme-card)]/80",
              style: {
                borderColor: kanban.blocked > 0 ? "color-mix(in srgb, var(--theme-warning) 35%, transparent)" : "var(--theme-border)",
                background: kanban.blocked > 0 ? "color-mix(in srgb, var(--theme-warning) 10%, transparent)" : "transparent",
                color: "var(--theme-muted)"
              },
              title: "Open Kanban board",
              children: [
                /* @__PURE__ */ jsx("span", { children: "board" }),
                /* @__PURE__ */ jsx("span", { style: { color: "var(--theme-text)" }, children: kanban.total }),
                kanban.ready > 0 ? /* @__PURE__ */ jsxs("span", { style: { color: "var(--theme-text)" }, children: [
                  "· ",
                  kanban.ready,
                  " ready"
                ] }) : null,
                kanban.running > 0 ? /* @__PURE__ */ jsxs("span", { style: { color: "var(--theme-success)" }, children: [
                  "· ",
                  kanban.running,
                  " running"
                ] }) : null,
                kanban.blocked > 0 ? /* @__PURE__ */ jsxs("span", { style: { color: "var(--theme-warning)" }, children: [
                  "· ",
                  kanban.blocked,
                  " blocked"
                ] }) : null
              ]
            }
          ) : null,
          cron ? (() => {
            const isStale = next?.text === "stale";
            const isWarn = next?.text === "overdue" || isStale;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => navigate({ to: "/jobs" }),
                className: "inline-flex items-center gap-2 rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors hover:bg-[var(--theme-card)]/80",
                style: {
                  borderColor: isWarn ? "color-mix(in srgb, var(--theme-warning) 35%, transparent)" : "var(--theme-border)",
                  background: isWarn ? "color-mix(in srgb, var(--theme-warning) 10%, transparent)" : "transparent",
                  color: "var(--theme-muted)"
                },
                title: isStale ? "Cron next-run is more than 7 days overdue" : "Open cron jobs",
                children: [
                  /* @__PURE__ */ jsx("span", { children: "cron" }),
                  /* @__PURE__ */ jsx("span", { style: { color: "var(--theme-text)" }, children: cron.total }),
                  cron.paused > 0 ? /* @__PURE__ */ jsxs("span", { style: { color: "var(--theme-warning)" }, children: [
                    "· ",
                    cron.paused,
                    " paused"
                  ] }) : null,
                  cron.running > 0 ? /* @__PURE__ */ jsxs("span", { style: { color: "var(--theme-success)" }, children: [
                    "· ",
                    cron.running,
                    " running"
                  ] }) : null,
                  next ? /* @__PURE__ */ jsxs("span", { style: { color: next.tone }, children: [
                    "· ",
                    next.text
                  ] }) : null
                ]
              }
            );
          })() : null
        ] })
      ]
    }
  );
}
function formatTokens$3(n) {
  if (!n || n <= 0) return "0";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
const FAMILY_TONES = [
  "var(--theme-accent)",
  "var(--theme-accent-secondary)",
  "var(--theme-success)",
  "var(--theme-warning)",
  "var(--theme-danger)",
  "#a78bfa",
  "#22d3ee",
  "#facc15"
];
function classify(modelId) {
  const id = modelId.toLowerCase();
  if (id.startsWith("claude-") || id.includes("anthropic"))
    return { key: "anthropic", label: "anthropic" };
  if (id.startsWith("gpt-") || id.startsWith("o1") || id.startsWith("o3") || id.includes("codex") || id.includes("openai"))
    return { key: "openai", label: "openai" };
  if (id.includes("gemini") || id.includes("google"))
    return { key: "google", label: "google" };
  if (id.includes("grok") || id.includes("xai"))
    return { key: "xai", label: "xai" };
  if (id.startsWith("gemma") || id.startsWith("llama") || id.startsWith("qwen") || id.startsWith("mistral") || id.startsWith("mixtral") || id.startsWith("deepseek") || id.startsWith("phi"))
    return { key: "local", label: "local" };
  if (id.startsWith("minimax")) return { key: "minimax", label: "minimax" };
  const slug = id.split(/[-/]/)[0] || "other";
  return { key: slug, label: slug };
}
function ProviderMixCard({
  analytics
}) {
  const buckets = useMemo(() => {
    if (!analytics || analytics.source !== "analytics") return [];
    const map = /* @__PURE__ */ new Map();
    for (const m of analytics.topModels) {
      const klass = classify(m.id);
      const existing = map.get(klass.key);
      if (existing) {
        existing.tokens += m.tokens;
        existing.sessions += m.sessions;
      } else {
        map.set(klass.key, {
          key: klass.key,
          label: klass.label,
          tokens: m.tokens,
          sessions: m.sessions,
          tone: FAMILY_TONES[map.size % FAMILY_TONES.length]
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.tokens - a.tokens);
  }, [analytics]);
  if (buckets.length === 0) return null;
  const totalTokens = buckets.reduce((a, b) => a + b.tokens, 0);
  if (totalTokens === 0) return null;
  let acc = 0;
  const stops = buckets.map((b) => {
    const pct = b.tokens / totalTokens * 100;
    const start = acc;
    acc += pct;
    return `${b.tone} ${start.toFixed(2)}% ${acc.toFixed(2)}%`;
  });
  const conic = `conic-gradient(${stops.join(", ")})`;
  const top = buckets[0];
  const topPct = top.tokens / totalTokens * 100;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex flex-col gap-2 overflow-hidden rounded-xl border p-3",
      style: {
        background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: {
              background: "linear-gradient(90deg, var(--theme-accent), color-mix(in srgb, var(--theme-accent) 40%, transparent), transparent)"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-[10px] font-semibold uppercase tracking-[0.18em]",
              style: { color: "var(--theme-text)" },
              children: "Provider mix"
            }
          ),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono text-[9px] uppercase tracking-[0.15em]",
              style: { color: "var(--theme-muted)" },
              children: [
                analytics ? `${analytics.windowDays}d` : "",
                " · ",
                buckets.length,
                " fam"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative shrink-0",
              style: { width: 64, height: 64 },
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-0 rounded-full",
                    style: { background: conic },
                    "aria-hidden": true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-[10px] rounded-full",
                    style: { background: "var(--theme-card)" },
                    "aria-hidden": true
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-center leading-none", children: [
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: "font-mono text-[12px] font-bold tabular-nums",
                      style: { color: "var(--theme-text)" },
                      children: [
                        topPct.toFixed(0),
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "mt-0.5 font-mono text-[7px] uppercase tracking-[0.12em]",
                      style: { color: "var(--theme-muted)" },
                      children: top.label
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("ul", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [
            buckets.slice(0, 4).map((b) => {
              const pct = b.tokens / totalTokens * 100;
              return /* @__PURE__ */ jsxs(
                "li",
                {
                  className: "flex items-center justify-between gap-2 text-[10px]",
                  style: { color: "var(--theme-muted)" },
                  title: `${b.sessions} sessions · ${formatTokens$3(b.tokens)} tokens`,
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 items-center gap-1.5 truncate", children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          "aria-hidden": true,
                          className: "inline-block size-1.5 shrink-0 rounded-full",
                          style: { background: b.tone }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "truncate font-mono uppercase tracking-[0.1em]",
                          style: { color: "var(--theme-text)" },
                          children: b.label
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "shrink-0 font-mono tabular-nums", children: [
                      pct.toFixed(0),
                      "%"
                    ] })
                  ]
                },
                b.key
              );
            }),
            buckets.length > 4 ? /* @__PURE__ */ jsxs(
              "li",
              {
                className: "text-[9px] font-mono uppercase tracking-[0.1em]",
                style: { color: "var(--theme-muted)" },
                children: [
                  "+",
                  buckets.length - 4,
                  " more"
                ]
              }
            ) : null
          ] })
        ] })
      ]
    }
  );
}
const KIND_ICONS = {
  chat: "💬",
  cron: "⏰",
  cli: "⌨️",
  api: "🔌",
  api_server: "🔌",
  telegram: "✈️",
  discord: "🎮",
  whatsapp: "🟢",
  signal: "🔵",
  imessage: "💬",
  matrix: "#",
  workspace: "🧭",
  local: "🧭",
  job: "📋"
};
function sessionGlyph(s) {
  if (typeof s.key === "string" && s.key.startsWith("cron_")) {
    return KIND_ICONS.cron;
  }
  const sourceKey = s.source?.toLowerCase();
  if (sourceKey && KIND_ICONS[sourceKey]) return KIND_ICONS[sourceKey];
  const kindKey = s.kind?.toLowerCase();
  if (kindKey && KIND_ICONS[kindKey]) return KIND_ICONS[kindKey];
  return KIND_ICONS.chat;
}
function relativeTime(ms) {
  if (!ms) return "—";
  const diff = Date.now() - ms;
  if (diff < 0) return "just now";
  if (diff < 6e4) return "<1m ago";
  if (diff < 36e5) return `${Math.round(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.round(diff / 36e5)}h ago`;
  return `${Math.round(diff / 864e5)}d ago`;
}
function formatTokens$2(n) {
  if (!n || n <= 0) return "0";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
function shortTitle(s) {
  const t = s.title?.trim();
  if (t && t.length > 0 && t !== s.key) return t;
  return `Session ${s.key.slice(0, 8)}`;
}
function buildBadges(s) {
  const badges = [];
  const now = Date.now();
  if (s.updatedAt && now - s.updatedAt < 5 * 6e4 && s.status !== "ended") {
    badges.push({
      label: "hot",
      tone: "var(--theme-success)",
      title: "Active in last 5 minutes"
    });
  }
  if (s.toolCallCount >= 20) {
    badges.push({
      label: "tool-heavy",
      tone: "var(--theme-accent)",
      title: `${s.toolCallCount} tool calls`
    });
  }
  if (s.tokenCount >= 5e4) {
    badges.push({
      label: "high-token",
      tone: "var(--theme-accent-secondary)",
      title: `${formatTokens$2(s.tokenCount)} tokens`
    });
  }
  if (s.status?.toLowerCase() === "error" || s.status?.toLowerCase() === "failed") {
    badges.push({
      label: "error",
      tone: "var(--theme-danger)",
      title: "Session ended in an error state"
    });
  }
  if (s.updatedAt && now - s.updatedAt > 7 * 864e5 && s.status !== "ended") {
    badges.push({
      label: "stale",
      tone: "var(--theme-muted)",
      title: "No activity in over 7 days"
    });
  }
  return badges;
}
function SessionsIntelligenceCard({
  sessions
}) {
  const navigate = useNavigate();
  const enriched = useMemo(() => {
    return sessions.map((s) => ({
      session: s,
      badges: buildBadges(s)
    }));
  }, [sessions]);
  const highlightId = useMemo(() => {
    const hot = enriched.find(
      (e) => e.badges.some((b) => b.label === "hot")
    );
    if (hot) return hot.session.key;
    const heavy = enriched.find(
      (e) => e.badges.some((b) => b.label === "tool-heavy")
    );
    if (heavy) return heavy.session.key;
    return enriched[0]?.session.key ?? null;
  }, [enriched]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex h-full flex-1 flex-col gap-2 overflow-hidden rounded-xl border p-3",
      style: {
        background: "linear-gradient(150deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 90%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-[11px] font-semibold uppercase tracking-[0.18em]",
              style: { color: "var(--theme-text)" },
              children: "Sessions intelligence"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs(
              "span",
              {
                className: "font-mono text-[10px] uppercase tracking-[0.15em]",
                style: { color: "var(--theme-muted)" },
                children: [
                  sessions.length,
                  " recent"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => navigate({
                  to: "/chat/$sessionKey",
                  params: { sessionKey: "main" }
                }),
                className: "rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors hover:bg-[var(--theme-card)]/80",
                style: {
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-muted)"
                },
                children: "Open chat →"
              }
            )
          ] })
        ] }),
        sessions.length === 0 ? /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex h-[120px] items-center justify-center rounded-md border border-dashed text-[11px]",
            style: {
              borderColor: "var(--theme-border)",
              color: "var(--theme-muted)"
            },
            children: "No sessions yet — start a chat."
          }
        ) : (
          // Iter 013: bumped from 8 → 14 rows. The card is now the
          // bottom anchor of the main column, so it has the room.
          // Operators that want fewer can still toggle to a deep
          // sessions route in iter N+1.
          /* @__PURE__ */ jsx("ul", { className: "flex flex-1 flex-col gap-1 overflow-hidden", children: enriched.slice(0, 14).map(({ session: s, badges }) => {
            const isHighlight = s.key === highlightId;
            const icon = sessionGlyph(s);
            return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => navigate({
                  to: "/chat/$sessionKey",
                  params: { sessionKey: s.key }
                }),
                className: "group flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left transition-colors hover:bg-[var(--theme-card)]/80",
                style: {
                  borderColor: isHighlight ? "color-mix(in srgb, var(--theme-accent) 50%, transparent)" : "var(--theme-border)",
                  background: isHighlight ? "color-mix(in srgb, var(--theme-accent) 6%, transparent)" : "transparent"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      "aria-hidden": true,
                      className: "text-sm",
                      style: { filter: isHighlight ? "none" : "grayscale(0.2)" },
                      children: icon
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "truncate text-[12px] font-semibold",
                          style: { color: "var(--theme-text)" },
                          title: s.title,
                          children: shortTitle(s)
                        }
                      ),
                      badges.map((b) => /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "hidden shrink-0 rounded px-1 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] sm:inline-block",
                          style: {
                            background: `color-mix(in srgb, ${b.tone} 14%, transparent)`,
                            color: b.tone,
                            border: `1px solid color-mix(in srgb, ${b.tone} 32%, transparent)`
                          },
                          title: b.title,
                          children: b.label
                        },
                        b.label
                      ))
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "mt-0.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.05em]",
                        style: { color: "var(--theme-muted)" },
                        children: [
                          s.model ? /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: "rounded px-1 py-0.5",
                              style: {
                                background: "color-mix(in srgb, var(--theme-accent) 10%, transparent)",
                                color: "var(--theme-accent)"
                              },
                              children: formatModelName(s.model)
                            }
                          ) : null,
                          /* @__PURE__ */ jsxs("span", { children: [
                            s.messageCount,
                            " msgs"
                          ] }),
                          s.toolCallCount > 0 ? /* @__PURE__ */ jsxs("span", { children: [
                            s.toolCallCount,
                            " tools"
                          ] }) : null,
                          s.tokenCount > 0 ? /* @__PURE__ */ jsxs("span", { children: [
                            formatTokens$2(s.tokenCount),
                            " tok"
                          ] }) : null,
                          /* @__PURE__ */ jsx("span", { className: "ml-auto", children: relativeTime(s.updatedAt ?? s.startedAt) })
                        ]
                      }
                    )
                  ] })
                ]
              }
            ) }, s.key);
          }) })
        )
      ]
    }
  );
}
function SkillsUsageCard({
  usage,
  installedCount,
  onOpen
}) {
  const navigate = useNavigate();
  const hasUsage = !!usage && usage.topSkills.length > 0;
  const top = hasUsage ? usage.topSkills : [];
  const max = top[0]?.totalCount || 1;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: () => {
        onOpen();
        navigate({ to: "/skills" });
      },
      className: "group relative flex w-full flex-col gap-2 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--theme-card)_85%,transparent)]",
      style: {
        background: "linear-gradient(150deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: {
              background: "linear-gradient(90deg, var(--theme-warning), color-mix(in srgb, var(--theme-warning) 40%, transparent), transparent)"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-[10px] font-semibold uppercase tracking-[0.18em]",
              style: { color: "var(--theme-text)" },
              children: "Skills usage"
            }
          ),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono text-[9px] uppercase tracking-[0.15em] transition-colors group-hover:text-[var(--theme-accent)]",
              style: { color: "var(--theme-muted)" },
              children: [
                hasUsage ? `${usage.distinctSkills} of ${installedCount} used` : `${installedCount} installed`,
                " · manage →"
              ]
            }
          )
        ] }),
        hasUsage ? /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1.5", children: top.slice(0, 5).map((s) => {
          const widthPct = Math.max(2, Math.round(s.totalCount / max * 100));
          return /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-2 text-[11px]", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "truncate font-mono",
                  style: { color: "var(--theme-text)" },
                  title: s.skill,
                  children: formatSkillName(s.skill)
                }
              ),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "font-mono text-[10px] tabular-nums",
                  style: { color: "var(--theme-muted)" },
                  children: [
                    s.totalCount,
                    /* @__PURE__ */ jsx("span", { className: "ml-1", children: "·" }),
                    /* @__PURE__ */ jsxs("span", { className: "ml-1", children: [
                      s.percentage.toFixed(1),
                      "%"
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "mt-0.5 h-1 w-full overflow-hidden rounded-full",
                style: {
                  background: "color-mix(in srgb, var(--theme-border) 50%, transparent)"
                },
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full",
                    style: {
                      width: `${widthPct}%`,
                      background: "linear-gradient(90deg, var(--theme-warning), color-mix(in srgb, var(--theme-warning) 60%, transparent))"
                    }
                  }
                )
              }
            )
          ] }, s.skill);
        }) }) : /* @__PURE__ */ jsx(
          "div",
          {
            className: "font-mono text-[11px] uppercase tracking-[0.15em]",
            style: { color: "var(--theme-muted)" },
            children: installedCount === 0 ? "no skills installed" : "no usage in this window yet"
          }
        )
      ]
    }
  );
}
function formatTokens$1(n) {
  if (!n || n <= 0) return "0";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
function formatHour(h) {
  if (h === 0) return "12a";
  if (h < 12) return `${h}a`;
  if (h === 12) return "12p";
  return `${h - 12}p`;
}
function TokenMixHourCard({
  analytics,
  sessions
}) {
  const slices = useMemo(() => {
    if (!analytics || analytics.source !== "analytics") return [];
    return [
      {
        label: "cache",
        value: analytics.cacheReadTokens,
        tone: "var(--theme-accent-secondary)",
        hint: "Cache read tokens."
      },
      {
        label: "input",
        value: analytics.inputTokens,
        tone: "var(--theme-accent)",
        hint: "Prompt tokens sent to the model."
      },
      {
        label: "output",
        value: analytics.outputTokens,
        tone: "var(--theme-success)",
        hint: "Completion tokens emitted."
      },
      {
        label: "reasoning",
        value: analytics.reasoningTokens,
        tone: "var(--theme-warning)",
        hint: "Thinking tokens (when supported)."
      }
    ];
  }, [analytics]);
  const totalTokens = slices.reduce((a, s) => a + s.value, 0);
  const ratio = analytics && analytics.inputTokens > 0 ? analytics.outputTokens / analytics.inputTokens * 100 : 0;
  const buckets = useMemo(() => {
    const counts = Array.from({ length: 24 }, () => 0);
    for (const s of sessions) {
      const ts = s.startedAt ?? s.updatedAt;
      if (!ts) continue;
      const date = new Date(ts);
      const hour = date.getHours();
      if (hour >= 0 && hour < 24) counts[hour] += 1;
    }
    return counts;
  }, [sessions]);
  const totalSessions = buckets.reduce((a, b) => a + b, 0);
  const maxBucket = Math.max(...buckets, 1);
  const peakHour = buckets.indexOf(maxBucket);
  if (totalTokens === 0 && totalSessions === 0) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex h-full flex-1 flex-col justify-between gap-3 overflow-hidden rounded-xl border p-3",
      style: {
        background: "linear-gradient(150deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxs(
            "h3",
            {
              className: "text-[10px] font-semibold uppercase tracking-[0.18em]",
              style: { color: "var(--theme-text)" },
              children: [
                "Mix & rhythm",
                analytics ? ` · ${analytics.windowDays}d` : ""
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono text-[9px] uppercase tracking-[0.15em]",
              style: { color: "var(--theme-muted)" },
              children: [
                totalTokens > 0 ? `out/in ${ratio.toFixed(1)}%` : "",
                totalTokens > 0 && totalSessions > 0 ? " · " : "",
                totalSessions > 0 ? `peak ${formatHour(peakHour)} · ${totalSessions} sess` : ""
              ]
            }
          )
        ] }),
        totalTokens > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex h-2 w-full overflow-hidden rounded-full",
              style: {
                background: "color-mix(in srgb, var(--theme-border) 40%, transparent)"
              },
              children: slices.map((s) => {
                const widthPct = Math.max(0, s.value / totalTokens * 100);
                if (widthPct < 0.5) return null;
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: { width: `${widthPct}%`, background: s.tone },
                    title: `${s.label}: ${formatTokens$1(s.value)} (${widthPct.toFixed(1)}%)`
                  },
                  s.label
                );
              })
            }
          ),
          /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]", children: slices.map((s) => {
            const widthPct = s.value / totalTokens * 100;
            return /* @__PURE__ */ jsxs(
              "li",
              {
                className: "flex items-center justify-between gap-2",
                style: { color: "var(--theme-muted)" },
                title: s.hint,
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 truncate", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "inline-block size-1.5 shrink-0 rounded-full",
                        style: { background: s.tone },
                        "aria-hidden": true
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "font-mono uppercase tracking-[0.1em]", children: s.label })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: "shrink-0 font-mono tabular-nums",
                      style: { color: "var(--theme-text)" },
                      children: [
                        formatTokens$1(s.value),
                        /* @__PURE__ */ jsxs(
                          "span",
                          {
                            className: "ml-1",
                            style: { color: "var(--theme-muted)" },
                            children: [
                              "· ",
                              widthPct.toFixed(0),
                              "%"
                            ]
                          }
                        )
                      ]
                    }
                  )
                ]
              },
              s.label
            );
          }) })
        ] }) : null,
        totalSessions > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-end gap-[2px]", style: { height: 38 }, children: buckets.map((count, hour) => {
            const heightPct = maxBucket > 0 ? count / maxBucket * 100 : 0;
            const isPeak = count === maxBucket && count > 0;
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: "flex-1 rounded-sm",
                style: {
                  background: count === 0 ? "color-mix(in srgb, var(--theme-border) 30%, transparent)" : isPeak ? "var(--theme-accent)" : `color-mix(in srgb, var(--theme-accent) ${Math.max(20, heightPct)}%, transparent)`,
                  height: count === 0 ? 4 : `${Math.max(8, heightPct)}%`,
                  minHeight: 4
                },
                title: `${formatHour(hour)} · ${count} session${count === 1 ? "" : "s"}`
              },
              hour
            );
          }) }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex justify-between font-mono text-[8px] uppercase tracking-[0.1em]",
              style: { color: "var(--theme-muted)" },
              children: [
                /* @__PURE__ */ jsx("span", { children: "12a" }),
                /* @__PURE__ */ jsx("span", { children: "6a" }),
                /* @__PURE__ */ jsx("span", { children: "12p" }),
                /* @__PURE__ */ jsx("span", { children: "6p" }),
                /* @__PURE__ */ jsx("span", { children: "12a" })
              ]
            }
          )
        ] }) : null
      ]
    }
  );
}
function formatTokens(n) {
  if (!n || n <= 0) return "0";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
function formatCost(usd) {
  if (!usd || usd <= 0) return "$0";
  if (usd < 0.01) return "<$0.01";
  if (usd < 1) return `$${usd.toFixed(3)}`;
  if (usd < 100) return `$${usd.toFixed(2)}`;
  return `$${Math.round(usd).toLocaleString()}`;
}
function TopModelsCard({
  analytics
}) {
  if (!analytics || analytics.topModels.length === 0) return null;
  const totalCalls = analytics.totalApiCalls || 0;
  const maxTokens = analytics.topModels[0]?.tokens || 1;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex flex-col gap-2 overflow-hidden rounded-xl border p-3",
      style: {
        background: "linear-gradient(150deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              HugeiconsIcon,
              {
                icon: ChartBarLineIcon,
                size: 14,
                strokeWidth: 1.5,
                style: { color: "var(--theme-accent-secondary)" }
              }
            ),
            /* @__PURE__ */ jsxs(
              "h3",
              {
                className: "text-[10px] font-semibold uppercase tracking-[0.18em]",
                style: { color: "var(--theme-text)" },
                children: [
                  "Top models · ",
                  analytics.windowDays,
                  "d"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono text-[9px] uppercase tracking-[0.15em]",
              style: { color: "var(--theme-muted)" },
              children: [
                analytics.topModels.length,
                " ranked"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1.5", children: analytics.topModels.map((m, i) => {
          const widthPct = Math.max(2, Math.round(m.tokens / maxTokens * 100));
          const sharePct = totalCalls > 0 ? Math.round(m.calls / totalCalls * 100) : 0;
          const tone = i === 0 ? "var(--theme-accent)" : i === 1 ? "var(--theme-accent-secondary)" : "var(--theme-muted)";
          return /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 text-[11px]", children: [
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "flex min-w-0 items-center gap-1.5 truncate font-mono",
                  style: { color: "var(--theme-text)" },
                  title: m.id,
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "inline-block w-3 text-right tabular-nums",
                        style: { color: "var(--theme-muted)" },
                        children: i + 1
                      }
                    ),
                    formatModelName(m.id)
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "font-mono text-[10px] tabular-nums",
                  style: { color: "var(--theme-muted)" },
                  children: formatTokens(m.tokens)
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "mt-0.5 h-1 w-full overflow-hidden rounded-full",
                style: {
                  background: "color-mix(in srgb, var(--theme-border) 50%, transparent)"
                },
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full",
                    style: {
                      width: `${widthPct}%`,
                      background: tone
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "mt-0.5 flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.1em]",
                style: { color: "var(--theme-muted)" },
                children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    sharePct,
                    "% of calls · ",
                    m.sessions.toLocaleString(),
                    " sessions"
                  ] }),
                  /* @__PURE__ */ jsx("span", { children: formatCost(m.cost) })
                ]
              }
            )
          ] }, m.id);
        }) })
      ]
    }
  );
}
function formatNumber(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}
function deltaText(curr, prev) {
  if (prev === 0) {
    return curr > 0 ? { text: "new", tone: "var(--theme-success)" } : { text: "flat", tone: "var(--theme-muted)" };
  }
  const pct = (curr - prev) / prev * 100;
  if (Math.abs(pct) < 1) return { text: "flat", tone: "var(--theme-muted)" };
  return {
    text: `${pct > 0 ? "+" : ""}${pct.toFixed(0)}%`,
    tone: pct > 0 ? "var(--theme-success)" : pct < -25 ? "var(--theme-warning)" : "var(--theme-muted)"
  };
}
function VelocityCard({
  analytics
}) {
  if (!analytics || analytics.source !== "analytics") return null;
  if (analytics.daily.length === 0) return null;
  const sessionsPerDay = analytics.totalSessions / Math.max(1, analytics.windowDays);
  const callsPerDay = analytics.totalApiCalls / Math.max(1, analytics.windowDays);
  const dailySessions = analytics.daily.map((d) => d.sessions);
  const mid = Math.floor(dailySessions.length / 2);
  const recent = dailySessions.slice(mid).reduce((a, b) => a + b, 0);
  const prior = dailySessions.slice(0, mid).reduce((a, b) => a + b, 0);
  const delta = deltaText(recent, prior);
  const max = Math.max(...dailySessions, 1);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex flex-col gap-2 overflow-hidden rounded-xl border p-3",
      style: {
        background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 92%, transparent))",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: {
              background: "linear-gradient(90deg, var(--theme-accent), color-mix(in srgb, var(--theme-accent) 40%, transparent), transparent)"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-[10px] font-semibold uppercase tracking-[0.18em]",
              style: { color: "var(--theme-text)" },
              children: "Velocity"
            }
          ),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono text-[9px] uppercase tracking-[0.15em]",
              style: { color: "var(--theme-muted)" },
              children: [
                analytics.windowDays,
                "d avg"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "font-mono text-2xl font-bold leading-none tabular-nums",
                style: { color: "var(--theme-text)" },
                children: sessionsPerDay.toFixed(sessionsPerDay < 10 ? 1 : 0)
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "font-mono text-[10px] uppercase tracking-[0.1em]",
                style: { color: "var(--theme-muted)" },
                children: "sess/day"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
              style: {
                background: `color-mix(in srgb, ${delta.tone} 14%, transparent)`,
                color: delta.tone
              },
              children: delta.text
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 text-[10px]", children: [
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-mono uppercase tracking-[0.1em]",
              style: { color: "var(--theme-muted)" },
              children: [
                formatNumber(callsPerDay),
                " calls/day"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex items-end gap-[2px]",
              style: { height: 18, width: 96 },
              "aria-hidden": true,
              children: dailySessions.map((c, idx) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "flex-1 rounded-sm",
                  style: {
                    height: `${Math.max(8, c / max * 100)}%`,
                    background: c === 0 ? "color-mix(in srgb, var(--theme-border) 35%, transparent)" : `color-mix(in srgb, var(--theme-accent) ${Math.max(40, c / max * 100)}%, transparent)`
                  },
                  title: `day ${idx + 1}: ${c} session${c === 1 ? "" : "s"}`
                },
                idx
              ))
            }
          )
        ] })
      ]
    }
  );
}
function WidgetShell({
  id,
  layout,
  children
}) {
  if (!layout.isVisible(id)) return null;
  const meta = WIDGET_CATALOG.find((w) => w.id === id);
  const canHide = meta?.hideable ?? true;
  if (!layout.editMode) {
    return /* @__PURE__ */ jsx(Fragment, { children });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative h-full", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": true,
        className: "pointer-events-none absolute inset-0 rounded-xl",
        style: {
          outline: "1px dashed var(--theme-accent)",
          outlineOffset: "2px",
          boxShadow: "0 0 0 6px color-mix(in srgb, var(--theme-accent) 8%, transparent)",
          borderRadius: 12
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "relative h-full", children }),
    canHide ? /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: (e) => {
          e.stopPropagation();
          layout.hide(id);
        },
        className: "absolute -right-2 -top-2 z-10 inline-flex size-6 items-center justify-center rounded-full text-[14px] font-bold leading-none shadow-md transition-transform hover:scale-110",
        style: {
          background: "var(--theme-card)",
          color: "var(--theme-danger)",
          border: "1px solid var(--theme-border)"
        },
        title: `Hide ${meta?.label ?? id}`,
        "aria-label": `Hide widget ${meta?.label ?? id}`,
        children: "×"
      }
    ) : null
  ] });
}
function normalizeDashboardSessionsPayload(data) {
  return {
    sessions: data.sessions ?? [],
    unavailable: data.source === "unavailable" || data.code === "capability_unavailable",
    message: typeof data.message === "string" ? data.message : void 0
  };
}
function themeColor(name, fallback) {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}
function readDashboardPalette() {
  return {
    accent: themeColor("--theme-accent", "#6366f1"),
    accentSecondary: themeColor("--theme-accent-secondary", "#8b5cf6"),
    success: themeColor("--theme-success", "#22c55e"),
    warning: themeColor("--theme-warning", "#f59e0b"),
    danger: themeColor("--theme-danger", "#ef4444"),
    muted: themeColor("--theme-muted", "#6b7280"),
    border: themeColor("--theme-border", "#333333"),
    card: themeColor("--theme-card", "#1a1a2e"),
    text: themeColor("--theme-text", "#e5e7eb")
  };
}
function useDashboardPalette() {
  const [palette, setPalette] = useState(readDashboardPalette);
  useEffect(() => {
    if (typeof document === "undefined") return void 0;
    const refresh = () => setPalette(readDashboardPalette());
    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style", "class"]
    });
    return () => observer.disconnect();
  }, []);
  return palette;
}
function GlassCard({
  title,
  titleRight,
  accentColor,
  noPadding,
  className,
  children
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "relative flex flex-col overflow-hidden rounded-xl border transition-colors",
        className
      ),
      style: {
        background: "var(--theme-card)",
        borderColor: "var(--theme-border)"
      },
      children: [
        accentColor && /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: {
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}50, transparent)`
            }
          }
        ),
        title && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 pt-4 pb-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-semibold uppercase tracking-[0.15em] text-muted", children: title }),
          titleRight
        ] }),
        /* @__PURE__ */ jsx("div", { className: cn("flex-1", noPadding ? "" : "px-5 pb-4 pt-3"), children })
      ]
    }
  );
}
function EnhancedBadge({ label = "Enhanced API" }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
      style: {
        border: `1px solid ${themeColor("--theme-accent-border", "rgba(245, 158, 11, 0.28)")}`,
        background: themeColor("--theme-accent-subtle", "rgba(245, 158, 11, 0.12)"),
        color: themeColor("--theme-accent", "#f59e0b")
      },
      children: label
    }
  );
}
function UnavailableWidget({
  title,
  description
}) {
  return /* @__PURE__ */ jsx(
    GlassCard,
    {
      title,
      titleRight: /* @__PURE__ */ jsx(EnhancedBadge, {}),
      accentColor: themeColor("--theme-warning", "#f59e0b"),
      className: "h-full",
      children: /* @__PURE__ */ jsx("div", { className: "flex h-full min-h-[180px] items-center justify-center rounded-lg border border-dashed border-[var(--theme-border)] bg-[var(--theme-card2)] px-4 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: description }) })
    }
  );
}
function SecondaryAction({
  label,
  icon,
  onClick,
  disabled
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick,
      disabled,
      className: "group inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.05em] transition-all hover:scale-[1.015] hover:bg-[var(--theme-card)]/70 hover:text-[var(--theme-text)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
      style: {
        borderColor: "var(--theme-border)",
        color: "var(--theme-muted)",
        background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 80%, transparent), transparent)"
      },
      children: [
        /* @__PURE__ */ jsx(
          HugeiconsIcon,
          {
            icon,
            size: 14,
            strokeWidth: 1.6,
            className: "transition-colors group-hover:text-[var(--theme-accent)]"
          }
        ),
        /* @__PURE__ */ jsx("span", { children: label })
      ]
    }
  );
}
function DashboardScreen() {
  const navigate = useNavigate();
  const skillsAvailable = useFeatureAvailable("skills");
  const sessionsQuery = useQuery({
    // Use a dedicated query key — NOT chatQueryKeys.sessions — to avoid
    // cache collisions with the chat sidebar which fetches fewer sessions
    // and overwrites the dashboard's larger dataset.
    // Also use the workspace proxy (/api/sessions) rather than the server-side
    // listSessions() — the latter calls the gateway via CLAUDE_API which is
    // only available server-side and returns nothing when called from the client.
    // Do not gate this direct proof behind /api/gateway-status. That probe can
    // be stale/loading while /api/sessions already works, which made the
    // dashboard show a bogus “Enhanced API required” warning even though
    // sessions were healthy.
    queryKey: ["dashboard", "sessions"],
    queryFn: async () => {
      const res = await fetch("/api/sessions?limit=200&offset=0");
      if (!res.ok) {
        throw new Error(`Sessions API returned HTTP ${res.status}`);
      }
      const data = await res.json();
      return normalizeDashboardSessionsPayload(data);
    },
    staleTime: 1e4,
    refetchInterval: 3e4,
    retry: 1
  });
  const sessionsResult = sessionsQuery.data;
  const rawSessions = sessionsResult?.sessions ?? [];
  const sessionsUnavailable = Boolean(sessionsResult?.unavailable);
  const sessionsUnavailableMessage = sessionsResult?.message ?? getUnavailableReason("sessions");
  const sessions = useMemo(
    () => rawSessions.map((s) => ({
      id: s.key ?? s.id,
      started_at: s.startedAt ? s.startedAt / 1e3 : void 0,
      message_count: s.message_count ?? 0,
      tool_call_count: s.tool_call_count ?? 0,
      input_tokens: s.tokenCount ?? 0,
      output_tokens: 0
    })),
    [rawSessions]
  );
  const sessionRows = useMemo(
    () => [...rawSessions].sort(
      (a, b) => (b.updatedAt ?? b.startedAt ?? 0) - (a.updatedAt ?? a.startedAt ?? 0)
    ).slice(0, 12).map((s) => ({
      key: String(s.key ?? s.id ?? ""),
      title: s.derivedTitle || s.title || s.preview || String(s.key ?? ""),
      kind: String(s.kind ?? "chat"),
      status: String(s.status ?? ""),
      source: s.source ?? null,
      model: s.model ?? null,
      messageCount: s.messageCount ?? s.message_count ?? 0,
      toolCallCount: s.toolCallCount ?? s.tool_call_count ?? 0,
      tokenCount: s.tokenCount ?? s.totalTokens ?? 0,
      startedAt: s.startedAt ?? null,
      updatedAt: s.updatedAt ?? null
    })),
    [rawSessions]
  );
  const stats = useMemo(() => {
    let totalMessages = 0, totalToolCalls = 0, totalTokens = 0;
    for (const s of sessions) {
      totalMessages += s.message_count ?? 0;
      totalToolCalls += s.tool_call_count ?? 0;
      totalTokens += (s.input_tokens ?? 0) + (s.output_tokens ?? 0);
    }
    return {
      totalSessions: sessions.length,
      totalMessages,
      totalToolCalls,
      totalTokens
    };
  }, [sessions]);
  const recentSessions = useMemo(
    () => [...sessions].sort((a, b) => (b.started_at ?? 0) - (a.started_at ?? 0)).slice(0, 6),
    [sessions]
  );
  useMemo(() => {
    let max = 0;
    for (const s of recentSessions) {
      const t = (s.input_tokens ?? 0) + (s.output_tokens ?? 0);
      if (t > max) max = t;
    }
    return max;
  }, [recentSessions]);
  const skillsCountQuery = useQuery({
    queryKey: ["dashboard", "skills-count"],
    queryFn: async () => {
      const res = await fetch(
        "/api/skills?tab=installed&limit=200&summary=search"
      );
      if (!res.ok) return 0;
      const data = await res.json();
      return data.skills?.length ?? 0;
    },
    staleTime: 6e4,
    enabled: skillsAvailable
  });
  const skillsInstalled = skillsCountQuery.data ?? 0;
  const layout = useDashboardLayout();
  const [period, setPeriod] = useState(() => {
    if (typeof window === "undefined") return 30;
    const stored = window.localStorage.getItem("dashboard.analyticsPeriod");
    const n = Number(stored);
    if (n === 7 || n === 14 || n === 30) return n;
    return 30;
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "dashboard.analyticsPeriod",
        String(period)
      );
    }
  }, [period]);
  const overviewQuery = useQuery({
    queryKey: ["dashboard", "overview", period],
    queryFn: async () => {
      const res = await fetch(
        `/api/dashboard/overview?days=${period}&achievements=5`
      );
      if (!res.ok) throw new Error(`overview ${res.status}`);
      return await res.json();
    },
    staleTime: 5e3,
    refetchInterval: 3e4
  });
  const overview = overviewQuery.data ?? null;
  const palette = useDashboardPalette();
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return true;
    const dt = document.documentElement.getAttribute("data-theme") || "";
    return !dt.endsWith("-light");
  });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-2 h-12", style: { paddingTop: "env(safe-area-inset-top, 0px)" }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-label": "Open navigation menu",
          onClick: openHamburgerMenu,
          className: "flex items-center justify-center w-11 h-11 rounded-xl active:bg-white/10 transition-colors touch-manipulation",
          children: /* @__PURE__ */ jsx("svg", { width: "20", height: "16", viewBox: "0 0 20 16", fill: "none", className: "opacity-70", style: { color: "var(--color-ink, #111)" }, children: /* @__PURE__ */ jsx("path", { d: "M1 1.5H19M1 8H19M1 14.5H13", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-label": "Toggle theme",
          onClick: () => {
            const LIGHT_DARK_PAIRS = {
              "claude-nous": "claude-nous-light",
              "claude-nous-light": "claude-nous",
              "claude-official": "claude-official-light",
              "claude-official-light": "claude-official",
              "claude-classic": "claude-classic-light",
              "claude-classic-light": "claude-classic",
              "claude-slate": "claude-slate-light",
              "claude-slate-light": "claude-slate"
            };
            const cur = document.documentElement.getAttribute("data-theme") || "claude-official";
            const nextDataTheme = LIGHT_DARK_PAIRS[cur] || (isDark ? "claude-official-light" : "claude-official");
            import("./router-DmH5gXcK.js").then((n) => n.a5).then(({ setTheme }) => {
              setTheme(nextDataTheme);
            });
            const nextMode = nextDataTheme.endsWith("-light") ? "light" : "dark";
            applyTheme();
            updateSettings({ theme: nextMode });
            setIsDark(nextMode === "dark");
          },
          className: "flex items-center justify-center w-11 h-11 rounded-xl active:bg-white/10 transition-colors touch-manipulation",
          style: { color: "var(--theme-muted)" },
          children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: isDark ? Sun02Icon : Moon02Icon, size: 20, strokeWidth: 1.5 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 pt-14 md:pt-4 py-4 md:px-8 md:py-6 lg:px-10 space-y-5 pb-28", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "relative inline-flex shrink-0 items-center justify-center rounded-xl border",
              style: {
                width: 44,
                height: 44,
                borderColor: "color-mix(in srgb, var(--theme-accent) 35%, var(--theme-border))",
                background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-accent) 14%, var(--theme-card)), var(--theme-card))",
                boxShadow: "0 0 0 4px color-mix(in srgb, var(--theme-accent) 6%, transparent)"
              },
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/claude-avatar.webp",
                  alt: "Hermes Workspace logo",
                  className: "size-8 rounded-md",
                  style: { background: "transparent" }
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col justify-center", children: /* @__PURE__ */ jsx(
            "h1",
            {
              className: "text-2xl font-bold tracking-tight",
              style: {
                color: "var(--theme-text)",
                letterSpacing: "-0.015em",
                lineHeight: 1.1
              },
              children: "Hermes Workspace"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-wrap items-center gap-2 lg:justify-end lg:max-w-xl", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({
                to: "/chat/$sessionKey",
                params: { sessionKey: "new" }
              }),
              className: "group relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.05em] transition-all hover:scale-[1.02] active:scale-[0.99] sm:px-3.5 sm:py-2 sm:text-sm",
              style: {
                background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentSecondary})`,
                color: "var(--theme-on-accent, white)",
                boxShadow: `0 6px 18px -8px ${palette.accent}aa, inset 0 1px 0 0 rgba(255,255,255,0.18)`
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": true,
                    className: "pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                    style: {
                      background: "linear-gradient(135deg, rgba(255,255,255,0.15), transparent 60%)"
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  HugeiconsIcon,
                  {
                    icon: BubbleChatAddIcon,
                    size: 16,
                    strokeWidth: 1.8
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: "New Chat" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            SecondaryAction,
            {
              label: "Terminal",
              icon: ConsoleIcon,
              onClick: () => navigate({ to: "/terminal" })
            }
          ),
          /* @__PURE__ */ jsx(
            SecondaryAction,
            {
              label: "Skills",
              icon: PuzzleIcon,
              onClick: () => navigate({ to: "/skills" }),
              disabled: !skillsAvailable
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": layout.editMode ? "Done editing layout" : "Edit layout",
              title: layout.editMode ? "Done editing layout" : "Edit layout",
              onClick: layout.toggleEdit,
              className: "inline-flex size-9 items-center justify-center rounded-lg border transition-all hover:scale-[1.05] hover:bg-[var(--theme-card)]/70",
              style: {
                borderColor: layout.editMode ? "var(--theme-accent)" : "var(--theme-border)",
                background: layout.editMode ? "color-mix(in srgb, var(--theme-accent) 14%, transparent)" : "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 80%, transparent), transparent)",
                color: layout.editMode ? "var(--theme-accent)" : "var(--theme-muted)"
              },
              children: /* @__PURE__ */ jsx(
                HugeiconsIcon,
                {
                  icon: layout.editMode ? CheckmarkCircle02Icon : Edit02Icon,
                  size: 15,
                  strokeWidth: 1.7
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              "aria-label": "Settings",
              title: "Settings",
              onClick: () => navigate({ to: "/settings", search: {} }),
              className: "inline-flex size-9 items-center justify-center rounded-lg border transition-all hover:scale-[1.05] hover:bg-[var(--theme-card)]/70 hover:text-[var(--theme-text)]",
              style: {
                borderColor: "var(--theme-border)",
                color: "var(--theme-muted)",
                background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 80%, transparent), transparent)"
              },
              children: /* @__PURE__ */ jsx(
                HugeiconsIcon,
                {
                  icon: Settings02Icon,
                  size: 15,
                  strokeWidth: 1.7
                }
              )
            }
          )
        ] })
      ] }),
      (overview?.incidents.length ?? 0) > 0 ? /* @__PURE__ */ jsx(AttentionMarquee, { overview: overview ?? null }) : null,
      /* @__PURE__ */ jsx(
        OpsStrip,
        {
          status: overview?.status ?? null,
          cron: overview?.cron ?? null,
          kanban: overview?.kanban ?? null,
          platforms: overview?.platforms ?? []
        }
      ),
      /* @__PURE__ */ jsx(
        HeroMetrics,
        {
          analytics: overview?.analytics ?? null,
          fallback: {
            sessions: stats.totalSessions,
            messages: stats.totalMessages,
            toolCalls: stats.totalToolCalls,
            tokens: stats.totalTokens
          },
          extraTile: /* @__PURE__ */ jsx(
            ActiveModelKpi,
            {
              modelInfo: overview?.modelInfo ?? null,
              analytics: overview?.analytics ?? null
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(EditModePanel, { layout }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 lg:grid-cols-12", children: [
        layout.isVisible("analytics_chart") ? /* @__PURE__ */ jsx("div", { className: "lg:col-span-8", children: /* @__PURE__ */ jsx(WidgetShell, { id: "analytics_chart", layout, children: /* @__PURE__ */ jsx(
          AnalyticsChartCard,
          {
            analytics: overview?.analytics ?? null,
            insights: overview?.insights ?? [],
            period,
            onPeriodChange: setPeriod,
            loading: overviewQuery.isFetching
          }
        ) }) }) : null,
        layout.isVisible("top_models") || layout.isVisible("provider_mix") || layout.isVisible("cache_efficiency") || layout.isVisible("velocity") || layout.isVisible("cost_ledger") ? /* @__PURE__ */ jsxs(
          "div",
          {
            className: layout.isVisible("analytics_chart") ? "flex flex-col gap-3 lg:col-span-4" : "flex flex-col gap-3 lg:col-span-12",
            children: [
              layout.isVisible("top_models") ? /* @__PURE__ */ jsx(WidgetShell, { id: "top_models", layout, children: /* @__PURE__ */ jsx(TopModelsCard, { analytics: overview?.analytics ?? null }) }) : null,
              layout.isVisible("cache_efficiency") ? /* @__PURE__ */ jsx(WidgetShell, { id: "cache_efficiency", layout, children: /* @__PURE__ */ jsx(
                CacheEfficiencyCard,
                {
                  analytics: overview?.analytics ?? null
                }
              ) }) : null,
              layout.isVisible("provider_mix") ? /* @__PURE__ */ jsx(WidgetShell, { id: "provider_mix", layout, children: /* @__PURE__ */ jsx(ProviderMixCard, { analytics: overview?.analytics ?? null }) }) : null,
              layout.isVisible("velocity") ? /* @__PURE__ */ jsx(WidgetShell, { id: "velocity", layout, children: /* @__PURE__ */ jsx(VelocityCard, { analytics: overview?.analytics ?? null }) }) : null,
              layout.isVisible("cost_ledger") ? /* @__PURE__ */ jsx(WidgetShell, { id: "cost_ledger", layout, children: /* @__PURE__ */ jsx(
                CostLedgerCard,
                {
                  analytics: overview?.analytics ?? null
                }
              ) }) : null
            ]
          }
        ) : null
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 lg:grid-cols-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex min-h-full flex-col gap-3 lg:col-span-8", children: [
          layout.isVisible("operator_tip") ? /* @__PURE__ */ jsx(WidgetShell, { id: "operator_tip", layout, children: /* @__PURE__ */ jsx(OperatorTipCard, { overview: overview ?? null }) }) : null,
          layout.isVisible("sessions_intelligence") ? /* @__PURE__ */ jsx("div", { className: "flex min-h-0 flex-1 flex-col", children: /* @__PURE__ */ jsx(WidgetShell, { id: "sessions_intelligence", layout, children: sessionsQuery.isError || sessionsUnavailable ? /* @__PURE__ */ jsx(
            UnavailableWidget,
            {
              title: "Recent Sessions",
              description: sessionsQuery.isError ? getUnavailableReason("sessions") : sessionsUnavailableMessage
            }
          ) : /* @__PURE__ */ jsx(SessionsIntelligenceCard, { sessions: sessionRows }) }) }) : null,
          layout.isVisible("logs_tail") ? /* @__PURE__ */ jsx(WidgetShell, { id: "logs_tail", layout, children: /* @__PURE__ */ jsx(LogsTailCard, { logs: overview?.logs ?? null }) }) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex min-h-full flex-col gap-3 lg:col-span-4", children: [
          /* @__PURE__ */ jsx(WidgetShell, { id: "achievements", layout, children: /* @__PURE__ */ jsx(
            AchievementsCard,
            {
              achievements: overview?.achievements ?? null
            }
          ) }),
          /* @__PURE__ */ jsx(WidgetShell, { id: "skills_usage", layout, children: /* @__PURE__ */ jsx(
            SkillsUsageCard,
            {
              usage: overview?.skillsUsage ?? null,
              installedCount: skillsInstalled,
              onOpen: () => navigate({ to: "/skills" })
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "flex min-h-0 flex-1 flex-col", children: /* @__PURE__ */ jsx(WidgetShell, { id: "mix_rhythm", layout, children: /* @__PURE__ */ jsx(
            TokenMixHourCard,
            {
              analytics: overview?.analytics ?? null,
              sessions: sessionRows
            }
          ) }) })
        ] })
      ] })
    ] })
  ] });
}
function DashboardRoute() {
  usePageTitle("Dashboard");
  return /* @__PURE__ */ jsx(DashboardScreen, {});
}
export {
  DashboardRoute as component
};
