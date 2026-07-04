import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useMemo, useState, useRef, useEffect, useCallback, useLayoutEffect, memo } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { Files01Icon, Globe02Icon, ArrowExpand02Icon, File01Icon, Bug01Icon, Note01Icon, PackageIcon, SentIcon, AlertCircleIcon, Clock01Icon, Add01Icon, ViewIcon, CheckmarkCircle02Icon, Settings01Icon, ArrowLeft01Icon, ArrowRight01Icon, CheckListIcon, ComputerTerminal01Icon, FlashIcon, Rocket01Icon, MessageMultiple01Icon, Cancel01Icon, Activity01Icon, UserMultipleIcon, AlarmClockIcon, CpuIcon } from "@hugeicons/core-free-icons";
import { g as getOnlineStatus, u as useCrewStatus } from "./use-crew-status-R2z-b9IQ.js";
import { c as cn, M as MemoizedChatComposer, A as AgentProgress, P as PixelAvatar, B as Button, t as toast } from "./router-DmH5gXcK.js";
import { O as OfficeView, W as WorkflowHelpModal } from "./workflow-help-modal-Z4pLvAKJ.js";
function synthesizeFromChangedFiles(workerId, changedFiles) {
  return changedFiles.slice(0, 12).map((path, index) => {
    const cleaned = path.replace(/\/$/, "");
    const isDir = path.endsWith("/");
    const fileName = cleaned.split("/").filter(Boolean).pop() ?? cleaned;
    return {
      id: `${workerId}-cf-${index}`,
      kind: isDir ? "file" : "diff",
      label: fileName || cleaned,
      path: cleaned,
      workerId,
      source: "inferred"
    };
  });
}
function iconForKind(kind) {
  switch (kind) {
    case "file":
      return File01Icon;
    case "diff":
    case "patch":
      return Files01Icon;
    case "build":
      return PackageIcon;
    case "report":
      return Note01Icon;
    case "log":
      return Bug01Icon;
    case "preview":
      return Globe02Icon;
    default:
      return File01Icon;
  }
}
function shortLabel(value, max = 22) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}
function Swarm2Artifacts({
  workerId,
  artifacts,
  previews,
  changedFiles = [],
  className,
  collapsedLimit = 3,
  expandedLimit = 8,
  expanded = false,
  mode = "auto",
  showHeader = true,
  centered = false
}) {
  const declaredArtifacts = artifacts ?? [];
  const changedFileArtifacts = changedFiles.length > 0 ? synthesizeFromChangedFiles(workerId, changedFiles) : [];
  const showingChangedFiles = mode === "files" ? changedFileArtifacts.length > 0 : mode === "artifacts" ? false : changedFileArtifacts.length > 0;
  const allArtifacts = mode === "files" ? changedFileArtifacts : showingChangedFiles ? changedFileArtifacts : declaredArtifacts;
  const allPreviews = previews ?? [];
  const limit = expanded ? expandedLimit : collapsedLimit;
  const visibleArtifacts = allArtifacts.slice(0, limit);
  const visiblePreviews = allPreviews.slice(0, expanded ? 4 : 2);
  const overflowArtifacts = Math.max(0, allArtifacts.length - visibleArtifacts.length);
  const isEmpty = allArtifacts.length === 0 && allPreviews.length === 0;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: cn(
        "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-2.5 py-2",
        className
      ),
      children: [
        showHeader ? /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Files01Icon, size: 11 }),
            showingChangedFiles ? "Changed files" : "Output"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium normal-case tracking-normal", children: [
            showingChangedFiles ? `${allArtifacts.length} changed` : declaredArtifacts.length > 0 ? `${allArtifacts.length} artifacts` : "0 artifacts",
            " · ",
            allPreviews.length,
            " previews"
          ] })
        ] }) : null,
        /* @__PURE__ */ jsxs("div", { className: cn("space-y-2", centered && "text-center"), children: [
          /* @__PURE__ */ jsx("p", { className: cn("text-[11px] leading-relaxed text-[var(--theme-muted)]", centered && "mx-auto max-w-2xl"), children: isEmpty ? `No artifacts yet for ${workerId}. Will surface as the agent writes files, diffs, or build outputs.` : showingChangedFiles ? "Inferred from git changes in the worker project. Real artifacts will replace this when the worker publishes them." : "Published by the worker runtime. Files, diffs, reports, and previews share the same card slot." }),
          visibleArtifacts.length > 0 ? /* @__PURE__ */ jsxs("div", { className: cn("flex flex-wrap gap-1.5", centered && "justify-center"), children: [
            visibleArtifacts.slice(0, expanded ? 6 : 4).map((artifact) => {
              const icon = iconForKind(artifact.kind);
              return /* @__PURE__ */ jsxs(
                "span",
                {
                  title: artifact.path ?? artifact.label,
                  className: "inline-flex max-w-full items-center gap-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2 py-1 text-[10px] text-[var(--theme-muted-2)]",
                  children: [
                    /* @__PURE__ */ jsx(HugeiconsIcon, { icon, size: 9 }),
                    /* @__PURE__ */ jsx("span", { className: "truncate max-w-[10rem]", children: shortLabel(artifact.label, 24) })
                  ]
                },
                artifact.id
              );
            }),
            overflowArtifacts > 0 ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center rounded-full border border-dashed border-[var(--theme-border)] px-2 py-1 text-[10px] text-[var(--theme-muted)]", children: [
              "+",
              overflowArtifacts,
              " more"
            ] }) : null
          ] }) : null,
          visiblePreviews.length > 0 ? /* @__PURE__ */ jsx("div", { className: cn("flex flex-wrap items-center gap-1", centered && "justify-center"), children: visiblePreviews.map((preview) => /* @__PURE__ */ jsxs(
            "a",
            {
              href: preview.url,
              target: "_blank",
              rel: "noreferrer",
              onClick: (event) => event.stopPropagation(),
              title: `${preview.label} · ${preview.url}${preview.source ? ` · ${preview.source}` : ""}`,
              className: cn(
                "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] transition-colors",
                preview.status === "down" ? "border-red-400/40 bg-red-500/10 text-red-200" : "border-[var(--theme-accent)]/40 bg-[var(--theme-accent-soft)] text-[var(--theme-text)] hover:border-[var(--theme-accent)]"
              ),
              children: [
                /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Globe02Icon, size: 9 }),
                /* @__PURE__ */ jsx("span", { className: "max-w-[7rem] truncate", children: shortLabel(preview.label, 18) }),
                /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ArrowExpand02Icon, size: 8 })
              ]
            },
            preview.id
          )) }) : null
        ] })
      ]
    }
  );
}
const POLL_INTERVAL_MS = 5e3;
const DEFAULT_LIMIT = 30;
async function fetchSwarmChat(workerId, limit) {
  const res = await fetch(
    `/api/swarm-chat?workerId=${encodeURIComponent(workerId)}&limit=${limit}`
  );
  if (!res.ok) throw new Error(`swarm-chat HTTP ${res.status}`);
  return await res.json();
}
async function sendDirectChat(workerId, prompt, limit) {
  const res = await fetch("/api/swarm-direct-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workerId, prompt, limit, timeoutMs: 12e4 })
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data && "error" in data && data.error || `swarm-direct-chat HTTP ${res.status}`);
  }
  if (!data || !("delivered" in data) || !data.delivered) {
    throw new Error(data?.error || "Direct chat did not reach worker");
  }
  return data;
}
function useSwarmChat({
  workerId,
  limit = DEFAULT_LIMIT,
  enabled = true
}) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ["swarm", "chat", workerId, limit],
    [workerId, limit]
  );
  const query = useQuery({
    queryKey,
    queryFn: () => fetchSwarmChat(workerId, limit),
    enabled: Boolean(workerId) && enabled,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
    staleTime: 2e3
  });
  const dispatch = useMutation({
    mutationFn: async (prompt) => {
      return await sendDirectChat(workerId, prompt, limit);
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(queryKey, data);
      await queryClient.invalidateQueries({ queryKey });
    }
  });
  const messages = useMemo(() => {
    return (query.data?.messages ?? []).map((m) => ({
      ...m,
      origin: "state.db"
    }));
  }, [query.data]);
  return {
    workerId,
    sessionId: query.data?.sessionId ?? null,
    sessionTitle: query.data?.sessionTitle ?? null,
    source: query.data?.source ?? "unavailable",
    error: (query.error instanceof Error ? query.error.message : null) ?? query.data?.error ?? null,
    messages,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    refetch: query.refetch,
    sendMessage: dispatch.mutateAsync,
    isSending: dispatch.isPending,
    sendError: dispatch.error instanceof Error ? dispatch.error.message : null
  };
}
function formatMessageTime(ts) {
  if (!ts) return "";
  const millis = ts < 1e12 ? ts * 1e3 : ts;
  const date = new Date(millis);
  const now = /* @__PURE__ */ new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const time = new Intl.DateTimeFormat(void 0, {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
  if (sameDay) return time;
  const shortDate = new Intl.DateTimeFormat(void 0, {
    month: "short",
    day: "numeric"
  }).format(date);
  return `${shortDate} ${time}`;
}
function parseTodoSummary(content) {
  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== "object" || !parsed.summary) return null;
    return {
      total: parsed.summary.total ?? 0,
      pending: parsed.summary.pending ?? 0,
      inProgress: parsed.summary.in_progress ?? 0,
      completed: parsed.summary.completed ?? 0,
      cancelled: parsed.summary.cancelled ?? 0
    };
  } catch {
    return null;
  }
}
function parseToolMarker(content) {
  const match = content.trim().match(/^\[tool:([^\]]+)\]$/i);
  return match?.[1]?.trim() ?? null;
}
function MessageBubble({
  workerId,
  message,
  nativeStyle = false
}) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isTool = message.role === "tool";
  const isError = message.role === "error";
  const label = isUser ? "You" : isAssistant ? workerId : isTool ? "tool" : message.role;
  const todoSummary = parseTodoSummary(message.content);
  const toolMarker = parseToolMarker(message.content);
  const renderAsToolCard = isTool || Boolean(toolMarker);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "w-full",
        nativeStyle && isUser ? "flex justify-end" : "flex justify-start"
      ),
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            nativeStyle ? "rounded-2xl border px-3 py-2 text-[12px] leading-relaxed shadow-sm" : "rounded-xl border px-2.5 py-1.5 text-[12px] leading-relaxed",
            nativeStyle && (isUser ? "max-w-[72%]" : "max-w-[92%]"),
            isUser && "border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-text)]",
            isAssistant && "border-[var(--theme-border)] bg-[var(--theme-card2)] text-[var(--theme-text)]",
            renderAsToolCard && "border-[var(--theme-border)] bg-[color:rgba(255,255,255,0.03)] text-[var(--theme-muted-2)]",
            isError && "border-red-400/40 bg-red-500/10 text-red-200",
            message.pending && "opacity-80"
          ),
          children: [
            /* @__PURE__ */ jsxs("div", { className: cn(
              "mb-0.5 flex items-center justify-between gap-2 text-[9px] text-[var(--theme-muted)]",
              nativeStyle ? "font-medium tracking-normal" : "font-semibold uppercase tracking-[0.16em]"
            ), children: [
              nativeStyle ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1", children: isError ? /* @__PURE__ */ jsx(HugeiconsIcon, { icon: AlertCircleIcon, size: 9 }) : null }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                isError ? /* @__PURE__ */ jsx(HugeiconsIcon, { icon: AlertCircleIcon, size: 9 }) : null,
                renderAsToolCard ? "tool" : label
              ] }),
              message.timestamp && !message.pending ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[9px] text-[var(--theme-muted)]/80", children: [
                /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Clock01Icon, size: 9 }),
                formatMessageTime(message.timestamp)
              ] }) : null
            ] }),
            todoSummary ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium text-[var(--theme-text)]", children: "Task snapshot" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 text-[10px] text-[var(--theme-muted-2)]", children: [
                /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] px-1.5 py-0.5", children: [
                  todoSummary.total,
                  " total"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] px-1.5 py-0.5", children: [
                  todoSummary.pending,
                  " pending"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] px-1.5 py-0.5", children: [
                  todoSummary.inProgress,
                  " in progress"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] px-1.5 py-0.5", children: [
                  todoSummary.completed,
                  " completed"
                ] }),
                todoSummary.cancelled > 0 ? /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] px-1.5 py-0.5", children: [
                  todoSummary.cancelled,
                  " cancelled"
                ] }) : null
              ] })
            ] }) : renderAsToolCard ? /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium text-[var(--theme-text)]", children: toolMarker ? `Used ${toolMarker}` : "Tool result" }),
              !toolMarker && message.content ? /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap break-words font-sans text-[11px] leading-snug text-[var(--theme-muted-2)]", children: message.content }) : null
            ] }) : /* @__PURE__ */ jsx("pre", { className: cn(
              "whitespace-pre-wrap break-words font-sans text-[12px] leading-snug",
              message.pending && isAssistant && "animate-pulse"
            ), children: message.content || "(empty)" })
          ]
        }
      )
    }
  );
}
function Swarm2LiveChat({
  workerId,
  className,
  preview = false,
  previewLimit = 4,
  nativeStyle = false
}) {
  const queryClient = useQueryClient();
  const {
    messages,
    isLoading,
    sendMessage,
    isSending,
    error,
    sendError,
    source
  } = useSwarmChat({ workerId, limit: 30, enabled: Boolean(workerId) });
  const [draft, setDraft] = useState("");
  const [localPending, setLocalPending] = useState(null);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (!localPending || !workerId) return;
    let cancelled = false;
    const startedAt = Date.now();
    const queryKey = ["swarm", "chat", workerId, 30];
    async function poll() {
      try {
        const res = await fetch(`/api/swarm-chat?workerId=${encodeURIComponent(workerId)}&limit=30`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        queryClient.setQueryData(queryKey, data);
      } catch {
      }
    }
    void poll();
    const interval = window.setInterval(() => {
      if (Date.now() - startedAt > 12e4) {
        window.clearInterval(interval);
        return;
      }
      void poll();
    }, 1e3);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [localPending, workerId, queryClient]);
  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [preview, nativeStyle, workerId]);
  const pendingState = useMemo(() => {
    if (!localPending) return { hasUserEcho: false, hasAssistantReply: false };
    const baselineId = localPending.baselineLastId;
    const baselineIndex = baselineId ? messages.findIndex((m) => m.id === baselineId) : -1;
    const newSlice = baselineIndex >= 0 ? messages.slice(baselineIndex + 1) : messages;
    const prompt = localPending.prompt.trim();
    const hasUserEcho = newSlice.some(
      (m) => m.role === "user" && (m.content.trim() === prompt || m.content.includes(prompt) || prompt.includes(m.content.trim()))
    );
    const hasAssistantReply = newSlice.some((m) => m.role === "assistant");
    return { hasUserEcho, hasAssistantReply };
  }, [messages, localPending]);
  const renderedMessages = useMemo(() => {
    if (!localPending) return messages;
    const extra = [];
    if (!pendingState.hasUserEcho) {
      extra.push({
        id: `local-user-${localPending.sentAt}`,
        role: "user",
        content: localPending.prompt,
        timestamp: localPending.sentAt,
        origin: "optimistic",
        pending: true
      });
    }
    if (!pendingState.hasAssistantReply) {
      extra.push({
        id: `local-assistant-${localPending.sentAt}`,
        role: "assistant",
        content: "Thinking…",
        timestamp: localPending.sentAt,
        origin: "optimistic",
        pending: true
      });
    }
    return [...messages, ...extra];
  }, [messages, localPending, pendingState]);
  useEffect(() => {
    if (!localPending) return;
    if (pendingState.hasAssistantReply) setLocalPending(null);
  }, [pendingState, localPending]);
  const previewMessages = preview ? renderedMessages.slice(-previewLimit) : renderedMessages;
  const allErrors = sendError || error;
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [renderedMessages.length]);
  async function handleSend() {
    const text = draft.trim();
    if (!text || isSending) return;
    const sentAt = Date.now();
    const baselineLastId = messages.length ? messages[messages.length - 1].id : null;
    setLocalPending({ prompt: text, sentAt, baselineLastId });
    setDraft("");
    try {
      await sendMessage(text);
    } catch {
      setLocalPending(null);
      setDraft(text);
    }
  }
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: cn(
        "flex min-h-0 flex-col rounded-[1.25rem] border border-[var(--theme-border)] bg-[color:rgba(255,255,255,0.015)]",
        className
      ),
      children: [
        !nativeStyle ? /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-2 border-b border-[var(--theme-border)]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]/85", children: [
          /* @__PURE__ */ jsx("span", { children: "Chat" }),
          /* @__PURE__ */ jsx("span", { className: "text-[9px] normal-case tracking-normal", children: source === "state.db" ? "live" : "no session" })
        ] }) : null,
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: scrollRef,
            className: cn(
              "flex-1 space-y-1.5 overflow-y-auto px-3 py-2",
              preview ? "max-h-[260px] min-h-[140px]" : nativeStyle ? "max-h-[300px] min-h-[170px]" : "max-h-[250px] min-h-[120px]"
            ),
            children: isLoading ? /* @__PURE__ */ jsx("p", { className: "text-center text-[11px] text-[var(--theme-muted)]", children: "Loading session…" }) : previewMessages.length === 0 ? /* @__PURE__ */ jsxs("p", { className: "text-center text-[11px] text-[var(--theme-muted)]", children: [
              "No messages yet for ",
              workerId,
              ". Send a prompt below."
            ] }) : previewMessages.map((m) => /* @__PURE__ */ jsx(MessageBubble, { workerId, message: m, nativeStyle }, m.id))
          }
        ),
        allErrors ? /* @__PURE__ */ jsx("div", { className: "border-t border-red-400/30 bg-red-500/10 px-3 py-1 text-[10px] text-red-200", children: allErrors }) : null,
        !preview ? nativeStyle ? /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--theme-border)]/70 px-2 py-2", children: /* @__PURE__ */ jsx(
          MemoizedChatComposer,
          {
            onSubmit: (value, _attachments, _fastMode, helpers) => {
              const text = value.trim();
              if (!text || isSending) return;
              const sentAt = Date.now();
              const baselineLastId = messages.length ? messages[messages.length - 1].id : null;
              setLocalPending({ prompt: text, sentAt, baselineLastId });
              helpers.reset();
              void sendMessage(text).catch(() => {
                setLocalPending(null);
                helpers.setValue(text);
              });
            },
            isLoading: isSending,
            disabled: false,
            embedded: true,
            hideModelSelector: true
          }
        ) }) : /* @__PURE__ */ jsx("div", { className: "border-t border-[var(--theme-border)]/70 px-2.5 py-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2 rounded-xl border border-[var(--theme-border)]/70 bg-transparent p-1.5", children: [
          /* @__PURE__ */ jsx(
            "textarea",
            {
              rows: 1,
              value: draft,
              onChange: (event) => setDraft(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  void handleSend();
                }
              },
              disabled: isSending,
              placeholder: `Message ${workerId}…`,
              className: "flex-1 resize-none bg-transparent px-1.5 text-[12px] text-[var(--theme-text)] outline-none placeholder:text-[var(--theme-muted)]"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => void handleSend(),
              disabled: isSending || !draft.trim(),
              className: cn(
                "inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11px] font-semibold transition-colors",
                isSending ? "bg-[var(--theme-accent-soft)] text-[var(--theme-text)]" : "bg-[var(--theme-accent)] text-primary-950 hover:bg-[var(--theme-accent-strong)] disabled:opacity-40"
              ),
              children: [
                /* @__PURE__ */ jsx(HugeiconsIcon, { icon: SentIcon, size: 11 }),
                isSending ? "…" : "Send"
              ]
            }
          )
        ] }) }) : null
      ]
    }
  );
}
const POLL_MS = 3e4;
async function fetchAssignedTasks(workerId) {
  const url = `/api/claude-tasks?assignee=${encodeURIComponent(workerId)}&include_done=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`tasks HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.tasks) ? data.tasks : [];
}
async function createWorkerTask(workerId, title, description = "") {
  const res = await fetch("/api/claude-tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      assignee: workerId,
      column: "todo",
      priority: "medium",
      created_by: "swarm2-card"
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `task create HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data.task) throw new Error("task create returned no task");
  return data.task;
}
function statusTone(column) {
  const c = (column ?? "").toLowerCase();
  if (c === "blocked") return { dot: "bg-red-500", rank: 0 };
  if (c === "in_progress" || c === "doing" || c === "progress")
    return { dot: "bg-emerald-500", rank: 1 };
  if (c === "review" || c === "reviewing")
    return { dot: "bg-violet-500", rank: 2 };
  return { dot: "bg-amber-500", rank: 3 };
}
function priorityTone(priority) {
  const p = (priority ?? "").toLowerCase();
  if (p === "high") {
    return "border-red-400/40 bg-red-500/10 text-red-200";
  }
  if (p === "medium") {
    return "border-amber-400/40 bg-amber-500/10 text-amber-200";
  }
  if (p === "low") {
    return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";
  }
  return null;
}
function Swarm2TaskQueue({
  workerId,
  className,
  limit = 3,
  doneLimit = 2,
  summaryTask = null,
  showHeader = true,
  composerOpen: composerOpenProp,
  onComposerOpenChange,
  centered = false
}) {
  const queryClient = useQueryClient();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [internalComposerOpen, setInternalComposerOpen] = useState(false);
  const composerOpen = composerOpenProp ?? internalComposerOpen;
  const setComposerOpen = (next) => {
    const resolved = typeof next === "function" ? next(composerOpen) : next;
    if (onComposerOpenChange) onComposerOpenChange(resolved);
    if (composerOpenProp === void 0) setInternalComposerOpen(resolved);
  };
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const query = useQuery({
    queryKey: ["swarm2", "tasks", workerId],
    queryFn: () => fetchAssignedTasks(workerId),
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: false,
    staleTime: 1e4,
    enabled: Boolean(workerId)
  });
  const createMutation = useMutation({
    mutationFn: async () => createWorkerTask(workerId, draftTitle.trim(), draftDescription.trim()),
    onSuccess: async () => {
      setDraftTitle("");
      setDraftDescription("");
      setComposerOpen(false);
      setDetailsOpen(true);
      await queryClient.invalidateQueries({ queryKey: ["swarm2", "tasks", workerId] });
    }
  });
  const tasks = query.data ?? [];
  const activeTasks = useMemo(() => {
    return [...tasks].filter((task) => (task.column ?? task.status ?? "").toLowerCase() !== "done").sort((a, b) => {
      const ra = statusTone(a.column ?? a.status).rank;
      const rb = statusTone(b.column ?? b.status).rank;
      if (ra !== rb) return ra - rb;
      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
    });
  }, [tasks]);
  const doneTasks = useMemo(() => {
    return [...tasks].filter((task) => (task.column ?? task.status ?? "").toLowerCase() === "done").sort((a, b) => (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0));
  }, [tasks]);
  const visibleActive = useMemo(
    () => detailsOpen ? activeTasks : activeTasks.slice(0, limit),
    [activeTasks, detailsOpen, limit]
  );
  const visibleDone = useMemo(
    () => detailsOpen ? doneTasks : doneTasks.slice(0, doneLimit),
    [doneTasks, detailsOpen, doneLimit]
  );
  const doneCount = doneTasks.length + (summaryTask ? 1 : 0);
  const hasOverflow = activeTasks.length > limit || doneTasks.length > doneLimit;
  const totalVisible = activeTasks.length + doneTasks.length + (summaryTask ? 1 : 0);
  return /* @__PURE__ */ jsxs("section", { className: cn("flex min-h-[4.25rem] flex-col px-0 py-0", className), onClick: (event) => event.stopPropagation(), children: [
    showHeader ? /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 text-[10px] font-semibold tracking-[0.02em] text-[var(--theme-muted)]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.16em] text-[var(--theme-muted)]/80", children: "Tasks" }),
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] normal-case tracking-normal text-[var(--theme-muted)]/80", children: [
          activeTasks.length,
          " active · ",
          doneCount,
          " done"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": composerOpen ? "Close add task" : "Add task",
            title: composerOpen ? "Close add task" : "Add task",
            onClick: () => setComposerOpen((value) => !value),
            className: "inline-flex h-5 w-5 items-center justify-center rounded-md text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]",
            children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Add01Icon, size: 10 })
          }
        ),
        hasOverflow ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": detailsOpen ? "Collapse task details" : "Expand task details",
            title: detailsOpen ? "Collapse task details" : "Expand task details",
            onClick: () => setDetailsOpen((value) => !value),
            className: "inline-flex h-5 w-5 items-center justify-center rounded-md text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]",
            children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ViewIcon, size: 10 })
          }
        ) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 border-b border-[var(--theme-border)]/70" })
    ] }) : null,
    composerOpen ? /* @__PURE__ */ jsxs("div", { className: cn("mb-2 mx-auto max-w-xl space-y-2 rounded-lg border border-[var(--theme-border)] bg-[color:rgba(255,255,255,0.02)] p-2 text-left", centered && "w-full"), children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          value: draftTitle,
          onChange: (event) => setDraftTitle(event.target.value),
          placeholder: "Add a task for this agent…",
          className: "w-full rounded-md border border-[var(--theme-border)] bg-transparent px-2 py-1.5 text-[12px] text-[var(--theme-text)] outline-none"
        }
      ),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: draftDescription,
          onChange: (event) => setDraftDescription(event.target.value),
          rows: 2,
          placeholder: "Optional notes",
          className: "w-full resize-none rounded-md border border-[var(--theme-border)] bg-transparent px-2 py-1.5 text-[12px] text-[var(--theme-text)] outline-none"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 text-[10px] text-[var(--theme-muted)]", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Assigns directly to ",
          workerId
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setComposerOpen(false),
              className: "rounded-md border border-[var(--theme-border)] px-2 py-1 hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              disabled: !draftTitle.trim() || createMutation.isPending,
              onClick: () => void createMutation.mutateAsync(),
              className: "rounded-md bg-[var(--theme-accent)] px-2 py-1 font-semibold text-primary-950 disabled:opacity-40",
              children: createMutation.isPending ? "Adding…" : "Add task"
            }
          )
        ] })
      ] })
    ] }) : null,
    /* @__PURE__ */ jsx("div", { className: cn("flex-1", centered && "flex flex-col justify-center"), children: query.isPending ? /* @__PURE__ */ jsx("p", { className: "pt-2 text-[11px] text-[var(--theme-muted)] text-center", children: "Loading…" }) : totalVisible === 0 ? /* @__PURE__ */ jsx("p", { className: "pt-2 text-[11px] text-[var(--theme-muted)] text-center", children: "No tracked tasks yet." }) : /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-xl space-y-1 text-center", children: [
      summaryTask ? /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-center gap-2 px-0 py-0.5", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex w-4 shrink-0 justify-center", children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: CheckmarkCircle02Icon, size: 12, className: "text-emerald-400" }) }),
        /* @__PURE__ */ jsx("span", { className: "max-w-full truncate text-[11px] text-[var(--theme-muted)] line-through decoration-[var(--theme-muted)]/60", title: summaryTask, children: summaryTask })
      ] }) : null,
      visibleActive.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: visibleActive.map((task) => {
        const tone = statusTone(task.column ?? task.status);
        const prioCls = priorityTone(task.priority);
        return /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-center gap-2 px-0 py-0.5 text-center", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex w-4 shrink-0 justify-center", children: /* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", tone.dot) }) }),
            prioCls ? /* @__PURE__ */ jsx("span", { className: cn("shrink-0 rounded-full border px-1 text-[9px] font-semibold uppercase tracking-[0.16em]", prioCls), children: String(task.priority).toUpperCase() === "HIGH" ? "P0" : String(task.priority).toUpperCase() === "MEDIUM" ? "P1" : "P2" }) : null,
            /* @__PURE__ */ jsx("span", { className: "max-w-full truncate text-[11px] text-[var(--theme-text)]", title: task.title || task.description || task.id, children: task.title || task.description || task.id })
          ] }),
          detailsOpen && task.description ? /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-xl text-center text-[10px] leading-relaxed text-[var(--theme-muted)]", children: task.description }) : null
        ] }, task.id);
      }) }) : null,
      visibleDone.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-1 border-t border-[var(--theme-border)]/50 pt-1.5", children: visibleDone.map((task) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-center gap-2 px-0 py-0.5", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex w-4 shrink-0 justify-center", children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: CheckmarkCircle02Icon, size: 12, className: "text-emerald-400" }) }),
          /* @__PURE__ */ jsx("span", { className: "max-w-full truncate text-[11px] text-[var(--theme-muted)] line-through decoration-[var(--theme-muted)]/60", title: task.title || task.description || task.id, children: task.title || task.description || task.id })
        ] }),
        detailsOpen && task.description ? /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-xl text-center text-[10px] leading-relaxed text-[var(--theme-muted)]/85 line-through decoration-[var(--theme-muted)]/50", children: task.description }) : null
      ] }, task.id)) }) : null,
      hasOverflow ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setDetailsOpen((value) => !value),
          className: "w-full rounded-md border border-dashed border-[var(--theme-border)]/70 bg-transparent px-2 py-1 text-center text-[10px] uppercase tracking-[0.18em] text-[var(--theme-muted)] hover:bg-[color:rgba(255,255,255,0.03)] hover:text-[var(--theme-text)]",
          children: detailsOpen ? "Less" : "More"
        }
      ) : null
    ] }) })
  ] });
}
const WORKER_COLORS = [
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#f59e0b",
  "#fb7185",
  "#22d3ee",
  "#84cc16",
  "#f472b6"
];
function roleFromId(id) {
  const m = id.match(/(\d+)/);
  const n = m ? m[1] : "";
  switch (n) {
    case "1":
      return "PR / Issues";
    case "2":
      return "Qwen PC1";
    case "3":
      return "BenchLoop";
    case "4":
      return "Research";
    case "5":
    case "10":
      return "Builder";
    case "6":
    case "11":
      return "Reviewer";
    case "7":
      return "Docs";
    case "8":
      return "Ops";
    case "9":
      return "Hackathon";
    case "12":
      return "PR / Issues";
    default:
      return "Worker";
  }
}
function deriveWorkerState(member, currentTask, checkpointStatus, runtimeState) {
  const status = getOnlineStatus(member);
  if (status === "offline") return "offline";
  const cs = checkpointStatus ?? null;
  const rs = runtimeState ?? null;
  if (cs === "done" || cs === "handoff" || rs === "idle") return "idle";
  if (cs === "blocked" || rs === "blocked") return "error";
  if (cs === "needs_input" || rs === "waiting") return "waiting";
  if (!currentTask) return "idle";
  if (cs && cs !== "none" && cs !== "in_progress") return "idle";
  const lc = currentTask.toLowerCase();
  if (lc.includes("review")) return "reviewing";
  if (lc.includes("writ") || lc.includes("doc") || lc.includes("spec")) return "writing";
  if (lc.includes("research") || lc.includes("plan") || lc.includes("think")) return "thinking";
  if (lc.includes("wait") || lc.includes("approval")) return "waiting";
  if (lc.includes("block") || lc.includes("error") || lc.includes("fail")) return "error";
  return "active";
}
function statusStyles(state) {
  if (state === "error") {
    return { dot: "bg-red-500", ring: "text-red-500", label: "Error", progress: "failed", avatar: "failed" };
  }
  if (state === "offline") {
    return { dot: "bg-primary-300", ring: "text-primary-300", label: "Offline", progress: "queued", avatar: "idle" };
  }
  if (state === "idle") {
    return { dot: "bg-primary-300", ring: "text-primary-300", label: "Idle", progress: "queued", avatar: "idle" };
  }
  if (state === "waiting") {
    return { dot: "bg-amber-500", ring: "text-amber-500", label: "Waiting", progress: "queued", avatar: "idle" };
  }
  if (state === "thinking") {
    return { dot: "bg-emerald-500", ring: "text-emerald-500", label: "Thinking", progress: "thinking", avatar: "thinking" };
  }
  return { dot: "bg-emerald-500", ring: "text-emerald-500", label: "Active", progress: "running", avatar: "running" };
}
function relativeOutputTime(ts) {
  if (!ts) return "no runtime output yet";
  const diff = Date.now() - ts;
  if (diff < 6e4) return "output just now";
  if (diff < 36e5) return `output ${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `output ${Math.floor(diff / 36e5)}h ago`;
  return `output ${Math.floor(diff / 864e5)}d ago`;
}
function isLivePulse(ts) {
  if (!ts) return false;
  return Date.now() - ts < 9e4;
}
async function fetchWorkerProject(workerId) {
  const res = await fetch(`/api/swarm-project?workerId=${encodeURIComponent(workerId)}`);
  if (!res.ok) return {};
  return await res.json();
}
function colorForWorker$1(workerId) {
  const number = parseInt(workerId.replace(/\D/g, ""), 10);
  if (Number.isFinite(number) && number > 0) {
    return WORKER_COLORS[(number - 1) % WORKER_COLORS.length];
  }
  return WORKER_COLORS[0];
}
function formatAssignedModel$1(model, provider) {
  const value = `${model || ""} ${provider || ""}`.toLowerCase();
  if (value.includes("claude-opus-4-7") || value.includes("opus-4-7")) return "Opus 4.7";
  if (value.includes("claude-opus-4-6") || value.includes("opus-4-6")) return "Opus 4.6";
  if (value.includes("gpt-5.5")) return "GPT-5.5";
  if (value.includes("gpt-5.4")) return "GPT-5.4";
  if (value.includes("gpt-5.3")) return "GPT-5.3";
  if (model && model !== "unknown") return model;
  if (provider && provider !== "unknown") return provider.replace(/^custom:/, "").replace(/[-_]/g, " ");
  return "Worker";
}
const SETTINGS_STORAGE_PREFIX = "claude-swarm2-card-settings:";
const ROLE_OPTIONS = [
  "Profile",
  "PR / Issues",
  "Builder",
  "Reviewer",
  "BenchLoop",
  "Research",
  "Docs",
  "Ops",
  "Qwen PC1",
  "Hackathon",
  "Worker"
];
const MODEL_OPTIONS = [
  "GPT-5.5",
  "GPT-5.4",
  "GPT-5.3",
  "Opus 4.7",
  "Opus 4.6",
  "Opus 4.5",
  "MiniMax",
  "Qwen3 8B",
  "Qwen3 14B",
  "Worker"
];
const AVATAR_OPTIONS = ["", "🤖", "🧠", "🛠️", "📊", "🧪", "📝", "⚙️", "🔬", "🚀"];
function OperationalWorkerCard({
  member,
  currentTask = null,
  checkpointStatus = null,
  runtimeState = null,
  recentOutputAt = null,
  recentSummary = null,
  artifacts = [],
  previews = [],
  inRoom,
  selected,
  onSelect,
  onToggleRoom,
  onOpenTui,
  onOpenTasks,
  cardRef
}) {
  const chatAnchorRef = useRef(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({});
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState("");
  const [draftModel, setDraftModel] = useState("");
  const [draftAvatar, setDraftAvatar] = useState("");
  const [taskComposerOpen, setTaskComposerOpen] = useState(false);
  const state = deriveWorkerState(member, currentTask, checkpointStatus, runtimeState);
  const status = statusStyles(state);
  const role = settings.role || member.role || roleFromId(member.id);
  const displayName = settings.displayName || member.displayName || member.id;
  const projectQuery = useQuery({
    queryKey: ["swarm2", "card-project", member.id],
    queryFn: () => fetchWorkerProject(member.id),
    enabled: Boolean(member.id),
    refetchInterval: 6e4,
    staleTime: 3e4
  });
  const projectName = projectQuery.data?.projectName ?? null;
  const projectBranch = projectQuery.data?.branch ?? null;
  const cardChangedFiles = projectQuery.data?.changedFiles ?? [];
  const previewUrl = projectQuery.data?.previewUrls?.[0] ?? null;
  const livePulse = isLivePulse(recentOutputAt);
  const activeCount = member.assignedTaskCount + member.cronJobCount;
  const hasPreview = Boolean(previewUrl);
  const progressValue = state === "idle" || state === "offline" ? 8 : state === "waiting" ? 38 : 68;
  const baseModelLabel = formatAssignedModel$1(member.model, member.provider);
  const modelLabel = settings.modelLabel || baseModelLabel;
  const avatarGlyph = settings.avatarGlyph || "";
  const outputFreshness = relativeOutputTime(recentOutputAt);
  const focusPanels = useMemo(() => {
    const panels = [
      {
        key: "tasks",
        label: "Tasks",
        meta: `${activeCount} active lanes`,
        helper: "Tracked work for this agent lives here."
      },
      {
        key: "output",
        label: "Output",
        meta: `${artifacts.length} artifacts · ${previews.length} previews`,
        helper: "Published runtime artifacts, previews, and reports."
      }
    ];
    if (cardChangedFiles.length > 0) {
      panels.push({
        key: "files",
        label: "Files",
        meta: `${cardChangedFiles.length} changed`,
        helper: "Git-inferred file changes until runtime artifacts replace them."
      });
    }
    return panels;
  }, [activeCount, artifacts.length, previews.length, cardChangedFiles.length]);
  const [focusPanel, setFocusPanel] = useState("tasks");
  const panelCollapsedLimit = selected ? 6 : 4;
  const panelExpandedLimit = selected ? 8 : 5;
  useEffect(() => {
    if (!focusPanels.some((panel) => panel.key === focusPanel)) {
      setFocusPanel("tasks");
    }
  }, [focusPanels, focusPanel]);
  const activeFocusPanel = focusPanels.find((panel) => panel.key === focusPanel) ?? focusPanels[0];
  function cycleFocusPanel(direction) {
    const currentIndex = focusPanels.findIndex((panel) => panel.key === focusPanel);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (safeIndex + direction + focusPanels.length) % focusPanels.length;
    setFocusPanel(focusPanels[nextIndex]?.key ?? "tasks");
  }
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`${SETTINGS_STORAGE_PREFIX}${member.id}`);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setSettings(parsed);
    } catch {
    }
  }, [member.id]);
  useEffect(() => {
    if (!settingsOpen) return;
    setDraftName(settings.displayName || member.displayName || "");
    setDraftRole(settings.role || member.role || roleFromId(member.id));
    setDraftModel(settings.modelLabel || baseModelLabel);
    setDraftAvatar(settings.avatarGlyph || "");
  }, [settingsOpen, settings, member.displayName, member.role, member.id, baseModelLabel]);
  useEffect(() => {
    if (!selected) return;
    const id = setTimeout(() => {
      chatAnchorRef.current?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth"
      });
    }, 40);
    return () => clearTimeout(id);
  }, [selected]);
  return /* @__PURE__ */ jsxs(
    "article",
    {
      ref: cardRef,
      "data-swarm2-worker-id": member.id,
      onClick: onSelect,
      className: cn(
        "relative overflow-hidden flex min-h-[30rem] flex-col rounded-[1.35rem] border bg-[var(--theme-card)] p-3 text-[var(--theme-text)] shadow-[0_18px_44px_color-mix(in_srgb,var(--theme-shadow)_13%,transparent)] transition-all",
        "hover:-translate-y-[1px] hover:shadow-[0_22px_58px_color-mix(in_srgb,var(--theme-shadow)_18%,transparent)]",
        selected ? "border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent-soft-strong)]" : inRoom ? "border-[var(--theme-border2)]" : "border-[var(--theme-border)]"
      ),
      children: [
        !settingsOpen ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-8 items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "absolute left-0 flex max-w-[10rem] flex-wrap items-center gap-1 text-[10px] text-[var(--theme-muted)]/85", children: [
              /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-1.5 py-0.5", children: modelLabel }),
              /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-1.5 py-0.5", children: projectBranch || projectName || (hasPreview ? "preview" : "main") })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex w-full justify-center px-28", children: /* @__PURE__ */ jsx("h3", { className: "min-w-0 text-center text-sm font-semibold text-[var(--theme-text)]", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex max-w-full items-center justify-center gap-2", children: [
              avatarGlyph ? /* @__PURE__ */ jsx("span", { children: avatarGlyph }) : null,
              /* @__PURE__ */ jsx("span", { className: "truncate", children: displayName }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    state !== "idle" && state !== "offline" && state !== "waiting" && "animate-pulse",
                    status.dot
                  ),
                  "aria-label": status.label,
                  title: status.label
                }
              ),
              livePulse ? /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-200",
                  title: "Output within the last 90 seconds",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "size-1.5 animate-pulse rounded-full bg-emerald-400" }),
                    "live"
                  ]
                }
              ) : null
            ] }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-0 flex max-w-[9rem] items-center gap-1", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "truncate rounded-full border border-[var(--theme-accent)]/30 bg-[var(--theme-accent-soft)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-muted)]",
                  title: role,
                  children: role
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `Settings for ${displayName}`,
                  title: `Settings for ${displayName}`,
                  onClick: (event) => {
                    event.stopPropagation();
                    setSettingsOpen(true);
                  },
                  className: "inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]",
                  children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Settings01Icon, size: 16, strokeWidth: 1.8 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-1 px-2 py-1.5 text-center", children: /* @__PURE__ */ jsxs("div", { className: "relative flex size-11 shrink-0 items-center justify-center", children: [
            /* @__PURE__ */ jsx(
              AgentProgress,
              {
                value: progressValue,
                status: status.progress,
                size: 44,
                strokeWidth: 2.5,
                className: status.ring
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(
              PixelAvatar,
              {
                size: 36,
                color: colorForWorker$1(member.id),
                accentColor: "#ffffff",
                status: status.avatar
              }
            ) })
          ] }) }),
          !member.profileFound ? /* @__PURE__ */ jsx("div", { className: "mb-2 rounded-xl border border-amber-400/35 bg-amber-500/10 px-3 py-2 text-center text-[11px] text-amber-200", children: "Roster-only agent, not provisioned yet. Configure now, bootstrap profile later." }) : null,
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: chatAnchorRef,
              onClick: (event) => event.stopPropagation(),
              className: cn("flex-1", selected ? "mt-5 min-h-[18rem]" : "mt-4 min-h-[16rem]"),
              children: /* @__PURE__ */ jsx(
                Swarm2LiveChat,
                {
                  workerId: member.id,
                  preview: false,
                  previewLimit: 6,
                  nativeStyle: true,
                  className: "h-full min-h-[16rem] bg-[var(--theme-bg)] text-[var(--theme-text)]"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs(
            "section",
            {
              className: cn(
                "mt-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-2.5 py-2",
                selected ? "min-h-[5.75rem]" : "min-h-[5rem]"
              ),
              onClick: (event) => event.stopPropagation(),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Previous panel",
                      title: "Previous panel",
                      onClick: () => cycleFocusPanel(-1),
                      className: "inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]",
                      children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ArrowLeft01Icon, size: 11 })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 text-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "truncate", children: activeFocusPanel?.label ?? "Panel" }),
                    /* @__PURE__ */ jsx("div", { className: "truncate text-[10px] font-medium normal-case tracking-normal text-[var(--theme-muted)]/80", children: activeFocusPanel?.meta ?? outputFreshness })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                    focusPanel === "tasks" ? /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": taskComposerOpen ? "Close add task" : "Add task",
                        title: taskComposerOpen ? "Close add task" : "Add task",
                        onClick: () => setTaskComposerOpen((value) => !value),
                        className: "inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]",
                        children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Add01Icon, size: 11 })
                      }
                    ) : null,
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": "Next panel",
                        title: "Next panel",
                        onClick: () => cycleFocusPanel(1),
                        className: "inline-flex h-6 w-6 items-center justify-center rounded-md border border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-text)]",
                        children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ArrowRight01Icon, size: 11 })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mb-2 mx-auto max-w-2xl text-center text-[11px] leading-relaxed text-[var(--theme-muted)]", children: activeFocusPanel?.helper ?? "Worker details" }),
                focusPanel === "tasks" ? /* @__PURE__ */ jsx(
                  Swarm2TaskQueue,
                  {
                    workerId: member.id,
                    limit: selected ? 5 : 3,
                    doneLimit: selected ? 3 : 2,
                    showHeader: false,
                    composerOpen: taskComposerOpen,
                    onComposerOpenChange: setTaskComposerOpen,
                    centered: true,
                    className: cn(selected ? "min-h-[5.75rem]" : "min-h-[5rem]")
                  }
                ) : focusPanel === "files" ? /* @__PURE__ */ jsx(
                  Swarm2Artifacts,
                  {
                    workerId: member.id,
                    artifacts,
                    previews: [],
                    changedFiles: cardChangedFiles,
                    expanded: selected,
                    collapsedLimit: panelCollapsedLimit,
                    expandedLimit: panelExpandedLimit,
                    mode: "files",
                    showHeader: false,
                    centered: true,
                    className: cn(selected ? "min-h-[5.75rem]" : "min-h-[5rem]", "border-0 bg-transparent px-0 py-0")
                  }
                ) : /* @__PURE__ */ jsx(
                  Swarm2Artifacts,
                  {
                    workerId: member.id,
                    artifacts,
                    previews,
                    changedFiles: cardChangedFiles,
                    expanded: selected,
                    collapsedLimit: panelCollapsedLimit,
                    expandedLimit: panelExpandedLimit,
                    mode: "artifacts",
                    showHeader: false,
                    centered: true,
                    className: cn(selected ? "min-h-[5.75rem]" : "min-h-[5rem]", "border-0 bg-transparent px-0 py-0")
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "mt-auto pt-3 flex items-center justify-between gap-2 border-t border-[var(--theme-border)] text-[11px]",
              onClick: (event) => event.stopPropagation(),
              children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: onOpenTasks,
                    title: `Route work to ${member.displayName || member.id}`,
                    className: "inline-flex items-center gap-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2.5 py-1 text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]",
                    children: [
                      /* @__PURE__ */ jsx(HugeiconsIcon, { icon: CheckListIcon, size: 11 }),
                      "Route to agent"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: onOpenTui,
                    className: "inline-flex items-center gap-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2.5 py-1 text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]",
                    children: [
                      /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ComputerTerminal01Icon, size: 11 }),
                      "Open terminal"
                    ]
                  }
                )
              ]
            }
          )
        ] }) : null,
        settingsOpen ? /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 z-20 flex items-center justify-center rounded-[1.35rem] bg-[color:rgba(5,10,15,0.9)] backdrop-blur-sm p-3",
            onClick: (event) => {
              event.stopPropagation();
              setSettingsOpen(false);
            },
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "w-full max-w-md rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 shadow-2xl",
                onClick: (event) => event.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-[var(--theme-text)]", children: "Agent settings" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[var(--theme-muted)]", children: "Local card overrides for now, native worker settings next." })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        className: "rounded-lg px-2 py-1 text-[var(--theme-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]",
                        onClick: () => setSettingsOpen(false),
                        children: "✕"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-[12px]", children: [
                    /* @__PURE__ */ jsxs("label", { className: "block", children: [
                      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[var(--theme-muted)]", children: "Name" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          value: draftName,
                          onChange: (event) => setDraftName(event.target.value),
                          className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none",
                          placeholder: member.displayName || member.id
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("label", { className: "block", children: [
                      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[var(--theme-muted)]", children: "Avatar glyph" }),
                      /* @__PURE__ */ jsxs(
                        "select",
                        {
                          value: draftAvatar,
                          onChange: (event) => setDraftAvatar(event.target.value),
                          className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none",
                          children: [
                            /* @__PURE__ */ jsx("option", { value: "", children: "None" }),
                            AVATAR_OPTIONS.filter(Boolean).map((option) => /* @__PURE__ */ jsx("option", { value: option, children: option }, option))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("label", { className: "block", children: [
                      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[var(--theme-muted)]", children: "Role" }),
                      /* @__PURE__ */ jsx(
                        "select",
                        {
                          value: draftRole,
                          onChange: (event) => setDraftRole(event.target.value),
                          className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none",
                          children: Array.from(new Set([draftRole || member.role || roleFromId(member.id), ...ROLE_OPTIONS].filter(Boolean))).map((option) => /* @__PURE__ */ jsx("option", { value: option, children: option }, option))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("label", { className: "block", children: [
                      /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[var(--theme-muted)]", children: "Model label" }),
                      /* @__PURE__ */ jsx(
                        "select",
                        {
                          value: draftModel,
                          onChange: (event) => setDraftModel(event.target.value),
                          className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none",
                          children: Array.from(new Set([draftModel || baseModelLabel, ...MODEL_OPTIONS].filter(Boolean))).map((option) => /* @__PURE__ */ jsx("option", { value: option, children: option }, option))
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        className: "rounded-xl border border-[var(--theme-border)] px-3 py-2 text-[11px] text-[var(--theme-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]",
                        onClick: () => {
                          const next = {};
                          setSettings(next);
                          try {
                            window.localStorage.removeItem(`${SETTINGS_STORAGE_PREFIX}${member.id}`);
                          } catch {
                          }
                          setSettingsOpen(false);
                        },
                        children: "Reset"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          className: "rounded-xl border border-[var(--theme-border)] px-3 py-2 text-[11px] text-[var(--theme-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]",
                          onClick: () => setSettingsOpen(false),
                          children: "Cancel"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          className: "rounded-xl bg-[var(--theme-accent)] px-3 py-2 text-[11px] font-semibold text-primary-950 hover:bg-[var(--theme-accent-strong)]",
                          onClick: () => {
                            const next = {
                              displayName: draftName.trim() || void 0,
                              avatarGlyph: draftAvatar.trim() || void 0,
                              role: draftRole.trim() || void 0,
                              modelLabel: draftModel.trim() || void 0
                            };
                            setSettings(next);
                            try {
                              window.localStorage.setItem(`${SETTINGS_STORAGE_PREFIX}${member.id}`, JSON.stringify(next));
                            } catch {
                            }
                            setSettingsOpen(false);
                          },
                          children: "Save"
                        }
                      )
                    ] })
                  ] })
                ]
              }
            )
          }
        ) : null
      ]
    }
  );
}
function roleForMember(members, id) {
  return members.find((member) => member.id === id)?.role || "Worker";
}
const QUICK_ROUTES = [
  "Research",
  "Builder",
  "Reviewer",
  "Docs",
  "Ops",
  "Best match",
  "Auto"
];
function RouterChat({
  members,
  roomIds,
  selectedId,
  open,
  onOpen,
  onClose,
  showClosedDock = false,
  embedded = false,
  seedPrompt,
  seedMode,
  seedKey,
  onResults
}) {
  const [mode, setMode] = useState("auto");
  const [prompt, setPrompt] = useState("");
  const [decomposing, setDecomposing] = useState(false);
  const [decomposeError, setDecomposeError] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchError, setDispatchError] = useState(null);
  const [results, setResults] = useState(null);
  const [followUp, setFollowUp] = useState(null);
  useEffect(() => {
    if (!seedPrompt?.trim()) return;
    setPrompt(seedPrompt);
    if (seedMode) setMode(seedMode);
    setAssignments([]);
    setUnassigned([]);
    setResults(null);
    setFollowUp(null);
    setDecomposeError(null);
    setDispatchError(null);
  }, [seedKey, seedMode, seedPrompt]);
  useEffect(() => {
    if (mode === "manual" && selectedId && assignments.length === 0 && prompt.trim()) {
      setAssignments([
        {
          workerId: selectedId,
          task: prompt.trim(),
          rationale: "Manual target."
        }
      ]);
    }
  }, [mode, selectedId, assignments.length, prompt]);
  if (!open) {
    if (!showClosedDock || !onOpen) return null;
    const targetLabel = selectedId ? selectedId : roomIds.length ? `${roomIds.length} in room` : `${members.length} workers`;
    return /* @__PURE__ */ jsx("div", { className: "fixed inset-x-0 bottom-0 z-40 mx-auto max-w-xl px-4 pb-3", children: /* @__PURE__ */ jsx(RouterClosedDock, { targetLabel, mode, onOpen }) });
  }
  const eligibleWorkers = members.map((m) => ({
    id: m.id,
    role: m.role,
    model: m.model,
    specialty: m.specialty,
    mission: m.mission || m.lastSessionTitle || void 0,
    skills: m.skills ?? [],
    capabilities: m.capabilities ?? [],
    notes: [
      m.specialty,
      m.mission || m.lastSessionTitle,
      m.skills?.length ? `skills=${m.skills.join(",")}` : "",
      `${m.sessionCount} sess · ${m.totalTokens} tok`
    ].filter(Boolean).join(" · ")
  }));
  async function autoDecompose() {
    if (!prompt.trim()) return null;
    setDecomposing(true);
    setDecomposeError(null);
    try {
      const res = await fetch("/api/swarm-decompose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          workers: eligibleWorkers
        }),
        signal: AbortSignal.timeout(12e4)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "decompose failed");
      const nextAssignments = data.assignments ?? [];
      setAssignments(nextAssignments);
      setUnassigned(data.unassigned ?? []);
      return nextAssignments;
    } catch (err) {
      setDecomposeError(err instanceof Error ? err.message : "decompose failed");
      return null;
    } finally {
      setDecomposing(false);
    }
  }
  async function dispatch() {
    let plan = [];
    if (mode === "auto") {
      if (assignments.length === 0) {
        const nextAssignments = await autoDecompose();
        if (!nextAssignments || nextAssignments.length === 0) return;
        plan = nextAssignments;
      } else {
        plan = assignments;
      }
    } else if (mode === "manual") {
      if (!selectedId) return;
      plan = [
        {
          workerId: selectedId,
          task: prompt.trim(),
          rationale: "Manual single-target."
        }
      ];
    } else {
      const targets = roomIds.length > 0 ? roomIds : members.map((m) => m.id);
      plan = targets.map((id) => ({
        workerId: id,
        task: prompt.trim(),
        rationale: "Broadcast."
      }));
    }
    if (plan.length === 0) return;
    setDispatching(true);
    setDispatchError(null);
    setResults(null);
    setFollowUp(null);
    try {
      const res = await fetch("/api/swarm-dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignments: plan,
          timeoutSeconds: 300,
          waitForCheckpoint: false
        }),
        signal: AbortSignal.timeout(6e4)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResults(data);
      onResults(data);
      if (plan.length > 1 && data.results.some((result) => result.checkpointStatus === "checkpointed")) {
        const reviewer = members.find((member) => member.id === "swarm6") ?? members.find((member) => /review|qa|critic/i.test(`${member.role} ${member.specialty ?? ""}`));
        const follow = await fetch("/api/swarm-orchestrator-loop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workerIds: [.../* @__PURE__ */ new Set([...plan.map((item) => item.workerId), ...reviewer ? [reviewer.id] : []])],
            staleMinutes: 3,
            autoContinue: true,
            allowExecution: false,
            reviewWorkerId: reviewer?.id
          })
        });
        const followData = await follow.json().catch(() => null);
        if (followData) setFollowUp(followData);
      }
    } catch (err) {
      setDispatchError(err instanceof Error ? err.message : "dispatch failed");
    } finally {
      setDispatching(false);
    }
  }
  function reset() {
    setPrompt("");
    setAssignments([]);
    setUnassigned([]);
    setResults(null);
    setFollowUp(null);
    setDecomposeError(null);
    setDispatchError(null);
  }
  return /* @__PURE__ */ jsx("div", { className: cn(embedded ? "w-full" : "fixed inset-x-0 bottom-0 z-40 mx-auto max-w-6xl px-4 pb-3"), children: /* @__PURE__ */ jsxs("div", { className: cn(
    "overflow-hidden rounded-[1.5rem] border border-[var(--theme-border)] bg-[var(--theme-card)]",
    embedded ? "max-h-none shadow-none" : "max-h-[min(58vh,460px)] shadow-[0_-18px_50px_var(--theme-shadow)]"
  ), children: [
    /* @__PURE__ */ jsxs("div", { className: cn("flex flex-wrap items-start justify-between gap-3", embedded ? "px-3 pt-3" : "px-5 pt-4"), children: [
      /* @__PURE__ */ jsx("div", { children: !embedded ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--theme-muted)]", children: [
          /* @__PURE__ */ jsx(HugeiconsIcon, { icon: FlashIcon, size: 11 }),
          "Agent Router Chat"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-[var(--theme-muted-2)]", children: "Type a mission, choose routing, dispatch. Keep workers selected in cards." })
      ] }) : null }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        !embedded ? /* @__PURE__ */ jsx(ModeToggle, { mode, setMode }) : null,
        !embedded ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--theme-muted)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]",
            children: "Close"
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn(
      "grid gap-3 overflow-y-auto py-3",
      embedded ? "max-h-none px-3" : "max-h-[330px] px-5 lg:grid-cols-[1.35fr_minmax(280px,1fr)]"
    ), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            rows: embedded ? 5 : 7,
            value: prompt,
            onChange: (e) => setPrompt(e.target.value),
            disabled: decomposing || dispatching,
            placeholder: mode === "auto" ? "Describe the mission, e.g. 'Sweep open PRs, then summarise BenchLoop runs from PC1, draft a launch tweet.'" : mode === "manual" ? `Message ${selectedId ?? "select a worker first"}…` : "Broadcast to the room (or all workers if no room): 'Status check.'",
            className: "min-h-[8rem] resize-y rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-muted)] focus:border-[var(--theme-accent)] focus:outline-none"
          }
        ),
        !embedded ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: QUICK_ROUTES.map((quick) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setMode("auto");
              setPrompt(
                (cur) => cur ? cur : `Use the ${quick.toLowerCase()} specialist for this:`
              );
            },
            className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--theme-muted)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]",
            children: quick
          },
          quick
        )) }) : null,
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-1", children: [
          embedded ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-3", children: /* @__PURE__ */ jsx(ModeToggle, { mode, setMode }) }) : /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[var(--theme-muted)]", children: `${prompt.trim().length} chars · ${mode === "auto" ? "auto-route by role" : mode === "manual" ? `→ ${selectedId ?? "no target"}` : `broadcast to ${roomIds.length || members.length}`}` }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            !embedded ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: reset,
                className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--theme-muted)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]",
                children: "Reset"
              }
            ) : null,
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: dispatch,
                disabled: dispatching || decomposing || !prompt.trim() || mode === "manual" && !selectedId,
                className: cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold",
                  dispatching || decomposing ? "bg-[var(--theme-accent-soft)] text-[var(--theme-text)]" : "bg-[var(--theme-accent)] text-primary-950 hover:bg-[var(--theme-accent-strong)] disabled:opacity-50"
                ),
                children: [
                  /* @__PURE__ */ jsx(
                    HugeiconsIcon,
                    {
                      icon: mode === "manual" ? SentIcon : mode === "auto" ? Settings01Icon : Rocket01Icon,
                      size: 12
                    }
                  ),
                  dispatching || decomposing ? mode === "auto" ? "Routing…" : "Sending…" : mode === "manual" ? `Send to ${selectedId ?? "—"}` : mode === "broadcast" ? `Broadcast to ${roomIds.length || members.length}` : "Route mission"
                ]
              }
            )
          ] })
        ] }),
        decomposeError ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-[var(--theme-danger-border)] bg-[var(--theme-danger-soft)] px-3 py-2 text-xs text-[var(--theme-text)]", children: decomposeError }) : null,
        dispatchError ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-[var(--theme-danger-border)] bg-[var(--theme-danger-soft)] px-3 py-2 text-xs text-[var(--theme-text)]", children: dispatchError }) : null
      ] }),
      !embedded ? /* @__PURE__ */ jsxs("div", { className: "flex min-h-[180px] flex-col gap-2 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: "Routing plan" }),
        assignments.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-[12px] text-[var(--theme-muted-2)]", children: mode === "auto" ? "Hit Auto decompose to see proposed routing here." : mode === "manual" ? "Single target dispatch." : "Broadcast — no per-target plan needed." }) : /* @__PURE__ */ jsx("ol", { className: "max-h-72 space-y-1.5 overflow-y-auto pr-1 text-[12px]", children: assignments.map((a, idx) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-2 py-1.5",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "→ ",
                  a.workerId,
                  " · ",
                  roleForMember(members, a.workerId)
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAssignments((c) => c.filter((_, i) => i !== idx)),
                    className: "text-[var(--theme-muted)] hover:text-[var(--theme-danger)]",
                    children: "remove"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  rows: 4,
                  value: a.task,
                  onChange: (e) => setAssignments(
                    (c) => c.map(
                      (entry, i) => i === idx ? { ...entry, task: e.target.value } : entry
                    )
                  ),
                  className: "mt-1 w-full resize-none rounded-md border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2 py-1 text-[11px] text-[var(--theme-text)] focus:border-[var(--theme-accent)] focus:outline-none"
                }
              ),
              a.rationale ? /* @__PURE__ */ jsx("div", { className: "mt-1 text-[10px] italic text-[var(--theme-muted-2)]", children: a.rationale }) : null
            ]
          },
          `${a.workerId}-${idx}`
        )) }),
        unassigned.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-md border border-[var(--theme-warning-border)] bg-[var(--theme-warning-soft)] px-2 py-1 text-[11px] text-[var(--theme-text)]", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: "Unrouted notes" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-4", children: unassigned.map((u, i) => /* @__PURE__ */ jsx("li", { children: u }, i)) })
        ] }) : null
      ] }) : null
    ] }),
    !embedded && results ? /* @__PURE__ */ jsxs("div", { className: "max-h-64 overflow-y-auto border-t border-[var(--theme-border)] px-5 py-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: [
        /* @__PURE__ */ jsx("span", { children: "Dispatch results" }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[var(--theme-muted)]", children: [
          /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Clock01Icon, size: 11 }),
          ((results.completedAt - results.dispatchedAt) / 1e3).toFixed(
            1
          ),
          "s"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3", children: results.results.map((r) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "rounded-xl border px-3 py-2 text-[11px]",
            r.ok ? "border-[var(--theme-border)] bg-[var(--theme-card)]" : "border-[var(--theme-danger-border)] bg-[var(--theme-danger-soft)]"
          ),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[var(--theme-text)]", children: [
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-semibold", children: [
                /* @__PURE__ */ jsx(
                  HugeiconsIcon,
                  {
                    icon: r.ok ? CheckmarkCircle02Icon : AlertCircleIcon,
                    size: 11,
                    className: r.ok ? "text-[var(--theme-accent)]" : "text-[var(--theme-danger)]"
                  }
                ),
                r.workerId
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[var(--theme-muted)]", children: [
                (r.durationMs / 1e3).toFixed(1),
                "s"
              ] })
            ] }),
            r.error ? /* @__PURE__ */ jsx("pre", { className: "mt-2 max-h-28 overflow-auto whitespace-pre-wrap text-[var(--theme-danger)]", children: r.error }) : null,
            r.checkpoint ? /* @__PURE__ */ jsxs("div", { className: "mt-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)] p-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: [
                "Checkpoint · ",
                r.checkpoint.stateLabel
              ] }),
              r.checkpoint.result ? /* @__PURE__ */ jsx("div", { className: "mt-1 line-clamp-4 text-[11px] text-[var(--theme-text)]", children: r.checkpoint.result }) : null,
              r.checkpoint.nextAction ? /* @__PURE__ */ jsxs("div", { className: "mt-1 text-[10px] text-[var(--theme-muted)]", children: [
                "Next: ",
                r.checkpoint.nextAction
              ] }) : null
            ] }) : r.checkpointStatus === "timeout" ? /* @__PURE__ */ jsx("div", { className: "mt-2 rounded-lg border border-[var(--theme-warning-border)] bg-[var(--theme-warning-soft)] p-2 text-[11px] text-[var(--theme-text)]", children: "Delivered, waiting for checkpoint. Orchestrator loop can follow up." }) : null,
            r.output ? /* @__PURE__ */ jsx("pre", { className: "mt-2 max-h-44 overflow-auto whitespace-pre-wrap text-[var(--theme-text)]", children: r.output.length > 1800 ? `${r.output.slice(0, 1800)}…
[truncated]` : r.output }) : null
          ]
        },
        r.workerId
      )) })
    ] }) : null,
    !embedded && followUp ? /* @__PURE__ */ jsxs("div", { className: "border-t border-[var(--theme-border)] px-5 py-3 text-[11px] text-[var(--theme-text)]", children: [
      /* @__PURE__ */ jsx("div", { className: "font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: "Orchestrator follow-up" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 text-[var(--theme-muted-2)]", children: [
        "Parsed ",
        followUp.summary?.checkpointed ?? 0,
        " checkpoints · stale ",
        followUp.summary?.stale ?? 0,
        " · continuation ",
        followUp.continuation ? "sent" : "not needed"
      ] })
    ] }) : null
  ] }) });
}
function RouterClosedDock({
  targetLabel,
  mode,
  onOpen
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: onOpen,
      className: "flex w-full items-center justify-between gap-3 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-3 text-left text-[var(--theme-text)] shadow-[0_-12px_34px_var(--theme-shadow)] transition-colors hover:border-[var(--theme-accent)]",
      children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex min-w-0 items-center gap-2", children: [
          /* @__PURE__ */ jsx(HugeiconsIcon, { icon: FlashIcon, size: 14, className: "text-[var(--theme-accent)]" }),
          /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-muted)]", children: "Router" }),
            /* @__PURE__ */ jsxs("span", { className: "block truncate text-sm text-[var(--theme-text)]", children: [
              mode,
              " · ",
              targetLabel
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded-full bg-[var(--theme-accent)] px-3 py-1 text-xs font-semibold text-primary-950", children: "Open" })
      ]
    }
  );
}
function ModeToggle({
  mode,
  setMode
}) {
  return /* @__PURE__ */ jsx("div", { className: "flex rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-1 text-[10px] uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: ["auto", "manual", "broadcast"].map((m) => /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: () => setMode(m),
      className: cn(
        "rounded-lg px-3 py-1 transition-colors",
        mode === m ? "bg-[var(--theme-accent)] text-primary-950" : "hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]"
      ),
      children: m === "manual" ? "one agent" : m
    },
    m
  )) });
}
const ORCHESTRATOR_NAME_KEY = "swarm2:orchestrator:name";
const DEFAULT_NAME = "Main Agent";
const AGENT_PAGE_SIZE = 12;
const AGENT_LENSES = [
  { id: "all", label: "All" },
  { id: "working", label: "Run" },
  { id: "reviewing", label: "Review" },
  { id: "blocked", label: "Blocked" },
  { id: "ready", label: "Ready" }
];
function Swarm2OrchestratorCard({
  totalWorkers,
  activeRuntimeCount,
  roomCount,
  authErrors,
  selectedLabel,
  workspaceModel,
  viewMode,
  onViewModeChange,
  lanes = [],
  activeAgents = [],
  members,
  roomIds,
  selectedId,
  recentUpdates = [],
  latestMission = null,
  inboxCounts = { needsReview: 0, blocked: 0, ready: 0 },
  routerSeed = null,
  onOpenRouter,
  onRouterResults,
  onAnchorRef,
  className
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [swarmCardMode, setSwarmCardMode] = useState("cards");
  const [agentLens, setAgentLens] = useState("all");
  const [agentPage, setAgentPage] = useState(0);
  const [name, setName] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_NAME;
    return window.localStorage.getItem(ORCHESTRATOR_NAME_KEY) || DEFAULT_NAME;
  });
  const [draftName, setDraftName] = useState(name);
  const anchorCallbackRef = useCallback(
    (node) => {
      onAnchorRef?.(node);
    },
    [onAnchorRef]
  );
  function openSettings() {
    setDraftName(name);
    setSettingsOpen(true);
  }
  function saveSettings() {
    const next = draftName.trim() || DEFAULT_NAME;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ORCHESTRATOR_NAME_KEY, next);
    }
    setName(next);
    setSettingsOpen(false);
  }
  const isActive = activeRuntimeCount > 0;
  const lensIndex = AGENT_LENSES.findIndex((lens) => lens.id === agentLens);
  const filteredAgents = useMemo(
    () => activeAgents.filter((agent) => agentLens === "all" || agent.state === agentLens),
    [activeAgents, agentLens]
  );
  const agentCounts = useMemo(() => {
    const counts = { all: activeAgents.length, working: 0, reviewing: 0, blocked: 0, ready: 0 };
    for (const agent of activeAgents) counts[agent.state] += 1;
    return counts;
  }, [activeAgents]);
  const agentPageCount = Math.max(1, Math.ceil(filteredAgents.length / AGENT_PAGE_SIZE));
  const visibleAgents = filteredAgents.slice(agentPage * AGENT_PAGE_SIZE, agentPage * AGENT_PAGE_SIZE + AGENT_PAGE_SIZE);
  const officeAgents = useMemo(() => activeAgents.map((agent) => ({
    id: agent.workerId,
    name: agent.workerName,
    modelId: agent.role,
    status: agent.state === "blocked" ? "error" : agent.state === "ready" ? "done" : "active",
    lastLine: agent.task,
    lastAt: Date.now(),
    taskCount: agent.state === "ready" ? 0 : 1,
    currentTask: agent.task,
    roleDescription: agent.role
  })), [activeAgents]);
  function cycleAgentPage(delta) {
    setAgentPage((page) => (page + delta + agentPageCount) % agentPageCount);
  }
  function selectAgentLens(lens) {
    setAgentLens(lens);
    setAgentPage(0);
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "article",
      {
        className: cn(
          "relative flex min-h-[23rem] flex-col rounded-[1.75rem] border border-[var(--theme-border)] border-l-4 border-l-[var(--theme-accent)] bg-[var(--theme-card)] px-5 pt-6 pb-4 shadow-[0_22px_64px_var(--theme-shadow)]",
          className
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center gap-3 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 flex shrink-0 items-center gap-1 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-1 shadow-sm", children: [
              ["cards", "Control"],
              ["kanban", "Board"],
              ["reports", "Inbox"],
              ["runtime", "Runtime"]
            ].map(([mode, label]) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => onViewModeChange(mode),
                className: cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
                  viewMode === mode ? "bg-[var(--theme-accent)] text-primary-950" : "text-[var(--theme-muted)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]"
                ),
                children: label
              },
              mode
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-0 flex shrink-0 items-center gap-1", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: onOpenRouter,
                  className: "inline-flex h-9 items-center gap-1 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]",
                  children: [
                    /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: MessageMultiple01Icon,
                        size: 13,
                        strokeWidth: 1.8
                      }
                    ),
                    "Router"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: openSettings,
                  className: "inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]",
                  "aria-label": "Orchestrator settings",
                  title: "Orchestrator settings",
                  children: /* @__PURE__ */ jsx(
                    HugeiconsIcon,
                    {
                      icon: Settings01Icon,
                      size: 16,
                      strokeWidth: 1.8
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative flex size-14 shrink-0 items-center justify-center", children: [
              /* @__PURE__ */ jsx(
                AgentProgress,
                {
                  value: isActive ? 82 : 16,
                  status: isActive ? "running" : "queued",
                  size: 56,
                  strokeWidth: 2.5,
                  className: "text-emerald-500"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                PixelAvatar,
                {
                  size: 42,
                  color: "#f59e0b",
                  accentColor: "#fbbf24",
                  status: isActive ? "running" : "idle"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsx("h2", { className: "truncate text-[1.05rem] font-semibold text-[var(--theme-text)]", children: name }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: cn(
                      "h-2 w-2 shrink-0 rounded-full bg-emerald-500",
                      isActive && "animate-pulse"
                    ),
                    "aria-label": "Active",
                    title: isActive ? "Active" : "Idle"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2 text-[11px] text-[var(--theme-muted)]", children: [
                /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2.5 py-1", children: [
                  totalWorkers,
                  " workers"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2.5 py-1", children: [
                  activeRuntimeCount,
                  " live"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 min-h-[12.5rem] flex-1", children: /* @__PURE__ */ jsx(
            RouterChat,
            {
              members,
              roomIds,
              selectedId,
              open: true,
              embedded: true,
              showClosedDock: false,
              seedPrompt: routerSeed?.prompt ?? null,
              seedMode: routerSeed?.mode,
              seedKey: routerSeed?.key ?? null,
              onClose: () => void 0,
              onResults: (response) => onRouterResults?.(response)
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto pt-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-2.5 text-left", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-2 grid items-center gap-2 md:grid-cols-[1fr_auto_1fr]", children: [
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-1 md:justify-start", children: AGENT_LENSES.map((lens) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => selectAgentLens(lens.id),
                  className: cn(
                    "rounded-full border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] transition-colors",
                    agentLens === lens.id ? "border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent-strong)]" : "border-transparent bg-transparent text-[var(--theme-muted)] hover:border-[var(--theme-border)] hover:bg-[var(--theme-card)] hover:text-[var(--theme-text)]"
                  ),
                  children: [
                    lens.label,
                    lens.id !== "all" && agentCounts[lens.id] ? ` ${agentCounts[lens.id]}` : ""
                  ]
                },
                lens.id
              )) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 justify-self-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSwarmCardMode("cards"),
                    className: cn("rounded-lg px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]", swarmCardMode === "cards" ? "bg-[var(--theme-accent)] text-primary-950" : "text-[var(--theme-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]"),
                    children: "Active Swarm"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSwarmCardMode("office"),
                    className: cn("rounded-lg px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]", swarmCardMode === "office" ? "bg-[var(--theme-accent)] text-primary-950" : "text-[var(--theme-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]"),
                    children: "Office"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: cn("flex items-center justify-center gap-1 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-1 justify-self-center md:justify-self-end", swarmCardMode === "office" && "opacity-40"), children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => cycleAgentPage(-1),
                    disabled: filteredAgents.length <= AGENT_PAGE_SIZE,
                    className: "inline-flex size-7 items-center justify-center rounded-lg text-[var(--theme-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)] disabled:cursor-not-allowed disabled:opacity-35",
                    "aria-label": "Previous agent page",
                    children: "←"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 px-1", "aria-label": `Agent page ${Math.min(agentPage + 1, agentPageCount)} of ${agentPageCount}`, children: Array.from({ length: Math.min(agentPageCount, 5) }).map((_, index) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: cn(
                      "size-1.5 rounded-full",
                      index === agentPage % 5 ? "bg-[var(--theme-accent)]" : "bg-[var(--theme-muted)]/30"
                    )
                  },
                  index
                )) }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => cycleAgentPage(1),
                    disabled: filteredAgents.length <= AGENT_PAGE_SIZE,
                    className: "inline-flex size-7 items-center justify-center rounded-lg text-[var(--theme-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)] disabled:cursor-not-allowed disabled:opacity-35",
                    "aria-label": "Next agent page",
                    children: "→"
                  }
                )
              ] })
            ] }),
            swarmCardMode === "office" ? /* @__PURE__ */ jsx("div", { className: "h-[360px] overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)]", children: /* @__PURE__ */ jsx(
              OfficeView,
              {
                agentRows: officeAgents,
                missionRunning: activeAgents.some((agent) => agent.state === "working" || agent.state === "reviewing"),
                onViewOutput: () => void 0,
                containerHeight: 360,
                hideHeader: true
              }
            ) }) : visibleAgents.length ? /* @__PURE__ */ jsx("div", { className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-4", children: visibleAgents.map((agent) => {
              const isBlocked = agent.state === "blocked";
              const isReview = agent.state === "reviewing";
              return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-2.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
                    /* @__PURE__ */ jsx(
                      PixelAvatar,
                      {
                        size: 30,
                        color: isBlocked ? "#ef4444" : isReview ? "#f59e0b" : "#34d399",
                        accentColor: isBlocked ? "#fecaca" : isReview ? "#fde68a" : "#bbf7d0",
                        status: isBlocked ? "failed" : isReview ? "thinking" : "running"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: cn("absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-[var(--theme-card)]", isBlocked ? "bg-red-500" : isReview ? "bg-amber-500" : "bg-emerald-500 animate-pulse") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsx("div", { className: "truncate text-[11px] font-semibold text-[var(--theme-text)]", children: agent.workerName }),
                      /* @__PURE__ */ jsx("div", { className: "shrink-0 text-[9px] text-[var(--theme-muted)]", children: agent.age })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "mt-0.5 truncate text-[9px] uppercase tracking-[0.12em] text-[var(--theme-muted)]", children: agent.state })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-2 line-clamp-3 text-[10px] leading-snug text-[var(--theme-muted-2)]", title: agent.task, children: agent.task }),
                /* @__PURE__ */ jsx("div", { className: "mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--theme-bg)]", children: /* @__PURE__ */ jsx("div", { className: cn("h-full rounded-full transition-all", isBlocked ? "bg-red-500" : isReview ? "bg-amber-500" : "bg-[var(--theme-accent)]"), style: { width: `${agent.progress}%` } }) })
              ] }, agent.workerId);
            }) }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-2 text-[11px] text-[var(--theme-muted)]", children: activeAgents.length ? `No ${AGENT_LENSES[lensIndex]?.label.toLowerCase() ?? "matching"} agents right now.` : "Dispatch a mission to see each worker appear here with progress." })
          ] }) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: anchorCallbackRef,
              "aria-hidden": "true",
              className: "pointer-events-none mt-3 h-px w-full",
              "data-swarm2-anchor": "orchestrator"
            }
          )
        ]
      }
    ),
    settingsOpen ? /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--theme-bg)_48%,transparent)] px-4 py-6 backdrop-blur-md",
        onClick: () => setSettingsOpen(false),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "w-full max-w-md rounded-3xl border border-[var(--theme-border2)] bg-[var(--theme-card)] p-6 shadow-[0_30px_100px_var(--theme-shadow)]",
            onClick: (event) => event.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex size-11 items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-accent)]", children: /* @__PURE__ */ jsx(
                    HugeiconsIcon,
                    {
                      icon: Settings01Icon,
                      size: 20,
                      strokeWidth: 1.8
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-[var(--theme-text)]", children: "Orchestrator Settings" }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--theme-muted-2)]", children: "Update the display name for the hub." })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSettingsOpen(false),
                    className: "inline-flex size-10 items-center justify-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]",
                    "aria-label": "Close orchestrator settings",
                    children: /* @__PURE__ */ jsx(
                      HugeiconsIcon,
                      {
                        icon: Cancel01Icon,
                        size: 18,
                        strokeWidth: 1.8
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "mt-6 block space-y-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[var(--theme-text)]", children: "Display name" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    value: draftName,
                    onChange: (event) => setDraftName(event.target.value),
                    placeholder: DEFAULT_NAME,
                    className: "w-full rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3 text-sm text-[var(--theme-text)] outline-none focus:border-[var(--theme-accent)]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-end gap-3", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "secondary",
                    onClick: () => setSettingsOpen(false),
                    children: "Close"
                  }
                ),
                /* @__PURE__ */ jsx(Button, { type: "button", onClick: saveSettings, children: "Save" })
              ] })
            ]
          }
        )
      }
    ) : null
  ] });
}
const EMPTY_GEOM = {
  width: 0,
  height: 0,
  origin: null,
  endpoints: /* @__PURE__ */ new Map()
};
function computeGeom(container, anchor, refs, workers) {
  const containerRect = container.getBoundingClientRect();
  const width = containerRect.width;
  const height = containerRect.height;
  const origin = anchor ? (() => {
    const r = anchor.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - containerRect.left,
      y: r.top + r.height / 2 - containerRect.top
    };
  })() : null;
  const endpoints = /* @__PURE__ */ new Map();
  for (const worker of workers) {
    const el = refs.get(worker.id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    endpoints.set(worker.id, {
      x: r.left + r.width / 2 - containerRect.left,
      y: r.top - containerRect.top + 6
    });
  }
  return { width, height, origin, endpoints };
}
function Swarm2Wires({
  containerRef,
  anchorRef,
  workerRefs,
  workers
}) {
  const [geom, setGeom] = useState(EMPTY_GEOM);
  const rafRef = useRef(null);
  const schedule = () => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const c = containerRef.current;
      if (!c) {
        setGeom(EMPTY_GEOM);
        return;
      }
      setGeom(computeGeom(c, anchorRef.current, workerRefs, workers));
    });
  };
  useLayoutEffect(() => {
    schedule();
  }, [workers.length]);
  useEffect(() => {
    schedule();
    const c = containerRef.current;
    if (!c) return void 0;
    const ro = new ResizeObserver(() => schedule());
    ro.observe(c);
    workerRefs.forEach((el) => ro.observe(el));
    if (anchorRef.current) ro.observe(anchorRef.current);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [workers.length]);
  if (geom.width === 0 || !geom.origin) return null;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      className: "pointer-events-none absolute inset-0 z-[2]",
      width: geom.width,
      height: geom.height,
      viewBox: `0 0 ${geom.width} ${geom.height}`,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: "swarm2-wire", x1: "0", x2: "0", y1: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "rgba(251,191,36,0.62)" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "rgba(52,211,153,0.32)" })
          ] }),
          /* @__PURE__ */ jsxs("linearGradient", { id: "swarm2-hot-wire", x1: "0", x2: "0", y1: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "rgba(251,191,36,0.98)" }),
            /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "rgba(245,158,11,0.82)" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "rgba(52,211,153,0.52)" })
          ] }),
          /* @__PURE__ */ jsx("style", { children: `
          @keyframes swarm2-flow {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -24; }
          }
          .swarm2-wire-hot {
            animation: swarm2-flow 1.6s linear infinite;
          }
        ` })
        ] }),
        workers.map((worker) => {
          const end = geom.endpoints.get(worker.id);
          if (!end || !geom.origin) return null;
          const isHot = worker.selected || worker.inRoom;
          const dx = end.x - geom.origin.x;
          const dy = end.y - geom.origin.y;
          const cx1 = geom.origin.x + dx * 0.15;
          const cy1 = geom.origin.y + Math.max(40, dy * 0.45);
          const cx2 = end.x - dx * 0.15;
          const cy2 = end.y - Math.max(30, dy * 0.35);
          const path = `M ${geom.origin.x} ${geom.origin.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`;
          return /* @__PURE__ */ jsxs("g", { children: [
            /* @__PURE__ */ jsx(
              "path",
              {
                d: path,
                fill: "none",
                stroke: "url(#swarm2-wire)",
                strokeWidth: isHot ? 2.2 : 1.5,
                strokeLinecap: "round",
                strokeDasharray: isHot ? void 0 : "5 10",
                opacity: isHot ? 0.82 : 0.64
              }
            ),
            isHot ? /* @__PURE__ */ jsx(
              "path",
              {
                d: path,
                fill: "none",
                stroke: "url(#swarm2-hot-wire)",
                strokeWidth: 1.9,
                strokeLinecap: "round",
                strokeDasharray: "6 14",
                className: "swarm2-wire-hot",
                opacity: 1
              }
            ) : null
          ] }, worker.id);
        })
      ]
    }
  );
}
function relativeTime$1(ts) {
  if (!ts) return "just now";
  const diff = Date.now() - ts;
  if (diff < 6e4) return `${Math.max(1, Math.floor(diff / 1e3))}s ago`;
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
function stripLogPrefix(line) {
  return line.replace(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}[^ ]*\s+/, "").replace(/^\[[^\]]+\]\s*/, "").trim();
}
function buildRows(members, runtime) {
  const rows = [];
  for (const member of members) {
    const entry = runtime.get(member.id);
    if (entry?.recentLogTail) {
      const lines = entry.recentLogTail.split("\n").map(stripLogPrefix).filter(Boolean);
      const last = lines[lines.length - 1];
      if (last) {
        rows.push({
          id: `${member.id}-tail`,
          workerId: member.id,
          workerName: member.displayName || member.id,
          text: last,
          ts: entry.lastOutputAt ?? entry.lastSessionStartedAt ?? null,
          kind: "tail"
        });
        continue;
      }
    }
    if (entry?.currentTask) {
      rows.push({
        id: `${member.id}-task`,
        workerId: member.id,
        workerName: member.displayName || member.id,
        text: entry.currentTask,
        ts: entry.lastOutputAt ?? null,
        kind: "task"
      });
      continue;
    }
    if (member.lastSessionTitle) {
      rows.push({
        id: `${member.id}-session`,
        workerId: member.id,
        workerName: member.displayName || member.id,
        text: member.lastSessionTitle,
        ts: member.lastSessionAt,
        kind: "session"
      });
    }
  }
  rows.sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
  return rows;
}
function Swarm2ActivityFeed({
  members,
  runtimeByWorker,
  selectedId,
  onSelect,
  limit = 8
}) {
  const rows = useMemo(
    () => buildRows(members, runtimeByWorker).slice(0, limit),
    [members, runtimeByWorker, limit]
  );
  if (rows.length === 0) {
    return /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-5 shadow-[0_18px_60px_color-mix(in_srgb,var(--theme-shadow)_12%,transparent)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-[var(--theme-text)]", children: [
        /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Activity01Icon, size: 14 }),
        "Recent swarm activity"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-[var(--theme-muted)]", children: "No worker output captured yet. Once swarm TUIs emit logs they will show up here, ordered by latest event." })
    ] });
  }
  return /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-5 shadow-[0_18px_60px_color-mix(in_srgb,var(--theme-shadow)_12%,transparent)]", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "flex size-7 items-center justify-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-accent)]", children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Activity01Icon, size: 13 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-[var(--theme-text)]", children: "Recent swarm activity" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[var(--theme-muted-2)]", children: "Latest signals across all wired workers" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-[10px] uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: [
        rows.length,
        " entries"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: rows.map((row) => {
      const isSelected = row.workerId === selectedId;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelect(row.workerId),
          className: cn(
            "flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-colors",
            isSelected ? "border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]" : "border-[var(--theme-border)] bg-[var(--theme-bg)] hover:bg-[var(--theme-card2)]"
          ),
          children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: row.workerName }),
            /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-xs text-[var(--theme-text)]", children: row.text }),
            /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[10px] text-[var(--theme-muted)]", children: relativeTime$1(row.ts) })
          ]
        },
        row.id
      );
    }) })
  ] });
}
function isLoopbackDashboardUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return ["127.0.0.1", "localhost", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}
function getKanbanBackendPresentation(backend) {
  if (!backend) {
    return {
      badgeLabel: "Detecting board",
      badgeTone: "unknown",
      toastTitle: "Detecting Swarm Board backend",
      toastBody: "Checking Hermes Kanban before falling back locally.",
      title: void 0
    };
  }
  if (backend.id === "hermes-proxy" && backend.detected) {
    const dashboardUrl = typeof backend.path === "string" && backend.path.startsWith("http") && !isLoopbackDashboardUrl(backend.path) ? `${backend.path.replace(/\/+$/, "")}/kanban` : void 0;
    return {
      badgeLabel: "Synced • Hermes",
      badgeTone: "hermes-proxy",
      toastTitle: "Synced with Hermes Dashboard",
      toastBody: "Cards and status changes round-trip through the Hermes Dashboard kanban plugin. Single source of truth, dispatcher-aware.",
      title: backend.details ?? backend.path ?? "Hermes Dashboard kanban plugin detected",
      dashboardUrl
    };
  }
  if (backend.id === "claude" && backend.detected) {
    return {
      badgeLabel: "Shared board",
      badgeTone: "claude",
      toastTitle: "Board connected",
      toastBody: "Cards and status changes are using the canonical Kanban store.",
      title: backend.details ?? backend.path ?? "Canonical Kanban store detected"
    };
  }
  return {
    badgeLabel: "Local fallback",
    badgeTone: "local",
    toastTitle: "Using local Swarm Board",
    toastBody: backend.details || "Hermes Kanban is not available yet. Cards stay local and the board will switch automatically when Hermes storage is detected.",
    title: backend.details ?? backend.path ?? "Local Swarm Board fallback"
  };
}
const LANES = [
  { id: "backlog", label: "Backlog", hint: "Captured, not committed" },
  { id: "ready", label: "Ready", hint: "Spec clear, safe to dispatch" },
  { id: "running", label: "Running", hint: "Worker executing" },
  { id: "review", label: "Review", hint: "Needs peer/human check" },
  { id: "blocked", label: "Blocked", hint: "Needs input or dependency" },
  { id: "done", label: "Done", hint: "Accepted / archived" }
];
const LANE_TONE = {
  backlog: "border-slate-400/40 bg-slate-500/10 text-slate-700",
  ready: "border-blue-400/40 bg-blue-500/10 text-blue-700",
  running: "border-emerald-400/40 bg-emerald-500/10 text-emerald-700",
  review: "border-violet-400/40 bg-violet-500/10 text-violet-700",
  blocked: "border-red-400/40 bg-red-500/10 text-red-700",
  done: "border-green-400/40 bg-green-500/10 text-green-700"
};
async function fetchKanbanCards() {
  const res = await fetch("/api/swarm-kanban");
  if (!res.ok) throw new Error(`Kanban request failed: ${res.status}`);
  const data = await res.json();
  return {
    cards: Array.isArray(data.cards) ? data.cards : [],
    backend: data.backend ?? null
  };
}
async function createKanbanCard(input) {
  const res = await fetch("/api/swarm-kanban", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) throw new Error(data?.error || `Kanban create failed: ${res.status}`);
  return data.card;
}
async function updateKanbanCard(id, updates) {
  const res = await fetch("/api/swarm-kanban", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) throw new Error(data?.error || `Kanban update failed: ${res.status}`);
  return data.card;
}
function splitCriteria(value) {
  return value.split("\n").map((line) => line.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
}
function splitTags(value) {
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}
const LABEL_COLORS = [
  "border-sky-400/50 bg-sky-500/10 text-sky-700",
  "border-violet-400/50 bg-violet-500/10 text-violet-700",
  "border-emerald-400/50 bg-emerald-500/10 text-emerald-700",
  "border-amber-400/50 bg-amber-500/10 text-amber-700",
  "border-rose-400/50 bg-rose-500/10 text-rose-700",
  "border-cyan-400/50 bg-cyan-500/10 text-cyan-700"
];
function labelColor(tier1) {
  let hash = 0;
  for (const char of tier1) hash = hash * 31 + char.charCodeAt(0) >>> 0;
  return LABEL_COLORS[hash % LABEL_COLORS.length] ?? LABEL_COLORS[0];
}
function parseTaskLabel(tag) {
  const raw = tag.trim();
  if (!raw.toLowerCase().startsWith("label:")) return null;
  const body = raw.slice("label:".length).trim();
  if (!body) return null;
  const [tier1, ...rest] = body.split("/").map((part) => part.trim()).filter(Boolean);
  if (!tier1) return null;
  return { tier1, tier2: rest.join(" / ") || void 0, color: labelColor(tier1) };
}
function formatElapsedSince(timestamp) {
  const ageMs = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(ageMs / 6e4);
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}
function workerLabel(workers, workerId) {
  if (!workerId) return "Unassigned";
  const worker = workers.find((item) => item.id === workerId);
  return worker?.displayName || workerId;
}
function Swarm2KanbanBoard({
  workers,
  latestMission,
  selectedWorkerId,
  onSelectWorker,
  onOpenRouter,
  className
}) {
  const queryClient = useQueryClient();
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSpec, setDraftSpec] = useState("");
  const [draftCriteria, setDraftCriteria] = useState("");
  const [draftWorker, setDraftWorker] = useState(selectedWorkerId ?? "");
  const [draftReviewer, setDraftReviewer] = useState("");
  const [draftStatus, setDraftStatus] = useState("backlog");
  const [draftLabels, setDraftLabels] = useState("");
  const [activeLabelFilter, setActiveLabelFilter] = useState(null);
  const [linkLatestMission, setLinkLatestMission] = useState(Boolean(latestMission));
  const [backendToast, setBackendToast] = useState(null);
  const lastToastedBackendKey = useRef(null);
  const query = useQuery({
    queryKey: ["swarm2", "kanban"],
    queryFn: fetchKanbanCards,
    refetchInterval: 5e3,
    staleTime: 2e3
  });
  const backend = query.data?.backend ?? null;
  const backendPresentation = useMemo(() => getKanbanBackendPresentation(backend), [backend]);
  useEffect(() => {
    if (!backend) return;
    const backendKey = `${backend.id}:${backend.detected ? "detected" : "fallback"}:${backend.path ?? ""}`;
    if (lastToastedBackendKey.current === backendKey) return;
    lastToastedBackendKey.current = backendKey;
    const storageKey = "swarm2-kanban-backend-toast";
    if (typeof window !== "undefined") {
      const lastSessionToast = window.sessionStorage.getItem(storageKey);
      if (lastSessionToast === backendKey) return;
      window.sessionStorage.setItem(storageKey, backendKey);
    }
    const nextToast = getKanbanBackendPresentation(backend);
    setBackendToast(nextToast);
    const timeout = window.setTimeout(() => setBackendToast(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [backend]);
  const createMutation = useMutation({
    mutationFn: () => createKanbanCard({
      title: draftTitle.trim(),
      spec: draftSpec.trim(),
      acceptanceCriteria: splitCriteria(draftCriteria),
      assignedWorker: draftWorker || null,
      reviewer: draftReviewer || null,
      status: draftStatus,
      missionId: linkLatestMission ? latestMission?.id ?? null : null,
      tags: splitTags(draftLabels)
    }),
    onSuccess: async () => {
      setDraftTitle("");
      setDraftSpec("");
      setDraftCriteria("");
      setDraftWorker(selectedWorkerId ?? "");
      setDraftReviewer("");
      setDraftStatus("backlog");
      setDraftLabels("");
      setComposerOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["swarm2", "kanban"] });
    }
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateKanbanCard(id, updates),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["swarm2", "kanban"] });
    }
  });
  const labelOptions = useMemo(() => {
    const labels = /* @__PURE__ */ new Map();
    for (const card of query.data?.cards ?? []) {
      for (const tag of card.tags ?? []) {
        const parsed = parseTaskLabel(tag);
        if (parsed) labels.set(`${parsed.tier1}${parsed.tier2 ? `/${parsed.tier2}` : ""}`, parsed);
      }
    }
    return [...labels.entries()].map(([key, label]) => ({ key, label }));
  }, [query.data]);
  const visibleCards = useMemo(() => {
    const cards = query.data?.cards ?? [];
    if (!activeLabelFilter) return cards;
    return cards.filter(
      (card) => (card.tags ?? []).some((tag) => {
        const parsed = parseTaskLabel(tag);
        const key = parsed ? `${parsed.tier1}${parsed.tier2 ? `/${parsed.tier2}` : ""}` : "";
        return key === activeLabelFilter || parsed?.tier1 === activeLabelFilter;
      })
    );
  }, [activeLabelFilter, query.data]);
  const cardsByLane = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const lane of LANES) map.set(lane.id, []);
    for (const card of visibleCards) {
      const bucket = map.get(card.status) ?? map.get("backlog");
      bucket.push(card);
    }
    return map;
  }, [visibleCards]);
  const total = query.data?.cards.length ?? 0;
  const reviewCount = cardsByLane.get("review")?.length ?? 0;
  const blockedCount = cardsByLane.get("blocked")?.length ?? 0;
  return /* @__PURE__ */ jsxs("section", { className: cn("rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 shadow-[0_24px_80px_var(--theme-shadow)]", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: "Manual planning" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-semibold text-[var(--theme-text)]", children: "Swarm Board" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-3xl text-xs leading-relaxed text-[var(--theme-muted-2)]", children: "Auto-detects the shared Kanban store by default; if it is unavailable, cards stay in a local fallback. Dispatch stays explicit through Router." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs text-[var(--theme-muted)]", children: [
        /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2 py-1", children: [
          total,
          " cards"
        ] }),
        backendPresentation.dashboardUrl ? /* @__PURE__ */ jsxs(
          "a",
          {
            href: backendPresentation.dashboardUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-medium transition-colors",
              "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
            ),
            title: `${backendPresentation.title ?? ""}
Open in Hermes Dashboard ↗`,
            "aria-live": "polite",
            children: [
              /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }),
              backendPresentation.badgeLabel,
              /* @__PURE__ */ jsx("span", { className: "opacity-60", "aria-hidden": "true", children: "↗" })
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          "span",
          {
            className: cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-medium",
              backendPresentation.badgeTone === "hermes-proxy" ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-700" : backendPresentation.badgeTone === "claude" ? "border-violet-400/40 bg-violet-500/10 text-violet-700" : backendPresentation.badgeTone === "local" ? "border-amber-400/40 bg-amber-500/10 text-amber-700" : "border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-muted)]"
            ),
            title: backendPresentation.title,
            "aria-live": "polite",
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "h-1.5 w-1.5 rounded-full",
                    backendPresentation.badgeTone === "hermes-proxy" ? "bg-emerald-500" : backendPresentation.badgeTone === "claude" ? "bg-violet-500" : backendPresentation.badgeTone === "local" ? "bg-amber-500" : "bg-[var(--theme-muted)]"
                  )
                }
              ),
              backendPresentation.badgeLabel
            ]
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2 py-1", children: [
          reviewCount,
          " review"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2 py-1", children: [
          blockedCount,
          " blocked"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setDraftWorker(selectedWorkerId ?? "");
              setLinkLatestMission(Boolean(latestMission));
              setComposerOpen((open) => !open);
            },
            className: "rounded-full bg-[var(--theme-accent)] px-3 py-1.5 font-semibold text-primary-950 hover:bg-[var(--theme-accent-strong)]",
            children: "New card"
          }
        )
      ] })
    ] }),
    labelOptions.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setActiveLabelFilter(null),
          className: cn(
            "rounded-full border px-2.5 py-1 font-semibold transition-colors",
            !activeLabelFilter ? "border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent-strong)]" : "border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-muted)] hover:text-[var(--theme-text)]"
          ),
          children: "All labels"
        }
      ),
      labelOptions.map(({ key, label }) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveLabelFilter(key),
          className: cn(
            "rounded-full border px-2.5 py-1 font-semibold transition-colors",
            label.color,
            activeLabelFilter === key ? "ring-2 ring-[var(--theme-accent)]" : ""
          ),
          title: label.tier2 ? `${label.tier1} → ${label.tier2}` : label.tier1,
          children: [
            label.tier1,
            label.tier2 ? /* @__PURE__ */ jsxs("span", { className: "ml-1 opacity-70", children: [
              "/",
              label.tier2
            ] }) : null
          ]
        },
        key
      ))
    ] }) : null,
    backendToast ? /* @__PURE__ */ jsx("div", { className: "fixed right-4 top-4 z-50 max-w-sm rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-3 text-sm text-[var(--theme-text)] shadow-[0_18px_60px_var(--theme-shadow)]", role: "status", "aria-live": "polite", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: cn(
        "mt-1 h-2 w-2 shrink-0 rounded-full",
        backendToast.badgeTone === "claude" ? "bg-violet-500" : backendToast.badgeTone === "local" ? "bg-amber-500" : "bg-[var(--theme-muted)]"
      ) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-semibold", children: backendToast.toastTitle }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs leading-relaxed text-[var(--theme-muted-2)]", children: backendToast.toastBody })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setBackendToast(null), className: "ml-1 rounded-full px-1.5 text-[var(--theme-muted)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]", "aria-label": "Dismiss backend notice", children: "×" })
    ] }) }) : null,
    composerOpen ? /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[var(--theme-border2)] bg-[var(--theme-card)] p-5 shadow-[0_30px_100px_var(--theme-shadow)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: "Manual planning" }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1 text-lg font-semibold text-[var(--theme-text)]", children: "New board card" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: "Spec work before routing it to an agent. Dispatch stays explicit through Router." })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setComposerOpen(false), className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-1.5 text-sm text-[var(--theme-muted)] hover:text-[var(--theme-text)]", children: "Close" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-xs md:col-span-2", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block font-semibold text-[var(--theme-muted)]", children: "Title" }),
          /* @__PURE__ */ jsx("input", { value: draftTitle, onChange: (event) => setDraftTitle(event.target.value), placeholder: "e.g. Review board UX safety", className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-sm text-[var(--theme-text)] outline-none" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-xs md:col-span-2", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block font-semibold text-[var(--theme-muted)]", children: "Spec" }),
          /* @__PURE__ */ jsx("textarea", { value: draftSpec, onChange: (event) => setDraftSpec(event.target.value), rows: 4, placeholder: "Short task spec / context", className: "w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-sm text-[var(--theme-text)] outline-none" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-xs md:col-span-2", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block font-semibold text-[var(--theme-muted)]", children: "Acceptance criteria" }),
          /* @__PURE__ */ jsx("textarea", { value: draftCriteria, onChange: (event) => setDraftCriteria(event.target.value), rows: 3, placeholder: "One per line", className: "w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-sm text-[var(--theme-text)] outline-none" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block font-semibold text-[var(--theme-muted)]", children: "Assigned worker" }),
          /* @__PURE__ */ jsxs("select", { value: draftWorker, onChange: (event) => setDraftWorker(event.target.value), className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-sm text-[var(--theme-text)] outline-none", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Unassigned" }),
            workers.map((worker) => /* @__PURE__ */ jsx("option", { value: worker.id, children: worker.displayName || worker.id }, worker.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block font-semibold text-[var(--theme-muted)]", children: "Reviewer" }),
          /* @__PURE__ */ jsxs("select", { value: draftReviewer, onChange: (event) => setDraftReviewer(event.target.value), className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-sm text-[var(--theme-text)] outline-none", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Unassigned" }),
            workers.map((worker) => /* @__PURE__ */ jsx("option", { value: worker.id, children: worker.displayName || worker.id }, worker.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block font-semibold text-[var(--theme-muted)]", children: "Status" }),
          /* @__PURE__ */ jsx("select", { value: draftStatus, onChange: (event) => setDraftStatus(event.target.value), className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-sm text-[var(--theme-text)] outline-none", children: LANES.map((lane) => /* @__PURE__ */ jsx("option", { value: lane.id, children: lane.label }, lane.id)) })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-xs md:col-span-2", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block font-semibold text-[var(--theme-muted)]", children: "Labels" }),
          /* @__PURE__ */ jsx("input", { value: draftLabels, onChange: (event) => setDraftLabels(event.target.value), placeholder: "label:Hermes/Workspace, priority:high", className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-sm text-[var(--theme-text)] outline-none" }),
          /* @__PURE__ */ jsx("span", { className: "mt-1 block text-[10px] text-[var(--theme-muted)]", children: "Use label:Business/Sub-scope for the two-tier board filter." })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 self-end rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-xs text-[var(--theme-muted)]", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: linkLatestMission, disabled: !latestMission, onChange: (event) => setLinkLatestMission(event.target.checked) }),
          "Link latest mission",
          latestMission ? `: ${latestMission.title}` : ""
        ] }),
        createMutation.error ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-700 md:col-span-2", children: createMutation.error.message }) : null,
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 md:col-span-2", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setComposerOpen(false), className: "rounded-xl border border-[var(--theme-border)] px-3 py-2 text-xs font-semibold text-[var(--theme-muted)] hover:bg-[var(--theme-card2)]", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "button", disabled: !draftTitle.trim() || createMutation.isPending, onClick: () => void createMutation.mutateAsync(), className: "rounded-xl bg-[var(--theme-accent)] px-3 py-2 text-xs font-semibold text-primary-950 disabled:opacity-50", children: createMutation.isPending ? "Saving…" : "Create card" })
        ] })
      ] })
    ] }) }) : null,
    query.isError ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-700", children: [
      "Kanban failed to load: ",
      query.error.message
    ] }) : query.isPending ? /* @__PURE__ */ jsx("div", { className: "mb-3 rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3 text-sm text-[var(--theme-muted)]", children: "Loading board cards and backend source…" }) : null,
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 xl:grid-cols-3 2xl:grid-cols-6", children: LANES.map((lane) => {
      const laneCards = cardsByLane.get(lane.id) ?? [];
      return /* @__PURE__ */ jsxs("div", { className: "min-h-64 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-2", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-2 flex items-center justify-between gap-2 px-1", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]", LANE_TONE[lane.id]), children: lane.label }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[var(--theme-muted)]", children: laneCards.length })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-[10px] text-[var(--theme-muted)]", children: lane.hint })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: query.isPending ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-[var(--theme-border)] p-3 text-xs text-[var(--theme-muted)]", children: "Waiting for source…" }) : laneCards.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-[var(--theme-border)] p-3 text-xs text-[var(--theme-muted)]", children: "Empty" }) : laneCards.map((card) => /* @__PURE__ */ jsxs("article", { className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-3 text-left shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold leading-snug text-[var(--theme-text)]", children: card.title }),
          card.spec ? /* @__PURE__ */ jsx("p", { className: "mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--theme-muted-2)]", children: card.spec }) : null,
          card.acceptanceCriteria.length ? /* @__PURE__ */ jsxs("ul", { className: "mt-2 space-y-1 text-[11px] text-[var(--theme-muted)]", children: [
            card.acceptanceCriteria.slice(0, 3).map((item, index) => /* @__PURE__ */ jsxs("li", { children: [
              "✓ ",
              item
            ] }, `${card.id}-ac-${index}`)),
            card.acceptanceCriteria.length > 3 ? /* @__PURE__ */ jsxs("li", { children: [
              "+",
              card.acceptanceCriteria.length - 3,
              " more"
            ] }) : null
          ] }) : null,
          card.tags?.length ? /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: card.tags.slice(0, 4).map((tag) => {
            const parsed = parseTaskLabel(tag);
            return parsed ? /* @__PURE__ */ jsxs("span", { className: cn("rounded-full border px-1.5 py-0.5 text-[9px] font-semibold", parsed.color), children: [
              parsed.tier1,
              parsed.tier2 ? /* @__PURE__ */ jsxs("span", { className: "opacity-70", children: [
                "/",
                parsed.tier2
              ] }) : null
            ] }, tag) : /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[var(--theme-border)] px-1.5 py-0.5 text-[9px] text-[var(--theme-muted)]", children: tag }, tag);
          }) }) : null,
          card.status === "running" || card.latestRun ? /* @__PURE__ */ jsxs("div", { className: "mt-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-2 py-1.5 text-[10px] text-emerald-700", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: card.status === "running" ? `Running for ${formatElapsedSince(card.updatedAt)}` : "Latest run" }),
            card.latestRun?.summary ? /* @__PURE__ */ jsx("div", { className: "mt-0.5 line-clamp-2", children: card.latestRun.summary }) : null,
            card.latestRun && (card.latestRun.status || card.latestRun.outcome) ? /* @__PURE__ */ jsx("div", { className: "mt-0.5 opacity-75", children: [card.latestRun.status, card.latestRun.outcome].filter(Boolean).join(" · ") }) : null
          ] }) : null,
          /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1 text-[10px] text-[var(--theme-muted)]", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              "Owner: ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-[var(--theme-text)]", children: workerLabel(workers, card.assignedWorker) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              "Reviewer: ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-[var(--theme-text)]", children: workerLabel(workers, card.reviewer) })
            ] }),
            card.missionId ? /* @__PURE__ */ jsxs("div", { className: "truncate", title: card.missionId, children: [
              "Mission: ",
              card.missionId
            ] }) : null,
            card.reportPath ? /* @__PURE__ */ jsxs("div", { className: "truncate", title: card.reportPath, children: [
              "Report: ",
              card.reportPath
            ] }) : null
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-1.5", children: [
            card.assignedWorker ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onSelectWorker?.(card.assignedWorker), className: "rounded-full border border-[var(--theme-border)] px-2 py-1 text-[10px] font-semibold text-[var(--theme-muted)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]", children: "Open worker" }) : null,
            card.status !== "running" ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => updateMutation.mutate({ id: card.id, updates: { status: "running" } }), className: "rounded-full border border-[var(--theme-border)] px-2 py-1 text-[10px] font-semibold text-[var(--theme-muted)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]", children: "Run" }) : null,
            card.status !== "review" ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => updateMutation.mutate({ id: card.id, updates: { status: "review" } }), className: "rounded-full border border-[var(--theme-border)] px-2 py-1 text-[10px] font-semibold text-[var(--theme-muted)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]", children: "Review" }) : null,
            card.status !== "done" ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => updateMutation.mutate({ id: card.id, updates: { status: "done" } }), className: "rounded-full border border-[var(--theme-border)] px-2 py-1 text-[10px] font-semibold text-[var(--theme-muted)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]", children: "Done" }) : null,
            onOpenRouter ? /* @__PURE__ */ jsx("button", { type: "button", onClick: onOpenRouter, className: "rounded-full border border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--theme-accent-strong)]", children: "Router" }) : null
          ] })
        ] }, card.id)) })
      ] }, lane.id);
    }) })
  ] });
}
const STATE_FILTERS = [
  { id: "all", label: "All" },
  { id: "needs_review", label: "Needs review" },
  { id: "ready", label: "Ready" },
  { id: "blocked", label: "Blocked" },
  { id: "artifact", label: "Artifacts" },
  { id: "in_progress", label: "In progress" }
];
function clean(value, fallback = "—") {
  const text = value?.trim();
  return text ? text : fallback;
}
function compact(value, max = 180) {
  const text = clean(value, "");
  if (!text) return "No report body published yet.";
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
function splitChangedFiles(value) {
  return clean(value, "").split(/\n|,/).map((item) => item.trim()).filter(Boolean).slice(0, 12).map((path, index) => ({
    id: `changed-${index}-${path}`,
    kind: "diff",
    label: path.split("/").filter(Boolean).pop() ?? path,
    path,
    source: "inferred"
  }));
}
function stateForAssignment(assignment) {
  const checkpoint = assignment.checkpoint;
  const statusText = `${assignment.state ?? ""} ${checkpoint?.stateLabel ?? ""} ${checkpoint?.checkpointStatus ?? ""}`.toLowerCase();
  if (statusText.includes("blocked") || statusText.includes("needs_input") || checkpoint?.blocker && checkpoint.blocker !== "none") {
    return "blocked";
  }
  if (assignment.reviewRequired && ["checkpointed", "reviewing"].includes(assignment.state ?? "")) return "needs_review";
  if (["done", "complete"].includes(assignment.state ?? "") || statusText.includes("handoff") || statusText.includes("done")) return "ready";
  return "in_progress";
}
function stateForRuntime(entry) {
  const statusText = `${entry.checkpointStatus ?? ""} ${entry.currentTask ?? ""}`.toLowerCase();
  if (entry.blockedReason || entry.needsHuman || statusText.includes("blocked") || statusText.includes("needs_input")) return "blocked";
  if (statusText.includes("review")) return "needs_review";
  if (statusText.includes("done") || statusText.includes("handoff") || entry.lastResult || entry.lastRealResult) return "ready";
  if ((entry.artifacts?.length ?? 0) > 0 || (entry.previews?.length ?? 0) > 0) return "artifact";
  return "in_progress";
}
function stateLabel(state) {
  switch (state) {
    case "needs_review":
      return "Needs review";
    case "ready":
      return "Ready";
    case "blocked":
      return "Blocked";
    case "artifact":
      return "Artifact";
    case "in_progress":
      return "In progress";
  }
}
function buildSwarm2ReportRows({
  missions,
  runtimes
}) {
  const runtimeByWorker = new Map(runtimes.map((entry) => [entry.workerId, entry]));
  const rows = [];
  for (const mission of missions) {
    for (const assignment of mission.assignments ?? []) {
      const workerId = clean(assignment.workerId, "unknown");
      const runtime = runtimeByWorker.get(workerId);
      const checkpoint = assignment.checkpoint;
      if (!checkpoint && !assignment.state) continue;
      const state = stateForAssignment(assignment);
      const inferredArtifacts = splitChangedFiles(checkpoint?.filesChanged);
      rows.push({
        id: `mission:${mission.id}:${assignment.id ?? workerId}:${assignment.state ?? "unknown"}`,
        kind: "checkpoint",
        title: clean(assignment.task, mission.title),
        missionId: mission.id,
        missionTitle: mission.title,
        assignmentId: assignment.id ?? null,
        workerId,
        workerName: runtime?.displayName || workerId,
        state,
        stateLabel: stateLabel(state),
        updatedAt: assignment.completedAt ?? mission.updatedAt ?? runtime?.lastOutputAt ?? null,
        summary: compact(checkpoint?.result ?? checkpoint?.blocker ?? checkpoint?.nextAction ?? assignment.task),
        checkpointStatus: checkpoint?.checkpointStatus ?? checkpoint?.stateLabel ?? null,
        blocker: checkpoint?.blocker ?? null,
        nextAction: checkpoint?.nextAction ?? null,
        reviewRequired: assignment.reviewRequired === true,
        reviewedAt: assignment.reviewedAt ?? null,
        reviewedBy: assignment.reviewedBy ?? null,
        details: [
          { label: "Task", value: clean(assignment.task) },
          { label: "Result", value: clean(checkpoint?.result) },
          { label: "Files changed", value: clean(checkpoint?.filesChanged) },
          { label: "Commands run", value: clean(checkpoint?.commandsRun) },
          { label: "Blocker", value: clean(checkpoint?.blocker) },
          { label: "Next action", value: clean(checkpoint?.nextAction) },
          { label: "Checkpoint", value: clean(checkpoint?.checkpointStatus ?? checkpoint?.stateLabel) },
          { label: "Reviewer", value: clean(assignment.reviewedBy) }
        ],
        artifacts: inferredArtifacts.length ? inferredArtifacts : runtime?.artifacts ?? [],
        previews: runtime?.previews ?? []
      });
    }
  }
  for (const runtime of runtimes) {
    const hasRuntimeOutput = Boolean(
      clean(runtime.lastSummary, "") || clean(runtime.lastResult, "") || clean(runtime.blockedReason, "") || clean(runtime.lastRealSummary, "") || clean(runtime.lastRealResult, "") || (runtime.artifacts?.length ?? 0) > 0 || (runtime.previews?.length ?? 0) > 0
    );
    if (!hasRuntimeOutput) continue;
    const state = stateForRuntime(runtime);
    rows.push({
      id: `runtime:${runtime.workerId}:${runtime.lastOutputAt ?? runtime.lastSessionStartedAt ?? "latest"}`,
      kind: (runtime.artifacts?.length ?? 0) > 0 || (runtime.previews?.length ?? 0) > 0 ? "artifact" : "runtime",
      title: clean(runtime.currentTask ?? runtime.lastRealSummary ?? runtime.lastSummary ?? runtime.lastRealResult ?? runtime.lastResult, "Runtime output"),
      missionId: null,
      missionTitle: null,
      assignmentId: null,
      workerId: runtime.workerId,
      workerName: runtime.displayName || runtime.workerId,
      state,
      stateLabel: stateLabel(state),
      updatedAt: runtime.lastOutputAt ?? runtime.lastSessionStartedAt ?? null,
      summary: compact(runtime.blockedReason ?? runtime.lastRealResult ?? runtime.lastResult ?? runtime.lastRealSummary ?? runtime.lastSummary ?? runtime.currentTask),
      checkpointStatus: runtime.checkpointStatus ?? null,
      blocker: runtime.blockedReason ?? null,
      nextAction: null,
      reviewRequired: false,
      reviewedAt: null,
      reviewedBy: null,
      details: [
        { label: "Current task", value: clean(runtime.currentTask) },
        { label: "Summary", value: clean(runtime.lastSummary) },
        { label: "Real summary", value: clean(runtime.lastRealSummary) },
        { label: "Result", value: clean(runtime.lastResult) },
        { label: "Real result", value: clean(runtime.lastRealResult) },
        { label: "Blocked reason", value: clean(runtime.blockedReason) },
        { label: "Checkpoint status", value: clean(runtime.checkpointStatus) },
        { label: "Recent log tail", value: compact(runtime.recentLogTail, 900) }
      ],
      artifacts: runtime.artifacts ?? [],
      previews: runtime.previews ?? []
    });
  }
  return rows.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0) || a.workerId.localeCompare(b.workerId));
}
function buildSwarm2InboxLanes({
  missions,
  runtimes
}) {
  const rows = buildSwarm2ReportRows({ missions, runtimes });
  const actionable = rows.filter((row) => {
    if (row.kind !== "checkpoint" || !row.missionId) return false;
    return row.state === "needs_review" || row.state === "blocked" || row.state === "ready";
  }).map((row) => ({ ...row, lane: row.state }));
  return {
    needs_review: actionable.filter((row) => row.lane === "needs_review"),
    blocked: actionable.filter((row) => row.lane === "blocked"),
    ready: actionable.filter((row) => row.lane === "ready")
  };
}
function formatAge(value) {
  if (!value) return "unknown age";
  const diff = Math.max(0, Date.now() - value);
  const minutes = Math.floor(diff / 6e4);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
function toneClass(state) {
  switch (state) {
    case "blocked":
      return "border-red-400/40 bg-red-500/10 text-red-700 dark:text-red-200";
    case "needs_review":
      return "border-amber-400/50 bg-amber-500/10 text-amber-700 dark:text-amber-200";
    case "ready":
      return "border-emerald-400/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200";
    case "artifact":
      return "border-[var(--theme-accent)]/40 bg-[var(--theme-accent-soft)] text-[var(--theme-accent-strong)]";
    case "in_progress":
      return "border-[var(--theme-border)] bg-[var(--theme-card2)] text-[var(--theme-muted)]";
  }
}
function statePriority(state) {
  switch (state) {
    case "blocked":
      return 0;
    case "needs_review":
      return 1;
    case "ready":
      return 2;
    case "artifact":
      return 3;
    case "in_progress":
      return 4;
  }
}
function colorForWorker(workerId) {
  const palette = ["#34d399", "#60a5fa", "#a78bfa", "#f59e0b", "#fb7185", "#22d3ee", "#84cc16", "#f472b6"];
  const number = Number.parseInt(workerId.replace(/\D/g, ""), 10);
  return Number.isFinite(number) && number > 0 ? palette[(number - 1) % palette.length] : palette[0];
}
function roleFromWorkerId(workerId) {
  const number = workerId.replace(/\D/g, "");
  switch (number) {
    case "4":
      return "Research";
    case "5":
    case "10":
      return "Builder";
    case "6":
    case "11":
      return "Reviewer";
    case "9":
      return "Lab";
    default:
      return "Worker";
  }
}
function buildWorkerReportCards(rows) {
  const grouped = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const existing = grouped.get(row.workerId);
    if (existing) existing.push(row);
    else grouped.set(row.workerId, [row]);
  }
  return [...grouped.entries()].map(([workerId, workerRows]) => {
    const sorted = [...workerRows].sort((a, b) => {
      const stateRank = statePriority(a.state) - statePriority(b.state);
      if (stateRank !== 0) return stateRank;
      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
    });
    const latest = sorted[0];
    return {
      workerId,
      workerName: latest.workerName,
      role: latest.missionTitle ?? roleFromWorkerId(workerId),
      state: latest.state,
      stateLabel: latest.stateLabel,
      latest,
      rows: sorted,
      reviewCount: workerRows.filter((row) => row.state === "needs_review").length,
      readyCount: workerRows.filter((row) => row.state === "ready").length,
      blockedCount: workerRows.filter((row) => row.state === "blocked").length,
      artifactCount: workerRows.reduce((sum, row) => sum + row.artifacts.length + row.previews.length, 0)
    };
  }).sort((a, b) => {
    const stateRank = statePriority(a.state) - statePriority(b.state);
    if (stateRank !== 0) return stateRank;
    return (b.latest.updatedAt ?? 0) - (a.latest.updatedAt ?? 0);
  });
}
function detailValue(row, label) {
  return row.details.find((detail) => detail.label === label)?.value ?? null;
}
function cleanDetail(value) {
  const text = value?.trim();
  return text && text !== "—" ? text : null;
}
function buildBlockedGuidanceTask(row, guidance) {
  return [
    guidance.trim(),
    "",
    `Prior blocker: ${cleanDetail(row.blocker) ?? "none"}`,
    `Latest next action: ${cleanDetail(row.nextAction) ?? "none"}`,
    "",
    "Resume: address the blocker and continue."
  ].join("\n");
}
function buildReviewerDispatchTask(row) {
  return `Review ${row.workerId} checkpoint at ${row.checkpointStatus ?? row.stateLabel}. Read the swarm6 review spec from the configured swarm-specs workspace. Verify, byte-check, return APPROVED/CHANGES_REQUESTED/BLOCKED.`;
}
function extractPullRequestUrl(row) {
  const sources = [
    row.summary,
    row.title,
    cleanDetail(detailValue(row, "Result")),
    cleanDetail(detailValue(row, "Real result")),
    cleanDetail(detailValue(row, "Summary")),
    cleanDetail(detailValue(row, "Real summary"))
  ].filter(Boolean);
  for (const source of sources) {
    const match = source.match(/https?:\/\/\S+\/pull\/\d+\S*/i);
    if (match) return match[0].replace(/[)>.,]+$/, "");
  }
  return null;
}
async function postSwarmDispatch(body, fetchImpl = fetch) {
  const res = await fetchImpl("/api/swarm-dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
}
async function markInboxItemReadyForEric(input, fetchImpl = fetch) {
  const res = await fetchImpl("/api/swarm-missions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "mark_ready_for_eric", ...input })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
}
function buildReplyPrefill(row) {
  return [
    `Worker: ${row.workerId}`,
    `Prior blocker: ${cleanDetail(row.blocker) ?? "none"}`,
    `Latest next action: ${cleanDetail(row.nextAction) ?? "none"}`,
    ""
  ].join("\n");
}
function Swarm2ReportsView({
  missions,
  runtimes,
  onSelectWorker,
  onOpenItem,
  onRouteToReviewer,
  onRefresh
}) {
  const [stateFilter, setStateFilter] = useState("all");
  const [layout, setLayout] = useState("cards");
  const [workerFilter, setWorkerFilter] = useState("all");
  const [missionFilter, setMissionFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyErrors, setReplyErrors] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);
  const rows = useMemo(() => buildSwarm2ReportRows({ missions, runtimes }), [missions, runtimes]);
  const inboxLanes = useMemo(() => buildSwarm2InboxLanes({ missions, runtimes }), [missions, runtimes]);
  const workers = useMemo(() => [...new Set(rows.map((row) => row.workerId))].sort(), [rows]);
  const missionOptions = useMemo(
    () => missions.map((mission) => ({ id: mission.id, label: mission.title || mission.id })),
    [missions]
  );
  const filteredRows = rows.filter((row) => {
    if (stateFilter !== "all" && row.state !== stateFilter) return false;
    if (workerFilter !== "all" && row.workerId !== workerFilter) return false;
    if (missionFilter !== "all" && row.missionId !== missionFilter) return false;
    return true;
  });
  const workerCards = useMemo(() => buildWorkerReportCards(filteredRows), [filteredRows]);
  const counts = rows.reduce(
    (acc, row) => {
      acc[row.state] += 1;
      return acc;
    },
    { needs_review: 0, ready: 0, blocked: 0, in_progress: 0, artifact: 0 }
  );
  function showToast(message) {
    setToastMessage(message);
  }
  async function refreshData() {
    await onRefresh?.();
  }
  async function sendGuidance(row) {
    const guidance = cleanDetail(replyDrafts[row.id]);
    if (!guidance) {
      setReplyErrors((current) => ({ ...current, [row.id]: "Add guidance before sending." }));
      return;
    }
    setBusyId(`reply:${row.id}`);
    setReplyErrors((current) => ({ ...current, [row.id]: null }));
    try {
      await postSwarmDispatch({
        assignments: [{ workerId: row.workerId, task: buildBlockedGuidanceTask(row, guidance) }]
      });
      await refreshData();
      setReplyDrafts((current) => ({ ...current, [row.id]: buildReplyPrefill(row) }));
      setExpandedId(null);
      showToast(`Sent to ${row.workerId}`);
    } catch (error) {
      setReplyErrors((current) => ({
        ...current,
        [row.id]: error instanceof Error ? error.message : "Failed to send guidance."
      }));
    } finally {
      setBusyId(null);
    }
  }
  async function routeToReviewer(row) {
    setBusyId(`review:${row.id}`);
    try {
      await postSwarmDispatch({
        assignments: [{ workerId: "swarm6", task: buildReviewerDispatchTask(row) }]
      });
      await refreshData();
      onRouteToReviewer?.(row);
      showToast(`Sent to swarm6 for ${row.workerId}`);
    } catch (error) {
      setReplyErrors((current) => ({
        ...current,
        [row.id]: error instanceof Error ? error.message : "Failed to route reviewer."
      }));
    } finally {
      setBusyId(null);
    }
  }
  async function markReady(row) {
    if (!row.missionId || !row.assignmentId) return;
    setBusyId(`ready:${row.id}`);
    try {
      await markInboxItemReadyForEric({ missionId: row.missionId, assignmentId: row.assignmentId });
      await refreshData();
      showToast(`Marked ${row.workerId} ready for Eric merge`);
    } catch (error) {
      setReplyErrors((current) => ({
        ...current,
        [row.id]: error instanceof Error ? error.message : "Failed to mark ready for Eric."
      }));
    } finally {
      setBusyId(null);
    }
  }
  function openReply(row) {
    const key = `reply:${row.id}`;
    setReplyDrafts((current) => ({
      ...current,
      [row.id]: current[row.id] ?? buildReplyPrefill(row)
    }));
    setReplyErrors((current) => ({ ...current, [row.id]: null }));
    setExpandedId(expandedId === key ? null : key);
  }
  function openWorker(row) {
    onOpenItem?.(row);
  }
  function renderReplyComposer(row) {
    const disabled = busyId === `reply:${row.id}`;
    return /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-3", children: [
      /* @__PURE__ */ jsxs("label", { className: "mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", htmlFor: `guidance-${row.id}`, children: [
        "Guidance for ",
        row.workerId
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: `guidance-${row.id}`,
          value: replyDrafts[row.id] ?? buildReplyPrefill(row),
          onChange: (event) => setReplyDrafts((current) => ({ ...current, [row.id]: event.target.value })),
          rows: 6,
          className: "w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-sm text-[var(--theme-text)] outline-none"
        }
      ),
      replyErrors[row.id] ? /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-red-600", children: replyErrors[row.id] }) : null,
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setExpandedId(null),
            className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-1.5 text-xs font-medium text-[var(--theme-muted)]",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            disabled,
            onClick: () => void sendGuidance(row),
            className: "rounded-lg bg-[var(--theme-accent)] px-3 py-1.5 text-xs font-semibold text-primary-950 disabled:cursor-not-allowed disabled:opacity-60",
            children: disabled ? "Sending…" : "Send guidance"
          }
        )
      ] })
    ] });
  }
  function renderRowActions(row, compact2 = false) {
    const prUrl = extractPullRequestUrl(row);
    const buttonClass = compact2 ? "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2 py-1 text-[10px] font-medium text-[var(--theme-text)] hover:border-[var(--theme-accent)]" : "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--theme-text)] hover:border-[var(--theme-accent)]";
    return /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap gap-1.5", children: [
      /* @__PURE__ */ jsx("button", { type: "button", "aria-label": `Open ${row.workerId} worker`, onClick: () => openWorker(row), className: buttonClass, children: "↗" }),
      row.state === "blocked" ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => openReply(row), className: buttonClass, children: "Guide worker" }) : null,
      row.state === "needs_review" ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => void routeToReviewer(row), className: cn(buttonClass, "border-amber-400/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15"), children: "Route to reviewer" }) : null,
      row.state === "ready" && prUrl ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("a", { href: prUrl, target: "_blank", rel: "noreferrer", className: cn(buttonClass, "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"), children: "Open PR" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => void markReady(row), className: cn(buttonClass, "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"), children: "Mark ready for Eric merge" })
      ] }) : null
    ] });
  }
  function renderInboxLane(lane, title, rowsForLane, emptyText) {
    const laneTone = toneClass(lane);
    return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-[var(--theme-text)]", children: title }),
        /* @__PURE__ */ jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]", laneTone), children: rowsForLane.length })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: rowsForLane.length ? rowsForLane.slice(0, 4).map((row) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "truncate text-xs font-semibold text-[var(--theme-text)]", children: row.title }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 text-[11px] text-[var(--theme-muted)]", children: [
              row.workerName,
              " · ",
              row.missionTitle ?? row.missionId
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "shrink-0 text-[10px] text-[var(--theme-muted)]", children: formatAge(row.updatedAt) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--theme-muted-2)]", children: row.summary }),
        renderRowActions(row, true),
        expandedId === `reply:${row.id}` ? renderReplyComposer(row) : null
      ] }, `lane:${lane}:${row.id}`)) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-4 text-xs text-[var(--theme-muted)]", children: emptyText }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("section", { className: "rounded-[1.5rem] border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 shadow-[0_20px_60px_color-mix(in_srgb,var(--theme-shadow)_14%,transparent)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: "Outputs / Reports" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-semibold text-[var(--theme-text)]", children: "Worker reports" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-3xl text-xs text-[var(--theme-muted-2)]", children: "Board for queues, Cards for worker-level scanning, List for dense detail." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-[0.12em] text-[var(--theme-muted)]", children: [
        /* @__PURE__ */ jsxs("span", { className: "rounded-xl border border-amber-400/40 bg-amber-500/10 px-2 py-1", children: [
          "Review ",
          counts.needs_review
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-2 py-1", children: [
          "Ready ",
          counts.ready
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "rounded-xl border border-red-400/40 bg-red-500/10 px-2 py-1", children: [
          "Blocked ",
          counts.blocked
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap gap-2", children: [
      STATE_FILTERS.map((filter) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setStateFilter(filter.id),
          className: cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            stateFilter === filter.id ? "border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent-strong)]" : "border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-muted)] hover:text-[var(--theme-text)]"
          ),
          children: filter.label
        },
        filter.id
      )),
      /* @__PURE__ */ jsxs("select", { value: workerFilter, onChange: (event) => setWorkerFilter(event.target.value), className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-1.5 text-xs text-[var(--theme-muted)] outline-none", children: [
        /* @__PURE__ */ jsx("option", { value: "all", children: "All workers" }),
        workers.map((worker) => /* @__PURE__ */ jsx("option", { value: worker, children: worker }, worker))
      ] }),
      /* @__PURE__ */ jsxs("select", { value: missionFilter, onChange: (event) => setMissionFilter(event.target.value), className: "max-w-xs rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-1.5 text-xs text-[var(--theme-muted)] outline-none", children: [
        /* @__PURE__ */ jsx("option", { value: "all", children: "All missions" }),
        missionOptions.map((mission) => /* @__PURE__ */ jsx("option", { value: mission.id, children: mission.label }, mission.id))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ml-auto flex rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] p-1", children: [
        ["board", "Board"],
        ["cards", "Cards"],
        ["list", "List"]
      ].map(([id, label]) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setLayout(id),
          className: cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            layout === id ? "bg-[var(--theme-accent)] text-primary-950" : "text-[var(--theme-muted)] hover:text-[var(--theme-text)]"
          ),
          children: label
        },
        id
      )) })
    ] }),
    layout === "board" ? /* @__PURE__ */ jsxs("div", { className: "grid gap-3 xl:grid-cols-3", children: [
      renderInboxLane("needs_review", "Needs review", inboxLanes.needs_review, "Reviewer lane is clear. Route the next completed worker output through swarm6."),
      renderInboxLane("blocked", "Blocked / needs input", inboxLanes.blocked, "No blockers waiting on human input."),
      renderInboxLane("ready", "Ready", inboxLanes.ready, "Nothing is ready yet.")
    ] }) : layout === "cards" ? /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3", children: workerCards.length ? workerCards.map((card) => {
      const expanded = expandedId === `worker:${card.workerId}`;
      const latestInboxItem = {
        ...card.latest,
        lane: card.latest.state === "blocked" ? "blocked" : card.latest.state === "ready" ? "ready" : "needs_review"
      };
      return /* @__PURE__ */ jsxs("article", { className: "rounded-[1.4rem] border border-[var(--theme-border)] border-l-4 border-l-[var(--theme-accent)] bg-[var(--theme-bg)] p-4 shadow-[0_16px_40px_color-mix(in_srgb,var(--theme-shadow)_10%,transparent)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex size-12 shrink-0 items-center justify-center", children: [
              /* @__PURE__ */ jsx(
                AgentProgress,
                {
                  value: card.state === "blocked" ? 30 : card.state === "needs_review" ? 74 : card.state === "ready" ? 100 : 58,
                  status: card.state === "blocked" ? "failed" : card.state === "ready" ? "done" : card.state === "needs_review" ? "thinking" : "running",
                  size: 48,
                  strokeWidth: 2.5,
                  className: card.state === "blocked" ? "text-red-500" : card.state === "needs_review" ? "text-amber-500" : card.state === "ready" ? "text-emerald-500" : "text-sky-500"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(PixelAvatar, { size: 34, color: colorForWorker(card.workerId), accentColor: "#fbbf24", status: card.state === "blocked" ? "failed" : card.state === "ready" ? "running" : "idle" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onSelectWorker?.(card.workerId), className: "truncate text-left text-sm font-semibold text-[var(--theme-text)] hover:text-[var(--theme-accent-strong)]", children: card.workerName }),
                /* @__PURE__ */ jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em]", toneClass(card.state)), children: card.stateLabel })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 text-[10px] text-[var(--theme-muted)]", children: [
                card.role,
                " · ",
                formatAge(card.latest.updatedAt)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setExpandedId(expanded ? null : `worker:${card.workerId}`),
                className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--theme-text)] hover:border-[var(--theme-accent)]",
                children: expanded ? "Hide reports" : `Open reports (${card.rows.length})`
              }
            ),
            card.prUrl ? /* @__PURE__ */ jsx(
              "a",
              {
                href: card.prUrl,
                target: "_blank",
                rel: "noreferrer",
                className: "inline-flex items-center rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] px-2.5 py-1.5 text-[11px] text-[var(--theme-text)] hover:bg-[var(--theme-card2)]",
                children: "↗"
              }
            ) : null,
            card.state === "needs_review" || card.state === "blocked" || card.state === "ready" ? /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => onRouteToReviewer?.(card),
                className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] px-2.5 py-1.5 text-[11px] text-[var(--theme-text)] hover:bg-[var(--theme-card2)]",
                children: "Steer"
              }
            ) : null
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-3 text-center line-clamp-2 text-lg font-semibold leading-tight text-[var(--theme-text)]", children: card.latest.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-center text-[11px] text-[var(--theme-muted)]", children: card.latest.summary }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-1.5 text-center text-[9px] uppercase tracking-[0.12em] text-[var(--theme-muted)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-amber-400/30 bg-amber-500/10 px-1.5 py-0.5", children: [
            "Review ",
            card.reviewCount
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-1.5 py-0.5", children: [
            "Ready ",
            card.readyCount
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-red-400/30 bg-red-500/10 px-1.5 py-0.5", children: [
            "Blocked ",
            card.blockedCount
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-1.5 py-0.5", children: [
            "Files ",
            card.artifactCount
          ] })
        ] }),
        expandedId === `reply:${latestInboxItem.id}` ? renderReplyComposer(latestInboxItem) : null,
        expanded ? /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2 border-t border-[var(--theme-border)] pt-3", children: card.rows.slice(0, 4).map((row) => {
          const inboxRow = {
            ...row,
            lane: row.state === "blocked" ? "blocked" : row.state === "ready" ? "ready" : "needs_review"
          };
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-3",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]", toneClass(row.state)), children: row.stateLabel }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[var(--theme-muted)]", children: formatAge(row.updatedAt) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-2 line-clamp-1 text-xs font-semibold text-[var(--theme-text)]", children: row.title }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 line-clamp-2 text-[11px] text-[var(--theme-muted-2)]", children: row.summary }),
                renderRowActions(inboxRow),
                expandedId === `reply:${row.id}` ? renderReplyComposer(inboxRow) : null
              ]
            },
            row.id
          );
        }) }) : null
      ] }, card.workerId);
    }) : /* @__PURE__ */ jsx("div", { className: "col-span-full rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-bg)] p-8 text-center text-sm text-[var(--theme-muted)]", children: "No worker reports match these filters yet." }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filteredRows.length ? filteredRows.map((row) => {
      const expanded = expandedId === row.id;
      return /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => setExpandedId(expanded ? null : row.id),
            onKeyDown: (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setExpandedId(expanded ? null : row.id);
              }
            },
            className: "block w-full cursor-pointer text-left",
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]", toneClass(row.state)), children: row.stateLabel }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[var(--theme-muted)]", children: row.kind }),
                  row.checkpointStatus ? /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[var(--theme-muted)]", children: row.checkpointStatus }) : null,
                  row.reviewRequired ? /* @__PURE__ */ jsx("span", { className: "rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700", children: "swarm6 gate" }) : null,
                  row.reviewedBy ? /* @__PURE__ */ jsxs("span", { className: "rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700", children: [
                    "reviewed by ",
                    row.reviewedBy
                  ] }) : null,
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[var(--theme-muted)]", children: formatAge(row.updatedAt) })
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "mt-2 truncate text-sm font-semibold text-[var(--theme-text)]", children: row.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--theme-muted-2)]", children: row.summary })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "shrink-0 text-right text-xs text-[var(--theme-muted)]", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-end gap-1.5", children: [
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: (event) => {
                    event.stopPropagation();
                    onSelectWorker?.(row.workerId);
                  }, className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] px-2 py-1 font-medium text-[var(--theme-text)] hover:border-[var(--theme-accent)]", children: row.workerName }),
                  row.state === "needs_review" ? /* @__PURE__ */ jsx("button", { type: "button", onClick: (event) => {
                    event.stopPropagation();
                    onRouteToReviewer?.({ ...row, lane: "needs_review" });
                  }, className: "rounded-lg border border-amber-400/40 bg-amber-500/10 px-2 py-1 font-medium text-amber-700 hover:bg-amber-500/15", children: "Route swarm6" }) : null
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 max-w-[14rem] truncate", children: row.missionTitle ?? "runtime output" })
              ] })
            ] })
          }
        ),
        expanded ? /* @__PURE__ */ jsxs("div", { className: "mt-3 border-t border-[var(--theme-border)] pt-3", children: [
          /* @__PURE__ */ jsx("dl", { className: "grid gap-2 md:grid-cols-2", children: row.details.map((detail) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-2", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: detail.label }),
            /* @__PURE__ */ jsx("dd", { className: "mt-1 whitespace-pre-wrap text-xs leading-relaxed text-[var(--theme-text)]", children: detail.value })
          ] }, detail.label)) }),
          row.artifacts.length > 0 || row.previews.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-2", children: [
            /* @__PURE__ */ jsx("div", { className: "mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: "Artifacts" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
              row.artifacts.map((artifact) => /* @__PURE__ */ jsxs("span", { title: artifact.path ?? artifact.label, className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-2 py-1 text-[10px] text-[var(--theme-muted-2)]", children: [
                artifact.kind,
                ": ",
                artifact.label
              ] }, artifact.id)),
              row.previews.map((preview) => /* @__PURE__ */ jsxs("a", { href: preview.url, target: "_blank", rel: "noreferrer", className: "rounded-full border border-[var(--theme-accent)]/40 bg-[var(--theme-accent-soft)] px-2 py-1 text-[10px] text-[var(--theme-accent-strong)]", children: [
                "preview: ",
                preview.label
              ] }, preview.id))
            ] })
          ] }) : null
        ] }) : null
      ] }, row.id);
    }) : /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-bg)] p-8 text-center text-sm text-[var(--theme-muted)]", children: "No reports match these filters yet. Checkpoints appear after workers return the required checkpoint format; runtime artifacts appear when workers publish artifacts/previews." }) })
  ] });
}
let xtermLoaded = false;
let TerminalCtor;
let FitAddonCtor;
let WebLinksAddonCtor;
async function ensureXterm() {
  if (xtermLoaded) return;
  const [xtermMod, fitMod, linksMod] = await Promise.all([
    import("xterm"),
    import("xterm-addon-fit"),
    import("xterm-addon-web-links")
  ]);
  await Promise.resolve({          });
  TerminalCtor = xtermMod.Terminal;
  FitAddonCtor = fitMod.FitAddon;
  WebLinksAddonCtor = linksMod.WebLinksAddon;
  xtermLoaded = true;
}
const SwarmTerminal = memo(function SwarmTerminal2({
  workerId,
  command,
  cwd,
  className,
  height = 480,
  active = true
}) {
  const containerRef = useRef(null);
  const terminalRef = useRef(null);
  const fitRef = useRef(null);
  const sessionIdRef = useRef(null);
  const readerRef = useRef(null);
  const inputBufferRef = useRef("");
  const flushTimerRef = useRef(null);
  const nativeInputCounterRef = useRef(0);
  const [state, setState] = useState("idle");
  const [error, setError] = useState(null);
  const [reconnectKey, setReconnectKey] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const focusTerminal = useCallback(() => {
    try {
      containerRef.current?.focus();
      terminalRef.current?.focus();
      const textarea = containerRef.current?.querySelector(".xterm-helper-textarea");
      textarea?.focus();
    } catch {
    }
  }, []);
  const flushPendingInput = useCallback(() => {
    const sessionId = sessionIdRef.current;
    const data = inputBufferRef.current;
    if (!sessionId || !data) return;
    inputBufferRef.current = "";
    void fetch("/api/terminal-input", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, data })
    }).catch(() => void 0);
  }, []);
  const queueInput = useCallback((data) => {
    if (!data) return;
    inputBufferRef.current += data;
    if (flushTimerRef.current) return;
    flushTimerRef.current = setTimeout(() => {
      flushTimerRef.current = null;
      flushPendingInput();
    }, 18);
  }, [flushPendingInput]);
  const stop = useCallback(() => {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    flushPendingInput();
    const sessionId = sessionIdRef.current;
    if (sessionId) {
      void fetch("/api/terminal-close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      }).catch(() => void 0);
    }
    if (readerRef.current) {
      try {
        void readerRef.current.cancel();
      } catch {
      }
      readerRef.current = null;
    }
    sessionIdRef.current = null;
    setState("closed");
  }, [flushPendingInput]);
  useCallback(() => {
    stop();
    if (terminalRef.current) {
      terminalRef.current.write("\r\n\x1B[33m[swarm] restarting…\x1B[0m\r\n");
    }
    setReconnectKey((k) => k + 1);
    setState("idle");
  }, [stop]);
  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (!containerRef.current) return;
      await ensureXterm();
      if (cancelled || !containerRef.current) return;
      const terminal = new TerminalCtor({
        cursorBlink: true,
        cursorStyle: "bar",
        fontFamily: "JetBrains Mono, Menlo, monospace",
        fontSize: 12,
        lineHeight: 1.25,
        scrollback: 5e3,
        theme: {
          background: "#0b0d12",
          foreground: "#e2e8f0",
          cursor: "#f59e0b",
          black: "#0f172a",
          brightBlack: "#1e293b"
        }
      });
      terminalRef.current = terminal;
      const fit = new FitAddonCtor();
      const links = new WebLinksAddonCtor();
      fitRef.current = fit;
      terminal.loadAddon(fit);
      terminal.loadAddon(links);
      terminal.open(containerRef.current);
      try {
        fit.fit();
      } catch {
      }
      focusTerminal();
      const viewport = containerRef.current.querySelector(
        ".xterm-viewport"
      );
      const wheelHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const lines = Math.max(-8, Math.min(8, Math.round(event.deltaY / 40)));
        if (lines !== 0) {
          terminal.scrollLines(lines);
        }
      };
      viewport?.addEventListener("wheel", wheelHandler, { passive: false });
      terminal.writeln(`\x1B[1;36m[swarm] worker ${workerId} terminal\x1B[0m`);
      terminal.writeln(`\x1B[2mcommand: ${command.join(" ")}\x1B[0m`);
      terminal.writeln("");
      setState("connecting");
      const response = await fetch("/api/terminal-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command,
          cwd,
          cols: terminal.cols,
          rows: terminal.rows
        })
      }).catch(() => null);
      if (cancelled) return;
      if (!response || !response.ok || !response.body) {
        setError(`Failed to start swarm terminal (${response?.status ?? "no response"})`);
        setState("error");
        terminal.writeln("\r\n\x1B[31m[swarm] failed to start terminal\x1B[0m");
        return;
      }
      setState("connected");
      setTimeout(() => focusTerminal(), 50);
      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";
      const dataDisposable = terminal.onData((data) => {
        nativeInputCounterRef.current += 1;
        queueInput(data);
      });
      const resizeDisposable = terminal.onResize(({ cols, rows }) => {
        const sessionId = sessionIdRef.current;
        if (!sessionId) return;
        void fetch("/api/terminal-resize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, cols, rows })
        }).catch(() => void 0);
      });
      const handleResize = () => {
        try {
          fit.fit();
        } catch {
        }
      };
      window.addEventListener("resize", handleResize);
      try {
        while (true) {
          const readState = await reader.read().catch(() => ({ done: true, value: void 0 }));
          if (readState.done) break;
          const value = readState.value;
          if (!value) continue;
          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split("\n\n");
          buffer = blocks.pop() ?? "";
          for (const block of blocks) {
            if (!block) continue;
            const lines = block.split("\n");
            let event = "message";
            let dataLine = "";
            for (const line of lines) {
              if (line.startsWith("event:")) event = line.slice(6).trim();
              if (line.startsWith("data:")) dataLine += line.slice(5).trim();
            }
            if (!dataLine) continue;
            try {
              const parsed = JSON.parse(dataLine);
              if (event === "session") {
                const sessionId = typeof parsed.sessionId === "string" ? parsed.sessionId : null;
                if (sessionId) sessionIdRef.current = sessionId;
              } else if (event === "data") {
                const data = typeof parsed.data === "string" ? parsed.data : "";
                if (data) terminal.write(data);
              } else if (event === "exit" || event === "close") {
                terminal.writeln("\r\n\x1B[33m[swarm] session ended\x1B[0m");
                sessionIdRef.current = null;
                setState("closed");
              } else if (event === "error") {
                const message = typeof parsed.message === "string" ? parsed.message : "unknown error";
                terminal.writeln(`\r
\x1B[31m[swarm] ${message}\x1B[0m`);
              }
            } catch {
            }
          }
        }
      } finally {
        if (flushTimerRef.current) {
          clearTimeout(flushTimerRef.current);
          flushTimerRef.current = null;
        }
        flushPendingInput();
        viewport?.removeEventListener("wheel", wheelHandler);
        dataDisposable.dispose();
        resizeDisposable.dispose();
        window.removeEventListener("resize", handleResize);
        if (!cancelled) setState("closed");
      }
    }
    void bootstrap();
    return () => {
      cancelled = true;
      stop();
      const terminal = terminalRef.current;
      terminalRef.current = null;
      fitRef.current = null;
      try {
        terminal?.dispose();
      } catch {
      }
    };
  }, [workerId, command.join("|"), cwd, reconnectKey, focusTerminal, flushPendingInput]);
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => {
      try {
        fitRef.current?.fit();
      } catch {
      }
      focusTerminal();
    }, 60);
    return () => clearTimeout(id);
  }, [active, focusTerminal]);
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-2", className), children: [
    state !== "connected" || error ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px] text-[var(--theme-muted)]", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        state === "connecting" && "connecting…",
        state === "closed" && "session closed",
        state === "error" && "error",
        state === "idle" && "idle"
      ] }),
      error ? /* @__PURE__ */ jsx("span", { className: "text-red-300", children: "attach error" }) : null
    ] }) : null,
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: containerRef,
        tabIndex: 0,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        onMouseDown: () => {
          requestAnimationFrame(() => focusTerminal());
        },
        onClick: () => {
          requestAnimationFrame(() => focusTerminal());
        },
        onPaste: (event) => {
          const text = event.clipboardData.getData("text");
          if (!text) return;
          event.preventDefault();
          event.stopPropagation();
          queueInput(text);
          focusTerminal();
        },
        onKeyDown: (event) => {
          const keyToData = () => {
            if (event.metaKey) return "";
            if (event.ctrlKey && event.key.length === 1) {
              const upper = event.key.toUpperCase();
              const code = upper.charCodeAt(0);
              if (code >= 64 && code <= 95) return String.fromCharCode(code - 64);
            }
            switch (event.key) {
              case "Enter":
                return "\r";
              case "Backspace":
                return "";
              case "Tab":
                return "	";
              case "Escape":
                return "\x1B";
              case "ArrowUp":
                return "\x1B[A";
              case "ArrowDown":
                return "\x1B[B";
              case "ArrowRight":
                return "\x1B[C";
              case "ArrowLeft":
                return "\x1B[D";
              case "Home":
                return "\x1B[H";
              case "End":
                return "\x1B[F";
              case "PageUp":
                return "\x1B[5~";
              case "PageDown":
                return "\x1B[6~";
              case "Delete":
                return "\x1B[3~";
              default:
                return event.key.length === 1 && !event.altKey ? event.key : "";
            }
          };
          const data = keyToData();
          if (!data) return;
          const activeEl = document.activeElement;
          const isXtermTextarea = activeEl?.classList?.contains("xterm-helper-textarea");
          if (isXtermTextarea) {
            const before = nativeInputCounterRef.current;
            window.setTimeout(() => {
              if (nativeInputCounterRef.current === before) {
                queueInput(data);
              }
            }, 35);
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          queueInput(data);
          focusTerminal();
        },
        onWheel: (event) => {
          event.preventDefault();
          event.stopPropagation();
          const lines = Math.max(-8, Math.min(8, Math.round(event.deltaY / 40)));
          if (lines !== 0) {
            terminalRef.current?.scrollLines(lines);
          }
        },
        className: cn(
          "cursor-text overflow-hidden rounded-2xl border bg-[#0b0d12] p-2 outline-none",
          isFocused ? "border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent-soft)]" : "border-[var(--theme-border)]"
        ),
        style: { height }
      }
    ),
    error ? /* @__PURE__ */ jsx("div", { className: "rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300", children: error }) : null
  ] });
});
const SWARM2_ROOM_STORAGE_KEY = "claude-swarm2-room-v1";
const SWARM2_OPERATION_THEME = {
  ["--theme-bg"]: "var(--color-surface)",
  ["--theme-card"]: "var(--color-primary-50)",
  ["--theme-card2"]: "var(--color-primary-100)",
  ["--theme-border"]: "var(--color-primary-200)",
  ["--theme-border2"]: "var(--color-primary-400)",
  ["--theme-text"]: "var(--color-ink)",
  ["--theme-muted"]: "var(--color-primary-700)",
  ["--theme-muted-2"]: "var(--color-primary-600)",
  ["--theme-accent"]: "var(--color-accent-500)",
  ["--theme-accent-strong"]: "var(--color-accent-600)",
  ["--theme-accent-soft"]: "color-mix(in srgb, var(--color-accent-500) 12%, transparent)",
  ["--theme-accent-soft-strong"]: "color-mix(in srgb, var(--color-accent-500) 18%, transparent)",
  ["--theme-shadow"]: "color-mix(in srgb, var(--color-primary-950) 14%, transparent)",
  ["--theme-danger"]: "var(--color-red-600, #dc2626)",
  ["--theme-danger-soft"]: "color-mix(in srgb, var(--theme-danger) 12%, transparent)",
  ["--theme-danger-border"]: "color-mix(in srgb, var(--theme-danger) 35%, white)",
  ["--theme-warning"]: "var(--color-amber-600, #d97706)",
  ["--theme-warning-soft"]: "color-mix(in srgb, var(--theme-warning) 12%, transparent)",
  ["--theme-warning-border"]: "color-mix(in srgb, var(--theme-warning) 35%, white)"
};
const ROLE_PRESETS = [
  {
    role: "Orchestrator",
    specialty: "control-plane state, dispatch, drift detection, escalation",
    mission: "Run the swarm. Read /swarm-specs/ at start. Dispatch workers per their standing missions. Detect drift, re-prompt, escalate to main agent when stuck.",
    systemPrompt: "You are the Hermes Agent orchestrator for the swarm. Read /swarm-specs/SWARM_SPEC.md and /swarm-specs/projects/swarmN.md for every worker before dispatching. Apply the swarm-orchestrator skill: assign work, request proof-bearing checkpoints, detect drift, re-prompt with stronger framing, escalate when blocked. Never make irreversible external actions without main-agent ack.",
    skills: ["swarm-orchestrator", "swarm-worker-core", "swarm-review-learning-loop", "self-improvement"],
    defaultModel: "GPT-5.4"
  },
  {
    role: "Builder",
    specialty: "full-stack implementation, fast ship cycles",
    mission: "Implement features per dispatched briefs. Smallest landed artifact first. Tests + build + smoke before checkpoint.",
    systemPrompt: "You are a senior builder. Ship working code. Always read the brief, plan smallest landed artifact, implement, run tests + build + smoke, commit (not push), checkpoint with proof.",
    skills: ["swarm-worker-core", "byte-verified-code-review"],
    defaultModel: "GPT-5.5"
  },
  {
    role: "Reviewer",
    specialty: "byte-verified code review, naming + tests + build gate",
    mission: "No PR ships without you. Verify diff, byte-check naming, run tests/build/smoke, verdict APPROVED/CHANGES_REQUESTED/BLOCKED.",
    systemPrompt: "You are the merge gate. For every PR: pull branch, read diff, xxd byte-check naming-sensitive areas, run tests, run build, smoke test. Verdict APPROVED routes to main agent for merge ack. Never merge yourself.",
    skills: ["swarm-worker-core", "byte-verified-code-review", "swarm-review-learning-loop"],
    defaultModel: "GPT-5.4"
  },
  {
    role: "Triage",
    specialty: "autonomous PR/issues processor",
    mission: "Score open issues every 4h, repro top-1, fix branch + tests + PR, request review. Never merge or close.",
    systemPrompt: "You are the issues/PRs autopilot. Every 4h: gh issue list per repo, score by Impact x Tractability x (1 + locally-tested), pick top-1 unassigned, repro, fix branch, push, gh pr create, request reviewer. Never merge, never close, always escalate to main agent for greenlight.",
    skills: ["swarm-worker-core", "byte-verified-code-review", "swarm-review-learning-loop"],
    defaultModel: "GPT-5.5"
  },
  {
    role: "Lab",
    specialty: "local-model R&D, spec-dec, benchmarking",
    mission: "Run autonomous lab loop. Test new model pulls. Wire spec-dec/DFlash/TurboQuant. Push tk/s + quality. Document every experiment.",
    systemPrompt: "You are the local-model lab. Read /swarm-specs/projects/lane-c-lab.md. Iterate experiments from open hypothesis space. Log to lab-loop-runs.jsonl. Escalate breakthroughs (>=10% tk/s) and install requests to main agent.",
    skills: ["swarm-worker-core", "pc1-ollama-gguf-bench", "swarm-bench-worker"],
    defaultModel: "GPT-5.4"
  },
  {
    role: "Sage",
    specialty: "research + scripts + X content + creative briefs",
    mission: "Research what matters. Draft scripts, X content, briefs. Cite sources. Never post externally without ack.",
    systemPrompt: "You are the research/content scout. Find angles, write scripts and drafts, always cite sources. Never post X/Discord/blog without main-agent ack — always draft + escalate.",
    skills: ["swarm-worker-core", "last30days", "pdf-and-paper-deep-reading"],
    defaultModel: "GPT-5.5"
  },
  {
    role: "Scribe",
    specialty: "docs, skills hygiene, memory curation",
    mission: "Keep docs current. Hygiene the skills folder. Curate memory. Write submission/release copy.",
    systemPrompt: "You are the source-of-truth keeper. Audit /skills/ every 12h, flag stale/unused/poorly-documented. Maintain SWARM_SPEC and worker specs as system evolves. Draft READMEs and changelogs.",
    skills: ["swarm-worker-core", "last30days", "creative-writing"],
    defaultModel: "GPT-5.5"
  },
  {
    role: "Foundation",
    specialty: "infra, repair playbook, autopilot wiring",
    mission: "Keep the swarm running. Apply repair playbook. Wire autopilot. Maintain loop infra.",
    systemPrompt: "You are infrastructure. Maintain /swarm-specs/playbooks/auto-repair.yaml. Health-check tmux sessions, autopilot tick, dev server. Apply known fixes; escalate novel failures.",
    skills: ["swarm-worker-core"],
    defaultModel: "GPT-5.4"
  },
  {
    role: "QA",
    specialty: "regression QA, render verification",
    mission: "Run regression suite on every commit + render. Block bad ships.",
    systemPrompt: "You are QA. On commit: full test suite. On render: ffprobe + tone consistency + pacing. Verdict PASS/FAIL/FLAKY with evidence.",
    skills: ["swarm-worker-core", "byte-verified-code-review"],
    defaultModel: "GPT-5.4"
  },
  {
    role: "Mirror Integrations",
    specialty: "asset packs, upstream sync",
    mission: "Generate assets. Watch upstream. Pack integrations.",
    systemPrompt: "You produce assets and watch upstream. Generate art/audio per Lane A. Every 12h diff upstream Hermes Agent main, surface portable items. Never cross-org PR without ack.",
    skills: ["swarm-worker-core", "claude-promo", "songwriting-and-ai-music"],
    defaultModel: "GPT-5.4"
  },
  {
    role: "Custom",
    specialty: "",
    mission: "",
    systemPrompt: "",
    skills: []
  }
];
const ROLE_NAMES = ROLE_PRESETS.map((p) => p.role);
async function fetchAvailableModels() {
  try {
    const res = await fetch("/api/models");
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.ok || !Array.isArray(data?.data)) return [];
    return data.data;
  } catch {
    return [];
  }
}
async function fetchRuntime() {
  const res = await fetch("/api/swarm-runtime");
  if (!res.ok) throw new Error(`Runtime request failed: ${res.status}`);
  return res.json();
}
async function fetchHealth() {
  const res = await fetch("/api/swarm-health");
  if (!res.ok) throw new Error(`Health request failed: ${res.status}`);
  return res.json();
}
async function fetchRoster() {
  const res = await fetch("/api/swarm-roster");
  if (!res.ok) throw new Error(`Roster request failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.roster?.workers) ? data.roster.workers : [];
}
async function fetchMissions() {
  const res = await fetch("/api/swarm-missions?limit=50");
  if (!res.ok) throw new Error(`Missions request failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.missions) ? data.missions : [];
}
function useUpdatedAgo(fetchedAt) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    function update() {
      if (!fetchedAt) {
        setLabel("");
        return;
      }
      const diff = Math.floor((Date.now() - fetchedAt) / 1e3);
      if (diff < 5) setLabel("just now");
      else if (diff < 60) setLabel(`${diff}s ago`);
      else setLabel(`${Math.floor(diff / 60)}m ago`);
    }
    update();
    const id = setInterval(update, 5e3);
    return () => clearInterval(id);
  }, [fetchedAt]);
  return label;
}
function commandForRuntime(runtime, mode = "auto") {
  const cwd = runtime?.cwd?.replace(/"/g, '\\"');
  const shellCommand = () => ({
    command: ["zsh", "-lc", cwd ? `cd "${cwd}" && exec zsh -l` : "exec zsh -l"],
    kind: "shell",
    label: cwd ? "shell @ cwd" : "shell"
  });
  const logCommand = () => runtime?.logPath ? {
    command: ["tail", "-n", "200", "-F", runtime.logPath],
    kind: "log-tail",
    label: "tail -F agent.log"
  } : null;
  if (mode === "logs") {
    return logCommand() ?? shellCommand();
  }
  if (mode === "shell") {
    return shellCommand();
  }
  if (runtime?.tmuxAttachable && runtime.tmuxSession) {
    return {
      command: ["tmux", "attach", "-t", runtime.tmuxSession],
      kind: "tmux",
      label: `tmux:${runtime.tmuxSession}`
    };
  }
  if (runtime?.cwd) {
    return shellCommand();
  }
  return logCommand() ?? shellCommand();
}
function recentLines(entry) {
  return (entry?.recentLogTail ?? "").split("\n").map((line) => line.trim()).filter(Boolean).slice(-4);
}
function rankMember(roomIds) {
  return (member) => {
    if (roomIds.includes(member.id)) return 0;
    const status = getOnlineStatus(member);
    if (status === "online") return 1;
    if (status === "offline") return 2;
    return 3;
  };
}
function sortSwarmMembers(members, roomIds) {
  const rank = rankMember(roomIds);
  return [...members].filter((member) => member.id && member.id.trim().length > 0).sort((a, b) => {
    const r = rank(a) - rank(b);
    if (r !== 0) return r;
    const numA = parseInt(a.id.replace(/\D/g, ""), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ""), 10) || 0;
    return numA - numB;
  });
}
function compactText(value, max = 38) {
  if (!value) return "—";
  return value.length > max ? `${value.slice(0, max)}…` : value;
}
function isRuntimeActive(entry) {
  if (!entry) return false;
  if (entry.tmuxAttachable) return true;
  if (entry.currentTask?.trim()) return true;
  const last = entry.lastOutputAt ?? entry.lastSessionStartedAt;
  return typeof last === "number" && Date.now() - last < 12 * 60 * 60 * 1e3;
}
function scrollNodeToTop(node) {
  if (!node) return;
  node.scrollTop = 0;
  node.scrollLeft = 0;
}
function withInstantScroll(anchor, fn) {
  if (typeof window === "undefined") return fn();
  const targets = [];
  if (document.documentElement instanceof HTMLElement) targets.push(document.documentElement);
  if (document.body instanceof HTMLElement) targets.push(document.body);
  let current = anchor;
  while (current) {
    targets.push(current);
    current = current.parentElement;
  }
  for (const selector of ["main", '[data-slot="content"]', '[data-slot="main"]', "[data-scroll-container]"]) {
    const node = document.querySelector(selector);
    if (node instanceof HTMLElement) targets.push(node);
  }
  const deduped = [...new Set(targets)].filter((node) => !node.closest(".xterm"));
  const previous = deduped.map((node) => [node, node.style.scrollBehavior]);
  for (const [node] of previous) node.style.scrollBehavior = "auto";
  try {
    return fn();
  } finally {
    for (const [node, value] of previous) node.style.scrollBehavior = value;
  }
}
function scrollContextToTop(anchor) {
  if (typeof window === "undefined") return;
  withInstantScroll(anchor, () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    let current = anchor;
    while (current) {
      scrollNodeToTop(current);
      current = current.parentElement;
    }
    const candidates = [
      document.querySelector("main"),
      document.querySelector('[data-slot="content"]'),
      document.querySelector('[data-slot="main"]'),
      document.querySelector("[data-scroll-container]")
    ];
    for (const node of candidates) {
      if (node instanceof HTMLElement && !node.closest(".xterm")) scrollNodeToTop(node);
    }
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "auto" });
    }
  });
}
function scheduleScrollContextToTop(anchor) {
  if (typeof window === "undefined") return () => {
  };
  let cancelled = false;
  const timers = [];
  const frames = [];
  const run = () => {
    if (cancelled) return;
    scrollContextToTop(anchor);
  };
  run();
  frames.push(window.requestAnimationFrame(run));
  frames.push(window.requestAnimationFrame(() => window.requestAnimationFrame(run)));
  timers.push(window.setTimeout(run, 0));
  timers.push(window.setTimeout(run, 50));
  timers.push(window.setTimeout(run, 150));
  timers.push(window.setTimeout(run, 300));
  return () => {
    cancelled = true;
    for (const id of timers) window.clearTimeout(id);
    for (const id of frames) window.cancelAnimationFrame(id);
  };
}
function relativeTime(ts) {
  if (!ts) return "never";
  const diff = Date.now() - ts;
  if (diff < 6e4) return `${Math.max(1, Math.floor(diff / 1e3))}s ago`;
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
function progressForRuntime(runtime) {
  if (!runtime) return 0;
  if (runtime.checkpointStatus === "done" || runtime.checkpointStatus === "handoff") return 100;
  if (runtime.checkpointStatus === "blocked" || runtime.checkpointStatus === "needs_input") return 100;
  if (!runtime.currentTask?.trim()) return 0;
  const text = `${runtime.phase ?? ""} ${runtime.currentTask ?? ""}`.toLowerCase();
  if (text.includes("review")) return 72;
  if (text.includes("test") || text.includes("qa")) return 78;
  if (text.includes("implement") || text.includes("build") || text.includes("patch")) return 64;
  if (text.includes("plan") || text.includes("research") || text.includes("design")) return 48;
  return 58;
}
function cleanSwarmLabel(rawValue, fallback = "Ready for task", maxLength = 64) {
  const raw = rawValue.trim();
  if (!raw) return fallback;
  const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
  const goalLine = lines.find((line) => /^goal\s*:/i.test(line));
  const selected = goalLine ? goalLine.replace(/^goal\s*:\s*/i, "") : lines.find((line) => !/^you are\b/i.test(line) && !/^context\b/i.test(line) && !/^constraints\b/i.test(line)) || lines[0];
  const cleaned = selected.replace(/^[A-Z][A-Z0-9_ -]{2,}TASK\s*:\s*/i, "").replace(/^DESIGN_ADDENDUM\s*:\s*/i, "").replace(/^CONTROL_PLANE_REPROMPT\s*:\s*/i, "").replace(/^EXPERIMENT_PLANNING_TASK\s*:\s*/i, "").replace(/^UPDATE\s*:\s*/i, "").replace(/^You are\s+[^.]{1,80}\.\s*/i, "").replace(/^[-*]\s+/, "").replace(/\s+/g, " ").trim();
  return compactText(cleaned || raw, maxLength);
}
function displayTaskTitle(runtime, fallback) {
  const realSummary = runtime?.lastRealSummary ?? null;
  const realResult = runtime?.lastRealResult ?? null;
  return cleanSwarmLabel(runtime?.blockedReason || runtime?.currentTask || realSummary || runtime?.lastSummary || realResult || runtime?.lastResult || fallback, "Ready for task", 64);
}
function formatAssignedModel(model, provider) {
  const value = `${model || ""} ${provider || ""}`.toLowerCase();
  if (value.includes("claude-opus-4-7") || value.includes("opus-4-7")) return "Opus 4.7";
  if (value.includes("claude-opus-4-6") || value.includes("opus-4-6")) return "Opus 4.6";
  if (value.includes("gpt-5.5")) return "GPT-5.5";
  if (value.includes("gpt-5.4")) return "GPT-5.4";
  if (value.includes("gpt-5.3")) return "GPT-5.3";
  if (model && model !== "unknown") return model;
  if (provider && provider !== "unknown") return provider.replace(/^custom:/, "").replace(/[-_]/g, " ");
  return "Worker";
}
function ControlPlaneStage({
  members,
  selectedId,
  roomIds,
  activeRuntimeCount,
  authErrors,
  selectedLabel,
  workspaceModel,
  lanes,
  activeAgents,
  recentUpdates,
  latestMission,
  missions,
  runtimeEntries,
  inboxCounts,
  routerSeed,
  onOpenInboxItem,
  onRouteToReviewer,
  viewMode,
  onViewModeChange,
  onOpenRouter,
  onRouterResults,
  onSelect,
  onToggleRoom,
  onOpenTui,
  onOpenTasks,
  runtimeByWorker,
  terminalTargets,
  tmuxAvailable,
  pendingTmux,
  focusedRuntimeWorkerId,
  onToggleFocusedRuntimeWorker,
  onClearFocusedRuntimeWorker,
  onStartAgentSession,
  onScrollTmuxSession
}) {
  const stageRef = useRef(null);
  const anchorRef = useRef(null);
  const workerRefsMap = useRef(/* @__PURE__ */ new Map());
  const cardSetters = useRef(/* @__PURE__ */ new Map());
  const [refsVersion, setRefsVersion] = useState(0);
  const bumpRefsVersion = useCallback(() => {
    setRefsVersion((value) => value + 1);
  }, []);
  const setAnchor = useCallback((node) => {
    if (anchorRef.current === node) return;
    anchorRef.current = node;
    bumpRefsVersion();
  }, [bumpRefsVersion]);
  const setWorkerRef = useCallback(
    (workerId) => {
      const existing = cardSetters.current.get(workerId);
      if (existing) return existing;
      const setter = (node) => {
        const map = workerRefsMap.current;
        const prior = map.get(workerId) ?? null;
        if (node === prior) return;
        if (node) map.set(workerId, node);
        else map.delete(workerId);
        bumpRefsVersion();
      };
      cardSetters.current.set(workerId, setter);
      return setter;
    },
    [bumpRefsVersion]
  );
  useEffect(() => {
    const liveIds = new Set(members.map((member) => member.id));
    let mutated = false;
    for (const id of cardSetters.current.keys()) {
      if (!liveIds.has(id)) {
        cardSetters.current.delete(id);
        workerRefsMap.current.delete(id);
        mutated = true;
      }
    }
    if (mutated) bumpRefsVersion();
  }, [members, bumpRefsVersion]);
  const wireTargets = useMemo(
    () => members.map((member) => ({
      id: member.id,
      selected: member.id === selectedId,
      inRoom: roomIds.includes(member.id)
    })),
    [members, selectedId, roomIds]
  );
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref: stageRef,
      className: "relative overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-3 shadow-[0_24px_80px_var(--theme-shadow)]",
      children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--theme-accent-soft),transparent_42%)]" }),
        /* @__PURE__ */ jsx(
          Swarm2Wires,
          {
            containerRef: stageRef,
            anchorRef,
            workerRefs: workerRefsMap.current,
            workers: wireTargets,
            version: refsVersion
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsx(
            Swarm2OrchestratorCard,
            {
              totalWorkers: members.length,
              activeRuntimeCount,
              roomCount: roomIds.length,
              authErrors,
              selectedLabel,
              workspaceModel,
              viewMode,
              onViewModeChange,
              lanes,
              activeAgents,
              recentUpdates,
              latestMission,
              inboxCounts,
              members,
              roomIds,
              selectedId,
              routerSeed,
              onOpenRouter,
              onRouterResults: () => {
                void onRouterResults();
              },
              onAnchorRef: setAnchor,
              className: "w-full max-w-5xl"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full pt-3", children: [
            /* @__PURE__ */ jsx("div", { className: cn("relative z-10", viewMode === "cards" ? "block" : "hidden"), children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 lg:grid-cols-2 min-[1680px]:grid-cols-3", children: members.length === 0 ? /* @__PURE__ */ jsx("div", { className: "col-span-full rounded-[1.5rem] border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] p-8 text-sm text-[var(--theme-muted)]", children: "No swarm workers discovered from crew status yet." }) : members.map((member) => {
              const runtime = runtimeByWorker.get(member.id);
              return /* @__PURE__ */ jsx(
                OperationalWorkerCard,
                {
                  cardRef: setWorkerRef(member.id),
                  member,
                  currentTask: runtime?.currentTask ?? null,
                  checkpointStatus: runtime?.checkpointStatus ?? null,
                  runtimeState: runtime?.state ?? null,
                  recentLines: recentLines(runtime),
                  recentOutputAt: runtime?.lastOutputAt ?? runtime?.lastSessionStartedAt ?? null,
                  recentSummary: runtime?.lastRealSummary ?? runtime?.lastRealResult ?? runtime?.lastSummary ?? runtime?.lastResult ?? runtime?.blockedReason ?? null,
                  artifacts: runtime?.artifacts ?? [],
                  previews: runtime?.previews ?? [],
                  inRoom: roomIds.includes(member.id),
                  selected: member.id === selectedId,
                  onSelect: () => onSelect(member.id),
                  onToggleRoom: () => onToggleRoom(member.id),
                  onOpenTui: () => onOpenTui(member.id),
                  onOpenTasks: () => onOpenTasks(member.id)
                },
                member.id
              );
            }) }) }),
            /* @__PURE__ */ jsxs("div", { className: cn("relative z-10 flex flex-col gap-3", viewMode === "runtime" ? "block" : "hidden"), children: [
              !tmuxAvailable ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-2.5 text-xs text-amber-100", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-amber-50", children: "tmux not installed on this host" }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 text-amber-100/80", children: "Spawning a Hermes swarm worker requires tmux. Without it, the worker can start but cannot dispatch tasks (you'll see ‘can't find pane: swarm-<id>’ errors). Install tmux:" }),
                /* @__PURE__ */ jsx("code", { className: "mt-1 inline-block rounded bg-black/30 px-2 py-0.5 text-[10px] text-amber-100", children: "brew install tmux" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-amber-100/60", children: "(macOS) or" }),
                " ",
                /* @__PURE__ */ jsx("code", { className: "inline-block rounded bg-black/30 px-2 py-0.5 text-[10px] text-amber-100", children: "apt install tmux" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-amber-100/60", children: "(Ubuntu/Debian)." })
              ] }) : null,
              focusedRuntimeWorkerId ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-2 text-xs text-[var(--theme-muted)]", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "Focus mode on",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-[var(--theme-text)]", children: members.find((member) => member.id === focusedRuntimeWorkerId)?.displayName || focusedRuntimeWorkerId })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClearFocusedRuntimeWorker,
                    className: "rounded-full border border-[var(--theme-border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--theme-muted)] transition-colors hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]",
                    children: "Exit focus"
                  }
                )
              ] }) : null,
              /* @__PURE__ */ jsx("div", { className: cn("grid grid-cols-1 gap-3", focusedRuntimeWorkerId ? "" : "2xl:grid-cols-2"), children: terminalTargets.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-[1.5rem] border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] p-8 text-sm text-[var(--theme-muted)]", children: "No active workers detected. Select a worker or wire it into the room to mount its terminal." }) : terminalTargets.map((member) => {
                const runtime = runtimeByWorker.get(member.id);
                const cmd = commandForRuntime(runtime, "auto");
                const kindBadgeClass = cmd.kind === "tmux" ? "border-[var(--theme-accent)]/40 bg-[var(--theme-accent-soft)] text-[var(--theme-accent-strong)]" : cmd.kind === "log-tail" ? "border-[var(--theme-warning-border)] bg-[var(--theme-warning-soft)] text-[var(--theme-warning)]" : "border-[var(--theme-border)] bg-[var(--theme-card2)] text-[var(--theme-muted)]";
                const titleLabel = member.displayName || member.id;
                const modelLabel = formatAssignedModel(member.model, member.provider);
                return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-[1.5rem] border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-[0_20px_60px_color-mix(in_srgb,var(--theme-shadow)_14%,transparent)]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-[var(--theme-border)] px-3 py-2 text-[11px] text-[var(--theme-muted)]", children: [
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 font-semibold text-[var(--theme-text)]", children: [
                      /* @__PURE__ */ jsx(HugeiconsIcon, { icon: CpuIcon, size: 13 }),
                      /* @__PURE__ */ jsx("span", { children: titleLabel }),
                      /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-medium text-[var(--theme-muted)]", children: [
                        "· ",
                        modelLabel
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "ml-auto flex items-center gap-1", children: runtime?.tmuxAttachable ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onScrollTmuxSession(member.id, "up", runtime.tmuxSession), className: "rounded-full border border-transparent px-1.5 py-0.5 text-[12px] text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-border)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]", title: `Scroll up in ${runtime.tmuxSession ?? `swarm-${member.id}`}`, children: "↑" }),
                      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onScrollTmuxSession(member.id, "down", runtime.tmuxSession), className: "rounded-full border border-transparent px-1.5 py-0.5 text-[12px] text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-border)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]", title: `Scroll down in ${runtime.tmuxSession ?? `swarm-${member.id}`}`, children: "↓" }),
                      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onToggleFocusedRuntimeWorker(member.id), className: "rounded-full border border-transparent px-1.5 py-0.5 text-[12px] text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-border)] hover:bg-[var(--theme-card2)] hover:text-[var(--theme-text)]", title: focusedRuntimeWorkerId === member.id ? `Exit focus for swarm-${member.id}` : `Focus swarm-${member.id}`, children: focusedRuntimeWorkerId === member.id ? "⛶" : "⤢" })
                    ] }) : /* @__PURE__ */ jsx("button", { type: "button", disabled: pendingTmux.has(member.id) || !tmuxAvailable, onClick: () => onStartAgentSession(member.id), className: cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] transition-colors", "border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent-strong)] hover:opacity-90", (pendingTmux.has(member.id) || !tmuxAvailable) && "cursor-not-allowed opacity-50"), title: tmuxAvailable ? `Start a live agent session in tmux (swarm-${member.id})` : "tmux is not installed on this host", children: pendingTmux.has(member.id) ? "Starting…" : "Start agent" }) }),
                    /* @__PURE__ */ jsx("span", { className: cn("inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em]", kindBadgeClass), title: cmd.command.join(" "), children: cmd.kind === "tmux" ? "tmux" : cmd.kind === "log-tail" ? "logs" : "shell" })
                  ] }),
                  /* @__PURE__ */ jsx(SwarmTerminal, { workerId: member.id, command: cmd.command, cwd: runtime?.cwd ?? void 0, height: 420, active: viewMode === "runtime" })
                ] }, member.id);
              }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: cn("relative z-10", viewMode === "kanban" ? "block" : "hidden"), children: /* @__PURE__ */ jsx(
              Swarm2KanbanBoard,
              {
                workers: members,
                latestMission,
                selectedWorkerId: selectedId,
                onSelectWorker: onSelect,
                onOpenRouter
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: cn("relative z-10", viewMode === "reports" ? "block" : "hidden"), children: /* @__PURE__ */ jsx(
              Swarm2ReportsView,
              {
                missions,
                runtimes: runtimeEntries,
                onSelectWorker: (workerId) => {
                  onSelect(workerId);
                  onViewModeChange("cards");
                },
                onOpenItem: onOpenInboxItem,
                onRouteToReviewer
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
function Swarm2Screen() {
  const { crew, lastUpdated } = useCrewStatus();
  useUpdatedAgo(lastUpdated);
  const [selectedId, setSelectedId] = useState(null);
  const [roomIds, setRoomIds] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const parsed = JSON.parse(
        window.localStorage.getItem(SWARM2_ROOM_STORAGE_KEY) ?? "[]"
      );
      return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
    } catch {
      return [];
    }
  });
  const [viewMode, setViewMode] = useState("cards");
  const [routerOpen, setRouterOpen] = useState(false);
  const [routerSeed, setRouterSeed] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [addSwarmOpen, setAddSwarmOpen] = useState(false);
  const [addSwarmSaving, setAddSwarmSaving] = useState(false);
  const [addSwarmError, setAddSwarmError] = useState(null);
  const modelsQuery = useQuery({
    queryKey: ["swarm2", "available-models"],
    queryFn: fetchAvailableModels,
    staleTime: 6e4,
    refetchOnWindowFocus: false
  });
  const availableModels = modelsQuery.data ?? [];
  const [newWorkerId, setNewWorkerId] = useState("");
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerRole, setNewWorkerRole] = useState("Builder");
  const [newWorkerSpecialty, setNewWorkerSpecialty] = useState("");
  const [newWorkerModel, setNewWorkerModel] = useState("");
  const [newWorkerMission, setNewWorkerMission] = useState("");
  const [pendingTmux, setPendingTmux] = useState(/* @__PURE__ */ new Set());
  const [focusedRuntimeWorkerId, setFocusedRuntimeWorkerId] = useState(null);
  const topRef = useRef(null);
  const runtimeQuery = useQuery({
    queryKey: ["swarm2", "runtime"],
    queryFn: fetchRuntime,
    refetchInterval: 3e4
  });
  const healthQuery = useQuery({
    queryKey: ["swarm2", "health"],
    queryFn: fetchHealth,
    refetchInterval: 6e4
  });
  const rosterQuery = useQuery({
    queryKey: ["swarm2", "roster"],
    queryFn: fetchRoster,
    refetchInterval: 6e4
  });
  const missionsQuery = useQuery({
    queryKey: ["swarm2", "missions"],
    queryFn: fetchMissions,
    refetchInterval: 3e4
  });
  const startAgentSession = useCallback(
    async (workerId) => {
      setPendingTmux((prev) => new Set(prev).add(workerId));
      try {
        const res = await fetch("/api/swarm-tmux-start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workerId })
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          let parsed = {};
          try {
            parsed = JSON.parse(text);
          } catch {
          }
          const msg = parsed.error || text || `HTTP ${res.status}`;
          if (msg.includes("tmux not installed")) {
            toast({
              title: "tmux not installed",
              description: `Swarm worker ${workerId} couldn't start because tmux is not installed on this host. Install tmux (‘brew install tmux’ or ‘apt install tmux’) and try again. See #244.`,
              variant: "destructive"
            });
          } else {
            toast({
              title: `Failed to start ${workerId}`,
              description: msg,
              variant: "destructive"
            });
          }
          console.error("[swarm2] start session failed:", res.status, text);
        }
      } catch (err) {
        toast({
          title: `Failed to start ${workerId}`,
          description: err instanceof Error ? err.message : String(err),
          variant: "destructive"
        });
      } finally {
        setPendingTmux((prev) => {
          const next = new Set(prev);
          next.delete(workerId);
          return next;
        });
        void runtimeQuery.refetch();
      }
    },
    [runtimeQuery]
  );
  useCallback(
    async (workerId) => {
      setPendingTmux((prev) => new Set(prev).add(workerId));
      try {
        const res = await fetch("/api/swarm-tmux-stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workerId })
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("[swarm2] stop session failed:", res.status, text);
        }
      } finally {
        setPendingTmux((prev) => {
          const next = new Set(prev);
          next.delete(workerId);
          return next;
        });
        void runtimeQuery.refetch();
      }
    },
    [runtimeQuery]
  );
  const scrollTmuxSession = useCallback(
    async (workerId, direction, session) => {
      try {
        const res = await fetch("/api/swarm-tmux-scroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workerId, session, direction, lines: 8 })
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("[swarm2] tmux scroll failed:", res.status, text);
        }
      } catch (error) {
        console.error("[swarm2] tmux scroll exception:", error);
      }
    },
    []
  );
  const toggleFocusedRuntimeWorker = useCallback((workerId) => {
    setFocusedRuntimeWorkerId((current) => current === workerId ? null : workerId);
  }, []);
  const runtimeByWorker = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const entry of runtimeQuery.data?.entries ?? [])
      map.set(entry.workerId, entry);
    return map;
  }, [runtimeQuery.data]);
  const members = useMemo(() => {
    const merged = sortSwarmMembers(crew, roomIds).map((member) => {
      const runtime = runtimeByWorker.get(member.id);
      const roster = rosterQuery.data?.find((worker) => worker.id === member.id);
      return {
        ...member,
        displayName: runtime?.displayName || roster?.name || member.displayName,
        role: roster?.role || runtime?.role || member.role,
        specialty: roster?.specialty,
        mission: roster?.mission,
        skills: roster?.skills ?? [],
        capabilities: roster?.capabilities ?? [],
        model: roster?.model || member.model
      };
    });
    const seen = new Set(merged.map((member) => member.id));
    const extras = (rosterQuery.data ?? []).filter((worker) => !seen.has(worker.id)).map((worker) => ({
      id: worker.id,
      displayName: worker.name || worker.id,
      role: worker.role || "Worker",
      profileFound: false,
      gatewayState: "unknown",
      processAlive: false,
      platforms: {},
      model: worker.model || "unknown",
      provider: "roster-only",
      specialty: worker.specialty,
      mission: worker.mission,
      skills: worker.skills ?? [],
      capabilities: worker.capabilities ?? [],
      lastSessionTitle: worker.mission || null,
      lastSessionAt: null,
      sessionCount: 0,
      messageCount: 0,
      toolCallCount: 0,
      totalTokens: 0,
      estimatedCostUsd: null,
      cronJobCount: 0,
      assignedTaskCount: 0
    }));
    return sortSwarmMembers([...merged, ...extras], roomIds);
  }, [crew, roomIds, runtimeByWorker, rosterQuery.data]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        SWARM2_ROOM_STORAGE_KEY,
        JSON.stringify(roomIds)
      );
    } catch {
    }
  }, [roomIds]);
  useEffect(() => {
    if (members.length === 0) {
      setSelectedId(null);
      setFocusedRuntimeWorkerId(null);
      return;
    }
    if (!selectedId || !members.some((member) => member.id === selectedId)) {
      setSelectedId(members[0]?.id ?? null);
    }
    if (focusedRuntimeWorkerId && !members.some((member) => member.id === focusedRuntimeWorkerId)) {
      setFocusedRuntimeWorkerId(null);
    }
  }, [members, selectedId, focusedRuntimeWorkerId]);
  useLayoutEffect(() => {
    return scheduleScrollContextToTop(topRef.current);
  }, []);
  const activeRuntimeCount = members.filter(
    (member) => isRuntimeActive(runtimeByWorker.get(member.id))
  ).length;
  const selectedMember = selectedId ? members.find((member) => member.id === selectedId) : null;
  const selectedLabel = selectedMember?.displayName || selectedId || "none";
  const tmuxAvailable = runtimeQuery.data?.tmuxAvailable ?? true;
  const autoMountTargets = useMemo(() => {
    if (roomIds.length) {
      return members.filter((member) => roomIds.includes(member.id));
    }
    const active = members.filter((member) => {
      const runtime = runtimeByWorker.get(member.id);
      if (runtime?.tmuxAttachable) return true;
      return isRuntimeActive(runtime);
    });
    if (active.length > 0) return active;
    return selectedId ? members.filter((member) => member.id === selectedId) : [];
  }, [members, roomIds, runtimeByWorker, selectedId]);
  const terminalTargets = focusedRuntimeWorkerId ? autoMountTargets.filter((member) => member.id === focusedRuntimeWorkerId) : autoMountTargets;
  const rosterLanes = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const member of members) {
      const role = member.role || "Worker";
      const existing = map.get(role) ?? { role, count: 0, active: 0 };
      existing.count += 1;
      if (isRuntimeActive(runtimeByWorker.get(member.id))) existing.active += 1;
      map.set(role, existing);
    }
    return [...map.values()].sort((a, b) => b.active - a.active || b.count - a.count || a.role.localeCompare(b.role));
  }, [members, runtimeByWorker]);
  const latestMission = useMemo(() => {
    const mission = missionsQuery.data?.[0];
    if (!mission) return null;
    const assignments = mission.assignments ?? [];
    const genericTitle = /^\d+\s+assigned tasks?$/i.test(mission.title.trim()) || /assigned tasks/i.test(mission.title);
    const firstTask = assignments.find((assignment) => assignment.task?.trim())?.task ?? "";
    return {
      id: mission.id,
      title: cleanSwarmLabel(genericTitle ? firstTask : mission.title, "Swarm mission", 72),
      state: mission.state,
      assignmentCount: assignments.length,
      checkpointedCount: assignments.filter((assignment) => ["checkpointed", "done"].includes(assignment.state)).length
    };
  }, [missionsQuery.data]);
  const activeAgents = useMemo(() => {
    return members.map((member) => {
      const runtime = runtimeByWorker.get(member.id);
      const currentTask = runtime?.currentTask?.trim();
      const blocked = Boolean(runtime?.blockedReason || runtime?.needsHuman || runtime?.checkpointStatus === "blocked" || runtime?.checkpointStatus === "needs_input");
      const done = runtime?.checkpointStatus === "done" || runtime?.checkpointStatus === "handoff";
      if (!currentTask && !blocked) return null;
      const state = blocked ? "blocked" : done ? "ready" : `${runtime?.phase ?? ""} ${currentTask ?? ""}`.toLowerCase().includes("review") ? "reviewing" : "working";
      const ts = runtime?.lastOutputAt ?? runtime?.lastSessionStartedAt ?? member.lastSessionAt ?? null;
      return {
        workerId: member.id,
        workerName: member.displayName || member.id,
        role: member.role || runtime?.role || "Worker",
        task: displayTaskTitle(runtime, "Awaiting checkpoint"),
        progress: progressForRuntime(runtime),
        state,
        age: relativeTime(ts),
        ts: ts ?? 0
      };
    }).filter((item) => Boolean(item)).sort((a, b) => {
      const priority = { blocked: 0, reviewing: 1, working: 2, ready: 3 };
      return priority[a.state] - priority[b.state] || b.ts - a.ts || a.workerId.localeCompare(b.workerId);
    }).map((item) => ({
      workerId: item.workerId,
      workerName: item.workerName,
      role: item.role,
      task: item.task,
      progress: item.progress,
      state: item.state,
      age: item.age
    }));
  }, [members, runtimeByWorker]);
  const inboxLanes = useMemo(
    () => buildSwarm2InboxLanes({ missions: missionsQuery.data ?? [], runtimes: runtimeQuery.data?.entries ?? [] }),
    [missionsQuery.data, runtimeQuery.data?.entries]
  );
  const openInboxItem = useCallback((item) => {
    if (item.workerId) {
      setSelectedId(item.workerId);
      setFocusedRuntimeWorkerId(item.workerId);
    }
    setViewMode("reports");
    setNotificationsOpen(false);
  }, []);
  const routeInboxItemToReviewer = useCallback((item) => {
    setSelectedId("swarm6");
    setRouterSeed({
      key: Date.now(),
      mode: "manual",
      prompt: [
        `Review ${item.workerId}'s Swarm control-plane output for mission ${item.missionId ?? "unknown mission"}. Do not broaden scope. Return the required checkpoint format.`,
        "",
        `Task: ${item.title}`,
        `Summary: ${item.summary}`,
        `Checkpoint: ${item.checkpointStatus ?? item.stateLabel}`,
        `Blocker: ${item.blocker ?? "none"}`,
        `Next action: ${item.nextAction ?? "none"}`
      ].join("\n")
    });
    setRouterOpen(true);
    setViewMode("reports");
  }, []);
  const swarmNotifications = useMemo(() => {
    const laneItems = [
      ...inboxLanes.needs_review.map((item) => ({
        id: `review-${item.id}`,
        workerId: item.workerId,
        title: `${item.workerName} · Needs review`,
        body: item.summary,
        age: relativeTime(item.updatedAt),
        actionable: true
      })),
      ...inboxLanes.blocked.map((item) => ({
        id: `blocked-${item.id}`,
        workerId: item.workerId,
        title: `${item.workerName} · Needs input`,
        body: item.blocker ?? item.summary,
        age: relativeTime(item.updatedAt),
        actionable: true
      })),
      ...inboxLanes.ready.map((item) => ({
        id: `ready-${item.id}`,
        workerId: item.workerId,
        title: `${item.workerName} · Ready`,
        body: item.summary,
        age: relativeTime(item.updatedAt),
        actionable: true
      }))
    ];
    if (latestMission) {
      laneItems.unshift({
        id: `mission-${latestMission.id}`,
        workerId: "",
        title: `Mission ${latestMission.state}`,
        body: `${latestMission.checkpointedCount}/${latestMission.assignmentCount} checkpointed · ${latestMission.title}`,
        age: latestMission.id,
        actionable: latestMission.checkpointedCount < latestMission.assignmentCount
      });
    }
    return laneItems.slice(0, 8);
  }, [inboxLanes, latestMission]);
  const actionableNotificationCount = swarmNotifications.filter((item) => item.actionable).length;
  const recentUpdates = useMemo(() => {
    return members.map((member) => {
      const runtime = runtimeByWorker.get(member.id);
      const ts = runtime?.lastOutputAt ?? runtime?.lastSessionStartedAt ?? member.lastSessionAt ?? null;
      const rawText = runtime?.lastRealSummary ?? runtime?.lastRealResult ?? runtime?.lastSummary ?? runtime?.lastResult ?? runtime?.blockedReason ?? runtime?.currentTask ?? member.lastSessionTitle ?? `Ready in ${member.role || "worker"} lane`;
      const state = (runtime?.phase || runtime?.currentTask || "").toLowerCase();
      const tone = runtime?.blockedReason ? "warning" : state.includes("review") || state.includes("write") || state.includes("build") || state.includes("implement") || state.includes("active") ? "active" : "idle";
      return {
        workerId: member.id,
        workerName: member.displayName || member.id,
        text: compactText(rawText, 72),
        age: relativeTime(ts),
        ts: ts ?? 0,
        tone
      };
    }).sort((a, b) => b.ts - a.ts || a.workerId.localeCompare(b.workerId)).slice(0, 3).map(({ workerId, workerName, text, age, tone }) => ({ workerId, workerName, text, age, tone }));
  }, [members, runtimeByWorker]);
  function toggleRoom(id) {
    setRoomIds(
      (current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }
  function openAddSwarm() {
    const existingIds = new Set((rosterQuery.data ?? []).map((worker) => worker.id));
    let next = 13;
    while (existingIds.has(`swarm${next}`)) next += 1;
    setNewWorkerId(`swarm${next}`);
    setNewWorkerName(`Swarm${next}`);
    setNewWorkerRole("Builder");
    setNewWorkerSpecialty("");
    setNewWorkerModel("");
    setNewWorkerMission("");
    setAddSwarmError(null);
    setAddSwarmOpen(true);
  }
  async function saveAddSwarm() {
    setAddSwarmSaving(true);
    setAddSwarmError(null);
    try {
      const preset = ROLE_PRESETS.find((p) => p.role === newWorkerRole);
      const res = await fetch("/api/swarm-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newWorkerId.trim(),
          name: newWorkerName.trim(),
          role: newWorkerRole.trim(),
          specialty: newWorkerSpecialty.trim() || preset?.specialty || "",
          model: newWorkerModel.trim(),
          mission: newWorkerMission.trim() || preset?.mission || "Awaiting orchestrator dispatch.",
          systemPrompt: preset?.systemPrompt ?? null,
          skills: preset?.skills ?? []
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      await rosterQuery.refetch();
      setAddSwarmOpen(false);
    } catch (error) {
      setAddSwarmError(error instanceof Error ? error.message : "Failed to save swarm agent");
    } finally {
      setAddSwarmSaving(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { ref: topRef, className: "min-h-full bg-surface text-primary-900", style: SWARM2_OPERATION_THEME, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "mx-auto flex min-h-full max-w-[1680px] flex-col gap-3 px-3 pt-3 sm:px-4 lg:px-5",
          routerOpen ? "pb-[30rem]" : "pb-24"
        ),
        children: [
          /* @__PURE__ */ jsx("header", { className: "rounded-xl border border-primary-200 bg-primary-50/80 px-5 py-3 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-accent)] shadow-sm", children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: UserMultipleIcon, size: 22 }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("h1", { className: "truncate text-base font-semibold text-primary-900", children: "Swarm" }),
                /* @__PURE__ */ jsx("p", { className: "truncate text-xs text-[var(--theme-muted-2)]", children: members.length > 0 ? `Detected ${members.length} worker${members.length === 1 ? "" : "s"} for planning, routing, reports, and reviewer-gated execution.` : "Detected Hermes profiles and roster workers for planning, routing, reports, and reviewer-gated execution." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative flex shrink-0 items-center gap-2 text-sm text-[var(--theme-muted)]", children: [
              /* @__PURE__ */ jsx(
                WorkflowHelpModal,
                {
                  compact: true,
                  eyebrow: "Swarm",
                  title: "How Swarm works",
                  sections: [
                    {
                      title: "What this surface does",
                      bullets: [
                        "Swarm turns a group of workers into one coordinated execution surface.",
                        "Use it to route tasks, monitor state, and keep parallel work moving without losing context."
                      ]
                    },
                    {
                      title: "Typical flow",
                      bullets: [
                        "Review worker state, then dispatch or reroute work from the orchestration controls.",
                        "Use reports, inbox, and runtime signals to spot blockers and pull workers back on track."
                      ]
                    },
                    {
                      title: "FAQ",
                      bullets: [
                        "If a worker is missing setup or model config, fix that in Operations first.",
                        "Swarm2 is the operational coordination layer, not the first-time setup screen."
                      ]
                    }
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setNotificationsOpen((open) => !open),
                  className: "relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] text-base shadow-sm hover:bg-[var(--theme-card2)]",
                  "aria-label": "Swarm notifications",
                  title: "Swarm notifications",
                  children: [
                    /* @__PURE__ */ jsx(HugeiconsIcon, { icon: AlarmClockIcon, size: 17, strokeWidth: 1.8 }),
                    actionableNotificationCount > 0 ? /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white", children: actionableNotificationCount }) : null
                  ]
                }
              ),
              notificationsOpen ? /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-12 z-40 w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-3 text-left shadow-[0_24px_80px_var(--theme-shadow)]", children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: "Swarm updates" }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-[var(--theme-muted-2)]", children: "Actionable state from canonical mission checkpoints and durable report lanes." })
                  ] }),
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setNotificationsOpen(false), className: "rounded-lg px-2 py-1 text-xs hover:bg-[var(--theme-card2)]", children: "Close" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "max-h-80 space-y-2 overflow-y-auto", children: swarmNotifications.length ? swarmNotifications.map((item) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      if (item.workerId) {
                        setViewMode("reports");
                        setSelectedId(item.workerId);
                        setFocusedRuntimeWorkerId(item.workerId);
                      }
                      setNotificationsOpen(false);
                    },
                    className: "block w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-left hover:border-[var(--theme-accent)]",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                        /* @__PURE__ */ jsx("span", { className: "truncate text-sm font-medium text-[var(--theme-text)]", children: item.title }),
                        /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[10px] text-[var(--theme-muted)]", children: item.age })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "mt-1 truncate text-xs text-[var(--theme-muted-2)]", children: item.body })
                    ]
                  },
                  item.id
                )) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-3 text-xs text-[var(--theme-muted)]", children: "No active swarm updates." }) })
              ] }) : null,
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: openAddSwarm,
                  className: "inline-flex items-center gap-2 rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-sm font-medium text-primary-950 shadow-sm hover:bg-[var(--theme-accent-strong)]",
                  children: [
                    /* @__PURE__ */ jsx(HugeiconsIcon, { icon: MessageMultiple01Icon, size: 13 }),
                    "Add Swarm"
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "grid min-h-0 grid-cols-1 gap-3", children: /* @__PURE__ */ jsx(
            ControlPlaneStage,
            {
              members,
              selectedId,
              roomIds,
              activeRuntimeCount,
              authErrors: healthQuery.data?.summary.totalAuthErrors24h ?? 0,
              selectedLabel,
              workspaceModel: healthQuery.data?.workspaceModel ?? null,
              lanes: rosterLanes,
              activeAgents,
              viewMode,
              onViewModeChange: setViewMode,
              onOpenRouter: () => setRouterOpen(true),
              onRouterResults: () => {
                void runtimeQuery.refetch();
                void missionsQuery.refetch();
              },
              onSelect: (workerId) => setSelectedId(workerId),
              onToggleRoom: (workerId) => toggleRoom(workerId),
              onOpenTui: (workerId) => {
                setSelectedId(workerId);
                setViewMode("runtime");
              },
              onOpenTasks: (workerId) => {
                setSelectedId(workerId);
                setRouterOpen(true);
              },
              runtimeByWorker,
              recentUpdates,
              latestMission,
              missions: missionsQuery.data ?? [],
              runtimeEntries: runtimeQuery.data?.entries ?? [],
              inboxCounts: {
                needsReview: inboxLanes.needs_review.length,
                blocked: inboxLanes.blocked.length,
                ready: inboxLanes.ready.length
              },
              routerSeed,
              onOpenInboxItem: openInboxItem,
              onRouteToReviewer: routeInboxItemToReviewer,
              terminalTargets,
              tmuxAvailable,
              pendingTmux,
              focusedRuntimeWorkerId,
              onToggleFocusedRuntimeWorker: toggleFocusedRuntimeWorker,
              onClearFocusedRuntimeWorker: () => setFocusedRuntimeWorkerId(null),
              onStartAgentSession: (workerId) => {
                void startAgentSession(workerId);
              },
              onScrollTmuxSession: (workerId, direction, session) => {
                void scrollTmuxSession(workerId, direction, session);
              }
            }
          ) }),
          viewMode === "cards" && members.length > 0 ? /* @__PURE__ */ jsx(
            Swarm2ActivityFeed,
            {
              members,
              runtimeByWorker,
              selectedId,
              onSelect: (workerId) => setSelectedId(workerId)
            }
          ) : null
        ]
      }
    ),
    addSwarmOpen ? /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-2xl rounded-3xl border border-[var(--theme-border2)] bg-[var(--theme-card)] p-6 shadow-[0_30px_100px_var(--theme-shadow)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-[var(--theme-text)]", children: "Add Swarm Agent" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--theme-muted-2)]", children: "Create a new swarm roster entry and configure its identity." })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setAddSwarmOpen(false),
            className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-1.5 text-[var(--theme-muted)] hover:text-[var(--theme-text)]",
            children: "Close"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-sm md:col-span-2", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[var(--theme-muted)]", children: "Role preset" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: newWorkerRole,
              onChange: (e) => {
                const role = e.target.value;
                setNewWorkerRole(role);
                const preset = ROLE_PRESETS.find((p) => p.role === role);
                if (preset && role !== "Custom") {
                  if (!newWorkerSpecialty.trim()) setNewWorkerSpecialty(preset.specialty);
                  if (!newWorkerMission.trim()) setNewWorkerMission(preset.mission);
                  if (preset.defaultModel && !newWorkerModel.trim()) setNewWorkerModel(preset.defaultModel);
                }
              },
              className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none",
              children: ROLE_NAMES.map((r) => /* @__PURE__ */ jsx("option", { value: r, children: r }, r))
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: "Presets auto-fill specialty, mission, system prompt, and skill stack. Pick “Custom” for a blank slate." })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[var(--theme-muted)]", children: "Worker ID" }),
          /* @__PURE__ */ jsx("input", { value: newWorkerId, onChange: (e) => setNewWorkerId(e.target.value), className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none", placeholder: "swarmN" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[var(--theme-muted)]", children: "Display name" }),
          /* @__PURE__ */ jsx("input", { value: newWorkerName, onChange: (e) => setNewWorkerName(e.target.value), className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none", placeholder: "e.g. Mirror, Builder" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-sm md:col-span-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "mb-1 flex items-center justify-between text-[var(--theme-muted)]", children: [
            /* @__PURE__ */ jsx("span", { children: "Model" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[var(--theme-muted-2)]", children: availableModels.length > 0 ? `${availableModels.length} available` : modelsQuery.isLoading ? "loading…" : "0 found" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: newWorkerModel,
              onChange: (e) => setNewWorkerModel(e.target.value),
              list: "swarm-add-models",
              placeholder: availableModels.length ? "Search or pick a detected model…" : modelsQuery.isLoading ? "Loading detected models…" : "No models detected",
              className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none"
            }
          ),
          /* @__PURE__ */ jsx("datalist", { id: "swarm-add-models", children: availableModels.map((m) => /* @__PURE__ */ jsx("option", { value: m.name, children: m.provider }, m.id)) }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: [
            "Searchable picker backed by /api/models, the same source as chat. ",
            modelsQuery.isError ? "Model discovery errored, so this is empty until refresh." : "Start typing to see every detected model from the user’s Hermes config and local providers."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-sm md:col-span-2", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[var(--theme-muted)]", children: "Specialty" }),
          /* @__PURE__ */ jsx("input", { value: newWorkerSpecialty, onChange: (e) => setNewWorkerSpecialty(e.target.value), className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none", placeholder: ROLE_PRESETS.find((p) => p.role === newWorkerRole)?.specialty || "short focus area" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block text-sm md:col-span-2", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-1 block text-[var(--theme-muted)]", children: "Mission" }),
          /* @__PURE__ */ jsx("textarea", { value: newWorkerMission, onChange: (e) => setNewWorkerMission(e.target.value), rows: 3, className: "w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 text-[var(--theme-text)] outline-none", placeholder: ROLE_PRESETS.find((p) => p.role === newWorkerRole)?.mission || "standing mission for this worker" })
        ] }),
        ROLE_PRESETS.find((p) => p.role === newWorkerRole)?.systemPrompt ? /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-2 text-xs text-[var(--theme-muted-2)]", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-1 font-semibold text-[var(--theme-muted)]", children: "System prompt (embedded with role)" }),
          /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap leading-relaxed", children: ROLE_PRESETS.find((p) => p.role === newWorkerRole)?.systemPrompt }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 font-semibold text-[var(--theme-muted)]", children: "Skills loaded" }),
          /* @__PURE__ */ jsx("div", { className: "font-mono", children: (ROLE_PRESETS.find((p) => p.role === newWorkerRole)?.skills ?? []).join(", ") || "—" })
        ] }) : null
      ] }),
      addSwarmError ? /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200", children: addSwarmError }) : null,
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-end gap-3", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setAddSwarmOpen(false), className: "rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-2 text-sm text-[var(--theme-muted)] hover:text-[var(--theme-text)]", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { type: "button", disabled: addSwarmSaving || !newWorkerId.trim() || !newWorkerName.trim(), onClick: () => void saveAddSwarm(), className: "rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-sm font-medium text-primary-950 disabled:opacity-50", children: addSwarmSaving ? "Saving…" : "Save swarm agent" })
      ] })
    ] }) }) : null,
    /* @__PURE__ */ jsx(
      RouterChat,
      {
        members,
        roomIds,
        selectedId,
        open: routerOpen,
        showClosedDock: false,
        seedPrompt: routerSeed?.prompt ?? null,
        seedMode: routerSeed?.mode,
        seedKey: routerSeed?.key ?? null,
        onOpen: () => setRouterOpen(true),
        onClose: () => setRouterOpen(false),
        onResults: () => {
          void runtimeQuery.refetch();
          void missionsQuery.refetch();
        }
      }
    )
  ] });
}
export {
  Swarm2Screen as S
};
