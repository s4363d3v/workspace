import { jsx, jsxs } from "react/jsx-runtime";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { useState, useEffect, useMemo } from "react";
function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("it-IT", {
    dateStyle: "short",
    timeStyle: "short"
  });
}
function compactJson(value) {
  if (value == null) return "—";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
function stateClass(state) {
  if (state === "idle")
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  if (state === "executing" || state === "thinking" || state === "writing")
    return "bg-amber-500/15 text-amber-200 border-amber-500/30";
  if (state === "blocked" || state === "offline")
    return "bg-red-500/15 text-red-200 border-red-500/30";
  return "bg-primary-500/15 text-primary-200 border-primary-500/30";
}
function modeLabel(mode) {
  if (mode === "observe_only") return "Modalità osservazione";
  return mode.replaceAll("_", " ");
}
function executionLabel(enabled) {
  return enabled ? "Esecuzione attiva" : "Esecuzione disattivata";
}
function decisionLabel(entry) {
  if (typeof entry.decision === "string") return entry.decision;
  const precheck = entry.council_precheck;
  if (precheck && typeof precheck === "object") {
    const decision = precheck.decision;
    if (typeof decision === "string") return decision;
  }
  return "precheck";
}
function entryTitle(entry, fallback) {
  return String(entry.asset ?? entry.symbol ?? fallback);
}
function fieldValue(entry, field) {
  if (!entry) return "—";
  const value = entry[field];
  if (value == null || value === "") return "—";
  return String(value);
}
function scopeLine(entry) {
  if (!entry) return "—";
  return [
    fieldValue(entry, "symbol"),
    fieldValue(entry, "book"),
    fieldValue(entry, "strategy_id"),
    fieldValue(entry, "intent"),
    fieldValue(entry, "position_horizon")
  ].filter((value) => value !== "—").join(" · ");
}
function MiniEvent({
  label,
  event
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "rounded-lg border p-3",
      style: { background: "var(--theme-card2)", borderColor: "var(--theme-border)" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.14em] text-muted", children: label }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm font-semibold text-ink", children: scopeLine(event) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-muted", children: [
          "approval ",
          fieldValue(event, "approval_id"),
          " · stato",
          " ",
          fieldValue(event, "status") !== "—" ? fieldValue(event, "status") : fieldValue(event, "decision")
        ] })
      ]
    }
  );
}
function Card({
  title,
  children,
  right,
  accent = "var(--theme-accent)"
}) {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: "relative overflow-hidden rounded-xl border p-4 transition-colors",
      style: {
        background: "var(--theme-card)",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: {
              background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 45%, transparent), transparent)`
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-[10px] font-semibold uppercase tracking-[0.15em] text-muted", children: title }),
          right
        ] }),
        children
      ]
    }
  );
}
function Metric({
  label,
  value,
  tone = "neutral"
}) {
  const accent = tone === "good" ? "var(--theme-success)" : tone === "warn" ? "var(--theme-warning)" : "var(--theme-accent)";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative overflow-hidden rounded-xl border p-3",
      style: {
        background: "var(--theme-card)",
        borderColor: "var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
            style: { background: `linear-gradient(90deg, ${accent}, transparent)` }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.15em] text-muted", children: label }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "mt-1 text-2xl font-bold tabular-nums leading-tight",
            style: { color: accent },
            children: value
          }
        )
      ]
    }
  );
}
function VtCapitalScreen() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/vt-capital", { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok || !("ok" in payload) || !payload.ok)
        throw new Error(
          "error" in payload && payload.error ? payload.error : "API VT Capital non disponibile"
        );
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 6e4);
    return () => window.clearInterval(timer);
  }, []);
  const activeWorkers = useMemo(
    () => data?.workers.filter(
      (w) => w.state && w.state !== "unknown" && w.runtimeExists
    ).length ?? 0,
    [data]
  );
  const latestCandidates = useMemo(() => {
    const candidates = data?.marketBias.latest?.candidates;
    return Array.isArray(candidates) ? candidates : [];
  }, [data]);
  if (loading)
    return /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-muted", children: "Carico VT Capital…" });
  if (error)
    return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-3 p-6 text-center", children: [
      /* @__PURE__ */ jsx(
        "h1",
        {
          className: "text-xl font-semibold",
          style: { color: "var(--theme-danger)" },
          children: "VT Capital non caricato"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "max-w-xl text-sm text-muted", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => void load(),
          className: "rounded-lg px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.02]",
          style: {
            background: "var(--theme-accent)",
            color: "var(--theme-on-accent, white)"
          },
          children: "Riprova"
        }
      )
    ] });
  if (!data) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-plugin-surface": "vt-capital",
      className: "min-h-full p-4 pb-28 pt-14 md:p-6 md:pb-28 lg:p-10 lg:pb-28",
      style: { background: "var(--theme-bg)", color: "var(--theme-text)" },
      children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-3 md:gap-5", children: [
        /* @__PURE__ */ jsxs(
          "header",
          {
            className: "relative overflow-hidden rounded-xl border p-5",
            style: {
              background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-card) 96%, var(--theme-accent)), var(--theme-card))",
              borderColor: "var(--theme-border)"
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  "aria-hidden": true,
                  className: "pointer-events-none absolute inset-x-0 top-0 h-[2px]",
                  style: {
                    background: "linear-gradient(90deg, var(--theme-accent), var(--theme-accent-secondary), transparent)"
                  }
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "inline-flex size-11 shrink-0 items-center justify-center rounded-xl border text-xl",
                      style: {
                        borderColor: "color-mix(in srgb, var(--theme-accent) 35%, var(--theme-border))",
                        background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-accent) 14%, var(--theme-card)), var(--theme-card))",
                        boxShadow: "0 0 0 4px color-mix(in srgb, var(--theme-accent) 6%, transparent)"
                      },
                      children: "◈"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted", children: "Plugin VT Capital" }),
                    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "VT Capital Cockpit" }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-2xl text-sm text-muted", children: "Bias crypto, council/precheck, worker Swarm e note vault in una superficie isolata dal resto della dashboard." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-xs", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "rounded-full border px-3 py-1 font-medium",
                      style: {
                        borderColor: "color-mix(in srgb, var(--theme-success) 40%, var(--theme-border))",
                        background: "color-mix(in srgb, var(--theme-success) 10%, transparent)",
                        color: "var(--theme-success)"
                      },
                      children: modeLabel(data.plugin.mode)
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "rounded-full border px-3 py-1 font-medium",
                      style: {
                        borderColor: data.plugin.executionEnabled ? "color-mix(in srgb, var(--theme-warning) 45%, var(--theme-border))" : "color-mix(in srgb, var(--theme-danger) 40%, var(--theme-border))",
                        background: data.plugin.executionEnabled ? "color-mix(in srgb, var(--theme-warning) 10%, transparent)" : "color-mix(in srgb, var(--theme-danger) 10%, transparent)",
                        color: data.plugin.executionEnabled ? "var(--theme-warning)" : "var(--theme-danger)"
                      },
                      children: executionLabel(data.plugin.executionEnabled)
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "rounded-full border px-3 py-1 text-muted",
                      style: {
                        borderColor: "var(--theme-border)",
                        background: "var(--theme-card2)"
                      },
                      children: "Scope: solo plugin"
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: "rounded-full border px-3 py-1 text-muted",
                      style: {
                        borderColor: "var(--theme-border)",
                        background: "var(--theme-card2)"
                      },
                      children: [
                        "v",
                        data.plugin.version
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
          /* @__PURE__ */ jsx(
            Metric,
            {
              label: "Market bias file",
              value: data.marketBias.fileExists ? "online" : "missing",
              tone: data.marketBias.fileExists ? "good" : "warn"
            }
          ),
          /* @__PURE__ */ jsx(
            Metric,
            {
              label: "Council precheck",
              value: data.council.fileExists ? `${data.council.recent.length} record` : "missing",
              tone: data.council.fileExists ? "good" : "warn"
            }
          ),
          /* @__PURE__ */ jsx(
            Metric,
            {
              label: "Worker runtime",
              value: `${activeWorkers}/${data.workers.length}`,
              tone: activeWorkers > 0 ? "good" : "warn"
            }
          ),
          /* @__PURE__ */ jsx(Metric, { label: "Ultimo refresh", value: formatTime(data.checkedAt) })
        ] }),
        data.guardian ? /* @__PURE__ */ jsxs(
          Card,
          {
            title: "Guardian / OMS",
            accent: "var(--theme-danger)",
            right: /* @__PURE__ */ jsx("span", { className: "text-xs text-muted", children: data.guardian.requireOrderScope ? "require_order_scope attivo" : "scope legacy" }),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 lg:grid-cols-4", children: [
                /* @__PURE__ */ jsx(
                  Metric,
                  {
                    label: "Modalità executor",
                    value: data.guardian.executionMode.replaceAll("_", " "),
                    tone: data.guardian.executionEnabled ? "warn" : "good"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Metric,
                  {
                    label: "Live trading",
                    value: data.guardian.liveBlocked ? "bloccato" : "aperto",
                    tone: data.guardian.liveBlocked ? "good" : "warn"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Metric,
                  {
                    label: "Ordini aperti demo",
                    value: data.guardian.demoState.openOrders,
                    tone: data.guardian.demoState.openOrders > 0 ? "warn" : "good"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Metric,
                  {
                    label: "Ordini tracciati",
                    value: data.guardian.demoState.trackedOrders
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 lg:grid-cols-3", children: [
                /* @__PURE__ */ jsx(MiniEvent, { label: "Ultimo risk.check", event: data.guardian.lastRiskCheck }),
                /* @__PURE__ */ jsx(
                  MiniEvent,
                  {
                    label: "Ultimo order.proposed",
                    event: data.guardian.lastOrderProposed
                  }
                ),
                /* @__PURE__ */ jsx(
                  MiniEvent,
                  {
                    label: "Ultimo order.executed",
                    event: data.guardian.lastOrderExecuted
                  }
                )
              ] }),
              data.guardian.recentBlocks.length > 0 ? /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "mt-4 rounded-lg border p-3",
                  style: {
                    background: "var(--theme-card2)",
                    borderColor: "var(--theme-border)"
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.14em] text-muted", children: "Blocchi recenti" }),
                    /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-2 text-xs", children: data.guardian.recentBlocks.map((block, index) => /* @__PURE__ */ jsxs(
                      "span",
                      {
                        className: "rounded-full border px-2 py-1",
                        style: {
                          borderColor: "color-mix(in srgb, var(--theme-danger) 35%, var(--theme-border))",
                          background: "color-mix(in srgb, var(--theme-danger) 10%, transparent)",
                          color: "var(--theme-danger)"
                        },
                        children: [
                          String(block.reason_code ?? block.reason ?? "BLOCKED"),
                          block.symbol ? ` · ${String(block.symbol)}` : ""
                        ]
                      },
                      index
                    )) })
                  ]
                }
              ) : null
            ]
          }
        ) : null,
        /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[1.1fr_0.9fr]", children: [
          /* @__PURE__ */ jsx(
            Card,
            {
              title: "Market Bias BTC/ETH/SOL",
              right: /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted", children: [
                "aggiornato ",
                formatTime(data.marketBias.updatedAt)
              ] }),
              children: latestCandidates.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-3", children: latestCandidates.slice(0, 6).map((candidate, index) => {
                const item = candidate;
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "rounded-lg border p-3 transition-colors hover:bg-[var(--theme-card2)]",
                    style: {
                      background: "var(--theme-card2)",
                      borderColor: "var(--theme-border)"
                    },
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "font-semibold text-ink", children: String(
                          item.asset ?? item.symbol ?? `Candidate ${index + 1}`
                        ) }),
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "rounded-full border px-2 py-0.5 text-xs",
                            style: {
                              borderColor: "var(--theme-accent-border)",
                              color: "var(--theme-accent)",
                              background: "var(--theme-accent-subtle)"
                            },
                            children: String(item.candidate_bias ?? item.bias ?? "—")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-muted", children: [
                        "confidence",
                        " ",
                        String(
                          item.confidence ?? item.confidence_final ?? "—"
                        )
                      ] }),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "mt-2 line-clamp-3 text-xs",
                          style: {
                            color: "color-mix(in srgb, var(--theme-text) 72%, var(--theme-muted))"
                          },
                          children: Array.isArray(item.reasons) ? item.reasons.join(" · ") : String(item.summary ?? item.reason ?? "")
                        }
                      )
                    ]
                  },
                  index
                );
              }) }) : /* @__PURE__ */ jsx(
                "pre",
                {
                  className: "max-h-96 overflow-auto rounded-lg border p-3 text-xs text-muted",
                  style: {
                    background: "var(--theme-card2)",
                    borderColor: "var(--theme-border)"
                  },
                  children: compactJson(
                    data.marketBias.latest?.raw ?? data.marketBias.recent.at(-1) ?? "Nessun candidato recente"
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            Card,
            {
              title: "Risk / Council Journal",
              right: /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted", children: [
                data.council.recent.length,
                " ultimi"
              ] }),
              accent: "var(--theme-warning)",
              children: /* @__PURE__ */ jsx("div", { className: "flex max-h-[420px] flex-col gap-2 overflow-auto pr-1", children: data.council.recent.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: "Nessun precheck council trovato." }) : data.council.recent.slice().reverse().map((entry, index) => /* @__PURE__ */ jsxs(
                "details",
                {
                  className: "rounded-lg border p-3",
                  style: {
                    background: "var(--theme-card2)",
                    borderColor: "var(--theme-border)"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("summary", { className: "cursor-pointer text-sm font-medium text-ink", children: [
                      entryTitle(entry, `Record ${index + 1}`),
                      " ·",
                      " ",
                      decisionLabel(entry)
                    ] }),
                    /* @__PURE__ */ jsx("pre", { className: "mt-3 overflow-auto whitespace-pre-wrap text-xs text-muted", children: compactJson(entry) })
                  ]
                },
                index
              )) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[0.9fr_1.1fr]", children: [
          /* @__PURE__ */ jsx(Card, { title: "Swarm Trading Workers", accent: "var(--theme-success)", children: /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2", children: data.workers.map((worker) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "rounded-lg border p-3",
              style: {
                background: "var(--theme-card2)",
                borderColor: "var(--theme-border)"
              },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-ink", children: worker.workerId }),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `rounded-full border px-2 py-0.5 text-xs ${stateClass(worker.state)}`,
                      children: worker.state ?? "unknown"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-muted", children: [
                  "memory ",
                  worker.memoryExists ? "ok" : "missing",
                  " · identity",
                  " ",
                  worker.identityExists ? "ok" : "missing"
                ] }),
                worker.currentTask ? /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-ink", children: [
                  "Task: ",
                  worker.currentTask
                ] }) : null,
                worker.lastSummary ? /* @__PURE__ */ jsx("div", { className: "mt-2 line-clamp-2 text-xs text-muted", children: worker.lastSummary }) : null
              ]
            },
            worker.workerId
          )) }) }),
          /* @__PURE__ */ jsx(
            Card,
            {
              title: "Vault / Report recenti",
              accent: "var(--theme-accent-secondary)",
              children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: data.notes.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: "Nessuna nota VT Capital/crypto trovata." }) : data.notes.map((note) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border p-3",
                  style: {
                    background: "var(--theme-card2)",
                    borderColor: "var(--theme-border)"
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium text-ink", children: note.title }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-muted", children: [
                      formatTime(note.mtimeMs),
                      " ·",
                      " ",
                      Math.round(note.size / 1024),
                      " KB"
                    ] }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "mt-1 truncate text-xs",
                        style: {
                          color: "color-mix(in srgb, var(--theme-muted) 70%, transparent)"
                        },
                        children: note.path
                      }
                    )
                  ]
                },
                note.path
              )) })
            }
          )
        ] })
      ] })
    }
  );
}
const SplitComponent = function VtCapitalRoute() {
  usePageTitle("VT Capital");
  return /* @__PURE__ */ jsx(VtCapitalScreen, {});
};
export {
  SplitComponent as component
};
