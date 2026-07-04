import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { Rocket01Icon, Settings01Icon, Search01Icon, PlayIcon, TaskDone01Icon, ArrowRight01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { v as fetchSessions, c as cn, B as Button, j as Markdown } from "./router-DmH5gXcK.js";
import { W as WorkflowHelpModal, O as OfficeView } from "./workflow-help-modal-Z4pLvAKJ.js";
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
const ACTIVE_MISSION_STORAGE_KEY = "conductor:active-mission";
const CONDUCTOR_SETTINGS_STORAGE_KEY = "conductor-settings";
const DEFAULT_CONDUCTOR_SETTINGS = {
  orchestratorModel: "",
  workerModel: "",
  projectsDir: "",
  maxParallel: 1,
  supervised: false
};
function shouldPersistActiveConductorMission(phase) {
  return phase === "decomposing" || phase === "running";
}
const HISTORY_STORAGE_KEY = "conductor:history";
const MAX_HISTORY_ENTRIES = 50;
const AGENT_NAMES$1 = ["Nova", "Pixel", "Blaze", "Echo", "Sage", "Drift", "Flux", "Volt"];
const AGENT_EMOJIS$1 = ["🤖", "⚡", "🔥", "🌊", "🌿", "💫", "🔮", "⭐"];
function getAgentPersona$1(index) {
  return {
    name: AGENT_NAMES$1[index % AGENT_NAMES$1.length],
    emoji: AGENT_EMOJIS$1[index % AGENT_EMOJIS$1.length]
  };
}
function extractTasksFromPlan(planText) {
  const tasks = [];
  const patterns = [/^\s*(\d+)\.\s+(.+)$/gm, /^\s*#{1,3}\s+(?:Step\s+)?(\d+)[.:]\s*(.+)$/gm, /^\s*-\s+\*\*(?:Task\s+)?(\d+)[.:]\s*\*\*\s*(.+)$/gm];
  const seen = /* @__PURE__ */ new Set();
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(planText)) !== null) {
      const num = match[1];
      const title = match[2].replace(/\*\*/g, "").trim();
      const id = `task-${num}`;
      if (!seen.has(id) && title.length > 3 && title.length < 200) {
        seen.add(id);
        tasks.push({
          id,
          title,
          status: "pending",
          workerKey: null,
          output: null
        });
      }
    }
  }
  tasks.sort((a, b) => {
    const numA = parseInt(a.id.replace("task-", ""), 10);
    const numB = parseInt(b.id.replace("task-", ""), 10);
    return numA - numB;
  });
  return tasks;
}
function readString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
function readNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function readRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value;
}
function toIso(value) {
  if (typeof value === "string" && value.trim()) {
    const ms = new Date(value).getTime();
    return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }
  return null;
}
function normalizeMatchText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
function getSessionSearchText(session) {
  return [
    readString(session.label),
    readString(session.title),
    readString(session.derivedTitle),
    readString(session.preview),
    readString(session.kind)
  ].filter((value) => Boolean(value)).join(" ");
}
function buildMissionNeedles(goal) {
  const words = normalizeMatchText(goal).split(" ").filter(Boolean);
  const prefixes = [5, 8, 12].map((count) => words.slice(0, count).join(" ").trim()).filter(Boolean);
  return [...new Set(prefixes)];
}
function sessionMatchesMissionContext(session, missionStartMs, missionNeedles) {
  const createdAt = toIso(session.createdAt ?? session.startedAt ?? session.updatedAt);
  if (!createdAt) return false;
  const createdMs = new Date(createdAt).getTime();
  if (!Number.isFinite(createdMs) || createdMs < missionStartMs) return false;
  const totalTokens = readNumber(session.totalTokens) ?? readNumber(session.tokenCount) ?? 0;
  if (totalTokens <= 0) return false;
  const text = normalizeMatchText(getSessionSearchText(session));
  if (!text) return false;
  if (text.includes("mission orchestrator")) return true;
  if (text.includes("dashboard-backed conductor")) return true;
  if (text.includes("conductor mission")) return true;
  return missionNeedles.some((needle) => text.includes(needle));
}
function loadPersistedMission() {
  try {
    const raw = globalThis.localStorage?.getItem(ACTIVE_MISSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const missionId = readString(parsed.missionId);
    const missionJobId = readString(parsed.missionJobId);
    const goal = typeof parsed.goal === "string" ? parsed.goal : null;
    const phase = parsed.phase;
    const streamText = typeof parsed.streamText === "string" ? parsed.streamText : null;
    const planText = typeof parsed.planText === "string" ? parsed.planText : null;
    const workerKeys = Array.isArray(parsed.workerKeys) ? parsed.workerKeys.filter((value) => typeof value === "string") : null;
    const workerLabels = Array.isArray(parsed.workerLabels) ? parsed.workerLabels.filter((value) => typeof value === "string") : null;
    const workerOutputs = parsed.workerOutputs && typeof parsed.workerOutputs === "object" && !Array.isArray(parsed.workerOutputs) ? Object.fromEntries(Object.entries(parsed.workerOutputs).filter((entry) => typeof entry[0] === "string" && typeof entry[1] === "string")) : {};
    const missionStartedAt = parsed.missionStartedAt === null || parsed.missionStartedAt === void 0 ? null : toIso(parsed.missionStartedAt);
    const isPaused = parsed.isPaused === true;
    const pausedElapsedMs = typeof parsed.pausedElapsedMs === "number" && Number.isFinite(parsed.pausedElapsedMs) ? Math.max(0, parsed.pausedElapsedMs) : 0;
    const accumulatedPausedMs = typeof parsed.accumulatedPausedMs === "number" && Number.isFinite(parsed.accumulatedPausedMs) ? Math.max(0, parsed.accumulatedPausedMs) : 0;
    const pauseStartedAt = parsed.pauseStartedAt === null || parsed.pauseStartedAt === void 0 ? null : toIso(parsed.pauseStartedAt);
    const completedAt = parsed.completedAt === null || parsed.completedAt === void 0 ? null : toIso(parsed.completedAt);
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks.map((task) => {
      const record = readRecord(task);
      if (!record) return null;
      const id = readString(record.id);
      const title = readString(record.title);
      const status = record.status;
      if (!id || !title || status !== "pending" && status !== "running" && status !== "complete" && status !== "failed") {
        return null;
      }
      return {
        id,
        title,
        status,
        workerKey: record.workerKey === null || record.workerKey === void 0 ? null : readString(record.workerKey),
        output: record.output === null || record.output === void 0 ? null : readString(record.output)
      };
    }).filter((task) => task !== null) : [];
    if (!goal || phase !== "idle" && phase !== "decomposing" && phase !== "running" && phase !== "complete" || streamText === null || planText === null || !workerKeys || !workerLabels) {
      return null;
    }
    if (!shouldPersistActiveConductorMission(phase)) {
      clearPersistedMission();
      return null;
    }
    return {
      missionId,
      missionJobId,
      goal,
      phase,
      missionStartedAt,
      isPaused,
      pausedElapsedMs,
      accumulatedPausedMs,
      pauseStartedAt,
      workerKeys,
      workerLabels,
      workerOutputs,
      streamText,
      planText,
      completedAt,
      tasks
    };
  } catch {
    return null;
  }
}
function loadConductorSettings() {
  try {
    const raw = globalThis.localStorage?.getItem(CONDUCTOR_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_CONDUCTOR_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      orchestratorModel: typeof parsed.orchestratorModel === "string" ? parsed.orchestratorModel : DEFAULT_CONDUCTOR_SETTINGS.orchestratorModel,
      workerModel: typeof parsed.workerModel === "string" ? parsed.workerModel : DEFAULT_CONDUCTOR_SETTINGS.workerModel,
      projectsDir: typeof parsed.projectsDir === "string" ? parsed.projectsDir : DEFAULT_CONDUCTOR_SETTINGS.projectsDir,
      maxParallel: Math.min(5, Math.max(1, typeof parsed.maxParallel === "number" && Number.isFinite(parsed.maxParallel) ? Math.round(parsed.maxParallel) : DEFAULT_CONDUCTOR_SETTINGS.maxParallel)),
      supervised: typeof parsed.supervised === "boolean" ? parsed.supervised : DEFAULT_CONDUCTOR_SETTINGS.supervised
    };
  } catch {
    return DEFAULT_CONDUCTOR_SETTINGS;
  }
}
function persistConductorSettings(settings) {
  try {
    globalThis.localStorage?.setItem(CONDUCTOR_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
  }
}
function loadMissionHistory() {
  try {
    const raw = globalThis.localStorage?.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = /* @__PURE__ */ new Set();
    return parsed.filter((entry) => {
      if (!entry || typeof entry !== "object") return false;
      const e = entry;
      if (typeof e.id !== "string" || typeof e.goal !== "string" || typeof e.startedAt !== "string") return false;
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    }).map((entry) => {
      const projectPath = typeof entry.projectPath === "string" && entry.projectPath.trim() || extractProjectPath$1(typeof entry.projectPath === "string" ? entry.projectPath : "") || null;
      const outputText = typeof entry.outputText === "string" ? entry.outputText : void 0;
      const streamText = typeof entry.streamText === "string" ? entry.streamText : void 0;
      const outputPath = typeof entry.outputPath === "string" && entry.outputPath.trim() || extractProjectPath$1(typeof entry.outputPath === "string" ? entry.outputPath : "") || projectPath || extractProjectPath$1(outputText ?? "") || extractProjectPath$1(streamText ?? "") || null;
      return {
        ...entry,
        projectPath,
        outputPath,
        outputText,
        streamText
      };
    }).slice(0, MAX_HISTORY_ENTRIES);
  } catch {
    return [];
  }
}
function appendMissionHistory(entry) {
  try {
    const current = loadMissionHistory();
    const filtered = current.filter((e) => e.id !== entry.id);
    const updated = [entry, ...filtered].slice(0, MAX_HISTORY_ENTRIES);
    globalThis.localStorage?.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
  }
}
function persistMission(state) {
  try {
    globalThis.localStorage?.setItem(ACTIVE_MISSION_STORAGE_KEY, JSON.stringify(state));
  } catch {
  }
}
function clearPersistedMission() {
  try {
    globalThis.localStorage?.removeItem(ACTIVE_MISSION_STORAGE_KEY);
  } catch {
  }
}
function clearMissionHistoryStorage() {
  try {
    globalThis.localStorage?.removeItem(HISTORY_STORAGE_KEY);
  } catch {
  }
}
function readContextTokens(session) {
  return readNumber(session.contextTokens) ?? readNumber(session.maxTokens) ?? readNumber(session.contextWindow) ?? readNumber(session.usage && typeof session.usage === "object" ? session.usage.contextTokens : null) ?? 0;
}
function deriveWorkerStatus(session, updatedAt) {
  const status = readString(session.status)?.toLowerCase();
  if (status && ["complete", "completed", "done", "success", "succeeded"].includes(status)) return "complete";
  if (status && ["idle", "waiting", "sleeping"].includes(status)) return "idle";
  if (status && ["error", "errored", "failed", "cancelled", "canceled", "killed"].includes(status)) return "stale";
  const updatedMs = updatedAt ? new Date(updatedAt).getTime() : 0;
  const staleness = updatedMs > 0 ? Date.now() - updatedMs : 0;
  const totalTokens = readNumber(session.totalTokens) ?? readNumber(session.tokenCount) ?? 0;
  if (totalTokens > 0 && staleness > 1e4) return "complete";
  if (staleness > 12e4) return "stale";
  return "running";
}
function workersLookComplete(workers, staleAfterMs) {
  if (workers.length === 0) return false;
  return workers.every((worker) => {
    if (worker.totalTokens <= 0) return false;
    if (!worker.updatedAt) return false;
    const updatedMs = new Date(worker.updatedAt).getTime();
    if (!Number.isFinite(updatedMs)) return false;
    return Date.now() - updatedMs >= staleAfterMs;
  });
}
function prettifyCronLabel(value) {
  const cronMatch = value.match(/^cron[_:]([0-9a-f]{6,})/i);
  if (cronMatch) {
    return `Mission ${cronMatch[1].slice(0, 6)}`;
  }
  const conductorMatch = value.match(/^conductor[-_](\d+)/i);
  if (conductorMatch) {
    return `Mission ${conductorMatch[1].slice(-6)}`;
  }
  return value.replace(/[-_]+/g, " ").trim();
}
function formatDisplayName(session) {
  const label = readString(session.label);
  if (label) {
    if (/^cron[_:]|^conductor[-_]/i.test(label)) return prettifyCronLabel(label);
    return label.replace(/^worker-/, "").replace(/[-_]+/g, " ");
  }
  const title = readString(session.title) ?? readString(session.derivedTitle);
  if (title) {
    if (/^cron[_:]|^conductor[-_]/i.test(title)) return prettifyCronLabel(title);
    return title;
  }
  const key = readString(session.key) ?? "worker";
  if (/^cron[_:]/i.test(key)) return prettifyCronLabel(key);
  return key.split(":").pop()?.replace(/[-_]+/g, " ") ?? key;
}
function formatTokenUsage(totalTokens, contextTokens) {
  if (contextTokens > 0) return `${totalTokens.toLocaleString()} / ${contextTokens.toLocaleString()} tok`;
  return `${totalTokens.toLocaleString()} tok`;
}
function toWorker(session) {
  const key = readString(session.key);
  if (!key) return null;
  const label = readString(session.label) ?? "worker";
  const updatedAt = toIso(session.updatedAt ?? session.startedAt ?? session.createdAt);
  const totalTokens = readNumber(session.totalTokens) ?? readNumber(session.tokenCount) ?? 0;
  const contextTokens = readContextTokens(session);
  return {
    key,
    label,
    model: readString(session.model),
    status: deriveWorkerStatus(session, updatedAt),
    updatedAt,
    displayName: formatDisplayName(session),
    totalTokens,
    contextTokens,
    tokenUsageLabel: formatTokenUsage(totalTokens, contextTokens),
    raw: session
  };
}
function extractHistoryMessageText(message) {
  if (!message) return "";
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.content)) {
    return message.content.map((part) => typeof part?.text === "string" ? part.text : "").filter(Boolean).join("\n");
  }
  return "";
}
function getLastAssistantMessage$1(messages) {
  if (!Array.isArray(messages)) return "";
  let best = "";
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role !== "assistant") continue;
    const text = extractHistoryMessageText(message).trim();
    if (text.length > best.length) best = text;
  }
  return best;
}
function readMissionLines(mission) {
  if (!Array.isArray(mission?.lines)) return [];
  return mission.lines.filter((line) => typeof line === "string");
}
function extractSessionIdFromMission(mission) {
  const direct = readString(mission?.session_id);
  if (direct) return direct;
  const lines = readMissionLines(mission);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const match = lines[index].match(/\bsession_id:\s*([A-Za-z0-9_.:-]+)/);
    if (match?.[1]) return match[1];
  }
  return null;
}
function formatMissionLog(lines) {
  return lines.map((line) => line.trimEnd()).filter((line) => line.trim().length > 0).join("\n").slice(-1e4);
}
function isFailedMissionStatus(status) {
  return status === "failed" || status === "error" || status === "errored" || status === "cancelled" || status === "canceled";
}
function isCompletedMissionStatus(status) {
  return status === "completed" || status === "complete" || status === "done" || status === "success";
}
async function fetchConductorMission(missionId) {
  const response = await fetch(`/api/conductor-spawn?missionId=${encodeURIComponent(missionId)}&lines=400`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok || !payload.mission) {
    throw new Error(payload.error || `Failed to load conductor mission ${missionId}`);
  }
  return payload.mission;
}
function extractProjectPath$1(text) {
  const structuredPatterns = [
    /\b(?:Created|Output|Wrote|Saved to|Built|Generated|Written to)\s+(\/tmp\/dispatch-[^\s"')`\]>]+)/gi,
    /\b(?:Created|Output|Wrote|Saved to|Built|Generated|Written to)\s*:\s*(\/tmp\/dispatch-[^\s"')`\]>]+)/gi
  ];
  for (const pattern of structuredPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const raw = match[1];
      if (!raw) continue;
      const cleaned = raw.replace(/[.,;:!?`]+$/, "");
      const normalized = cleaned.replace(/\/(index\.html|dist|build)\/?$/i, "");
      if (normalized.startsWith("/tmp/dispatch-")) return normalized;
    }
  }
  const matches = text.match(/\/tmp\/dispatch-[^\s"')`\]>]+/g) ?? [];
  for (const raw of matches) {
    const cleaned = raw.replace(/[.,;:!?\-`]+$/, "");
    const normalized = cleaned.replace(/\/(index\.html|dist|build)\/?$/i, "");
    if (normalized.startsWith("/tmp/dispatch-")) return normalized;
  }
  const tmpMatches = text.match(/\/tmp\/[a-zA-Z0-9][^\s"')`\]>]+/g) ?? [];
  for (const raw of tmpMatches) {
    const cleaned = raw.replace(/[.,;:!?\-`]+$/, "");
    const normalized = cleaned.replace(/\/(index\.html|dist|build)\/?$/i, "");
    if (normalized.length > 5) return normalized;
  }
  return null;
}
function buildMissionOutputPath(workers, workerOutputs, tasks, streamText) {
  const workerOutputTexts = [...Object.values(workerOutputs), ...workers.map((worker) => getLastAssistantMessage$1(worker.raw.messages))].filter(Boolean);
  for (const text of workerOutputTexts) {
    const extractedPath = extractProjectPath$1(text);
    if (extractedPath) return extractedPath;
  }
  for (const task of tasks) {
    if (!task.output) continue;
    const extractedPath = extractProjectPath$1(task.output);
    if (extractedPath) return extractedPath;
  }
  const streamPath = extractProjectPath$1(streamText);
  if (streamPath) return streamPath;
  return null;
}
function summarizeWorkers(workers) {
  return workers.map((worker) => {
    const output = getLastAssistantMessage$1(worker.raw.messages);
    const firstLine = output.split(/\n+/).map((line) => line.trim()).find(Boolean);
    const statusLabel = worker.status === "stale" ? "failed" : worker.status;
    return `${worker.displayName}: ${firstLine ?? `${statusLabel} · ${worker.totalTokens.toLocaleString()} tok`}`;
  });
}
function buildCompleteSummary(params) {
  const { goal, streamError, missionStartedAt, completedAt, totalWorkers, totalTokens, outputPath } = params;
  const durationMs = Math.max(0, new Date(completedAt).getTime() - new Date(missionStartedAt).getTime());
  const totalSeconds = Math.floor(durationMs / 1e3);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  const duration = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  const lines = [streamError ? `❌ ${streamError}` : "✅ Mission completed successfully", "", `**Goal:** ${goal}`, `**Duration:** ${duration}`];
  if (totalWorkers > 0) {
    lines.push(`**Workers:** ${totalWorkers} ran · ${totalTokens.toLocaleString()} tokens`);
  }
  if (outputPath) {
    lines.push(`**Output:** ${outputPath.split("/").pop() || "Output ready"}`);
  }
  return lines.join("\n");
}
function buildMissionOutputText(workers, workerOutputs, streamText) {
  const workerSections = workers.map((worker) => {
    const output = (workerOutputs[worker.key] ?? getLastAssistantMessage$1(worker.raw.messages)).trim();
    if (!output) return null;
    return `### ${worker.displayName}

${output}`;
  }).filter((section) => section !== null);
  if (workerSections.length > 0) {
    return workerSections.join("\n\n---\n\n").slice(0, 5e3);
  }
  return streamText.trim().slice(0, 5e3);
}
async function fetchWorkerOutput(sessionKey, limit = 5) {
  const response = await fetch(`/api/history?sessionKey=${encodeURIComponent(sessionKey)}&limit=${limit}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Failed to load history for ${sessionKey}`);
  }
  return getLastAssistantMessage$1(payload.messages);
}
function appendStreamEvent(update, event) {
  update((current) => [...current.slice(-99), event]);
}
function readStreamText(event, payload, currentText) {
  if (event !== "chunk" && event !== "assistant") return null;
  const text = readString(payload.delta) ?? readString(payload.text) ?? readString(payload.content) ?? readString(payload.chunk);
  if (!text) return null;
  return payload.fullReplace === true || event === "assistant" ? text : currentText + text;
}
function readDoneMessageText(payload) {
  const message = readRecord(payload.message);
  return extractHistoryMessageText(message).trim();
}
async function streamPortableConductorMission(params) {
  const response = await fetch("/api/send-stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionKey: params.sessionKey,
      friendlyId: params.friendlyId,
      message: params.prompt,
      history: [],
      idempotencyKey: crypto.randomUUID(),
      model: params.model || void 0,
      locale: typeof window !== "undefined" ? localStorage.getItem("hermes-workspace-locale") || "en" : "en"
    }),
    signal: params.signal
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Conductor stream failed (${response.status})`);
  }
  let sessionKey = response.headers.get("x-hermes-session-key")?.trim() || params.sessionKey;
  let runId = null;
  let accumulated = "";
  let sawDone = false;
  params.onSessionResolved(sessionKey, runId);
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Conductor stream did not include a response body");
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      if (!block.trim()) continue;
      const lines = block.split("\n");
      let event = "";
      let data = "";
      for (const line of lines) {
        if (line.startsWith("event: ")) {
          event = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          data += line.slice(6);
        } else if (line.startsWith("data:")) {
          data += line.slice(5);
        }
      }
      if (!event || !data) continue;
      let payload;
      try {
        payload = readRecord(JSON.parse(data)) ?? {};
      } catch {
        continue;
      }
      if (event === "started") {
        runId = readString(payload.runId) ?? runId;
        sessionKey = readString(payload.sessionKey) ?? sessionKey;
        params.onSessionResolved(sessionKey, runId);
        params.onStreamEvent({ type: "started", runId: runId ?? void 0, sessionKey });
        continue;
      }
      const nextText = readStreamText(event, payload, accumulated);
      if (nextText !== null) {
        accumulated = nextText;
        params.onText(accumulated);
        continue;
      }
      if (event === "thinking") {
        const text = readString(payload.text) ?? readString(payload.thinking);
        if (text) params.onStreamEvent({ type: "thinking", text });
        continue;
      }
      if (event === "tool") {
        const name = readString(payload.name) ?? void 0;
        const phase = readString(payload.phase) ?? void 0;
        params.onStreamEvent({ type: "tool", name, phase, data: payload });
        continue;
      }
      if (event === "done" || event === "complete") {
        sawDone = true;
        const state = readString(payload.state) ?? void 0;
        const message = readString(payload.errorMessage) ?? readString(payload.message) ?? void 0;
        const finalText = readDoneMessageText(payload);
        if (!accumulated && finalText) {
          accumulated = finalText;
          params.onText(accumulated);
        }
        params.onStreamEvent({ type: "done", state, message });
        if (state === "error" && message) throw new Error(message);
        continue;
      }
      if (event === "error") {
        const message = readString(payload.message) ?? "Conductor stream error";
        params.onStreamEvent({ type: "error", message });
        throw new Error(message);
      }
    }
  }
  if (!sawDone && !accumulated) {
    throw new Error("Conductor stream closed without output");
  }
  return { runId, sessionKey, text: accumulated };
}
function useConductorGateway() {
  const [initialMission] = useState(() => loadPersistedMission());
  const [missionId, setMissionId] = useState(() => initialMission?.missionId ?? null);
  const [missionJobId, setMissionJobId] = useState(() => initialMission?.missionJobId ?? null);
  const [phase, setPhase] = useState(() => initialMission?.phase ?? "idle");
  const [goal, setGoal] = useState(() => initialMission?.goal ?? "");
  const [orchestratorSessionKey, setOrchestratorSessionKey] = useState(() => initialMission?.workerKeys[0] ?? null);
  const [streamText, setStreamText] = useState(() => initialMission?.streamText ?? "");
  const [planText, setPlanText] = useState(() => initialMission?.planText ?? "");
  const [streamEvents, setStreamEvents] = useState([]);
  const [missionStartedAt, setMissionStartedAt] = useState(() => initialMission?.missionStartedAt ?? null);
  const [isPaused, setIsPaused] = useState(() => initialMission?.isPaused ?? false);
  const [pausedElapsedMs, setPausedElapsedMs] = useState(() => initialMission?.pausedElapsedMs ?? 0);
  const [accumulatedPausedMs, setAccumulatedPausedMs] = useState(() => initialMission?.accumulatedPausedMs ?? 0);
  const [pauseStartedAt, setPauseStartedAt] = useState(() => initialMission?.pauseStartedAt ?? null);
  const [completedAt, setCompletedAt] = useState(() => initialMission?.completedAt ?? null);
  const [streamError, setStreamError] = useState(null);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const [missionWorkerKeys, setMissionWorkerKeys] = useState(() => new Set(initialMission?.workerKeys ?? []));
  const [missionWorkerLabels, setMissionWorkerLabels] = useState(() => new Set(initialMission?.workerLabels ?? []));
  const [workerOutputs, setWorkerOutputs] = useState(() => initialMission?.workerOutputs ?? {});
  const [tasks, setTasks] = useState(() => initialMission?.tasks ?? []);
  const [missionHistory, setMissionHistory] = useState(() => loadMissionHistory());
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState(null);
  const [conductorSettings, setConductorSettings] = useState(() => loadConductorSettings());
  const doneRef = useRef(initialMission?.phase === "complete");
  const seenToolCallRef = useRef(false);
  const historySavedRef = useRef(false);
  const lastActivityAtRef = useRef(Date.now());
  const lastWorkerSnapshotRef = useRef("");
  const portableStreamAbortRef = useRef(null);
  const sessionsQuery = useQuery({
    queryKey: ["conductor", "gateway", "sessions"],
    queryFn: async () => {
      const payload = await fetchSessions();
      const sessions = Array.isArray(payload.sessions) ? payload.sessions : [];
      const missionStartMs = missionStartedAt ? new Date(missionStartedAt).getTime() : 0;
      const missionNeedles = buildMissionNeedles(goal);
      return sessions.filter((session) => {
        const label = readString(session.label) ?? "";
        const key = readString(session.key) ?? "";
        if (missionWorkerKeys.size > 0 && missionWorkerKeys.has(key)) {
          return true;
        }
        if (label.startsWith("worker-") || label.startsWith("conductor-")) {
          if (missionWorkerLabels.size > 0 && missionWorkerLabels.has(label)) {
            return true;
          }
          const createdIso = toIso(session.createdAt ?? session.startedAt ?? session.updatedAt);
          if (createdIso && missionStartMs && new Date(createdIso).getTime() >= missionStartMs) {
            return true;
          }
        }
        if (key.includes(":subagent:")) {
          const createdIso = toIso(session.createdAt ?? session.startedAt ?? session.updatedAt);
          if (createdIso && missionStartMs && new Date(createdIso).getTime() >= missionStartMs) {
            return true;
          }
        }
        if (missionStartMs > 0 && sessionMatchesMissionContext(session, missionStartMs, missionNeedles)) {
          return true;
        }
        return false;
      }).map(toWorker).filter((session) => session !== null).sort((a, b) => {
        const statusRank = { running: 0, idle: 1, complete: 2, stale: 3 };
        const rankDiff = statusRank[a.status] - statusRank[b.status];
        if (rankDiff !== 0) return rankDiff;
        return new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime();
      });
    },
    enabled: phase !== "idle",
    refetchInterval: phase === "decomposing" || phase === "running" || phase === "complete" && Object.keys(workerOutputs).length === 0 ? 3e3 : false
  });
  const recentSessionsQuery = useQuery({
    queryKey: ["conductor", "recent-sessions"],
    queryFn: async () => {
      const payload = await fetchSessions();
      const sessions = Array.isArray(payload.sessions) ? payload.sessions : [];
      const cutoff = Date.now() - 24 * 60 * 6e4;
      return sessions.filter((session) => {
        const label = readString(session.label) ?? "";
        const key = readString(session.key) ?? "";
        const updatedAt = toIso(session.updatedAt ?? session.startedAt ?? session.createdAt);
        if (!updatedAt) return false;
        const isConductorSession = label.startsWith("worker-") || label.startsWith("conductor-") || /^cron[_:]/i.test(key) || key.includes(":subagent:");
        return isConductorSession && new Date(updatedAt).getTime() >= cutoff;
      }).sort((a, b) => {
        const updatedA = new Date(toIso(a.updatedAt ?? a.startedAt ?? a.createdAt) ?? 0).getTime();
        const updatedB = new Date(toIso(b.updatedAt ?? b.startedAt ?? b.createdAt) ?? 0).getTime();
        return updatedB - updatedA;
      }).slice(0, 20);
    },
    enabled: phase === "idle",
    refetchInterval: false
  });
  const missionStatusQuery = useQuery({
    queryKey: ["conductor", "mission-status", missionId],
    queryFn: async () => {
      if (!missionId) return null;
      return fetchConductorMission(missionId);
    },
    enabled: Boolean(missionId) && shouldPersistActiveConductorMission(phase),
    refetchInterval: phase === "decomposing" || phase === "running" ? 2500 : false,
    retry: Infinity,
    retryDelay: (attemptIndex) => Math.min(2e3 * 2 ** attemptIndex, 1e4)
  });
  const sessionWorkers = sessionsQuery.data ?? [];
  const swarmAssignments = missionStatusQuery.data?.assignments;
  const isNativeSwarm = missionStatusQuery.data?.nativeSwarm === true;
  const virtualWorkers = useMemo(() => {
    if (!isNativeSwarm || !swarmAssignments || swarmAssignments.length === 0) return [];
    const missionUpdatedAt = new Date(missionStatusQuery.data?.updatedAt ?? Date.now()).toISOString();
    return swarmAssignments.map((assignment, index) => {
      const workerId = assignment.workerId;
      const state = assignment.state ?? "dispatched";
      assignment.checkpoint;
      const isComplete = state === "checkpointed" || state === "done" || state === "cancelled";
      const isBlocked = state === "blocked" || state === "needs_input";
      const personaNames = ["Nova", "Pixel", "Blaze", "Echo", "Sage", "Drift", "Flux", "Volt"];
      const persona = personaNames[index % personaNames.length];
      return {
        key: workerId,
        label: workerId,
        model: "native-swarm",
        status: isComplete ? "complete" : isBlocked ? "stale" : "running",
        updatedAt: missionUpdatedAt,
        displayName: `${persona} · ${state}`,
        totalTokens: 0,
        contextTokens: 0,
        tokenUsageLabel: state,
        raw: {
          key: workerId,
          label: workerId,
          friendlyId: workerId,
          status: isComplete ? "completed" : "running",
          model: "native-swarm",
          lastMessage: null,
          createdAt: missionStatusQuery.data?.updatedAt ?? Date.now(),
          startedAt: missionStatusQuery.data?.updatedAt ?? Date.now(),
          updatedAt: Date.now()
        }
      };
    });
  }, [isNativeSwarm, swarmAssignments]);
  const workers = useMemo(() => {
    if (sessionWorkers.length > 0) return sessionWorkers;
    return virtualWorkers;
  }, [sessionWorkers, virtualWorkers]);
  const activeWorkers = useMemo(() => workers.filter((worker) => worker.status === "running" || worker.status === "idle"), [workers]);
  const hasPersistedMission = initialMission !== null;
  useEffect(() => {
    const mission = missionStatusQuery.data;
    if (!mission) return;
    const status = readString(mission.status)?.toLowerCase() ?? null;
    const realSessionKey = extractSessionIdFromMission(mission);
    const lines = readMissionLines(mission);
    const missionLog = formatMissionLog(lines);
    if (realSessionKey) {
      setOrchestratorSessionKey(realSessionKey);
      setMissionWorkerKeys((current) => {
        if (current.has(realSessionKey)) return current;
        const next = new Set(current);
        next.add(realSessionKey);
        return next;
      });
      setPlanText((current) => current && !current.startsWith("Conductor mission") ? current : "Orchestrator session attached. Tracking worker activity...");
      lastActivityAtRef.current = Date.now();
      setTimeoutWarning(false);
    } else if (phase === "decomposing" || phase === "running") {
      setPlanText((current) => current || `Conductor mission ${status ?? "running"}. Waiting for Hermes to report the session...`);
    }
    if (missionLog) {
      setStreamText((current) => current === missionLog ? current : missionLog);
      lastActivityAtRef.current = Date.now();
      setTimeoutWarning(false);
    }
    if (isCompletedMissionStatus(status)) {
      doneRef.current = true;
      setCompletedAt((value) => value ?? (/* @__PURE__ */ new Date()).toISOString());
      setPhase("complete");
      return;
    }
    if (isFailedMissionStatus(status)) {
      doneRef.current = true;
      setStreamError(mission.error || "Conductor mission failed");
      setCompletedAt((value) => value ?? (/* @__PURE__ */ new Date()).toISOString());
      setPhase("complete");
    }
  }, [missionStatusQuery.data, phase]);
  const getMissionElapsedMs = (referenceTime = Date.now()) => {
    if (!missionStartedAt) return 0;
    const startedMs = new Date(missionStartedAt).getTime();
    if (!Number.isFinite(startedMs)) return 0;
    const pauseStartedMs = pauseStartedAt ? new Date(pauseStartedAt).getTime() : NaN;
    const inFlightPausedMs = isPaused && Number.isFinite(pauseStartedMs) ? Math.max(0, referenceTime - pauseStartedMs) : 0;
    return Math.max(0, referenceTime - startedMs - accumulatedPausedMs - inFlightPausedMs);
  };
  useEffect(() => {
    if (missionWorkerLabels.size === 0 || workers.length === 0) return;
    const matchedKeys = workers.filter((worker) => missionWorkerLabels.has(worker.label)).map((worker) => worker.key);
    if (matchedKeys.length === 0) return;
    setMissionWorkerKeys((current) => {
      const next = new Set(current);
      let changed = false;
      for (const key of matchedKeys) {
        if (!next.has(key)) {
          next.add(key);
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [missionWorkerLabels, workers]);
  useEffect(() => {
    if (phase !== "decomposing") return;
    if (workers.length > 0) {
      setPhase("running");
      return;
    }
    const timer = setTimeout(() => {
      if (phase === "decomposing") {
        setPhase("running");
      }
    }, 15e3);
    return () => clearTimeout(timer);
  }, [phase, workers.length]);
  useEffect(() => {
    if (phase !== "running" && phase !== "decomposing") {
      setTimeoutWarning(false);
      lastActivityAtRef.current = Date.now();
      lastWorkerSnapshotRef.current = "";
      return;
    }
    lastActivityAtRef.current = Date.now();
    setTimeoutWarning(false);
  }, [phase]);
  useEffect(() => {
    if (phase !== "running" && phase !== "decomposing") return;
    const workerSnapshot = workers.map((worker) => `${worker.key}:${worker.updatedAt ?? ""}:${worker.totalTokens}:${worker.status}`).join("|");
    if (workerSnapshot && workerSnapshot !== lastWorkerSnapshotRef.current) {
      lastWorkerSnapshotRef.current = workerSnapshot;
      lastActivityAtRef.current = Date.now();
      setTimeoutWarning(false);
    }
  }, [phase, workers]);
  useEffect(() => {
    if (phase !== "running" && phase !== "decomposing") return;
    lastActivityAtRef.current = Date.now();
    setTimeoutWarning(false);
  }, [phase, streamText, planText, streamEvents.length]);
  useEffect(() => {
    if (phase !== "running" && phase !== "decomposing") return;
    const timer = window.setInterval(() => {
      if (Date.now() - lastActivityAtRef.current >= 6e4) {
        setTimeoutWarning(true);
      }
    }, 1e3);
    return () => window.clearInterval(timer);
  }, [phase]);
  useEffect(() => {
    if (phase !== "running") return;
    const shouldCompleteImmediately = doneRef.current && workersLookComplete(workers, 8e3);
    if (shouldCompleteImmediately) {
      setPhase("complete");
      setCompletedAt((value) => value ?? (/* @__PURE__ */ new Date()).toISOString());
      return;
    }
    if (activeWorkers.length > 0) return;
    if (workers.length === 0 && !doneRef.current) return;
    setPhase("complete");
    setCompletedAt((value) => value ?? (/* @__PURE__ */ new Date()).toISOString());
  }, [activeWorkers.length, phase, workers]);
  useEffect(() => {
    if (workers.length === 0) return;
    let cancelled = false;
    const fetchAll = async () => {
      for (const worker of workers) {
        if (worker.totalTokens <= 0 && worker.status !== "complete") continue;
        try {
          const output = await fetchWorkerOutput(worker.key, 10);
          if (cancelled || !output) continue;
          setWorkerOutputs((current) => {
            if (current[worker.key] === output) return current;
            return { ...current, [worker.key]: output };
          });
        } catch {
        }
      }
    };
    void fetchAll();
    const hasRunningWorkers = workers.some((worker) => worker.status === "running" || worker.status === "idle");
    const hasMissingOutputs = workers.some((worker) => worker.status === "complete" && !workerOutputs[worker.key]);
    if (!hasRunningWorkers && !hasMissingOutputs) {
      return () => {
        cancelled = true;
      };
    }
    const timer = window.setInterval(
      () => {
        void fetchAll();
      },
      hasRunningWorkers ? 5e3 : 2e3
    );
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [phase, workers]);
  useEffect(() => {
    if (!planText) return;
    const extracted = extractTasksFromPlan(planText);
    if (extracted.length === 0) return;
    setTasks((current) => {
      if (current.length >= extracted.length) return current;
      return extracted.map((task) => {
        const existing = current.find((item) => item.id === task.id);
        return existing ?? task;
      });
    });
  }, [planText]);
  useEffect(() => {
    if (tasks.length === 0 || workers.length === 0) return;
    setTasks((current) => {
      const updated = current.map((task, index) => {
        const worker = workers[index];
        if (!worker) return task;
        const workerOutput = workerOutputs[worker.key] ?? null;
        const newStatus = worker.status === "complete" ? "complete" : worker.status === "stale" ? "failed" : worker.status === "running" ? "running" : task.status;
        if (task.workerKey === worker.key && task.status === newStatus && task.output === workerOutput) return task;
        return {
          ...task,
          workerKey: worker.key,
          status: newStatus,
          output: workerOutput
        };
      });
      const changed = updated.some((task, index) => task !== current[index]);
      return changed ? updated : current;
    });
  }, [workers, workerOutputs, tasks.length]);
  const historySaveCountRef = useRef(0);
  useEffect(() => {
    if (phase !== "complete" || !goal || !completedAt || !missionStartedAt) return;
    const missionHistoryId = `mission-${new Date(missionStartedAt).getTime()}`;
    const outputPath = buildMissionOutputPath(workers, workerOutputs, tasks, streamText);
    const workerSummary = summarizeWorkers(workers);
    const outputText = buildMissionOutputText(workers, workerOutputs, streamText);
    const totalTokens = workers.reduce((sum, worker) => sum + worker.totalTokens, 0);
    const completeSummary = buildCompleteSummary({
      goal,
      streamError,
      missionStartedAt,
      completedAt,
      totalWorkers: workers.length,
      totalTokens,
      outputPath
    });
    const workerDetails = workers.map((worker, index) => {
      const persona = getAgentPersona$1(index);
      return {
        label: worker.label,
        model: worker.model ?? "",
        totalTokens: worker.totalTokens,
        personaEmoji: persona.emoji,
        personaName: persona.name
      };
    });
    const entry = {
      id: missionHistoryId,
      goal,
      startedAt: missionStartedAt,
      completedAt,
      workerCount: workers.length,
      totalTokens,
      status: streamError ? "failed" : "completed",
      projectPath: outputPath,
      outputPath,
      workerSummary: workerSummary.length > 0 ? workerSummary : void 0,
      outputText: outputText || void 0,
      streamText: streamText ? streamText.slice(0, 5e3) : void 0,
      completeSummary,
      workerDetails: workerDetails.length > 0 ? workerDetails : void 0,
      error: streamError ?? void 0
    };
    appendMissionHistory(entry);
    if (historySaveCountRef.current === 0) {
      historySavedRef.current = true;
      setMissionHistory((current) => {
        if (current.some((e) => e.id === missionHistoryId)) return current;
        return [entry, ...current].slice(0, MAX_HISTORY_ENTRIES);
      });
    } else {
      setMissionHistory((current) => current.map((e) => e.id === missionHistoryId ? entry : e));
    }
    historySaveCountRef.current += 1;
  }, [phase, goal, completedAt, missionStartedAt, workers, streamError, workerOutputs, tasks, streamText]);
  useEffect(() => {
    persistConductorSettings(conductorSettings);
  }, [conductorSettings]);
  useEffect(() => {
    if (!shouldPersistActiveConductorMission(phase)) {
      try {
        localStorage.removeItem(ACTIVE_MISSION_STORAGE_KEY);
      } catch {
      }
      return;
    }
    persistMission({
      missionId,
      missionJobId,
      goal,
      phase,
      missionStartedAt,
      isPaused,
      pausedElapsedMs,
      accumulatedPausedMs,
      pauseStartedAt,
      workerKeys: [...missionWorkerKeys],
      workerLabels: [...missionWorkerLabels],
      workerOutputs,
      streamText: streamText.slice(0, 1e4),
      planText: planText.slice(0, 1e4),
      completedAt,
      tasks
    });
  }, [
    missionId,
    missionJobId,
    phase,
    goal,
    missionStartedAt,
    isPaused,
    pausedElapsedMs,
    accumulatedPausedMs,
    pauseStartedAt,
    completedAt,
    missionWorkerKeys,
    missionWorkerLabels,
    workerOutputs,
    streamText,
    planText,
    tasks
  ]);
  const dismissTimeoutWarning = () => {
    lastActivityAtRef.current = Date.now();
    setTimeoutWarning(false);
  };
  const clearMissionState = () => {
    doneRef.current = false;
    portableStreamAbortRef.current?.abort();
    portableStreamAbortRef.current = null;
    clearPersistedMission();
    setMissionId(null);
    setMissionJobId(null);
    setPhase("idle");
    setGoal("");
    setOrchestratorSessionKey(null);
    setStreamText("");
    setPlanText("");
    setStreamEvents([]);
    setStreamError(null);
    setTimeoutWarning(false);
    lastActivityAtRef.current = Date.now();
    lastWorkerSnapshotRef.current = "";
    setMissionStartedAt(null);
    setIsPaused(false);
    setPausedElapsedMs(0);
    setAccumulatedPausedMs(0);
    setPauseStartedAt(null);
    setCompletedAt(null);
    setMissionWorkerKeys(/* @__PURE__ */ new Set());
    setMissionWorkerLabels(/* @__PURE__ */ new Set());
    setWorkerOutputs({});
    setTasks([]);
    setSelectedHistoryEntry(null);
    seenToolCallRef.current = false;
    historySavedRef.current = false;
  };
  const sendMission = useMutation({
    mutationFn: async ({ nextGoal, settings }) => {
      const trimmed = nextGoal.trim();
      if (!trimmed) throw new Error("Mission goal required");
      doneRef.current = false;
      lastActivityAtRef.current = Date.now();
      lastWorkerSnapshotRef.current = "";
      setTimeoutWarning(false);
      setGoal(trimmed);
      setMissionId(null);
      setMissionJobId(null);
      setOrchestratorSessionKey(null);
      setStreamText("");
      setPlanText("");
      setStreamEvents([]);
      setStreamError(null);
      setCompletedAt(null);
      setIsPaused(false);
      setPausedElapsedMs(0);
      setAccumulatedPausedMs(0);
      setPauseStartedAt(null);
      setMissionWorkerKeys(/* @__PURE__ */ new Set());
      setMissionWorkerLabels(/* @__PURE__ */ new Set());
      setWorkerOutputs({});
      setTasks([]);
      setSelectedHistoryEntry(null);
      seenToolCallRef.current = false;
      historySavedRef.current = false;
      const startedAt = (/* @__PURE__ */ new Date()).toISOString();
      setMissionStartedAt(startedAt);
      setPhase("decomposing");
      persistMission({
        missionId: null,
        missionJobId: null,
        goal: trimmed,
        phase: "decomposing",
        missionStartedAt: startedAt,
        isPaused: false,
        pausedElapsedMs: 0,
        accumulatedPausedMs: 0,
        pauseStartedAt: null,
        workerKeys: [],
        workerLabels: [],
        workerOutputs: {},
        streamText: "",
        planText: "",
        completedAt: null,
        tasks: []
      });
      const response = await fetch("/api/conductor-spawn", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ goal: trimmed, ...settings })
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || `Spawn failed (${response.status})`);
      }
      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error ?? "Failed to spawn orchestrator");
      }
      if (result.mode === "portable" || result.prompt) {
        const prompt = typeof result.prompt === "string" ? result.prompt : "";
        if (!prompt.trim()) throw new Error("Portable conductor response did not include a prompt");
        const portableSessionKey = result.sessionKey?.trim() || result.jobName?.trim() || `conductor-${Date.now()}`;
        const portableFriendlyId = result.jobName?.trim() || portableSessionKey;
        setMissionId(null);
        setMissionJobId(null);
        setOrchestratorSessionKey(portableSessionKey);
        setMissionWorkerKeys((current) => {
          if (current.has(portableSessionKey)) return current;
          const next = new Set(current);
          next.add(portableSessionKey);
          return next;
        });
        setPlanText("Conductor portable mission launched. Streaming orchestrator output...");
        setPhase("running");
        const abortController = new AbortController();
        portableStreamAbortRef.current = abortController;
        try {
          const streamResult = await streamPortableConductorMission({
            sessionKey: portableSessionKey,
            friendlyId: portableFriendlyId,
            prompt,
            model: settings.orchestratorModel || void 0,
            signal: abortController.signal,
            onSessionResolved: (resolvedSessionKey) => {
              setOrchestratorSessionKey(resolvedSessionKey);
              setMissionWorkerKeys((current) => {
                if (current.has(resolvedSessionKey)) return current;
                const next = new Set(current);
                next.add(resolvedSessionKey);
                return next;
              });
              lastActivityAtRef.current = Date.now();
              setTimeoutWarning(false);
            },
            onText: (text) => {
              setStreamText(text);
              setPlanText(text);
              lastActivityAtRef.current = Date.now();
              setTimeoutWarning(false);
            },
            onStreamEvent: (event) => {
              appendStreamEvent(setStreamEvents, event);
              lastActivityAtRef.current = Date.now();
              setTimeoutWarning(false);
            }
          });
          if (streamResult.text.trim()) {
            setStreamText(streamResult.text);
            setPlanText(streamResult.text);
          }
          doneRef.current = true;
          setCompletedAt((value) => value ?? (/* @__PURE__ */ new Date()).toISOString());
          setPhase("complete");
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
          throw error;
        } finally {
          if (portableStreamAbortRef.current === abortController) {
            portableStreamAbortRef.current = null;
          }
        }
        return;
      }
      if (result.mode === "native-swarm") {
        const missionId2 = result.missionId ?? null;
        setMissionId(missionId2);
        setMissionJobId(result.jobId ?? null);
        setOrchestratorSessionKey(missionId2);
        if (missionId2) {
          setMissionWorkerKeys((current) => {
            if (current.has(missionId2)) return current;
            const next = new Set(current);
            next.add(missionId2);
            return next;
          });
        }
        setPlanText(result.assignments?.length ? `Native swarm mission launched with ${result.assignments.length} workers. Watching for swarm activity...` : "Native swarm mission launched. Decomposing and spawning workers...");
        setPhase("running");
        return;
      }
      if (!result.sessionKey && !result.sessionKeyPrefix && !result.missionId && !result.jobId) {
        throw new Error(result.error ?? "Failed to spawn orchestrator");
      }
      const nextMissionId = result.missionId ?? null;
      setMissionId(nextMissionId);
      setMissionJobId(result.jobId ?? null);
      const orchestratorKey = result.sessionKey ?? null;
      const prefix = result.sessionKeyPrefix;
      if (orchestratorKey) {
        setOrchestratorSessionKey(orchestratorKey);
        setMissionWorkerKeys((current) => {
          if (current.has(orchestratorKey)) return current;
          const next = new Set(current);
          next.add(orchestratorKey);
          return next;
        });
      }
      if (prefix) {
        const resolveOrchestrator = async () => {
          for (let attempt = 0; attempt < 30; attempt += 1) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            try {
              const sessionPayload = await fetchSessions();
              const sessions = Array.isArray(sessionPayload.sessions) ? sessionPayload.sessions : [];
              const match = sessions.find((session) => {
                const key = typeof session.key === "string" ? session.key : "";
                return key.startsWith(prefix);
              });
              if (match && typeof match.key === "string") {
                setOrchestratorSessionKey(match.key);
                setMissionWorkerKeys((current) => {
                  const next = new Set(current);
                  next.delete(orchestratorKey);
                  next.add(match.key);
                  return next;
                });
                return;
              }
            } catch {
            }
          }
        };
        void resolveOrchestrator();
      }
      setPlanText(
        nextMissionId ? "Conductor mission launched. Waiting for Hermes session and worker activity..." : "Orchestrator spawned. Decomposing mission and spawning workers..."
      );
      setPhase("running");
    },
    onError: (error) => {
      doneRef.current = true;
      setStreamError(error instanceof Error ? error.message : String(error));
      setPhase("complete");
      setCompletedAt((/* @__PURE__ */ new Date()).toISOString());
    }
  });
  const resetMission = () => {
    clearMissionState();
  };
  const resetSavedState = () => {
    clearMissionState();
    clearMissionHistoryStorage();
    setMissionHistory([]);
  };
  const pauseAgent = useMutation({
    mutationFn: async ({ sessionKey, pause }) => {
      const response = await fetch("/api/agent-pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionKey: sessionKey.trim(), pause })
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || `Pause request failed (${response.status})`);
      }
      const now = Date.now();
      if (pause) {
        setPausedElapsedMs(getMissionElapsedMs(now));
        setPauseStartedAt(new Date(now).toISOString());
        setIsPaused(true);
        return;
      }
      const pauseStartedMs = pauseStartedAt ? new Date(pauseStartedAt).getTime() : NaN;
      const additionalPausedMs = Number.isFinite(pauseStartedMs) ? Math.max(0, now - pauseStartedMs) : 0;
      setAccumulatedPausedMs((current) => current + additionalPausedMs);
      setPauseStartedAt(null);
      setIsPaused(false);
      setPausedElapsedMs(0);
    }
  });
  const stopMission = async () => {
    portableStreamAbortRef.current?.abort();
    portableStreamAbortRef.current = null;
    const sessionKeys = [.../* @__PURE__ */ new Set([...missionWorkerKeys, ...workers.map((worker) => worker.key)])];
    const missionIds = missionId ? [missionId] : [];
    try {
      await fetch("/api/conductor-stop", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionKeys, missionIds })
      });
    } catch {
    }
    setStreamError("Mission stopped by user");
    setIsPaused(false);
    setPauseStartedAt(null);
    setCompletedAt((/* @__PURE__ */ new Date()).toISOString());
    setPhase("complete");
  };
  const retryMission = async () => {
    if (!goal) return;
    const currentGoal = goal;
    resetMission();
    await new Promise((resolve) => setTimeout(resolve, 100));
    await sendMission.mutateAsync({
      nextGoal: currentGoal,
      settings: conductorSettings
    });
  };
  return {
    phase,
    goal,
    orchestratorSessionKey,
    streamText,
    planText,
    streamEvents,
    streamError,
    timeoutWarning,
    dismissTimeoutWarning,
    missionStartedAt,
    isPaused,
    pausedElapsedMs,
    pausedAtMs: pauseStartedAt ? new Date(pauseStartedAt).getTime() : null,
    missionElapsedMs: getMissionElapsedMs(),
    completedAt,
    tasks,
    workers,
    activeWorkers,
    missionHistory,
    hasPersistedMission,
    selectedHistoryEntry,
    setSelectedHistoryEntry,
    recentSessions: recentSessionsQuery.data ?? [],
    missionWorkerKeys,
    workerOutputs,
    conductorSettings,
    setConductorSettings,
    sendMission: (nextGoal) => sendMission.mutateAsync({ nextGoal, settings: conductorSettings }),
    pauseAgent: (sessionKey, pause) => pauseAgent.mutateAsync({ sessionKey, pause }),
    isSending: sendMission.isPending,
    isPausing: pauseAgent.isPending,
    resetMission,
    resetSavedState,
    stopMission,
    retryMission,
    refreshWorkers: sessionsQuery.refetch,
    isRefreshingWorkers: sessionsQuery.isFetching
  };
}
const THEME_STYLE = {
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
  ["--theme-danger-soft-strong"]: "color-mix(in srgb, var(--theme-danger) 18%, transparent)",
  ["--theme-danger-border"]: "color-mix(in srgb, var(--theme-danger) 35%, white)",
  ["--theme-warning"]: "var(--color-amber-600, #d97706)",
  ["--theme-warning-soft"]: "color-mix(in srgb, var(--theme-warning) 12%, transparent)",
  ["--theme-warning-soft-strong"]: "color-mix(in srgb, var(--theme-warning) 18%, transparent)",
  ["--theme-warning-border"]: "color-mix(in srgb, var(--theme-warning) 35%, white)"
};
const QUICK_ACTIONS = [
  {
    id: "research",
    label: "Research",
    icon: Search01Icon,
    prompt: "Research the problem space, gather constraints, compare approaches, and propose the most viable plan."
  },
  {
    id: "build",
    label: "Build",
    icon: PlayIcon,
    prompt: "Build the requested feature end-to-end, including implementation, validation, and a concise delivery summary."
  },
  {
    id: "review",
    label: "Review",
    icon: TaskDone01Icon,
    prompt: "Review the current implementation for correctness, regressions, missing tests, and release risks."
  },
  {
    id: "deploy",
    label: "Deploy",
    icon: Rocket01Icon,
    prompt: "Prepare the work for deployment, verify readiness, and summarize any operational follow-ups."
  }
];
const AGENT_NAMES = ["Nova", "Pixel", "Blaze", "Echo", "Sage", "Drift", "Flux", "Volt"];
const AGENT_EMOJIS = ["🤖", "⚡", "🔥", "🌊", "🌿", "💫", "🔮", "⭐"];
const BLENDED_COST_PER_MILLION_TOKENS = 5;
const CONDUCTOR_GOAL_DRAFT_STORAGE_KEY = "conductor:goal-draft";
function loadConductorGoalDraft() {
  try {
    return globalThis.localStorage?.getItem(CONDUCTOR_GOAL_DRAFT_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}
function persistConductorGoalDraft(value) {
  try {
    if (value.trim()) {
      globalThis.localStorage?.setItem(CONDUCTOR_GOAL_DRAFT_STORAGE_KEY, value);
    } else {
      globalThis.localStorage?.removeItem(CONDUCTOR_GOAL_DRAFT_STORAGE_KEY);
    }
  } catch {
  }
}
function getAgentPersona(index) {
  return {
    name: AGENT_NAMES[index % AGENT_NAMES.length],
    emoji: AGENT_EMOJIS[index % AGENT_EMOJIS.length]
  };
}
function estimateTokenCost(totalTokens) {
  return Math.max(0, totalTokens) / 1e6 * BLENDED_COST_PER_MILLION_TOKENS;
}
function formatUsd(value) {
  return `$${value.toFixed(value >= 0.1 ? 2 : 3)}`;
}
function MissionCostSection({ totalTokens, workers, expanded, onToggle }) {
  const estimatedCost = estimateTokenCost(totalTokens);
  return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-5 py-4", children: [
    /* @__PURE__ */ jsxs("button", { type: "button", onClick: onToggle, "aria-expanded": expanded, className: "flex w-full items-start justify-between gap-4 text-left", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Mission Cost" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--theme-muted-2)]", children: "Approximate at $5 / 1M tokens blended from input/output pricing." })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-2 text-xs font-medium text-[var(--theme-text)]", children: [
        expanded ? "Hide" : "Show",
        /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ArrowDown01Icon, size: 16, strokeWidth: 1.7, className: cn("transition-transform duration-200", expanded ? "rotate-180" : "rotate-0") })
      ] })
    ] }),
    expanded ? /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: "Total Tokens" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-semibold text-[var(--theme-text)]", children: totalTokens.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: "Estimated Cost" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-semibold text-[var(--theme-text)]", children: formatUsd(estimatedCost) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[var(--theme-border)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: [
          /* @__PURE__ */ jsx("span", { children: "Workers" }),
          /* @__PURE__ */ jsx("span", { children: "Cost" })
        ] }),
        workers.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-[var(--theme-border)]", children: workers.map((worker) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-[var(--theme-text)]", children: [
            worker.personaEmoji,
            " ",
            worker.personaName
          ] }),
          /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-[var(--theme-muted)]", children: worker.label }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-[var(--theme-muted)]", children: [
            worker.totalTokens.toLocaleString(),
            " tok"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "min-w-[4.5rem] text-right font-medium text-[var(--theme-text)]", children: formatUsd(estimateTokenCost(worker.totalTokens)) })
        ] }, worker.id)) }) : /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-sm text-[var(--theme-muted)]", children: "Per-worker token details were not captured for this mission." })
      ] })
    ] }) : null
  ] });
}
const PLANNING_STEPS = ["Planning the mission…", "Analyzing requirements…", "Preparing agents…", "Writing the spec…"];
const WORKING_STEPS = [
  "📋 Reviewing the brief…",
  "🔍 Scanning existing patterns…",
  "✏️ Drafting the implementation…",
  "☕ Grabbing a coffee…",
  "🧠 Thinking through edge cases…",
  "🎨 Polishing the design…",
  "🔧 Wiring up components…",
  "📐 Checking the layout…",
  "🚀 Almost there…"
];
function CyclingStatus({ steps, intervalMs = 3e3, isPaused = false }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % steps.length), intervalMs);
    return () => window.clearInterval(timer);
  }, [isPaused, steps.length, intervalMs]);
  if (isPaused) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 py-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex size-3.5 items-center justify-center rounded-full border border-amber-400/60 bg-amber-500/10 text-[9px] text-amber-300", children: "||" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--theme-muted)]", children: "Paused" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 py-3", children: [
    /* @__PURE__ */ jsx("div", { className: "size-3.5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--theme-muted)] transition-opacity duration-500", children: steps[step] })
  ] });
}
function PlanningIndicator() {
  return /* @__PURE__ */ jsx(CyclingStatus, { steps: PLANNING_STEPS, intervalMs: 2500 });
}
function getOutputDisplayName(projectPath) {
  if (!projectPath) return "Output ready";
  return projectPath.split("/").pop() || "index.html";
}
function formatMissionTimestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}
function buildProjectPathCandidates(workers, missionStartedAt) {
  const timestamp = formatMissionTimestamp(missionStartedAt);
  const candidates = /* @__PURE__ */ new Set();
  for (const worker of workers) {
    const label = worker.label ?? "";
    const slug = label.replace(/^worker-/, "").trim();
    if (!slug) continue;
    candidates.add(`/tmp/dispatch-${slug}`);
    candidates.add(`/tmp/dispatch-${slug}-page`);
    if (timestamp) {
      candidates.add(`/tmp/dispatch-${slug}-${timestamp}`);
      candidates.add(`/tmp/dispatch-${slug}-${timestamp}-page`);
    }
  }
  return [...candidates];
}
function formatElapsedTime(startIso, now) {
  if (!startIso) return "0s";
  const startMs = new Date(startIso).getTime();
  if (!Number.isFinite(startMs)) return "0s";
  return formatElapsedMilliseconds(now - startMs);
}
function formatElapsedMilliseconds(durationMs) {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1e3));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
function formatDurationRange(startIso, endIso, now) {
  const endMs = endIso ? new Date(endIso).getTime() : now;
  if (!Number.isFinite(endMs)) return formatElapsedTime(startIso, now);
  return formatElapsedTime(startIso, endMs);
}
function formatRelativeTime(value, now) {
  if (!value) return "just now";
  const ms = new Date(value).getTime();
  if (!Number.isFinite(ms)) return "just now";
  const diffSeconds = Math.max(0, Math.floor((now - ms) / 1e3));
  if (diffSeconds < 10) return "just now";
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours}h ago`;
}
function truncateContinuationText(text, limit = 500) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}
function getWorkerDot(status) {
  if (status === "complete") return { dotClass: "bg-emerald-400", label: "Complete" };
  if (status === "running") return { dotClass: "bg-sky-400 animate-pulse", label: "Running" };
  if (status === "idle") return { dotClass: "bg-amber-400", label: "Idle" };
  return { dotClass: "bg-red-400", label: "Stale" };
}
function getWorkerBorderClass(status) {
  if (status === "complete") return "border-l-emerald-400";
  if (status === "running") return "border-l-sky-400";
  if (status === "idle") return "border-l-amber-400";
  return "border-l-red-400";
}
function WorkerCard({
  worker,
  index,
  conductor,
  now
}) {
  const dot = getWorkerDot(worker.status);
  const persona = getAgentPersona(index);
  const workerOutput = conductor.workerOutputs[worker.key] ?? getLastAssistantMessage(worker.raw.messages);
  const workerStartedAt = typeof worker.raw.createdAt === "string" ? worker.raw.createdAt : typeof worker.raw.startedAt === "string" ? worker.raw.startedAt : conductor.missionStartedAt;
  const workerEndTime = worker.status === "complete" || worker.status === "stale" ? new Date(worker.updatedAt ?? (/* @__PURE__ */ new Date()).toISOString()).getTime() : conductor.isPaused ? conductor.pausedAtMs ?? now : now;
  return /* @__PURE__ */ jsxs("div", { className: cn("overflow-hidden rounded-2xl border border-[var(--theme-border)] border-l-4 bg-[var(--theme-card)] px-4 py-3", getWorkerBorderClass(worker.status)), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: cn("size-2.5 rounded-full", dot.dotClass) }),
          /* @__PURE__ */ jsxs("p", { className: "truncate text-sm font-medium text-[var(--theme-text)]", children: [
            persona.emoji,
            " ",
            persona.name,
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-muted)]", children: "·" }),
            " ",
            worker.label
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: worker.displayName })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-card2)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: dot.label })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[var(--theme-muted)]", children: "Model" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 truncate text-[var(--theme-text)]", children: getShortModelName(worker.model) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[var(--theme-muted)]", children: "Tokens" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-[var(--theme-text)]", children: worker.tokenUsageLabel })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[var(--theme-muted)]", children: "Elapsed" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-[var(--theme-text)]", children: formatElapsedTime(workerStartedAt, workerEndTime) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[var(--theme-muted)]", children: "Last update" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-[var(--theme-text)]", children: formatRelativeTime(worker.updatedAt, now) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-4", children: workerOutput ? /* @__PURE__ */ jsx(Markdown, { className: "max-h-[400px] max-w-none overflow-auto text-sm text-[var(--theme-text)]", children: workerOutput }) : /* @__PURE__ */ jsx(CyclingStatus, { steps: WORKING_STEPS, intervalMs: 3500, isPaused: conductor.isPaused }) })
  ] }, worker.key);
}
function usePreviewAvailability(previewUrl, enabled) {
  const [failedProbes, setFailedProbes] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const lastProbeRef = useRef(0);
  useEffect(() => {
    setFailedProbes(0);
    setTimedOut(false);
    lastProbeRef.current = 0;
  }, [enabled, previewUrl]);
  useEffect(() => {
    if (!enabled || !previewUrl) return;
    const timer = window.setTimeout(() => setTimedOut(true), 6e3);
    return () => window.clearTimeout(timer);
  }, [enabled, previewUrl]);
  const exhausted = enabled && !!previewUrl && (failedProbes >= 4 || timedOut);
  const probeQuery = useQuery({
    queryKey: ["conductor", "preview-probe", previewUrl],
    queryFn: async () => {
      if (!previewUrl) return false;
      try {
        const res = await fetch(previewUrl);
        if (!res.ok) return false;
        const text = await res.text();
        return text.length > 20 && (text.includes("<") || text.includes("html"));
      } catch {
        return false;
      }
    },
    enabled: enabled && !!previewUrl && !exhausted,
    retry: false,
    refetchInterval: (query) => query.state.data === true || exhausted ? false : 1500,
    staleTime: 5e3
  });
  useEffect(() => {
    if (!enabled || !previewUrl || probeQuery.data === true || probeQuery.dataUpdatedAt === 0) return;
    if (lastProbeRef.current === probeQuery.dataUpdatedAt) return;
    lastProbeRef.current = probeQuery.dataUpdatedAt;
    setFailedProbes((current) => current + 1);
  }, [enabled, previewUrl, probeQuery.data, probeQuery.dataUpdatedAt]);
  return {
    ready: probeQuery.data === true,
    loading: enabled && !!previewUrl && !exhausted && probeQuery.data !== true,
    unavailable: enabled && !!previewUrl && exhausted && probeQuery.data !== true
  };
}
function getShortModelName(model) {
  if (!model) return "Unknown";
  const parts = model.split("/");
  return parts[parts.length - 1] || model;
}
function getModelDisplayName(model, modelId) {
  if (!modelId) return "Default (auto)";
  return model?.name?.trim() || model?.id?.trim() || modelId;
}
function getProviderLabel(provider) {
  const raw = provider?.trim();
  if (!raw) return "Unknown";
  return raw.split(/[-_\s]+/).filter(Boolean).map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(" ");
}
function groupModelsByProvider(models) {
  const groups = /* @__PURE__ */ new Map();
  for (const model of models) {
    const provider = getProviderLabel(model.provider);
    const existing = groups.get(provider);
    if (existing) {
      existing.push(model);
    } else {
      groups.set(provider, [model]);
    }
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([provider, providerModels]) => ({
    provider,
    models: [...providerModels].sort((a, b) => getModelDisplayName(a, a.id).localeCompare(getModelDisplayName(b, b.id)))
  }));
}
function getDirectoryPathSegments(pathValue) {
  const normalized = pathValue.trim();
  if (!normalized) return ["~"];
  if (normalized === "~") return ["~"];
  if (normalized.startsWith("~/")) {
    return ["~", ...normalized.slice(2).split("/").filter(Boolean)];
  }
  if (normalized === "/") return ["/"];
  if (normalized.startsWith("/")) {
    return ["/", ...normalized.slice(1).split("/").filter(Boolean)];
  }
  return normalized.split("/").filter(Boolean);
}
function buildDirectoryPathFromSegments(segments) {
  if (segments.length === 0) return "~";
  if (segments[0] === "~") {
    return segments.length === 1 ? "~" : `~/${segments.slice(1).join("/")}`;
  }
  if (segments[0] === "/") {
    return segments.length === 1 ? "/" : `/${segments.slice(1).join("/")}`;
  }
  return segments.join("/");
}
function getParentDirectory(pathValue) {
  const segments = getDirectoryPathSegments(pathValue);
  if (segments.length <= 1) return pathValue.startsWith("/") ? "/" : "~";
  return buildDirectoryPathFromSegments(segments.slice(0, -1));
}
function getDirectorySuggestions() {
  return ["~/conductor-projects", "~/Projects", "/tmp", "~/Desktop"];
}
function ModelSelectorDropdown({
  label,
  value,
  onChange,
  models,
  disabled = false
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);
  const selectedModel = models.find((model) => (model.id ?? "") === value);
  const groupedModels = useMemo(() => groupModelsByProvider(models), [models]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[var(--theme-text)]", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", ref: containerRef, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            if (disabled) return;
            setOpen((current) => !current);
          },
          className: cn(
            "inline-flex min-h-[3rem] w-full items-center justify-between gap-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3 text-left text-sm text-[var(--theme-text)] shadow-[0_8px_24px_color-mix(in_srgb,var(--theme-shadow)_18%,transparent)] transition-colors",
            disabled ? "cursor-not-allowed opacity-60" : "hover:border-[var(--theme-accent)] focus:border-[var(--theme-accent)]"
          ),
          "aria-haspopup": "listbox",
          "aria-expanded": open,
          disabled,
          children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex min-w-0 items-center gap-2", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-1 text-xs font-medium text-[var(--theme-text)]", children: [
              /* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", value ? "bg-[var(--theme-accent)]" : "bg-[var(--theme-border2)]") }),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: getModelDisplayName(selectedModel, value) })
            ] }) }),
            /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ArrowDown01Icon, size: 16, strokeWidth: 1.8, className: cn("shrink-0 text-[var(--theme-muted)] transition-transform", open && "rotate-180") })
          ]
        }
      ),
      open ? /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-[calc(100%+0.5rem)] z-[80] w-full overflow-hidden rounded-2xl border border-[var(--theme-border2)] bg-[var(--theme-card)] shadow-[0_24px_80px_var(--theme-shadow)]", children: /* @__PURE__ */ jsxs("div", { className: "max-h-80 overflow-y-auto p-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              onChange("");
              setOpen(false);
            },
            className: cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
              !value ? "bg-[var(--theme-accent-soft)] text-[var(--theme-text)]" : "text-[var(--theme-text)] hover:bg-[var(--theme-bg)]"
            ),
            role: "option",
            "aria-selected": !value,
            children: [
              /* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", !value ? "bg-[var(--theme-accent)]" : "bg-[var(--theme-border2)]") }),
              /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children: "Default (auto)" }),
              /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-card2)] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--theme-muted)]", children: "Auto" })
            ]
          }
        ),
        groupedModels.map((group) => /* @__PURE__ */ jsxs("div", { className: "mt-2 first:mt-3", children: [
          /* @__PURE__ */ jsx("div", { className: "px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: group.provider }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1", children: group.models.map((model) => {
            const modelId = model.id ?? "";
            const active = modelId === value;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  onChange(modelId);
                  setOpen(false);
                },
                className: cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  active ? "bg-[var(--theme-accent-soft)] text-[var(--theme-text)]" : "text-[var(--theme-text)] hover:bg-[var(--theme-bg)]"
                ),
                role: "option",
                "aria-selected": active,
                children: [
                  /* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", active ? "bg-[var(--theme-accent)]" : "bg-[var(--theme-border2)]") }),
                  /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children: getModelDisplayName(model, modelId) }),
                  /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-card2)] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--theme-muted)]", children: group.provider })
                ]
              },
              `${group.provider}-${modelId}`
            );
          }) })
        ] }, group.provider))
      ] }) }) : null
    ] })
  ] });
}
function extractMessageText(message) {
  if (!message) return "";
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.content)) {
    return message.content.map((part) => typeof part?.text === "string" ? part.text : "").filter(Boolean).join("\n");
  }
  return "";
}
function getLastAssistantMessage(messages) {
  if (!Array.isArray(messages)) return "";
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role !== "assistant") continue;
    const text = extractMessageText(message);
    if (text.trim()) return text.trim();
  }
  return "";
}
function extractProjectPath(text) {
  const structuredPatterns = [
    /\b(?:Created|Output|Wrote|Saved to|Built|Generated|Written to)\s+(\/tmp\/dispatch-[^\s"')`\]>]+)/gi,
    /\b(?:Created|Output|Wrote|Saved to|Built|Generated|Written to)\s*:\s*(\/tmp\/dispatch-[^\s"')`\]>]+)/gi
  ];
  for (const pattern of structuredPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const raw = match[1];
      if (!raw) continue;
      const cleaned = raw.replace(/[.,;:!?`]+$/, "");
      const normalized = cleaned.replace(/\/(index\.html|dist|build)\/?$/i, "");
      if (normalized.startsWith("/tmp/dispatch-")) return normalized;
    }
  }
  const matches = text.match(/\/tmp\/dispatch-[^\s"')`\]>]+/g) ?? [];
  for (const raw of matches) {
    const cleaned = raw.replace(/[.,;:!?\-`]+$/, "");
    const normalized = cleaned.replace(/\/(index\.html|dist|build)\/?$/i, "");
    if (normalized.startsWith("/tmp/dispatch-")) return normalized;
  }
  const tmpMatches = text.match(/\/tmp\/[a-zA-Z0-9][^\s"')`\]>]+/g) ?? [];
  for (const raw of tmpMatches) {
    const cleaned = raw.replace(/[.,;:!?\-`]+$/, "");
    const normalized = cleaned.replace(/\/(index\.html|dist|build)\/?$/i, "");
    if (normalized.length > 5) return normalized;
  }
  return null;
}
function deriveSessionStatus(session) {
  const updatedMs = new Date(session.updatedAt).getTime();
  const staleness = Number.isFinite(updatedMs) ? Date.now() - updatedMs : 0;
  const tokens = typeof session.totalTokens === "number" ? session.totalTokens : 0;
  const statusText = `${session.status ?? ""} ${session.state ?? ""}`.toLowerCase();
  if (statusText.includes("error") || statusText.includes("failed")) return "failed";
  if (tokens > 0 && staleness > 3e4) return "completed";
  if (staleness > 12e4 && tokens === 0) return "failed";
  return "running";
}
function Conductor() {
  const conductor = useConductorGateway();
  const [goalDraft, setGoalDraft] = useState(() => loadConductorGoalDraft());
  const [missionModalOpen, setMissionModalOpen] = useState(false);
  const [continueDraft, setContinueDraft] = useState("");
  const [continueModalOpen, setContinueModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("build");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activityFilter, setActivityFilter] = useState("all");
  const [activityPage, setActivityPage] = useState(0);
  const [completeCostExpanded, setCompleteCostExpanded] = useState(true);
  const [historyCostExpanded, setHistoryCostExpanded] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [directoryBrowserOpen, setDirectoryBrowserOpen] = useState(false);
  const [directoryBrowserPath, setDirectoryBrowserPath] = useState("~");
  const [directoryBrowserEntries, setDirectoryBrowserEntries] = useState([]);
  const [directoryBrowserLoading, setDirectoryBrowserLoading] = useState(false);
  const [directoryBrowserError, setDirectoryBrowserError] = useState(null);
  const modelsQuery = useQuery({
    queryKey: ["conductor", "models"],
    queryFn: async () => {
      const res = await fetch("/api/models");
      const data = await res.json();
      return data.models ?? [];
    },
    enabled: settingsOpen,
    staleTime: 6e4
  });
  const availableModels = modelsQuery.data ?? [];
  useEffect(() => {
    if (!directoryBrowserOpen) return;
    let cancelled = false;
    const loadDirectory = async () => {
      setDirectoryBrowserLoading(true);
      setDirectoryBrowserError(null);
      try {
        const res = await fetch(`/api/files?path=${encodeURIComponent(directoryBrowserPath)}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Failed to load directory");
        }
        if (cancelled) return;
        setDirectoryBrowserPath(typeof data.root === "string" && data.root.trim() ? data.root : directoryBrowserPath);
        setDirectoryBrowserEntries(Array.isArray(data.entries) ? data.entries.filter((entry) => entry?.type === "folder") : []);
      } catch (error) {
        if (cancelled) return;
        setDirectoryBrowserEntries([]);
        setDirectoryBrowserError(error instanceof Error ? error.message : "Failed to load directory");
      } finally {
        if (!cancelled) {
          setDirectoryBrowserLoading(false);
        }
      }
    };
    void loadDirectory();
    return () => {
      cancelled = true;
    };
  }, [directoryBrowserOpen, directoryBrowserPath]);
  useEffect(() => {
    if (conductor.phase === "idle" || conductor.phase === "complete" || conductor.isPaused) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1e3);
    return () => window.clearInterval(timer);
  }, [conductor.isPaused, conductor.phase]);
  useEffect(() => {
    persistConductorGoalDraft(goalDraft);
  }, [goalDraft]);
  useEffect(() => {
    if (!conductor.isPaused) return;
    setNow(conductor.pausedAtMs ?? Date.now());
  }, [conductor.isPaused, conductor.pausedAtMs]);
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "var(--color-surface)";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);
  const phase = useMemo(() => {
    if (conductor.phase === "idle") return "home";
    if (conductor.phase === "decomposing") return "preview";
    if (conductor.phase === "running") return "active";
    return "complete";
  }, [conductor.phase]);
  const handleNewMission = () => {
    conductor.resetMission();
    setGoalDraft("");
    persistConductorGoalDraft("");
    setMissionModalOpen(false);
    setContinueDraft("");
    setContinueModalOpen(false);
    setSelectedTaskId(null);
  };
  const handleSubmit = async () => {
    const trimmed = goalDraft.trim();
    if (!trimmed) return;
    setMissionModalOpen(false);
    setContinueDraft("");
    await conductor.sendMission(trimmed);
    persistConductorGoalDraft("");
    setGoalDraft("");
  };
  const handleQuickActionSelect = (action) => {
    setSelectedAction(action.id);
    setGoalDraft((current) => {
      const trimmed = current.trim();
      if (!trimmed) return `${action.label}: `;
      if (trimmed.toLowerCase().startsWith(`${action.label.toLowerCase()}:`)) return current;
      return `${action.label}: ${trimmed}`;
    });
  };
  const handleContinueMission = async () => {
    const trimmedInstructions = continueDraft.trim();
    if (!trimmedInstructions) return;
    const continuationSummarySource = completeSummary ?? Object.values(conductor.workerOutputs).find((output) => output.trim()) ?? conductor.workers.map((worker) => getLastAssistantMessage(worker.raw.messages)).find((output) => output.trim()) ?? conductor.streamText;
    const combinedPrompt = [
      "CONTINUATION OF PREVIOUS MISSION",
      `Original goal: ${conductor.goal}`,
      `Previous output summary: ${truncateContinuationText(continuationSummarySource ?? "")}`,
      `New instructions: ${trimmedInstructions}`,
      "",
      "Please continue building on the previous work."
    ].join("\n");
    setContinueDraft("");
    setContinueModalOpen(false);
    await conductor.sendMission(combinedPrompt);
  };
  const updateSettings = (patch) => {
    conductor.setConductorSettings({ ...conductor.conductorSettings, ...patch });
  };
  const openDirectoryBrowser = () => {
    setDirectoryBrowserPath(conductor.conductorSettings.projectsDir.trim() || "~");
    setDirectoryBrowserEntries([]);
    setDirectoryBrowserError(null);
    setDirectoryBrowserOpen(true);
  };
  const closeDirectoryBrowser = () => {
    setDirectoryBrowserOpen(false);
    setDirectoryBrowserLoading(false);
    setDirectoryBrowserError(null);
  };
  const directoryBreadcrumbs = useMemo(() => {
    const segments = getDirectoryPathSegments(directoryBrowserPath);
    return segments.map((segment, index) => ({
      label: segment === "/" ? "Root" : segment,
      path: buildDirectoryPathFromSegments(segments.slice(0, index + 1))
    }));
  }, [directoryBrowserPath]);
  const totalWorkers = conductor.workers.length;
  const completedWorkers = conductor.workers.filter((worker) => worker.status === "complete").length;
  const activeWorkerCount = conductor.activeWorkers.length;
  const missionProgress = totalWorkers > 0 ? Math.round(completedWorkers / totalWorkers * 100) : 0;
  const totalTokens = conductor.workers.reduce((sum, worker) => sum + worker.totalTokens, 0);
  const selectedHistoryEntry = conductor.selectedHistoryEntry;
  const completeMissionCostWorkers = useMemo(
    () => conductor.workers.map((worker, index) => {
      const persona = getAgentPersona(index);
      return {
        id: worker.key,
        label: worker.label,
        totalTokens: worker.totalTokens,
        personaEmoji: persona.emoji,
        personaName: persona.name
      };
    }),
    [conductor.workers]
  );
  const historyMissionCostWorkers = useMemo(
    () => (selectedHistoryEntry?.workerDetails ?? []).map((worker, index) => ({
      id: `${selectedHistoryEntry?.id ?? "history"}-${index}`,
      label: worker.label,
      totalTokens: worker.totalTokens,
      personaEmoji: worker.personaEmoji,
      personaName: worker.personaName
    })),
    [selectedHistoryEntry]
  );
  const OFFICE_NAMES = ["Nova", "Pixel", "Blaze", "Echo", "Sage", "Drift"];
  const homeOfficeRows = useMemo(() => {
    const sessions = conductor.recentSessions;
    if (sessions.length === 0) {
      return OFFICE_NAMES.slice(0, 3).map((name, i) => ({
        id: `placeholder-${i}`,
        name,
        modelId: "auto",
        status: "idle",
        lastLine: "Waiting for work…",
        taskCount: 0,
        roleDescription: "Worker"
      }));
    }
    return sessions.slice(0, 6).map((session, i) => {
      const s = session;
      const updatedAt = typeof s.updatedAt === "string" ? new Date(s.updatedAt).getTime() : typeof s.updatedAt === "number" ? s.updatedAt : 0;
      const statusText = `${s.status ?? ""} ${s.kind ?? ""}`.toLowerCase();
      const status = /error|failed/.test(statusText) ? "error" : /pause/.test(statusText) ? "paused" : Date.now() - updatedAt < 12e4 ? "active" : "idle";
      return {
        id: s.key ?? `session-${i}`,
        name: OFFICE_NAMES[i % OFFICE_NAMES.length],
        modelId: s.model ?? "auto",
        status,
        lastLine: s.task ?? s.label ?? s.title ?? s.derivedTitle ?? "Working…",
        lastAt: updatedAt || void 0,
        taskCount: 0,
        roleDescription: s.label ?? "Worker",
        sessionKey: s.key ?? void 0
      };
    });
  }, [conductor.recentSessions]);
  const officeAgentRows = useMemo(() => {
    if (conductor.workers.length > 0) {
      return conductor.workers.map((worker, index) => {
        const persona = getAgentPersona(index);
        const currentTask = conductor.tasks.find((task) => task.workerKey === worker.key && task.status === "running")?.title;
        const lastLine = conductor.workerOutputs[worker.key] ?? getLastAssistantMessage(worker.raw.messages);
        const isWorkerPaused = conductor.isPaused && (worker.status === "running" || worker.status === "idle");
        return {
          id: worker.key,
          name: persona.name,
          modelId: worker.model || "auto",
          roleDescription: worker.displayName,
          status: isWorkerPaused ? "paused" : worker.status === "complete" ? "idle" : worker.status === "stale" ? "error" : "active",
          lastLine: isWorkerPaused ? "Paused" : lastLine,
          lastAt: worker.updatedAt ? new Date(worker.updatedAt).getTime() : void 0,
          taskCount: conductor.tasks.filter((task) => task.workerKey === worker.key).length,
          currentTask: isWorkerPaused ? "Paused" : currentTask,
          sessionKey: worker.key
        };
      });
    }
    return [
      {
        id: "conductor-placeholder-agent",
        name: "Nova",
        modelId: conductor.conductorSettings.workerModel || "auto",
        roleDescription: "Waiting for workers",
        status: "spawning",
        lastLine: conductor.goal || "Preparing the office…",
        taskCount: 0,
        currentTask: conductor.goal || "Preparing the office…",
        sessionKey: "conductor-placeholder-agent"
      }
    ];
  }, [conductor.conductorSettings.workerModel, conductor.goal, conductor.isPaused, conductor.tasks, conductor.workerOutputs, conductor.workers]);
  const completePhaseProjectPath = useMemo(() => {
    const workerOutputTexts = [...Object.values(conductor.workerOutputs), ...conductor.workers.map((worker) => getLastAssistantMessage(worker.raw.messages))].filter(
      Boolean
    );
    for (const text of workerOutputTexts) {
      const extractedPath = extractProjectPath(text);
      if (extractedPath) return extractedPath;
    }
    for (const task of conductor.tasks) {
      if (!task.output) continue;
      const extractedPath = extractProjectPath(task.output);
      if (extractedPath) return extractedPath;
    }
    const streamPath = extractProjectPath(conductor.streamText);
    if (streamPath) return streamPath;
    const candidates = buildProjectPathCandidates(conductor.workers, conductor.missionStartedAt);
    return candidates[0] ?? null;
  }, [conductor.tasks, conductor.streamText, conductor.workerOutputs, conductor.workers, conductor.missionStartedAt]);
  const completePhaseOutputLabel = useMemo(() => getOutputDisplayName(completePhaseProjectPath), [completePhaseProjectPath]);
  const previewUrl = completePhaseProjectPath ? `/api/preview-file?path=${encodeURIComponent(`${completePhaseProjectPath}/index.html`)}` : null;
  const selectedHistoryOutputPath = useMemo(() => {
    const entry = conductor.selectedHistoryEntry;
    if (!entry) return null;
    if (entry.outputPath) return entry.outputPath;
    if (entry.projectPath) return entry.projectPath;
    const extractedOutputPath = extractProjectPath(entry.outputText ?? "") ?? extractProjectPath(entry.streamText ?? "");
    if (extractedOutputPath) return extractedOutputPath;
    const candidates = buildProjectPathCandidates(
      (entry.workerDetails ?? []).map((worker) => ({ label: worker.label })),
      entry.startedAt
    );
    return candidates[0] ?? null;
  }, [conductor.selectedHistoryEntry]);
  const selectedHistoryOutputLabel = useMemo(() => getOutputDisplayName(selectedHistoryOutputPath), [selectedHistoryOutputPath]);
  const selectedHistoryPreviewUrl = selectedHistoryOutputPath ? `/api/preview-file?path=${encodeURIComponent(`${selectedHistoryOutputPath}/index.html`)}` : null;
  const isLiveCompletePreview = phase === "complete" && !!completePhaseProjectPath && selectedHistoryOutputPath === completePhaseProjectPath;
  const selectedHistoryPreview = usePreviewAvailability(selectedHistoryPreviewUrl, !!conductor.selectedHistoryEntry && isLiveCompletePreview);
  const previewState = usePreviewAvailability(previewUrl, phase === "complete");
  const completedTaskOutputs = useMemo(() => {
    return conductor.tasks.filter((task) => task.output).map((task) => ({
      ...task,
      extractedPath: extractProjectPath(task.output ?? ""),
      previewUrl: (() => {
        const extractedPath = extractProjectPath(task.output ?? "");
        return extractedPath ? `/api/preview-file?path=${encodeURIComponent(`${extractedPath}/index.html`)}` : null;
      })(),
      previewText: (task.output ?? "").trim().slice(0, 200)
    }));
  }, [conductor.tasks]);
  const completeSummary = useMemo(() => {
    if (phase !== "complete") return null;
    const isFailed = !!conductor.streamError;
    const lines = [
      isFailed ? `❌ ${conductor.streamError}` : "✅ Mission completed successfully",
      "",
      `**Goal:** ${conductor.goal}`,
      `**Duration:** ${formatElapsedTime(conductor.missionStartedAt, conductor.completedAt ? new Date(conductor.completedAt).getTime() : now)}`
    ];
    if (totalWorkers > 0) {
      lines.push(`**Workers:** ${totalWorkers} ran · ${totalTokens.toLocaleString()} tokens`);
    }
    if (completePhaseProjectPath) {
      lines.push(`**Output:** ${completePhaseOutputLabel}`);
    }
    return lines.join("\n");
  }, [phase, completePhaseProjectPath, completePhaseOutputLabel, totalWorkers, conductor.goal, totalTokens, conductor.missionStartedAt, now]);
  const continuationPreview = useMemo(() => {
    const summarySource = completeSummary ?? Object.values(conductor.workerOutputs).find((output) => output.trim()) ?? conductor.workers.map((worker) => getLastAssistantMessage(worker.raw.messages)).find((output) => output.trim()) ?? conductor.streamText;
    return truncateContinuationText(summarySource ?? "");
  }, [completeSummary, conductor.streamText, conductor.workerOutputs, conductor.workers]);
  const continuationModalPreview = useMemo(() => truncateContinuationText(continuationPreview, 200), [continuationPreview]);
  const hasMissionHistory = conductor.missionHistory.length > 0;
  const canResetSavedState = hasMissionHistory || conductor.hasPersistedMission;
  const filteredHistory = (() => {
    const history = conductor.missionHistory;
    if (activityFilter === "all") return history;
    return history.filter((entry) => entry.status === activityFilter);
  })();
  const filteredSessions = (() => {
    const sessions = conductor.recentSessions;
    if (activityFilter === "all") return sessions;
    return sessions.filter((session) => (session.label ?? "").startsWith("worker-")).filter((session) => deriveSessionStatus(session) === activityFilter);
  })();
  const activityItems = hasMissionHistory ? filteredHistory : filteredSessions;
  const ACTIVITY_PAGE_SIZE = 3;
  const activityTotalPages = Math.max(1, Math.ceil(activityItems.length / ACTIVITY_PAGE_SIZE));
  const safeActivityPage = Math.min(activityPage, activityTotalPages - 1);
  const visibleActivityItems = activityItems.slice(safeActivityPage * ACTIVITY_PAGE_SIZE, (safeActivityPage + 1) * ACTIVITY_PAGE_SIZE);
  useEffect(() => {
    if (!selectedTaskId) return;
    if (conductor.tasks.some((task) => task.id === selectedTaskId)) return;
    setSelectedTaskId(null);
  }, [conductor.tasks, selectedTaskId]);
  useEffect(() => {
    if (phase !== "complete") return;
    setCompleteCostExpanded(true);
  }, [phase, conductor.completedAt]);
  useEffect(() => {
    if (!selectedHistoryEntry) return;
    setHistoryCostExpanded(false);
  }, [selectedHistoryEntry]);
  if (phase === "home") {
    if (selectedHistoryEntry) {
      const historyWorkerDetails = selectedHistoryEntry.workerDetails ?? [];
      const historySummary = selectedHistoryEntry.completeSummary ?? selectedHistoryEntry.streamText;
      const historyOutputText = selectedHistoryEntry.outputText?.trim() || selectedHistoryEntry.streamText?.trim() || "";
      const showHistoryOutputFallback = !!historyOutputText && (!selectedHistoryOutputPath || selectedHistoryPreview.unavailable);
      const historyStatusLabel = selectedHistoryEntry.status === "completed" ? "Complete" : "Stopped";
      const historyStatusClasses = selectedHistoryEntry.status === "completed" ? "border border-emerald-400/35 bg-emerald-500/10 text-emerald-300" : "border border-red-400/35 bg-red-500/10 text-red-300";
      return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh flex-col overflow-y-auto bg-[var(--theme-bg)] text-[var(--theme-text)]", style: THEME_STYLE, children: /* @__PURE__ */ jsx("main", { className: "mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col px-4 py-4 pb-4 md:pb-[calc(var(--tabbar-h,80px)+1rem)] md:px-6 md:py-8", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => conductor.setSelectedHistoryEntry(null),
            className: "inline-flex items-center gap-2 self-start rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-2 text-sm text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-border2)] hover:text-[var(--theme-text)]",
            children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "←" }),
              " Back"
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: cn("text-xs font-semibold uppercase tracking-[0.24em]", selectedHistoryEntry.status === "completed" ? "text-[var(--theme-accent)]" : "text-red-400"), children: selectedHistoryEntry.status === "completed" ? "Mission Complete" : "Mission Stopped" }),
            /* @__PURE__ */ jsx("h1", { className: "mt-2 text-xl font-semibold tracking-tight text-[var(--theme-text)] sm:text-2xl", children: selectedHistoryEntry.goal }),
            /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-[var(--theme-muted-2)]", children: [
              selectedHistoryEntry.workerCount,
              "/",
              Math.max(selectedHistoryEntry.workerCount, 1),
              " workers finished ·",
              " ",
              formatDurationRange(selectedHistoryEntry.startedAt, selectedHistoryEntry.completedAt, now),
              " total elapsed"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              onClick: () => {
                conductor.setSelectedHistoryEntry(null);
                handleNewMission();
              },
              className: "rounded-xl bg-[var(--theme-accent)] px-5 text-white hover:bg-[var(--theme-accent-strong)]",
              children: "New Mission"
            }
          ) })
        ] }) }),
        selectedHistoryOutputPath && selectedHistoryPreview.ready ? /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Output Preview" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: selectedHistoryOutputLabel })
            ] }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: selectedHistoryPreviewUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-1.5 text-xs font-medium text-[var(--theme-text)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]",
                children: "Open in new tab ↗"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-auto rounded-2xl border border-[var(--theme-border)] bg-white", children: /* @__PURE__ */ jsx("iframe", { src: selectedHistoryPreviewUrl, className: "h-[clamp(280px,55vh,520px)] w-full", sandbox: "allow-scripts allow-same-origin", title: "Mission history output preview" }) })
        ] }) : selectedHistoryOutputPath && selectedHistoryPreview.loading ? /* @__PURE__ */ jsx("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-[var(--theme-muted)]", children: [
          /* @__PURE__ */ jsx("div", { className: "size-4 animate-spin rounded-full border-2 border-[var(--theme-border)] border-t-[var(--theme-accent)]" }),
          "Loading output preview…"
        ] }) }) : selectedHistoryOutputPath && selectedHistoryPreview.unavailable ? showHistoryOutputFallback ? null : /* @__PURE__ */ jsx("p", { className: "px-1 text-sm text-[var(--theme-muted)]", children: "No preview available." }) : null,
        /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Agent Summary" }) }),
            /* @__PURE__ */ jsx("span", { className: cn("rounded-full px-3 py-1 text-xs font-medium", historyStatusClasses), children: historyStatusLabel })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-5 py-4", children: historySummary ? /* @__PURE__ */ jsx(Markdown, { className: "max-h-[400px] max-w-none overflow-auto text-sm text-[var(--theme-text)]", children: historySummary }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--theme-muted)]", children: "No summary captured." }) }),
          historyWorkerDetails.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: historyWorkerDetails.map((worker, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", selectedHistoryEntry.status === "completed" ? "bg-emerald-400" : "bg-red-400") }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium text-[var(--theme-text)]", children: [
              worker.personaEmoji,
              " ",
              worker.personaName
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-muted)]", children: worker.label }),
            /* @__PURE__ */ jsxs("span", { className: "ml-auto text-xs text-[var(--theme-muted)]", children: [
              getShortModelName(worker.model),
              " · ",
              worker.totalTokens.toLocaleString(),
              " tok"
            ] })
          ] }, `${selectedHistoryEntry.id}-worker-${index}`)) }),
          (selectedHistoryEntry.totalTokens > 0 || historyMissionCostWorkers.length > 0) && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
            MissionCostSection,
            {
              totalTokens: selectedHistoryEntry.totalTokens,
              workers: historyMissionCostWorkers,
              expanded: historyCostExpanded,
              onToggle: () => setHistoryCostExpanded((current) => !current)
            }
          ) }),
          selectedHistoryEntry.streamText && selectedHistoryEntry.completeSummary && /* @__PURE__ */ jsxs("details", { className: "mt-4 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-5 py-4", children: [
            /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-xs font-medium text-[var(--theme-muted)]", children: "Raw Agent Output" }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-[var(--theme-border)] pt-4", children: /* @__PURE__ */ jsx(Markdown, { className: "max-h-[400px] max-w-none overflow-auto text-sm text-[var(--theme-text)]", children: selectedHistoryEntry.streamText }) })
          ] })
        ] }),
        showHistoryOutputFallback ? /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-3", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Output" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: [
              "Preview unavailable",
              selectedHistoryOutputPath ? ` for ${selectedHistoryOutputLabel}` : "",
              "."
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-5 py-4", children: /* @__PURE__ */ jsx(Markdown, { className: "max-h-[600px] max-w-none overflow-auto text-sm text-[var(--theme-text)]", children: historyOutputText }) })
        ] }) : historyOutputText ? /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Worker Output" }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-5 py-4", children: /* @__PURE__ */ jsx(Markdown, { className: "max-h-[600px] max-w-none overflow-auto text-sm text-[var(--theme-text)]", children: historyOutputText }) })
        ] }) : null,
        !historySummary && historyWorkerDetails.length === 0 && !selectedHistoryOutputPath && !selectedHistoryEntry.workerSummary?.length && !historyOutputText && /* @__PURE__ */ jsx("section", { className: "overflow-hidden rounded-3xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] p-6", children: /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-[var(--theme-muted)]", children: [
          "No detailed output was captured for this mission.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--theme-muted-2)]", children: "Missions run after this update will save full agent summaries and output previews." })
        ] }) })
      ] }) }) });
    }
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh flex-col overflow-y-auto bg-[var(--theme-bg)] text-[var(--theme-text)]", style: THEME_STYLE, children: /* @__PURE__ */ jsxs("main", { className: "mx-auto flex min-h-0 w-full max-w-[760px] flex-1 flex-col items-stretch justify-start px-4 py-4 pb-4 md:pb-[calc(var(--tabbar-h,80px)+1rem)] md:px-6 md:py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "hidden md:block flex-1" }),
            /* @__PURE__ */ jsxs("div", { className: "hidden md:inline-flex shrink-0 items-center gap-2.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--theme-muted)]", children: [
              /* @__PURE__ */ jsx("span", { children: "Conductor" }),
              /* @__PURE__ */ jsx("span", { className: "size-2.5 shrink-0 rounded-full bg-emerald-400" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex md:flex-1 items-center justify-end gap-2 ml-auto md:ml-0", children: [
              /* @__PURE__ */ jsx(
                WorkflowHelpModal,
                {
                  compact: true,
                  eyebrow: "Conductor",
                  title: "How Conductor works",
                  sections: [
                    {
                      title: "What Conductor is for",
                      bullets: [
                        "Conductor is the mission-level orchestration surface for coordinated agent execution.",
                        "Use it when one goal should be planned, assigned, and tracked end to end."
                      ]
                    },
                    {
                      title: "Typical flow",
                      bullets: [
                        "Start a mission, watch worker progress, and intervene only when something is blocked or clearly off-course.",
                        "Use the mission views to understand what happened before retrying or launching the next mission."
                      ]
                    },
                    {
                      title: "FAQ",
                      bullets: [
                        "If Conductor says upstream is unavailable, the underlying runtime capability is not ready yet.",
                        "Conductor is for orchestration, not first-time setup. Fix setup issues in Operations first."
                      ]
                    }
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setMissionModalOpen(true),
                  className: "inline-flex items-center justify-center rounded-xl bg-[var(--theme-accent)] p-2 text-white shadow-sm transition-colors hover:bg-[var(--theme-accent-strong)]",
                  "aria-label": "New Mission",
                  children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Rocket01Icon, size: 18, strokeWidth: 1.7 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSettingsOpen(true),
                  className: "inline-flex items-center justify-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-2 text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]",
                  "aria-label": "Open conductor settings",
                  children: /* @__PURE__ */ jsx(HugeiconsIcon, { icon: Settings01Icon, size: 18, strokeWidth: 1.7 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--theme-muted-2)]", children: "Launch a mission and watch your agent team build it live." })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "h-[280px] overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-[0_24px_80px_var(--theme-shadow)] md:h-[520px]", children: /* @__PURE__ */ jsx(
          OfficeView,
          {
            agentRows: homeOfficeRows,
            missionRunning: homeOfficeRows.some((a) => a.status === "active"),
            onViewOutput: () => {
            },
            processType: "parallel",
            companyName: "",
            containerHeight: 520,
            hideHeader: true
          }
        ) }),
        hasMissionHistory || conductor.recentSessions.length > 0 ? /* @__PURE__ */ jsxs("section", { className: "mt-6 w-full space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: "Recent Missions" }),
            activityTotalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[var(--theme-muted-2)]", children: [
                safeActivityPage + 1,
                "/",
                activityTotalPages
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  disabled: safeActivityPage === 0,
                  onClick: () => setActivityPage((p) => Math.max(0, p - 1)),
                  className: "inline-flex size-6 items-center justify-center rounded-lg border border-[var(--theme-border)] text-xs text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-accent)] disabled:opacity-30",
                  children: "‹"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  disabled: safeActivityPage >= activityTotalPages - 1,
                  onClick: () => setActivityPage((p) => Math.min(activityTotalPages - 1, p + 1)),
                  className: "inline-flex size-6 items-center justify-center rounded-lg border border-[var(--theme-border)] text-xs text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-accent)] disabled:opacity-30",
                  children: "›"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: ["all", "completed", "failed"].map((filter) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setActivityFilter(filter);
                setActivityPage(0);
              },
              className: cn(
                "rounded-full border px-3 py-1 text-[11px] font-medium capitalize transition-colors",
                activityFilter === filter ? "border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent-strong)]" : "border-[var(--theme-border)] text-[var(--theme-muted-2)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-text)]"
              ),
              children: filter
            },
            filter
          )) }),
          visibleActivityItems.length > 0 ? /* @__PURE__ */ jsx("div", { className: "min-h-[140px] space-y-1.5", children: hasMissionHistory ? visibleActivityItems.map((item) => {
            const entry = item;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => conductor.setSelectedHistoryEntry(entry),
                className: "flex w-full items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-2 text-left text-sm transition-colors hover:border-[var(--theme-accent)] sm:gap-3",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate font-medium text-[var(--theme-text)]", children: entry.goal }),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: cn(
                        "w-[72px] shrink-0 rounded-full border px-2 py-0.5 text-center text-[10px] font-medium uppercase tracking-[0.12em]",
                        entry.status === "completed" ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-300" : "border-red-400/35 bg-red-500/10 text-red-300"
                      ),
                      children: entry.status === "completed" ? "Complete" : "Failed"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "w-[48px] shrink-0 text-right text-xs text-[var(--theme-muted-2)]", children: formatRelativeTime(entry.completedAt, now) }),
                  /* @__PURE__ */ jsxs("span", { className: "hidden shrink-0 text-right text-xs text-[var(--theme-muted)] sm:inline", children: [
                    entry.totalTokens.toLocaleString(),
                    " tok"
                  ] })
                ]
              },
              entry.id
            );
          }) : visibleActivityItems.map((item) => {
            const recentSession = item;
            const label = recentSession.label ?? recentSession.key ?? "";
            const displayName = label.replace(/^worker-/, "").replace(/[-_]+/g, " ");
            const tokens = typeof recentSession.totalTokens === "number" ? recentSession.totalTokens : 0;
            const model = getShortModelName(recentSession.model);
            const updatedAt = typeof recentSession.updatedAt === "string" ? recentSession.updatedAt : typeof recentSession.startedAt === "string" ? recentSession.startedAt : typeof recentSession.createdAt === "string" ? recentSession.createdAt : null;
            const sessionStatus = deriveSessionStatus(recentSession);
            const dotClass = sessionStatus === "completed" ? "bg-emerald-400" : sessionStatus === "failed" ? "bg-red-400" : "bg-sky-400 animate-pulse";
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-3 py-2 text-sm sm:gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate font-medium capitalize text-[var(--theme-text)]", children: displayName }),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]",
                    sessionStatus === "completed" ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-300" : sessionStatus === "failed" ? "border-red-400/35 bg-red-500/10 text-red-300" : "border-sky-400/35 bg-sky-500/10 text-sky-300"
                  ),
                  children: [
                    /* @__PURE__ */ jsx("span", { className: cn("mr-1 inline-block size-1.5 rounded-full align-middle", dotClass) }),
                    sessionStatus
                  ]
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "shrink-0 text-xs text-[var(--theme-muted-2)]", children: formatRelativeTime(updatedAt, now) }),
              /* @__PURE__ */ jsxs("span", { className: "hidden shrink-0 text-xs text-[var(--theme-muted)] sm:inline", children: [
                tokens.toLocaleString(),
                " tok"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "hidden shrink-0 text-xs text-[var(--theme-muted)] sm:inline", children: model })
            ] }, recentSession.key);
          }) }) : /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-dashed border-[var(--theme-border)] px-4 py-6 text-center text-sm text-[var(--theme-muted)]", children: [
            "No ",
            activityFilter === "all" ? "" : `${activityFilter} `,
            hasMissionHistory ? "missions" : "sessions",
            " found"
          ] })
        ] }) : /* @__PURE__ */ jsx("section", { className: "mt-6 w-full", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-dashed border-[var(--theme-border)] px-4 py-8 text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--theme-muted)]", children: "No missions yet." }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: "Launch your first mission and it will appear here." })
        ] }) })
      ] }),
      missionModalOpen ? /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--theme-bg)_48%,transparent)] px-4 py-6 backdrop-blur-md",
          onClick: () => setMissionModalOpen(false),
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "w-full max-w-2xl rounded-3xl border border-[var(--theme-border2)] bg-[var(--theme-card)] p-5 shadow-[0_24px_80px_var(--theme-shadow)] sm:p-6",
              onClick: (event) => event.stopPropagation(),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight text-[var(--theme-text)]", children: "New Mission" }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--theme-muted-2)]", children: "Describe the mission, constraints, and desired outcome." })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setMissionModalOpen(false),
                      className: "inline-flex size-9 items-center justify-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] text-lg text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]",
                      "aria-label": "Close new mission dialog",
                      children: "×"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  "form",
                  {
                    className: "mt-5 space-y-4",
                    onSubmit: (event) => {
                      event.preventDefault();
                      void handleSubmit();
                    },
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: QUICK_ACTIONS.map((action) => /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleQuickActionSelect(action),
                          className: cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                            selectedAction === action.id ? "border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent-strong)]" : "border-[var(--theme-border)] bg-transparent text-[var(--theme-muted)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]"
                          ),
                          children: [
                            /* @__PURE__ */ jsx(HugeiconsIcon, { icon: action.icon, size: 14, strokeWidth: 1.7 }),
                            action.label
                          ]
                        },
                        action.id
                      )) }),
                      /* @__PURE__ */ jsx(
                        "textarea",
                        {
                          value: goalDraft,
                          onChange: (event) => setGoalDraft(event.target.value),
                          placeholder: `${QUICK_ACTIONS.find((action) => action.id === selectedAction)?.label ?? "Build"}: describe the mission, constraints, and desired outcome.`,
                          disabled: conductor.isSending,
                          rows: 8,
                          className: "min-h-[220px] w-full rounded-3xl border border-[var(--theme-border2)] bg-[var(--theme-bg)] px-4 py-4 text-sm text-[var(--theme-text)] outline-none transition-colors placeholder:text-[var(--theme-muted-2)] focus:border-[var(--theme-accent)] disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
                        }
                      ),
                      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: !goalDraft.trim() || conductor.isSending, className: "rounded-full bg-[var(--theme-accent)] px-5 text-white hover:bg-[var(--theme-accent-strong)]", children: [
                        conductor.isSending ? "Launching..." : "Launch Mission",
                        /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ArrowRight01Icon, size: 16, strokeWidth: 1.7 })
                      ] }) })
                    ]
                  }
                )
              ]
            }
          )
        }
      ) : null,
      settingsOpen && /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--theme-bg)_55%,transparent)] px-4 py-6 backdrop-blur-md",
          onClick: () => setSettingsOpen(false),
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[var(--theme-border2)] bg-[var(--theme-card)] p-5 shadow-[0_24px_80px_var(--theme-shadow)] sm:p-6",
              onClick: (event) => event.stopPropagation(),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Mission Defaults" }),
                    /* @__PURE__ */ jsx("h2", { className: "mt-2 text-2xl font-semibold tracking-tight text-[var(--theme-text)]", children: "Conductor settings" }),
                    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[var(--theme-muted-2)]", children: "Set the models and defaults every new mission should inherit." })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSettingsOpen(false),
                      className: "inline-flex size-10 items-center justify-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] text-lg text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]",
                      "aria-label": "Close settings",
                      children: "×"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
                  /* @__PURE__ */ jsx(
                    ModelSelectorDropdown,
                    {
                      label: "Orchestrator Model",
                      value: conductor.conductorSettings.orchestratorModel,
                      onChange: (nextValue) => updateSettings({ orchestratorModel: nextValue }),
                      models: availableModels
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    ModelSelectorDropdown,
                    {
                      label: "Worker Model",
                      value: conductor.conductorSettings.workerModel,
                      onChange: (nextValue) => updateSettings({ workerModel: nextValue }),
                      models: availableModels
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[var(--theme-text)]", children: "Project Directory" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          value: conductor.conductorSettings.projectsDir,
                          onChange: (event) => updateSettings({ projectsDir: event.target.value }),
                          placeholder: "~/conductor-projects",
                          className: "min-w-0 flex-1 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3 text-sm text-[var(--theme-text)] outline-none transition-colors placeholder:text-[var(--theme-muted-2)] focus:border-[var(--theme-accent)]"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: openDirectoryBrowser,
                          className: "shrink-0 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-4 py-3 text-sm font-medium text-[var(--theme-text)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]",
                          children: "Browse"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--theme-muted-2)]", children: "Type a path directly or choose a directory from the browser." })
                  ] }),
                  /* @__PURE__ */ jsxs("label", { className: "block space-y-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-[var(--theme-text)]", children: "Max Parallel Workers" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        max: 5,
                        value: conductor.conductorSettings.maxParallel,
                        onChange: (event) => updateSettings({
                          maxParallel: Math.min(5, Math.max(1, Number(event.target.value) || 1))
                        }),
                        className: "w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3 text-sm text-[var(--theme-text)] outline-none transition-colors focus:border-[var(--theme-accent)]"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("label", { className: "flex items-start gap-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-4", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: conductor.conductorSettings.supervised,
                        onChange: (event) => updateSettings({ supervised: event.target.checked }),
                        className: "mt-1 size-4 rounded border-[var(--theme-border2)] accent-[var(--theme-accent)]"
                      }
                    ),
                    /* @__PURE__ */ jsxs("span", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsx("span", { className: "block text-sm font-medium text-[var(--theme-text)]", children: "Supervised Mode" }),
                      /* @__PURE__ */ jsx("span", { className: "mt-1 block text-sm text-[var(--theme-muted-2)]", children: "Require approval before each task" })
                    ] })
                  ] }),
                  canResetSavedState ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-[var(--theme-text)]", children: "Reset saved state" }),
                      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: "Clear mission history and any persisted Conductor mission state." })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setSettingsOpen(false);
                          conductor.resetSavedState();
                          setGoalDraft("");
                          setContinueDraft("");
                          setSelectedTaskId(null);
                        },
                        className: "text-xs text-[var(--theme-muted)] transition-colors hover:text-[var(--theme-accent)]",
                        children: "Reset"
                      }
                    )
                  ] }) : null
                ] })
              ]
            }
          )
        }
      ),
      directoryBrowserOpen ? /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[70] flex items-center justify-center bg-[color-mix(in_srgb,var(--theme-bg)_55%,transparent)] px-4 py-6 backdrop-blur-md", onClick: closeDirectoryBrowser, children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "w-full max-w-2xl rounded-3xl border border-[var(--theme-border2)] bg-[var(--theme-card)] p-5 shadow-[0_24px_80px_var(--theme-shadow)] sm:p-6",
          onClick: (event) => event.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Directory Browser" }),
                /* @__PURE__ */ jsx("h3", { className: "mt-2 text-xl font-semibold tracking-tight text-[var(--theme-text)]", children: "Choose project directory" }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[var(--theme-muted-2)]", children: "Select the folder where Conductor should create project output." })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: closeDirectoryBrowser,
                  className: "inline-flex size-10 items-center justify-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] text-lg text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]",
                  "aria-label": "Close directory browser",
                  children: "×"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDirectoryBrowserPath(getParentDirectory(directoryBrowserPath)),
                    disabled: directoryBrowserLoading || getParentDirectory(directoryBrowserPath) === directoryBrowserPath,
                    className: cn(
                      "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                      directoryBrowserLoading || getParentDirectory(directoryBrowserPath) === directoryBrowserPath ? "cursor-not-allowed border-[var(--theme-border)] bg-[var(--theme-card2)] text-[var(--theme-muted)] opacity-60" : "border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-text)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]"
                    ),
                    children: "Up"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-1 text-sm", children: directoryBreadcrumbs.map((crumb, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  index > 0 ? /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-muted-2)]", children: "/" }) : null,
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setDirectoryBrowserPath(crumb.path),
                      className: cn(
                        "rounded-md px-1.5 py-0.5 transition-colors",
                        crumb.path === directoryBrowserPath ? "bg-[var(--theme-accent-soft)] text-[var(--theme-accent-strong)]" : "text-[var(--theme-text)] hover:bg-[var(--theme-card2)]"
                      ),
                      children: crumb.label
                    }
                  )
                ] }, crumb.path)) }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: "Current path" }),
                /* @__PURE__ */ jsx("span", { className: "truncate text-sm text-[var(--theme-text)]", children: directoryBrowserPath })
              ] }) }),
              directoryBrowserError ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-[var(--theme-warning-border)] bg-[var(--theme-warning-soft)] px-4 py-3 text-sm text-[var(--theme-warning)]", children: directoryBrowserError }) : null,
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)]", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[var(--theme-border)] px-4 py-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: "Folders" }),
                  directoryBrowserLoading ? /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--theme-muted-2)]", children: "Loading…" }) : /* @__PURE__ */ jsxs("span", { className: "text-xs text-[var(--theme-muted-2)]", children: [
                    directoryBrowserEntries.length,
                    " visible"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "max-h-[22rem] overflow-y-auto p-2", children: directoryBrowserLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 px-4 py-10 text-sm text-[var(--theme-muted)]", children: [
                  /* @__PURE__ */ jsx("div", { className: "size-4 animate-spin rounded-full border-2 border-[var(--theme-border)] border-t-[var(--theme-accent)]" }),
                  /* @__PURE__ */ jsx("span", { children: "Loading folders…" })
                ] }) : directoryBrowserEntries.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-1", children: directoryBrowserEntries.map((entry) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDirectoryBrowserPath(entry.path),
                    className: "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-card2)]",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "inline-flex size-2 rounded-full bg-[var(--theme-accent)]" }),
                      /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate", children: entry.name }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--theme-muted)]", children: "Open" })
                    ]
                  },
                  entry.path
                )) }) : /* @__PURE__ */ jsx("div", { className: "px-4 py-10 text-center text-sm text-[var(--theme-muted)]", children: "No folders found in this location." }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: "Quick paths" }),
                /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: getDirectorySuggestions().map((pathOption) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDirectoryBrowserPath(pathOption),
                    className: "rounded-full border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-1.5 text-xs font-medium text-[var(--theme-text)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]",
                    children: pathOption
                  },
                  pathOption
                )) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: closeDirectoryBrowser,
                    className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3 text-sm font-medium text-[var(--theme-text)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      updateSettings({ projectsDir: directoryBrowserPath });
                      closeDirectoryBrowser();
                    },
                    className: "rounded-xl bg-[var(--theme-accent)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--theme-accent-strong)]",
                    children: "Select This Directory"
                  }
                )
              ] })
            ] })
          ]
        }
      ) }) : null
    ] }) });
  }
  if (phase === "preview") {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh flex-col overflow-y-auto bg-[var(--theme-bg)] text-[var(--theme-text)]", style: THEME_STYLE, children: /* @__PURE__ */ jsx("main", { className: "mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col px-4 py-4 pb-4 md:pb-[calc(var(--tabbar-h,80px)+1rem)] md:px-6 md:py-8", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-accent)]", children: "Mission Decomposition" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: conductor.goal }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--theme-muted-2)]", children: "The agent is breaking the mission into workers. Once they spawn, this view flips into the active board." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-[var(--theme-border)] pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Mission Planning" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: "Analyzing your request and preparing agents" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300 animate-pulse", children: "Working" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 min-h-[200px] overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-5 py-4", children: conductor.planText ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(Markdown, { className: "max-h-[500px] max-w-none overflow-auto text-sm text-[var(--theme-text)]", children: conductor.planText.replace(/(.{20,}?)\1+/g, "$1") }),
          /* @__PURE__ */ jsx(PlanningIndicator, {})
        ] }) : /* @__PURE__ */ jsx(PlanningIndicator, {}) }),
        conductor.streamError && /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-600", children: conductor.streamError }),
        conductor.timeoutWarning && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-5 py-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-700", children: "⚠️ Planning is taking longer than expected..." }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              onClick: handleNewMission,
              className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-4 text-[var(--theme-text)] hover:bg-[var(--theme-card2)]",
              children: "Cancel"
            }
          )
        ] }),
        conductor.tasks.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: [
            "Identified Tasks (",
            conductor.tasks.length,
            ")"
          ] }),
          conductor.tasks.map((task) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-zinc-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-text)]", children: task.title })
          ] }, task.id))
        ] })
      ] })
    ] }) }) });
  }
  if (phase === "complete") {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh flex-col overflow-y-auto bg-[var(--theme-bg)] text-[var(--theme-text)]", style: THEME_STYLE, children: /* @__PURE__ */ jsxs("main", { className: "mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col px-4 py-4 pb-4 md:pb-[calc(var(--tabbar-h,80px)+1rem)] md:px-6 md:py-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-muted)]", children: [
          "Conductor",
          /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-emerald-400" })
        ] }) }),
        conductor.streamError && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-[var(--theme-danger-border)] bg-[var(--theme-danger-soft)] px-5 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "pt-0.5 text-[var(--theme-danger)]", children: "❌" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[var(--theme-danger)]", children: "Mission failed" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[var(--theme-danger)]/90", children: conductor.streamError })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
            /* @__PURE__ */ jsx(
              WorkflowHelpModal,
              {
                compact: true,
                eyebrow: "Conductor",
                title: "How Conductor works",
                sections: [
                  {
                    title: "What Conductor is for",
                    bullets: [
                      "Conductor is the mission-level orchestration surface for coordinated agent execution.",
                      "Use it when one goal should be planned, assigned, and tracked end to end."
                    ]
                  },
                  {
                    title: "Typical flow",
                    bullets: [
                      "Start a mission, watch worker progress, and intervene only when something is blocked or clearly off-course.",
                      "Use the mission views to understand what happened before retrying or launching the next mission."
                    ]
                  },
                  {
                    title: "FAQ",
                    bullets: [
                      "If Conductor says upstream is unavailable, the underlying runtime capability is not ready yet.",
                      "Conductor is for orchestration, not first-time setup. Fix setup issues in Operations first."
                    ]
                  }
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                onClick: () => void conductor.retryMission(),
                className: "rounded-xl border border-[var(--theme-danger-border)] bg-[var(--theme-danger-soft)] px-4 text-[var(--theme-danger)] hover:bg-[var(--theme-danger-soft-strong)]",
                children: "Retry Mission"
              }
            ),
            /* @__PURE__ */ jsx(Button, { type: "button", onClick: handleNewMission, className: "rounded-xl bg-[var(--theme-accent)] px-4 text-white hover:bg-[var(--theme-accent-strong)]", children: "New Mission" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: cn("text-xs font-semibold uppercase tracking-[0.24em]", conductor.streamError ? "text-red-400" : "text-[var(--theme-accent)]"), children: conductor.streamError ? "Mission Stopped" : "Mission Complete" }),
            /* @__PURE__ */ jsx("h1", { className: "mt-2 text-xl font-semibold tracking-tight text-[var(--theme-text)] sm:text-2xl", children: conductor.goal }),
            /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-[var(--theme-muted-2)]", children: [
              completedWorkers,
              "/",
              Math.max(totalWorkers, completedWorkers),
              " workers finished ·",
              " ",
              formatElapsedTime(conductor.missionStartedAt, conductor.completedAt ? new Date(conductor.completedAt).getTime() : now),
              " total elapsed"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            !completePhaseProjectPath || !previewState.ready ? /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                onClick: () => setContinueModalOpen(true),
                className: "rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-4 text-[var(--theme-text)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]",
                children: "Continue"
              }
            ) : null,
            /* @__PURE__ */ jsx(Button, { type: "button", onClick: handleNewMission, className: "rounded-xl bg-[var(--theme-accent)] px-5 text-white hover:bg-[var(--theme-accent-strong)]", children: "New Mission" })
          ] })
        ] }) }),
        completePhaseProjectPath && previewState.ready ? /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Output Preview" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: completePhaseProjectPath.split("/").pop() || "index.html" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: previewUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-1.5 text-xs font-medium text-[var(--theme-text)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]",
                  children: "Open in new tab ↗"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setContinueModalOpen(true),
                  className: "inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-1.5 text-xs font-medium text-[var(--theme-text)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]",
                  children: "Continue"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-auto rounded-2xl border border-[var(--theme-border)] bg-white", children: /* @__PURE__ */ jsx("iframe", { src: previewUrl, className: "h-[clamp(280px,55vh,520px)] w-full", sandbox: "allow-scripts allow-same-origin", title: "Mission output preview" }) })
        ] }) : completePhaseProjectPath && previewState.loading && !conductor.streamError ? /* @__PURE__ */ jsx("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-[var(--theme-muted)]", children: [
          /* @__PURE__ */ jsx("div", { className: "size-4 animate-spin rounded-full border-2 border-[var(--theme-border)] border-t-[var(--theme-accent)]" }),
          "Loading output preview…"
        ] }) }) : null,
        (!completePhaseProjectPath || previewState.unavailable) && (() => {
          const outputSections = conductor.workers.map((worker, index) => {
            const output = (conductor.workerOutputs[worker.key] ?? getLastAssistantMessage(worker.raw.messages)).trim();
            if (!output) return null;
            const persona = getAgentPersona(index);
            return {
              key: worker.key,
              persona,
              label: worker.label,
              output
            };
          }).filter((section) => section !== null);
          const fallbackText = outputSections.length > 0 ? outputSections.map((s) => `### ${s.persona.emoji} ${s.persona.name} · ${s.label}

${s.output}`).join("\n\n---\n\n") : conductor.streamText.trim();
          if (!fallbackText) return null;
          return /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-3", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Output" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: completePhaseProjectPath ? `Preview unavailable for ${completePhaseOutputLabel}` : "Agent work output" })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-5 py-4", children: /* @__PURE__ */ jsx(Markdown, { className: "max-h-[600px] max-w-none overflow-auto text-sm text-[var(--theme-text)]", children: fallbackText }) })
          ] });
        })(),
        conductor.tasks.length > 1 && completedTaskOutputs.length > 0 && /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-3", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Task Outputs" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted-2)]", children: "Per-task output snapshots from completed workers." })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: completedTaskOutputs.map((task) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-emerald-400" }),
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-medium text-[var(--theme-text)]", children: task.title })
              ] }) }),
              task.previewUrl && /* @__PURE__ */ jsx(
                "a",
                {
                  href: task.previewUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] px-3 py-1.5 text-xs font-medium text-[var(--theme-text)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]",
                  children: "Preview"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm text-[var(--theme-muted)]", children: [
              task.previewText,
              (task.output ?? "").trim().length > 200 ? "…" : ""
            ] })
          ] }, task.id)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-6 shadow-[0_24px_80px_var(--theme-shadow)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: "Agent Summary" }) }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  conductor.streamError ? "border border-red-400/35 bg-red-500/10 text-red-300" : "border border-emerald-400/35 bg-emerald-500/10 text-emerald-300"
                ),
                children: conductor.streamError ? "Stopped" : "Complete"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-5 py-4", children: completeSummary ? /* @__PURE__ */ jsx(Markdown, { className: "max-h-[400px] max-w-none overflow-auto text-sm text-[var(--theme-text)]", children: completeSummary }) : conductor.streamText ? /* @__PURE__ */ jsx(Markdown, { className: "max-h-[400px] max-w-none overflow-auto text-sm text-[var(--theme-text)]", children: conductor.streamText }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--theme-muted)]", children: "No summary captured." }) }),
          conductor.workers.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: conductor.workers.map((worker, index) => {
            const persona = getAgentPersona(index);
            const shortModelName = getShortModelName(worker.model);
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-emerald-400" }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium text-[var(--theme-text)]", children: [
                persona.emoji,
                " ",
                persona.name
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-muted)]", children: worker.label }),
              /* @__PURE__ */ jsxs("span", { className: "ml-auto text-xs text-[var(--theme-muted)]", children: [
                shortModelName,
                " · ",
                worker.totalTokens.toLocaleString(),
                " tok"
              ] })
            ] }, worker.key);
          }) }),
          (totalTokens > 0 || completeMissionCostWorkers.length > 0) && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(MissionCostSection, { totalTokens, workers: completeMissionCostWorkers, expanded: completeCostExpanded, onToggle: () => setCompleteCostExpanded((current) => !current) }) }),
          conductor.streamText && completeSummary && /* @__PURE__ */ jsxs("details", { className: "mt-4 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-5 py-4", children: [
            /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-xs font-medium text-[var(--theme-muted)]", children: "Raw Agent Output" }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-[var(--theme-border)] pt-4", children: /* @__PURE__ */ jsx(Markdown, { className: "max-h-[400px] max-w-none overflow-auto text-sm text-[var(--theme-text)]", children: conductor.streamText }) })
          ] })
        ] })
      ] }),
      continueModalOpen ? /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--theme-bg)_48%,transparent)] px-4 py-6 backdrop-blur-md",
          onClick: () => setContinueModalOpen(false),
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "w-full max-w-md rounded-3xl border border-[var(--theme-border2)] bg-[var(--theme-card)] p-5 shadow-[0_24px_80px_var(--theme-shadow)] sm:p-6",
              onClick: (event) => event.stopPropagation(),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight text-[var(--theme-text)]", children: "Continue Mission" }) }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setContinueModalOpen(false),
                      className: "inline-flex size-9 items-center justify-center rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card2)] text-lg text-[var(--theme-muted)] transition-colors hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent-strong)]",
                      "aria-label": "Close continue mission dialog",
                      children: "×"
                    }
                  )
                ] }),
                continuationModalPreview ? /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--theme-muted)]", children: "Previous output summary" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[var(--theme-text)]", children: continuationModalPreview })
                ] }) : null,
                /* @__PURE__ */ jsxs(
                  "form",
                  {
                    className: "mt-4 space-y-3",
                    onSubmit: (event) => {
                      event.preventDefault();
                      void handleContinueMission();
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          value: continueDraft,
                          onChange: (event) => setContinueDraft(event.target.value),
                          placeholder: "Continue with additional instructions...",
                          disabled: conductor.isSending,
                          className: "w-full rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3 text-sm text-[var(--theme-text)] outline-none transition-colors placeholder:text-[var(--theme-muted-2)] focus:border-[var(--theme-accent)] disabled:cursor-not-allowed disabled:opacity-60"
                        }
                      ),
                      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "submit",
                          disabled: !continueDraft.trim() || conductor.isSending,
                          className: cn(
                            "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition-colors sm:min-w-[96px]",
                            !continueDraft.trim() || conductor.isSending ? "cursor-not-allowed border border-[var(--theme-border)] bg-[var(--theme-card2)] text-[var(--theme-muted)] opacity-60" : "border border-[var(--theme-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-text)] hover:border-[var(--theme-accent)] hover:bg-[var(--theme-accent-soft-strong)]"
                          ),
                          children: [
                            /* @__PURE__ */ jsx(HugeiconsIcon, { icon: ArrowRight01Icon, size: 16, strokeWidth: 1.8 }),
                            conductor.isSending ? "Sending" : "Send"
                          ]
                        }
                      ) })
                    ]
                  }
                )
              ]
            }
          )
        }
      ) : null
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh flex-col overflow-y-auto bg-[var(--theme-bg)] text-[var(--theme-text)]", style: THEME_STYLE, children: /* @__PURE__ */ jsx("main", { className: "mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col px-4 py-4 pb-4 md:pb-[calc(var(--tabbar-h,80px)+1rem)] md:px-6 md:py-8", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-6", children: [
    /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--theme-muted)]", children: [
      "Conductor",
      /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-emerald-400 animate-pulse" })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-5 py-5 shadow-[0_24px_80px_var(--theme-shadow)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "line-clamp-2 text-xl font-semibold tracking-tight text-[var(--theme-text)] sm:text-2xl", children: conductor.goal }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-center gap-2 text-xs text-[var(--theme-muted)]", children: [
          /* @__PURE__ */ jsx("span", { children: formatElapsedMilliseconds(conductor.isPaused ? conductor.pausedElapsedMs : conductor.missionElapsedMs) }),
          /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-border)]", children: "·" }),
          /* @__PURE__ */ jsxs("span", { children: [
            completedWorkers,
            "/",
            Math.max(totalWorkers, 1),
            " complete"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[var(--theme-border)]", children: "·" }),
          /* @__PURE__ */ jsxs("span", { children: [
            activeWorkerCount,
            " active"
          ] })
        ] }),
        conductor.isPaused ? /* @__PURE__ */ jsx("div", { className: "mt-3 flex justify-center", children: /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--theme-accent-strong)] animate-pulse", children: "Paused" }) }) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 h-1 w-full overflow-hidden rounded-full bg-[var(--theme-border)]", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-[var(--theme-accent)] transition-[width] duration-500 ease-out", style: { width: `${missionProgress}%` } }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => void conductor.stopMission(),
            className: "inline-flex items-center gap-1.5 rounded-xl border border-[var(--theme-danger-border, color-mix(in srgb, var(--theme-danger) 35%, white))] bg-[var(--theme-danger-soft, color-mix(in srgb, var(--theme-danger) 12%, transparent))] px-3 py-1.5 text-xs font-medium text-[var(--theme-danger)] transition-colors hover:bg-[var(--theme-danger-soft-strong, color-mix(in srgb, var(--theme-danger) 18%, transparent))]",
            children: [
              /* @__PURE__ */ jsx("span", { children: "■" }),
              " Stop Mission"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            disabled: !conductor.orchestratorSessionKey || conductor.isPausing,
            onClick: async () => {
              if (!conductor.orchestratorSessionKey) return;
              try {
                await conductor.pauseAgent(conductor.orchestratorSessionKey, !conductor.isPaused);
              } catch {
              }
            },
            className: cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              !conductor.orchestratorSessionKey || conductor.isPausing ? "cursor-not-allowed border-[var(--theme-border)] bg-[var(--theme-card2)] text-[var(--theme-muted)] opacity-50" : conductor.isPaused ? "border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent-strong)] hover:bg-[var(--theme-accent-soft-strong)]" : "border-[var(--theme-border)] bg-[var(--theme-card2)] text-[var(--theme-muted)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-text)]"
            ),
            children: [
              /* @__PURE__ */ jsx("span", { children: conductor.isPaused ? "▶" : "⏸" }),
              " ",
              conductor.isPausing ? "..." : conductor.isPaused ? "Resume" : "Pause"
            ]
          }
        )
      ] })
    ] }),
    conductor.timeoutWarning && /* @__PURE__ */ jsx("section", { className: "rounded-2xl border border-[var(--theme-warning-border)] bg-[var(--theme-warning-soft)] px-5 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[var(--theme-warning)]", children: "⏳ Mission appears stalled — no activity for 60 seconds" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[var(--theme-muted)]", children: "Sometimes the workers are still alive, but the stream went quiet. Your call." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            onClick: conductor.dismissTimeoutWarning,
            className: "rounded-xl border border-[var(--theme-warning-border)] bg-[var(--theme-card)] px-4 text-[var(--theme-text)] hover:bg-[var(--theme-card2)]",
            children: "Keep Waiting"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            onClick: () => void conductor.stopMission(),
            className: "rounded-xl border border-[var(--theme-warning-border)] bg-[var(--theme-warning-soft)] px-4 text-[var(--theme-warning)] hover:bg-[var(--theme-warning-soft-strong)]",
            children: "Stop Mission"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "max-h-[clamp(200px,40vh,360px)] overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-[0_24px_80px_var(--theme-shadow)]", children: /* @__PURE__ */ jsx(OfficeView, { agentRows: officeAgentRows, missionRunning: true, onViewOutput: () => {
    }, processType: "parallel", companyName: "Conductor Office", containerHeight: 360, hideHeader: true }) }),
    conductor.tasks.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-[280px_1fr]", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]", children: [
          "Tasks (",
          conductor.tasks.filter((task) => task.status === "complete").length,
          "/",
          conductor.tasks.length,
          ")"
        ] }),
        conductor.tasks.map((task) => {
          const isSelected = selectedTaskId === task.id;
          const statusDot = task.status === "complete" ? "bg-emerald-400" : task.status === "running" ? "bg-sky-400 animate-pulse" : task.status === "failed" ? "bg-red-400" : "bg-zinc-500";
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setSelectedTaskId(isSelected ? null : task.id),
              className: cn(
                "w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                isSelected ? "border-[var(--theme-accent)] bg-[var(--theme-accent-soft)]" : "border-[var(--theme-border)] bg-[var(--theme-card)] hover:border-[var(--theme-accent)]"
              ),
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: cn("size-2 shrink-0 rounded-full", statusDot) }),
                /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate font-medium text-[var(--theme-text)]", children: task.title })
              ] })
            },
            task.id
          );
        })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        selectedTaskId ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-3", children: /* @__PURE__ */ jsx("h2", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]", children: "Task Output" }) }) : null,
        (() => {
          const selectedTask = selectedTaskId ? conductor.tasks.find((task) => task.id === selectedTaskId) : null;
          const displayWorkers = selectedTask?.workerKey ? conductor.workers.filter((worker) => worker.key === selectedTask.workerKey) : conductor.workers;
          return /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
            displayWorkers.map((worker, index) => {
              return /* @__PURE__ */ jsx(WorkerCard, { worker, index, conductor, now }, worker.key);
            }),
            displayWorkers.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-8 text-center text-sm text-[var(--theme-muted)] md:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "size-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" }),
                /* @__PURE__ */ jsx("span", { children: "Spawning workers..." })
              ] }),
              conductor.planText ? /* @__PURE__ */ jsx("p", { className: "max-w-xl text-xs text-[var(--theme-muted-2)]", children: conductor.planText }) : null
            ] }) })
          ] });
        })()
      ] })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      conductor.workers.map((worker, index) => {
        return /* @__PURE__ */ jsx(WorkerCard, { worker, index, conductor, now }, worker.key);
      }),
      conductor.workers.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-8 text-center text-sm text-[var(--theme-muted)] md:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "size-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" }),
          /* @__PURE__ */ jsx("span", { children: "Spawning workers..." })
        ] }),
        conductor.planText ? /* @__PURE__ */ jsx("p", { className: "max-w-xl text-xs text-[var(--theme-muted-2)]", children: conductor.planText }) : null
      ] }) })
    ] }) })
  ] }) }) });
}
function ConductorRoute() {
  return /* @__PURE__ */ jsx(Conductor, {});
}
export {
  ConductorRoute as component
};
