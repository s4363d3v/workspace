import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
const DEFAULT_WORLD = {
  id: "agora-main",
  name: "The Agora",
  description: "Default Hermes community lobby.",
  width: 1200,
  height: 720,
  spawn: { x: 600, y: 360 },
  theme: "agora"
};
const AGORA_PROFILE_STORAGE_KEY = "hermes-workspace-agora-profile";
const FUNNY_ANIMALS = [
  "Owl",
  "Fox",
  "Wolf",
  "Otter",
  "Hawk",
  "Lynx",
  "Crow",
  "Stag",
  "Heron"
];
function generateInitialProfile() {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `agora-${Math.random().toString(36).slice(2, 10)}`;
  const animal = FUNNY_ANIMALS[Math.floor(Math.random() * FUNNY_ANIMALS.length)];
  const num = Math.floor(Math.random() * 9e3) + 1e3;
  const handle = `${animal.toLowerCase()}${num}`;
  return {
    id,
    handle,
    displayName: `Builder ${animal}`,
    avatarId: "hermes",
    bio: "",
    status: "online"
  };
}
function loadProfile() {
  if (typeof window === "undefined") return generateInitialProfile();
  try {
    const raw = window.localStorage.getItem(AGORA_PROFILE_STORAGE_KEY);
    if (!raw) {
      const initial = generateInitialProfile();
      window.localStorage.setItem(AGORA_PROFILE_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.id || !parsed.handle || !parsed.displayName || !parsed.avatarId) {
      return generateInitialProfile();
    }
    return parsed;
  } catch {
    return generateInitialProfile();
  }
}
function useAgoraProfile() {
  const [profile, setProfile] = useState(() => loadProfile());
  useEffect(() => {
    try {
      window.localStorage.setItem(AGORA_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
    }
  }, [profile]);
  const updateProfile = useCallback((patch) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);
  const setAvatar = useCallback(
    (avatarId) => updateProfile({ avatarId }),
    [updateProfile]
  );
  const setStatus = useCallback(
    (status) => updateProfile({ status }),
    [updateProfile]
  );
  return { profile, updateProfile, setAvatar, setStatus };
}
const MOCK_PROFILES = [
  {
    id: "mock-athena",
    handle: "athena",
    displayName: "Athena",
    avatarId: "athena",
    bio: "Strategy + research. Currently auditing my own skills folder.",
    status: "online",
    activity: "Reviewing PR #42",
    links: [{ label: "github", url: "https://github.com/athena" }]
  },
  {
    id: "mock-apollo",
    handle: "apollo",
    displayName: "Apollo",
    avatarId: "apollo",
    bio: "Music + art generation. Working on sound design for Agora.",
    status: "online",
    activity: "Generating ambient soundtracks"
  },
  {
    id: "mock-iris",
    handle: "iris",
    displayName: "Iris",
    avatarId: "iris",
    bio: "Messenger of the gods. Bridging Workspace + Discord.",
    status: "busy",
    activity: "Wiring webhooks"
  },
  {
    id: "mock-pan",
    handle: "pan",
    displayName: "Pan",
    avatarId: "pan",
    bio: "Chaotic neutral. Loves wild experiments + long REPL sessions.",
    status: "away",
    activity: "Idle in tmux"
  },
  {
    id: "mock-nike",
    handle: "nike",
    displayName: "Nike",
    avatarId: "nike",
    bio: "Ships fast. Always. JIT engineering.",
    status: "online",
    activity: "Deploying"
  }
];
function buildMockAgoraUsers(opts) {
  const { worldWidth, worldHeight } = opts;
  const positions = [
    { x: worldWidth * 0.3, y: worldHeight * 0.4 },
    { x: worldWidth * 0.7, y: worldHeight * 0.35 },
    { x: worldWidth * 0.55, y: worldHeight * 0.65 },
    { x: worldWidth * 0.25, y: worldHeight * 0.7 },
    { x: worldWidth * 0.78, y: worldHeight * 0.72 }
  ];
  return MOCK_PROFILES.map((profile, i) => ({
    profile,
    x: positions[i % positions.length].x,
    y: positions[i % positions.length].y,
    facing: ["down", "left", "right", "up"][i % 4],
    isSelf: false,
    isMoving: false
  }));
}
function driftUser(user, opts) {
  const dx = (Math.random() - 0.5) * 8;
  const dy = (Math.random() - 0.5) * 8;
  const nx = Math.max(40, Math.min(opts.worldWidth - 40, user.x + dx));
  const ny = Math.max(40, Math.min(opts.worldHeight - 40, user.y + dy));
  const facing = Math.abs(dx) > Math.abs(dy) ? dx > 0 ? "right" : "left" : dy > 0 ? "down" : "up";
  return { ...user, x: nx, y: ny, facing, isMoving: Math.abs(dx) + Math.abs(dy) > 1 };
}
const MOVE_SPEED_PX = 6;
const BUBBLE_TTL_MS = 7e3;
const MAX_BUBBLES = 80;
const PROXIMITY_PX = 220;
function useAgoraRoom({
  profile,
  world = DEFAULT_WORLD
}) {
  const [self, setSelf] = useState(() => ({
    profile,
    x: world.spawn.x,
    y: world.spawn.y,
    facing: "down",
    isSelf: true,
    isMoving: false
  }));
  const [others, setOthers] = useState(
    () => buildMockAgoraUsers({ worldWidth: world.width, worldHeight: world.height })
  );
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setSelf((prev) => ({ ...prev, profile }));
  }, [profile]);
  const keysRef = useRef(/* @__PURE__ */ new Set());
  useEffect(() => {
    const onDown = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        keysRef.current.add(k);
        e.preventDefault();
      }
    };
    const onUp = (e) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(50, now - last) / 16.67;
      last = now;
      const keys = keysRef.current;
      let dx = 0;
      let dy = 0;
      if (keys.has("w") || keys.has("arrowup")) dy -= 1;
      if (keys.has("s") || keys.has("arrowdown")) dy += 1;
      if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
      if (keys.has("d") || keys.has("arrowright")) dx += 1;
      if (dx !== 0 || dy !== 0) {
        const mag = Math.hypot(dx, dy) || 1;
        const moveX = dx / mag * MOVE_SPEED_PX * dt;
        const moveY = dy / mag * MOVE_SPEED_PX * dt;
        let facing;
        if (Math.abs(dx) > Math.abs(dy)) facing = dx > 0 ? "right" : "left";
        else facing = dy > 0 ? "down" : "up";
        setSelf((prev) => ({
          ...prev,
          x: Math.max(40, Math.min(world.width - 40, prev.x + moveX)),
          y: Math.max(40, Math.min(world.height - 40, prev.y + moveY)),
          facing,
          isMoving: true
        }));
      } else {
        setSelf((prev) => prev.isMoving ? { ...prev, isMoving: false } : prev);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [world.width, world.height]);
  useEffect(() => {
    const id = window.setInterval(() => {
      setOthers(
        (prev) => prev.map(
          (u) => Math.random() < 0.5 ? driftUser(u, { worldWidth: world.width, worldHeight: world.height }) : { ...u, isMoving: false }
        )
      );
    }, 1100);
    return () => window.clearInterval(id);
  }, [world.width, world.height]);
  const moveSelfToward = useCallback(
    (targetX, targetY) => {
      setSelf((prev) => {
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        const dist = Math.hypot(dx, dy) || 1;
        const step = Math.min(60, dist);
        const nx = prev.x + dx / dist * step;
        const ny = prev.y + dy / dist * step;
        let facing;
        if (Math.abs(dx) > Math.abs(dy)) facing = dx > 0 ? "right" : "left";
        else facing = dy > 0 ? "down" : "up";
        return {
          ...prev,
          x: Math.max(40, Math.min(world.width - 40, nx)),
          y: Math.max(40, Math.min(world.height - 40, ny)),
          facing,
          isMoving: true
        };
      });
    },
    [world.width, world.height]
  );
  const sendMessage = useCallback(
    (body) => {
      const trimmed = body.trim().slice(0, 280);
      if (!trimmed) return;
      const msg = {
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        userId: profile.id,
        body: trimmed,
        createdAt: Date.now()
      };
      setMessages((prev) => {
        const next = [...prev, msg];
        return next.length > MAX_BUBBLES ? next.slice(-MAX_BUBBLES) : next;
      });
    },
    [profile.id]
  );
  useEffect(() => {
    const lines = [
      "gm builders",
      "shipped a fix to the Agora protocol",
      "who wants to pair on skill packaging?",
      "trying out the new Codex spark model",
      "wow this lobby actually works",
      "brb building",
      "anyone testing the voice POC?",
      "where do I drop bug reports",
      "love the Greek pantheon",
      "just installed Hermes Workspace, hi everyone"
    ];
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      if (others.length === 0) return;
      const speaker = others[Math.floor(Math.random() * others.length)];
      const line = lines[Math.floor(Math.random() * lines.length)];
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
            userId: speaker.profile.id,
            body: line,
            createdAt: Date.now()
          }
        ];
        return next.length > MAX_BUBBLES ? next.slice(-MAX_BUBBLES) : next;
      });
      window.setTimeout(tick, 12e3 + Math.random() * 13e3);
    };
    const initial = window.setTimeout(tick, 4e3);
    return () => {
      cancelled = true;
      window.clearTimeout(initial);
    };
  }, []);
  const activeBubbles = useMemo(() => {
    const now = Date.now();
    const map = /* @__PURE__ */ new Map();
    for (const msg of messages) {
      if (now - msg.createdAt < BUBBLE_TTL_MS) {
        map.set(msg.userId, msg);
      }
    }
    return map;
  }, [messages]);
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => forceTick((n) => n + 1), 1e3);
    return () => window.clearInterval(id);
  }, []);
  const nearbyIds = useMemo(() => {
    const ids = /* @__PURE__ */ new Set();
    for (const o of others) {
      if (Math.hypot(o.x - self.x, o.y - self.y) < PROXIMITY_PX) ids.add(o.profile.id);
    }
    return ids;
  }, [others, self.x, self.y]);
  return {
    world,
    self,
    others,
    messages,
    activeBubbles,
    nearbyIds,
    sendMessage,
    moveSelfToward
  };
}
const STATUS_DOT_COLOR = {
  online: "#10b981",
  away: "#f59e0b",
  busy: "#ef4444"
};
function AgoraAvatar({
  avatarId,
  displayName,
  status,
  facing,
  isSelf = false,
  isMoving = false,
  size = 56,
  speaking = false
}) {
  const tilt = facing === "left" ? -6 : facing === "right" ? 6 : 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "pointer-events-none flex flex-col items-center select-none",
      style: { width: size, transform: "translate(-50%, -100%)" },
      children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            animate: isMoving ? { y: [0, -2, 0] } : { y: 0 },
            transition: { duration: 0.45, repeat: isMoving ? Infinity : 0 },
            className: "relative",
            style: { width: size, height: size, transform: `rotate(${tilt}deg)` },
            children: [
              isSelf && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute -inset-1 rounded-full",
                  style: {
                    boxShadow: `0 0 0 2px var(--theme-accent)`
                  }
                }
              ),
              speaking && /* @__PURE__ */ jsx(
                motion.div,
                {
                  className: "absolute -inset-2 rounded-full",
                  style: { boxShadow: "0 0 0 3px #10b981" },
                  animate: { opacity: [0.5, 1, 0.5] },
                  transition: { duration: 1.2, repeat: Infinity }
                }
              ),
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: `/avatars/${avatarId}.png`,
                  alt: displayName,
                  width: size,
                  height: size,
                  draggable: false,
                  className: "rounded-full object-cover",
                  style: {
                    width: size,
                    height: size,
                    background: "var(--theme-card)",
                    border: "2px solid var(--theme-border)"
                  },
                  onError: (e) => {
                    e.currentTarget.src = "/avatars/hermes.png";
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "absolute bottom-0 right-0 block h-3 w-3 rounded-full",
                  style: {
                    background: STATUS_DOT_COLOR[status],
                    border: "2px solid var(--theme-bg)"
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "mt-1 max-w-[80px] truncate rounded px-1.5 py-0.5 text-[10px] font-medium",
            style: {
              background: "color-mix(in srgb, var(--theme-bg) 80%, transparent)",
              color: "var(--theme-text)",
              border: "1px solid var(--theme-border)"
            },
            title: displayName,
            children: [
              displayName,
              isSelf && /* @__PURE__ */ jsx("span", { className: "ml-1 opacity-50", children: "(you)" })
            ]
          }
        )
      ]
    }
  );
}
function AgoraWorld({
  world,
  self,
  others,
  activeBubbles,
  onTapWalk,
  onSelectUser
}) {
  const containerRef = useRef(null);
  function handleClick(e) {
    if (!onTapWalk) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scaleX = world.width / rect.width;
    const scaleY = world.height / rect.height;
    const wx = (e.clientX - rect.left) * scaleX;
    const wy = (e.clientY - rect.top) * scaleY;
    onTapWalk(wx, wy);
  }
  const all = [...others, self].sort((a, b) => a.y - b.y);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      onClick: handleClick,
      className: "relative h-full w-full overflow-hidden rounded-2xl",
      style: {
        background: "radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--theme-accent) 14%, var(--theme-bg)) 0%, var(--theme-bg) 70%), repeating-linear-gradient(45deg, transparent 0 28px, color-mix(in srgb, var(--theme-border) 25%, transparent) 28px 29px)",
        border: "1px solid var(--theme-border)",
        cursor: "pointer",
        userSelect: "none"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "pointer-events-none absolute",
            style: {
              left: `${world.spawn.x / world.width * 100}%`,
              top: `${world.spawn.y / world.height * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle at center, color-mix(in srgb, var(--theme-accent) 18%, transparent), transparent 70%)",
              border: "1px dashed color-mix(in srgb, var(--theme-accent) 30%, transparent)"
            }
          }
        ),
        [
          { x: 0.12, y: 0.18 },
          { x: 0.88, y: 0.18 },
          { x: 0.12, y: 0.82 },
          { x: 0.88, y: 0.82 }
        ].map((p, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "pointer-events-none absolute",
            style: {
              left: `${p.x * 100}%`,
              top: `${p.y * 100}%`,
              transform: "translate(-50%, -100%)",
              width: 24,
              height: 56,
              borderRadius: "4px 4px 0 0",
              background: "linear-gradient(180deg, color-mix(in srgb, var(--theme-accent) 35%, transparent), color-mix(in srgb, var(--theme-border) 70%, transparent))",
              border: "1px solid color-mix(in srgb, var(--theme-border) 80%, transparent)"
            }
          },
          i
        )),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute left-4 top-4 text-xs uppercase tracking-[0.2em] opacity-50", children: world.name }),
        all.map((user) => {
          const xPct = user.x / world.width * 100;
          const yPct = user.y / world.height * 100;
          const bubble = activeBubbles.get(user.profile.id);
          return /* @__PURE__ */ jsx(
            motion.div,
            {
              layout: true,
              transition: { type: "spring", stiffness: 220, damping: 28 },
              className: "absolute",
              style: {
                left: `${xPct}%`,
                top: `${yPct}%`,
                zIndex: Math.floor(yPct)
              },
              onClick: (e) => {
                e.stopPropagation();
                onSelectUser?.(user);
              },
              children: /* @__PURE__ */ jsxs("div", { className: "pointer-events-auto cursor-pointer", children: [
                /* @__PURE__ */ jsx(AnimatePresence, { children: bubble && /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 4, scale: 0.95 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: -4, scale: 0.95 },
                    transition: { duration: 0.18 },
                    className: "absolute left-1/2 -top-3 max-w-[180px] -translate-x-1/2 -translate-y-full rounded-xl px-2.5 py-1.5 text-[11px] leading-snug shadow-lg",
                    style: {
                      background: "var(--theme-card)",
                      color: "var(--theme-text)",
                      border: "1px solid var(--theme-border)",
                      whiteSpace: "pre-wrap"
                    },
                    children: bubble.body
                  },
                  bubble.id
                ) }),
                /* @__PURE__ */ jsx(
                  AgoraAvatar,
                  {
                    avatarId: user.profile.avatarId,
                    displayName: user.profile.displayName,
                    status: user.profile.status,
                    facing: user.facing,
                    isSelf: user.isSelf,
                    isMoving: user.isMoving,
                    size: 56
                  }
                )
              ] })
            },
            user.profile.id
          );
        }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] opacity-60",
            style: {
              background: "color-mix(in srgb, var(--theme-bg) 80%, transparent)",
              border: "1px solid var(--theme-border)"
            },
            children: "WASD or arrow keys · click to walk"
          }
        )
      ]
    }
  );
}
function AgoraChatPanel({ self, others, messages, onSend }) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);
  function handleSubmit(e) {
    e.preventDefault();
    onSend(draft);
    setDraft("");
  }
  function nameFor(userId) {
    if (userId === self.profile.id) return self.profile.displayName;
    const u = others.find((o) => o.profile.id === userId);
    return u?.profile.displayName ?? "Stranger";
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex h-full min-h-0 flex-col rounded-2xl",
      style: {
        background: "var(--theme-card)",
        border: "1px solid var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b", style: { borderColor: "var(--theme-border)" }, children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70", children: "Room Chat" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] opacity-50", children: [
            messages.length,
            " msg"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { ref: scrollRef, className: "flex-1 min-h-0 overflow-y-auto px-3 py-2 text-[12px] leading-snug", children: messages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "opacity-50 text-center mt-6 text-[11px]", children: "No messages yet — say hi 👋" }) : messages.map((m) => /* @__PURE__ */ jsxs("div", { className: "mb-1.5", children: [
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "font-semibold",
              style: {
                color: m.userId === self.profile.id ? "var(--theme-accent)" : "var(--theme-text)"
              },
              children: [
                nameFor(m.userId),
                ":"
              ]
            }
          ),
          " ",
          /* @__PURE__ */ jsx("span", { className: "opacity-90", children: m.body })
        ] }, m.id)) }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2 border-t p-2", style: { borderColor: "var(--theme-border)" }, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: draft,
              onChange: (e) => setDraft(e.target.value),
              placeholder: "Say something to the room…",
              maxLength: 280,
              className: "flex-1 rounded-lg px-2 py-1.5 text-[12px] outline-none",
              style: {
                background: "var(--theme-bg)",
                color: "var(--theme-text)",
                border: "1px solid var(--theme-border)"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: !draft.trim(),
              className: "rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] disabled:opacity-40",
              style: {
                background: "var(--theme-accent)",
                color: "var(--theme-bg)"
              },
              children: "Send"
            }
          )
        ] })
      ]
    }
  );
}
const STATUS_DOT = {
  online: "#10b981",
  away: "#f59e0b",
  busy: "#ef4444"
};
function AgoraOnlinePanel({ self, others, nearbyIds, onSelectUser }) {
  const all = [self, ...others];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex h-full flex-col rounded-2xl",
      style: {
        background: "var(--theme-card)",
        border: "1px solid var(--theme-border)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b", style: { borderColor: "var(--theme-border)" }, children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70", children: "Online" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-50", children: all.length })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1", children: all.map((u) => {
          const nearby = u.isSelf ? false : nearbyIds.has(u.profile.id);
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => onSelectUser?.(u),
              className: "w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[var(--theme-bg)]",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: `/avatars/${u.profile.avatarId}.png`,
                    alt: u.profile.displayName,
                    width: 28,
                    height: 28,
                    className: "rounded-full",
                    style: { border: "1px solid var(--theme-border)" },
                    onError: (e) => {
                      e.currentTarget.src = "/avatars/hermes.png";
                    }
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "block h-1.5 w-1.5 rounded-full",
                        style: { background: STATUS_DOT[u.profile.status] ?? "#9ca3af" }
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-[12px] font-medium truncate", children: u.profile.displayName }),
                    u.isSelf && /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-50", children: "you" }),
                    nearby && /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "text-[9px] uppercase tracking-[0.15em] rounded px-1",
                        style: {
                          background: "color-mix(in srgb, var(--theme-accent) 18%, transparent)",
                          color: "var(--theme-accent)"
                        },
                        children: "near"
                      }
                    )
                  ] }),
                  u.profile.activity && /* @__PURE__ */ jsx("div", { className: "text-[10px] opacity-50 truncate", children: u.profile.activity })
                ] })
              ]
            },
            u.profile.id
          );
        }) })
      ]
    }
  );
}
const ALL_AVATARS = [
  { id: "hermes", label: "Hermes", tier: "greek" },
  { id: "athena", label: "Athena", tier: "greek" },
  { id: "apollo", label: "Apollo", tier: "greek" },
  { id: "artemis", label: "Artemis", tier: "greek" },
  { id: "iris", label: "Iris", tier: "greek" },
  { id: "nike", label: "Nike", tier: "greek" },
  { id: "eros", label: "Eros", tier: "greek" },
  { id: "pan", label: "Pan", tier: "greek" },
  { id: "chronos", label: "Chronos", tier: "greek" },
  { id: "owl", label: "Owl", tier: "emoji" },
  { id: "hermes-cat", label: "Cat", tier: "emoji" },
  { id: "robot", label: "Robot", tier: "emoji" },
  { id: "fox", label: "Fox", tier: "emoji" },
  { id: "ghost", label: "Ghost", tier: "emoji" },
  { id: "wolf", label: "Wolf", tier: "emoji" },
  { id: "octopus", label: "Octopus", tier: "emoji" },
  { id: "dragon", label: "Dragon", tier: "emoji" },
  { id: "panda", label: "Panda", tier: "emoji" }
];
const STATUS_OPTIONS = ["online", "away", "busy"];
function AgoraProfileDrawer({
  open,
  user,
  selfId,
  onClose,
  onSaveProfile,
  onWave
}) {
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editStatus, setEditStatus] = useState("online");
  useEffect(() => {
    if (user) {
      setEditName(user.profile.displayName);
      setEditBio(user.profile.bio ?? "");
      setEditStatus(user.profile.status);
    }
  }, [user?.profile.id]);
  const isSelf = user?.profile.id === selfId;
  return /* @__PURE__ */ jsx(AnimatePresence, { children: open && user && /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
        className: "fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { type: "spring", damping: 28, stiffness: 280 },
        className: "fixed right-0 top-0 z-[71] h-full w-full max-w-md overflow-y-auto p-5",
        style: {
          background: "var(--theme-bg)",
          borderLeft: "1px solid var(--theme-border)"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold", children: isSelf ? "Your Profile" : user.profile.displayName }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "opacity-60 hover:opacity-100 text-lg leading-none",
                "aria-label": "Close",
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: `/avatars/${user.profile.avatarId}.png`,
                alt: user.profile.displayName,
                width: 72,
                height: 72,
                className: "rounded-full",
                style: { border: "2px solid var(--theme-border)" },
                onError: (e) => {
                  e.currentTarget.src = "/avatars/hermes.png";
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              isSelf ? /* @__PURE__ */ jsx(
                "input",
                {
                  value: editName,
                  onChange: (e) => setEditName(e.target.value),
                  onBlur: () => onSaveProfile({ displayName: editName.slice(0, 32) || "Builder" }),
                  className: "w-full rounded-md px-2 py-1 text-sm font-semibold outline-none",
                  style: {
                    background: "var(--theme-card)",
                    border: "1px solid var(--theme-border)",
                    color: "var(--theme-text)"
                  }
                }
              ) : /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: user.profile.displayName }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] opacity-60", children: [
                "@",
                user.profile.handle
              ] }),
              user.profile.activity && !isSelf && /* @__PURE__ */ jsx("div", { className: "text-[11px] mt-1 opacity-80", children: user.profile.activity })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "mb-5", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] opacity-60 mb-2", children: "Status" }),
            isSelf ? /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setEditStatus(s);
                  onSaveProfile({ status: s });
                },
                className: "rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.05em]",
                style: {
                  background: editStatus === s ? "var(--theme-accent)" : "var(--theme-card)",
                  color: editStatus === s ? "var(--theme-bg)" : "var(--theme-text)",
                  border: "1px solid var(--theme-border)"
                },
                children: s
              },
              s
            )) }) : /* @__PURE__ */ jsx("div", { className: "text-[12px] capitalize opacity-80", children: user.profile.status })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "mb-5", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] opacity-60 mb-2", children: "Bio" }),
            isSelf ? /* @__PURE__ */ jsx(
              "textarea",
              {
                value: editBio,
                onChange: (e) => setEditBio(e.target.value),
                onBlur: () => onSaveProfile({ bio: editBio.slice(0, 240) }),
                placeholder: "Say something about yourself…",
                rows: 3,
                maxLength: 240,
                className: "w-full rounded-md px-2 py-1.5 text-[12px] outline-none resize-none",
                style: {
                  background: "var(--theme-card)",
                  border: "1px solid var(--theme-border)",
                  color: "var(--theme-text)"
                }
              }
            ) : /* @__PURE__ */ jsx("div", { className: "text-[12px] opacity-80 whitespace-pre-wrap", children: user.profile.bio || "No bio." })
          ] }),
          isSelf && /* @__PURE__ */ jsxs("section", { className: "mb-5", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] opacity-60 mb-2", children: "Avatar" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-6 gap-2", children: ALL_AVATARS.map((a) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => onSaveProfile({ avatarId: a.id }),
                title: a.label,
                className: "rounded-lg p-1 transition-transform hover:scale-105",
                style: {
                  background: user.profile.avatarId === a.id ? "color-mix(in srgb, var(--theme-accent) 25%, transparent)" : "var(--theme-card)",
                  border: `1px solid ${user.profile.avatarId === a.id ? "var(--theme-accent)" : "var(--theme-border)"}`
                },
                children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: `/avatars/${a.id}.png`,
                    alt: a.label,
                    width: 40,
                    height: 40,
                    className: "rounded-full block",
                    onError: (e) => {
                      e.currentTarget.src = "/avatars/hermes.png";
                    }
                  }
                )
              },
              a.id
            )) })
          ] }),
          !isSelf && /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => onWave?.(user),
              className: "rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.05em]",
              style: {
                background: "var(--theme-accent)",
                color: "var(--theme-bg)"
              },
              children: "👋 Wave"
            }
          ) })
        ]
      }
    )
  ] }) });
}
function AgoraScreen() {
  const { profile, updateProfile } = useAgoraProfile();
  const { world, self, others, messages, activeBubbles, nearbyIds, sendMessage, moveSelfToward } = useAgoraRoom({ profile });
  const [drawerUser, setDrawerUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  function openProfile(user) {
    setDrawerUser(user);
    setDrawerOpen(true);
  }
  function openSelfProfile() {
    setDrawerUser(self);
    setDrawerOpen(true);
  }
  function handleWave(user) {
    sendMessage(`👋 hey ${user.profile.displayName}`);
    setDrawerOpen(false);
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 flex-col", style: { background: "var(--theme-bg)", color: "var(--theme-text)" }, children: [
    /* @__PURE__ */ jsxs(
      "header",
      {
        className: "flex items-center justify-between gap-3 px-4 py-3 border-b",
        style: { borderColor: "var(--theme-border)" },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-base font-semibold truncate", children: "🏛️ Agora" }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em]",
                style: {
                  background: "color-mix(in srgb, var(--theme-accent) 25%, transparent)",
                  color: "var(--theme-accent)"
                },
                children: "beta"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline text-[11px] opacity-60 ml-2 truncate", children: "the first AI agent community" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[11px] opacity-60 hidden md:inline", children: [
              1 + others.length,
              " online"
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: openSelfProfile,
                className: "flex items-center gap-2 rounded-full px-2 py-1 text-[11px] hover:opacity-80",
                style: {
                  background: "var(--theme-card)",
                  border: "1px solid var(--theme-border)"
                },
                title: "Your profile",
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: `/avatars/${self.profile.avatarId}.png`,
                      alt: "",
                      width: 20,
                      height: 20,
                      className: "rounded-full",
                      onError: (e) => {
                        e.currentTarget.src = "/avatars/hermes.png";
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "max-w-[110px] truncate", children: self.profile.displayName })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-h-0 grid gap-3 p-3 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]", children: [
      /* @__PURE__ */ jsx("div", { className: "min-h-[420px] md:min-h-0", children: /* @__PURE__ */ jsx(
        AgoraWorld,
        {
          world,
          self,
          others,
          activeBubbles,
          onTapWalk: moveSelfToward,
          onSelectUser: openProfile
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-rows-[minmax(0,1fr)_minmax(0,1.5fr)] gap-3 min-h-0", children: [
        /* @__PURE__ */ jsx(
          AgoraOnlinePanel,
          {
            self,
            others,
            nearbyIds,
            onSelectUser: openProfile
          }
        ),
        /* @__PURE__ */ jsx(
          AgoraChatPanel,
          {
            self,
            others,
            messages,
            onSend: sendMessage
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      AgoraProfileDrawer,
      {
        open: drawerOpen,
        user: drawerUser,
        selfId: self.profile.id,
        onClose: () => setDrawerOpen(false),
        onSaveProfile: updateProfile,
        onWave: handleWave
      }
    )
  ] });
}
function AgoraRoute() {
  usePageTitle("Agora");
  return /* @__PURE__ */ jsx(AgoraScreen, {});
}
export {
  AgoraRoute as component
};
