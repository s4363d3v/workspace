import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
function PlaygroundHeroCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId = 0;
    let mounted = true;
    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const stars = [];
    for (let i = 0; i < 90; i++) stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.2, tw: Math.random() * Math.PI * 2 });
    const orbiters = [];
    const palette = ["#facc15", "#fbbf24", "#fde68a", "#22d3ee", "#a78bfa", "#fb7185", "#34d399"];
    for (let i = 0; i < 42; i++) orbiters.push({ phase: Math.random() * Math.PI * 2, orbit: 0.18 + Math.random() * 0.22, speed: 0.4 + Math.random() * 0.5, size: 1.5 + Math.random() * 2.4, color: palette[Math.floor(Math.random() * palette.length)] });
    const agentNodes = [];
    const agentColors = ["#facc15", "#22d3ee", "#a78bfa", "#34d399", "#fb7185", "#fbbf24"];
    for (let i = 0; i < 6; i++) agentNodes.push({ a: i / 6 * Math.PI * 2, r: 1, color: agentColors[i] });
    let t = 0;
    const draw = () => {
      if (!mounted) return;
      t += 8e-3;
      const g = ctx.createRadialGradient(w / 2, h * 0.45, 20, w / 2, h * 0.45, Math.max(w, h) * 0.9);
      g.addColorStop(0, "#0d1d2c");
      g.addColorStop(0.45, "#0a121e");
      g.addColorStop(1, "#06080f");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        const x = s.x * w;
        const y = s.y * h;
        const tw = 0.55 + (Math.sin(t * 2 + s.tw) + 1) * 0.225;
        ctx.fillStyle = `rgba(207, 231, 240, ${tw})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      const cx = w / 2;
      const cy = h * 0.48;
      const baseR = Math.min(w, h) * 0.32;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(34,211,238,0.22)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, baseR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(167,139,250,0.18)";
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.78, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(251,191,36,0.18)";
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 1.18, 0, Math.PI * 2);
      ctx.stroke();
      for (const o of orbiters) {
        const a = t * o.speed + o.phase;
        const r = baseR * (0.9 + Math.sin(t * 0.7 + o.phase) * o.orbit);
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * 0.7;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, o.size * 6);
        grad.addColorStop(0, o.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, o.size * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(x, y, o.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      const netRot = t * 0.08;
      const nodePts = agentNodes.map((n) => ({
        x: Math.cos(n.a + netRot) * baseR * n.r,
        y: Math.sin(n.a + netRot) * baseR * n.r * 0.7,
        color: n.color
      }));
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodePts.length; i++) {
        for (let j = i + 1; j < nodePts.length; j++) {
          const a = nodePts[i];
          const b = nodePts[j];
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `${a.color}55`);
          grad.addColorStop(1, `${b.color}55`);
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (const n of nodePts) {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 14);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      const orb = ctx.createRadialGradient(0, 0, 8, 0, 0, baseR * 0.55);
      orb.addColorStop(0, "rgba(250, 204, 21, 0.7)");
      orb.addColorStop(0.4, "rgba(250, 204, 21, 0.16)");
      orb.addColorStop(1, "rgba(250, 204, 21, 0)");
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref,
      style: { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" },
      "aria-hidden": true
    }
  );
}
const HERMES_REPO_URL = "https://github.com/outsourc-e/hermes-workspace";
const HERMES_ROADMAP_URL = "https://github.com/outsourc-e/hermes-workspace/blob/main/docs/hermesworld/master-roadmap.md";
const HERMES_DOCS_URL = "https://github.com/outsourc-e/hermes-workspace/tree/main/docs/hermesworld";
const HERMES_FEATURES_URL = "https://github.com/outsourc-e/hermes-workspace/blob/main/FEATURES-INVENTORY.md";
const externalLinkProps = { target: "_blank", rel: "noreferrer" };
const capabilities = [
  { label: "Persistent World", copy: "World state keeps moving while agents continue work.", icon: "✦" },
  { label: "Live Agents", copy: "Companions follow, plan, craft, scout, and report back.", icon: "◈" },
  { label: "Zones & Quests", copy: "Each zone gives humans and agents a place to act.", icon: "◇" },
  { label: "Memory Progression", copy: "Agents carry context, unlocks, and completed history.", icon: "◎" },
  { label: "Hermes Sigils", copy: "Make invisible agent progress visible and collectible.", icon: "⚚" },
  { label: "Multiplayer Presence", copy: "Humans and agents share the same world layer.", icon: "◌" }
];
const zones = [
  {
    name: "Training Grounds",
    label: "Starter Zone",
    tone: "#76d88f",
    copy: "Learn the verbs of the world. Move, talk, equip, travel, and send your first companion on a quest."
  },
  {
    name: "Forge",
    label: "Progression",
    tone: "#ff9f55",
    copy: "Craft tools for agents. Upgrade companions, shape items, and turn raw progress into better workflows."
  },
  {
    name: "Agora",
    label: "Social Hub",
    tone: "#d9b35f",
    copy: "The social relay. Meet NPCs, inspect public quests, and watch live activity from humans and agents."
  },
  {
    name: "Grove",
    label: "Memory Zone",
    tone: "#34d399",
    copy: "A quieter zone for long-term memory, reflection, archived quests, and restoring agent energy."
  },
  {
    name: "Oracle",
    label: "Planning",
    tone: "#a78bfa",
    copy: "Planning and prophecy. Decompose goals, reveal quest paths, and route work to the right agent."
  },
  {
    name: "Arena",
    label: "Combat Online",
    tone: "#f87171",
    copy: "Battle, evals, and trials. Test agents in controlled challenges and unlock capabilities through risk."
  }
];
const party = [
  { name: "Atlas", role: "Scout", state: "Following", tone: "#76d88f" },
  { name: "Forge", role: "Builder", state: "Crafting", tone: "#ff9f55" },
  { name: "Oracle", role: "Planner", state: "Planning", tone: "#a78bfa" }
];
const consoleLines = [
  'move_to("Agora")',
  'talk_to("Quartermaster")',
  'accept_quest("Northern Gate")',
  'equip("Hermes Sigil")',
  'send_agent("Oracle", "plan route")',
  'complete_quest("First Step")'
];
const progression = [
  ["Unlocks", "Open zones, panes, capabilities, and world systems."],
  ["Agent Progression", "Upgrade companion abilities, tools, loadouts, and memory depth."],
  ["Quests", "Convert goals into trackable work with receipts and history."],
  ["Cosmetics & Lore", "Customize player, companions, banners, and world profile."]
];
const todayDrops = [
  ["Landing Page", "A cinematic share surface for the HermesWorld reveal."],
  ["Roadmap", "The build path from preview world to persistent agent RPG."],
  ["Feature List", "Zones, companions, quests, sigils, multiplayer, and world systems."],
  ["Graphics Sprint", "Next pass: in-game world art, logo lockup, and launch visuals."]
];
function HermesWorldLanding() {
  return /* @__PURE__ */ jsxs("main", { className: "min-h-screen overflow-hidden bg-[#03060a] text-[#f8f3e7] selection:bg-[#d9b35f] selection:text-[#07080d]", children: [
    /* @__PURE__ */ jsx(HermesBackdrop, {}),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("section", { className: "relative mx-auto grid min-h-[calc(100vh-82px)] w-full max-w-[1560px] items-center gap-10 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8 lg:pb-18 lg:pt-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-2xl lg:pl-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-5 inline-flex items-center gap-2 rounded-full border border-[#d9b35f]/30 bg-[#d9b35f]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#f8e4ac] shadow-[0_0_42px_rgba(217,179,95,.12)]", children: [
          /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(34,211,238,.95)]" }),
          "HermesWorld Preview // Persistent Agent World"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "max-w-[760px] text-balance font-serif text-[clamp(3.6rem,7.5vw,8.4rem)] leading-[0.82] tracking-[-0.075em] text-[#fff6df] drop-shadow-[0_20px_80px_rgba(0,0,0,.65)]", children: "Your AI workspace is becoming a world." }),
        /* @__PURE__ */ jsx("p", { className: "mt-7 max-w-xl text-pretty text-lg leading-8 text-[#d7d0bd]/72 sm:text-xl", children: "HermesWorld turns agents into companions inside a persistent world. Explore zones, complete quests, collect sigils, and watch agents keep working while the world keeps moving." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsxs("a", { href: "/playground", className: "group inline-flex items-center justify-center rounded-xl border border-[#ffe7a3]/50 bg-[linear-gradient(180deg,#ffe7a3,#d9a63f)] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#11100b] shadow-[0_24px_80px_rgba(217,179,95,.28)] transition hover:-translate-y-0.5 hover:brightness-110", children: [
            "▶ Play Now ",
            /* @__PURE__ */ jsx("span", { className: "ml-2 transition group-hover:translate-x-1", children: "→" })
          ] }),
          /* @__PURE__ */ jsx("a", { href: HERMES_REPO_URL, ...externalLinkProps, className: "inline-flex items-center justify-center rounded-xl border border-[#d9b35f]/24 bg-[#0b1118]/78 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#f8e4ac] shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl transition hover:border-[#d9b35f]/50 hover:bg-[#121823]", children: "View on GitHub" }),
          /* @__PURE__ */ jsx("a", { href: HERMES_DOCS_URL, ...externalLinkProps, className: "inline-flex items-center justify-center rounded-xl border border-[#d9b35f]/24 bg-[#0b1118]/78 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#f8e4ac] shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl transition hover:border-[#d9b35f]/50 hover:bg-[#121823]", children: "Read Docs" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#bfb49a]/60", children: [
          /* @__PURE__ */ jsx("span", { children: "Preview build" }),
          /* @__PURE__ */ jsx("span", { className: "text-[#d9b35f]/55", children: "✦" }),
          /* @__PURE__ */ jsx("span", { children: "Persistent agents" }),
          /* @__PURE__ */ jsx("span", { className: "text-[#d9b35f]/55", children: "✦" }),
          /* @__PURE__ */ jsx("span", { children: "Zones, quests, sigils" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-7 max-w-xl rounded-2xl border border-[#d9b35f]/18 bg-[#05080e]/70 p-4 shadow-[0_20px_70px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9b35f]/35 bg-[#d9b35f]/12 text-lg shadow-[0_0_28px_rgba(217,179,95,.16)]", children: "🏆" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-[#d9b35f]/70", children: "Dropping today" }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm font-bold leading-5 text-[#fff6df]", children: "HermesWorld landing page, roadmap, feature list, and the first public build notes." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(HeroWorldFrame, {})
    ] }),
    /* @__PURE__ */ jsx(CapabilityStrip, {}),
    /* @__PURE__ */ jsx(TodayDropSection, {}),
    /* @__PURE__ */ jsx(ZonesSection, {}),
    /* @__PURE__ */ jsx(AgentsSection, {}),
    /* @__PURE__ */ jsx(SigilsSection, {}),
    /* @__PURE__ */ jsx(FinalCta, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function Header() {
  return /* @__PURE__ */ jsxs("header", { className: "relative z-30 mx-auto mt-4 flex max-w-[1560px] items-center justify-between border-b border-[#d9b35f]/20 px-4 pb-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("a", { href: "/hermes-world", className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("img", { src: "/hermesworld-logo.svg", alt: "HermesWorld", className: "h-10 w-10 rounded-2xl shadow-[0_0_34px_rgba(34,211,238,.18)]" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "font-serif text-lg font-bold tracking-[-0.03em] text-[#f8e4ac]", children: [
          "Hermes",
          /* @__PURE__ */ jsx("span", { className: "text-cyan-200", children: "World" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-[9px] font-black uppercase tracking-[0.22em] text-[#bfb49a]/46", children: "Persistent Agent RPG" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-8 text-[11px] font-black uppercase tracking-[0.18em] text-[#d7d0bd]/58 md:flex", children: [
      /* @__PURE__ */ jsx("a", { href: "#world", className: "transition hover:text-[#f8e4ac]", children: "World" }),
      /* @__PURE__ */ jsx("a", { href: "#agents", className: "transition hover:text-[#f8e4ac]", children: "Agents" }),
      /* @__PURE__ */ jsx("a", { href: "#sigils", className: "transition hover:text-[#f8e4ac]", children: "Sigils" }),
      /* @__PURE__ */ jsx("a", { href: "#preview", className: "transition hover:text-[#f8e4ac]", children: "Preview" }),
      /* @__PURE__ */ jsx("a", { href: "#today", className: "transition hover:text-[#f8e4ac]", children: "Today" }),
      /* @__PURE__ */ jsx("a", { href: HERMES_DOCS_URL, ...externalLinkProps, className: "transition hover:text-[#f8e4ac]", children: "Docs" }),
      /* @__PURE__ */ jsx("a", { href: "/playground", className: "rounded-lg border border-[#ffe7a3]/55 bg-[linear-gradient(180deg,#ffe7a3,#d9a63f)] px-4 py-2 font-black text-[#11100b] shadow-[0_0_30px_rgba(217,179,95,.18)] transition hover:brightness-110", children: "▶ Play" }),
      /* @__PURE__ */ jsx("a", { href: HERMES_REPO_URL, ...externalLinkProps, className: "rounded-lg border border-[#d9b35f]/30 bg-[#d9b35f]/10 px-4 py-2 text-[#f8e4ac] shadow-[0_0_30px_rgba(217,179,95,.08)] transition hover:bg-[#d9b35f]/18", children: "GitHub" })
    ] })
  ] });
}
function HeroWorldFrame() {
  return /* @__PURE__ */ jsxs("div", { id: "preview", className: "relative z-10 mx-auto w-full max-w-[930px]", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -inset-10 rounded-[4rem] bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,.18),transparent_52%),radial-gradient(circle_at_68%_72%,rgba(167,139,250,.16),transparent_48%)] blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[1.65rem] border border-[#d9b35f]/34 bg-[#05080e] p-2 shadow-[0_50px_160px_rgba(0,0,0,.72),0_0_80px_rgba(217,179,95,.12)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[#d9b35f]/18 px-3 py-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("i", { className: "h-2.5 w-2.5 rounded-full bg-red-400" }),
          /* @__PURE__ */ jsx("i", { className: "h-2.5 w-2.5 rounded-full bg-amber-300" }),
          /* @__PURE__ */ jsx("i", { className: "h-2.5 w-2.5 rounded-full bg-emerald-300" }),
          /* @__PURE__ */ jsx("span", { className: "ml-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#f8e4ac]/70", children: "Live World Preview" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-200/75 sm:flex", children: [
          /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,.9)]" }),
          "Live World Build"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative aspect-[16/10] overflow-hidden rounded-[1.15rem] bg-[#0a1117]", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0", children: /* @__PURE__ */ jsx(PlaygroundHeroCanvas, {}) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_36%,rgba(3,6,10,.28)_78%),linear-gradient(180deg,rgba(3,6,10,.02),rgba(3,6,10,.62))]" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute left-4 top-4 rounded-xl border border-[#d9b35f]/24 bg-[#05080e]/70 px-3 py-2 shadow-2xl backdrop-blur-xl", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[9px] font-black uppercase tracking-[0.2em] text-[#f8e4ac]/70", children: "HermesWorld Entry" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-[#d7d0bd]/70", children: "Portal online · Zones awakening · Sigils active" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-4 max-w-[320px] rounded-xl border border-cyan-200/20 bg-[#05080e]/72 p-3 shadow-2xl backdrop-blur-xl", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/72", children: "World State" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm font-bold text-[#fff6df]", children: "Agents need a world they can inhabit." }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs leading-5 text-[#d7d0bd]/58", children: "Persistent zones, believable characters, cleaner quests, stronger atmosphere." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 right-4 hidden rounded-xl border border-violet-200/20 bg-[#05080e]/70 p-3 text-xs text-[#d7d0bd]/62 shadow-2xl backdrop-blur-xl sm:block", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[9px] font-black uppercase tracking-[0.18em] text-violet-100/72", children: "Launch Focus" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1", children: "Agora believable" }),
          /* @__PURE__ */ jsx("div", { children: "Character pipeline" }),
          /* @__PURE__ */ jsx("div", { children: "Graphics + HUD pass" })
        ] })
      ] })
    ] })
  ] });
}
function CapabilityStrip() {
  return /* @__PURE__ */ jsx("section", { className: "relative mx-auto max-w-[1560px] px-4 py-5 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "grid overflow-hidden rounded-2xl border border-[#d9b35f]/20 bg-[#071018]/76 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_30px_100px_rgba(0,0,0,.38)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-6", children: capabilities.map((capability) => /* @__PURE__ */ jsxs("div", { className: "border-b border-r border-[#d9b35f]/12 p-5 last:border-r-0 sm:min-h-36 lg:border-b-0", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-3 text-2xl text-[#d9b35f] drop-shadow-[0_0_18px_rgba(217,179,95,.3)]", children: capability.icon }),
    /* @__PURE__ */ jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.17em] text-[#f8e4ac]", children: capability.label }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs leading-5 text-[#d7d0bd]/52", children: capability.copy })
  ] }, capability.label)) }) });
}
function TodayDropSection() {
  return /* @__PURE__ */ jsx("section", { id: "today", className: "relative mx-auto max-w-[1560px] px-4 py-16 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-[2rem] border border-[#d9b35f]/24 bg-[radial-gradient(circle_at_18%_0%,rgba(217,179,95,.2),transparent_34%),linear-gradient(135deg,rgba(7,16,24,.92),rgba(4,7,12,.9))] p-5 shadow-[0_34px_120px_rgba(0,0,0,.42)] sm:p-7 lg:p-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-center", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-[#d9b35f]/24 bg-[#d9b35f]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#f8e4ac]", children: [
        /* @__PURE__ */ jsx("span", { children: "🏆" }),
        "Launch drop"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mt-4 font-serif text-4xl font-bold leading-[0.92] tracking-[-0.055em] text-[#fff6df] sm:text-5xl lg:text-6xl", children: "Dropping HermesWorld today." }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-xl text-sm leading-7 text-[#d7d0bd]/62 sm:text-base", children: "Landing page, roadmap, feature list, and build notes first. Then we move straight into the game graphics sprint: world art, logo lockup, social cards, and clip-ready visuals." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: todayDrops.map(([title, copy]) => /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-white/10 bg-black/22 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-3 h-px w-12 bg-[linear-gradient(90deg,#d9b35f,transparent)]" }),
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-black uppercase tracking-[0.18em] text-[#f8e4ac]", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs leading-5 text-[#d7d0bd]/54", children: copy })
    ] }, title)) })
  ] }) }) });
}
function ZonesSection() {
  return /* @__PURE__ */ jsxs("section", { id: "world", className: "relative mx-auto max-w-[1560px] px-4 py-20 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.24em] text-[#d9b35f]/70", children: "The world map" }),
      /* @__PURE__ */ jsx("h2", { className: "mx-auto mt-3 max-w-4xl font-serif text-4xl font-bold tracking-[-0.055em] text-[#fff6df] sm:text-6xl", children: "Six zones. One persistent agent world." }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#d7d0bd]/58 sm:text-base", children: "Every zone teaches a different part of the agent loop: training, crafting, strategy, memory, prophecy, and evaluation." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-6", children: zones.map((zone, index) => /* @__PURE__ */ jsxs("article", { className: "group overflow-hidden rounded-2xl border border-[#d9b35f]/20 bg-[#071018]/82 p-2 shadow-[0_24px_90px_rgba(0,0,0,.38)] transition hover:-translate-y-1 hover:border-[#d9b35f]/38", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative h-48 overflow-hidden rounded-xl bg-[#0c1415]", style: { boxShadow: `inset 0 0 100px ${zone.tone}22` }, children: [
        /* @__PURE__ */ jsx(ZoneDiorama, { index, tone: zone.tone }),
        /* @__PURE__ */ jsx("div", { className: "absolute left-3 top-3 rounded-md border border-white/10 bg-black/42 px-2 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-white/65 backdrop-blur", children: zone.label })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl font-bold tracking-[-0.035em]", style: { color: zone.tone }, children: zone.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs leading-5 text-[#d7d0bd]/56", children: zone.copy })
      ] })
    ] }, zone.name)) })
  ] });
}
function AgentsSection() {
  return /* @__PURE__ */ jsx("section", { id: "agents", className: "relative border-y border-[#d9b35f]/14 bg-[#061016]/72 px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100/60", children: "Humans + Agents" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-3 max-w-2xl font-serif text-4xl font-bold tracking-[-0.055em] text-[#fff6df] sm:text-6xl", children: "Your agents live in the world with you." }),
      /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-xl text-base leading-8 text-[#d7d0bd]/62", children: "HermesWorld turns agents into visible companions. They can follow, take quests, report progress, and eventually move through the world on their own." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-7 grid gap-3 text-sm text-[#d7d0bd]/62 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsx(InfoPill, { title: "Companions", copy: "Roles, memory, and status." }),
        /* @__PURE__ */ jsx(InfoPill, { title: "Takeover", copy: "Future agent world actions." }),
        /* @__PURE__ */ jsx(InfoPill, { title: "Offline", copy: "Progress continues between visits." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-[0.8fr_1fr]", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#d9b35f]/18 bg-[#05080e]/78 p-4 shadow-2xl backdrop-blur-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#f8e4ac]/62", children: "Your Party" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: party.map((agent) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-white/8 bg-white/[0.035] p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-[#fff6df]", children: agent.name }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-[#d7d0bd]/45", children: agent.role })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl", style: { background: `${agent.tone}22`, border: `1px solid ${agent.tone}66`, boxShadow: `0 0 22px ${agent.tone}22` } })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-lg border border-white/8 bg-black/28 px-3 py-2 text-xs font-bold", style: { color: agent.tone }, children: agent.state })
        ] }, agent.name)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-cyan-100/16 bg-[#04070c]/82 p-4 shadow-2xl backdrop-blur-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/62", children: "Agent Console" }),
        /* @__PURE__ */ jsxs("div", { className: "min-h-[340px] rounded-xl border border-white/8 bg-black/36 p-4 font-mono text-xs leading-7 text-[#bff9ff]/72", children: [
          consoleLines.map((line) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#d9b35f]", children: "›" }),
            " ",
            line
          ] }, line)),
          /* @__PURE__ */ jsx("div", { className: "mt-3 text-[#76d88f]", children: "quest accepted: Open the Northern Gate" }),
          /* @__PURE__ */ jsx("div", { className: "text-[#a78bfa]", children: "agent route planned: Oracle → Grove → Forge" }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 animate-pulse text-[#f8e4ac]", children: "▌" })
        ] })
      ] })
    ] })
  ] }) });
}
function SigilsSection() {
  return /* @__PURE__ */ jsx("section", { id: "sigils", className: "relative mx-auto max-w-[1560px] px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 rounded-[2rem] border border-[#d9b35f]/22 bg-[radial-gradient(circle_at_32%_42%,rgba(217,179,95,.22),transparent_34%),#071018] p-5 shadow-[0_40px_140px_rgba(0,0,0,.45)] md:grid-cols-[0.9fr_1.1fr] md:p-8 lg:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[1.35rem] border border-[#d9b35f]/18 bg-[#04070c]", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute h-64 w-64 rounded-full bg-[#d9b35f]/20 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "relative flex h-56 w-56 items-center justify-center rounded-full border border-[#d9b35f]/42 bg-[radial-gradient(circle,#f8e4ac_0%,#d9b35f_22%,#4b3516_68%,#120d08_100%)] shadow-[0_0_90px_rgba(217,179,95,.32)]", children: /* @__PURE__ */ jsx("img", { src: "/hermesworld-logo.svg", alt: "Hermes Sigil", loading: "lazy", decoding: "async", className: "h-36 w-36 rounded-[2rem] shadow-[0_0_40px_rgba(34,211,238,.18)]" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.24em] text-[#d9b35f]/72", children: "In-world progression" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-3 font-serif text-4xl font-bold tracking-[-0.055em] text-[#fff6df] sm:text-6xl", children: "Collect Hermes Sigils as you unlock the world." }),
      /* @__PURE__ */ jsx("p", { className: "mt-5 text-base leading-8 text-[#d7d0bd]/62", children: "Hermes Sigils are progression artifacts earned through quests, agent upgrades, world exploration, and system mastery. They make invisible agent progress visible." }),
      /* @__PURE__ */ jsx("div", { className: "mt-7 grid gap-3 sm:grid-cols-2", children: progression.map(([title, copy]) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#d9b35f]/14 bg-black/20 p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-black uppercase tracking-[0.16em] text-[#f8e4ac]", children: title }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs leading-5 text-[#d7d0bd]/54", children: copy })
      ] }, title)) })
    ] })
  ] }) });
}
function FinalCta() {
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,6,10,.18),#03060a),url('/hermesworld-world.png')] bg-cover bg-center opacity-45" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(217,179,95,.2),transparent_42%),linear-gradient(90deg,#03060a_0%,rgba(3,6,10,.58)_50%,#03060a_100%)]" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[880px] rounded-[2rem] border border-[#d9b35f]/24 bg-[#05080e]/78 p-8 text-center shadow-[0_40px_140px_rgba(0,0,0,.52)] backdrop-blur-xl sm:p-12", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100/62", children: "Enter the world" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-3 font-serif text-4xl font-bold tracking-[-0.055em] text-[#fff6df] sm:text-6xl", children: "Build with agents in a world, not a chat box." }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mt-5 max-w-2xl text-base leading-8 text-[#d7d0bd]/62", children: "Enter HermesWorld and explore the first playable layer of Hermes Workspace: zones, quests, companions, sigils, and persistent agent progression." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col justify-center gap-3 sm:flex-row", children: [
        /* @__PURE__ */ jsx("a", { href: "/playground", className: "rounded-xl bg-[#f8e4ac] px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#11100b] transition hover:-translate-y-0.5 hover:bg-white", children: "▶ Play Now" }),
        /* @__PURE__ */ jsx("a", { href: HERMES_DOCS_URL, ...externalLinkProps, className: "rounded-xl border border-white/12 bg-white/[0.055] px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white/78 transition hover:bg-white/[0.1]", children: "Read Docs" }),
        /* @__PURE__ */ jsx("a", { href: HERMES_REPO_URL, ...externalLinkProps, className: "rounded-xl border border-white/12 bg-white/[0.055] px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white/78 transition hover:bg-white/[0.1]", children: "View GitHub" }),
        /* @__PURE__ */ jsx("a", { href: HERMES_ROADMAP_URL, ...externalLinkProps, className: "rounded-xl border border-white/12 bg-white/[0.055] px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white/78 transition hover:bg-white/[0.1]", children: "Read Roadmap" })
      ] })
    ] })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsxs("footer", { className: "mx-auto flex max-w-[1560px] flex-col gap-4 border-t border-[#d9b35f]/14 px-4 py-8 text-xs text-[#d7d0bd]/42 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("img", { src: "/hermesworld-logo.svg", alt: "HermesWorld", loading: "lazy", decoding: "async", className: "h-8 w-8 rounded-xl" }),
      /* @__PURE__ */ jsxs("span", { className: "font-serif text-base text-[#f8e4ac]", children: [
        "Hermes",
        /* @__PURE__ */ jsx("span", { className: "text-cyan-200", children: "World" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 uppercase tracking-[0.16em]", children: [
      /* @__PURE__ */ jsx("a", { href: HERMES_REPO_URL, ...externalLinkProps, className: "hover:text-[#f8e4ac]", children: "GitHub" }),
      /* @__PURE__ */ jsx("a", { href: HERMES_DOCS_URL, ...externalLinkProps, className: "hover:text-[#f8e4ac]", children: "Docs" }),
      /* @__PURE__ */ jsx("a", { href: HERMES_ROADMAP_URL, ...externalLinkProps, className: "hover:text-[#f8e4ac]", children: "Roadmap" }),
      /* @__PURE__ */ jsx("a", { href: HERMES_FEATURES_URL, ...externalLinkProps, className: "hover:text-[#f8e4ac]", children: "Feature List" }),
      /* @__PURE__ */ jsx("a", { href: "#today", className: "hover:text-[#f8e4ac]", children: "Today’s Drop" })
    ] })
  ] });
}
function InfoPill({ title, copy }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[#d9b35f]/14 bg-[#05080e]/42 p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[11px] font-black uppercase tracking-[0.16em] text-[#f8e4ac]", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs leading-5 text-[#d7d0bd]/50", children: copy })
  ] });
}
function ZoneDiorama({ tone, index }) {
  return /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.22))]", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-24 bg-[#1d392a]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-[64%] h-36 w-56 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-[42%] bg-[#31492f] shadow-[0_28px_60px_rgba(0,0,0,.48)]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute left-[18%] top-[58%] h-8 w-40 rotate-[-10deg] rounded-full bg-[#caa65c]/76" }),
    /* @__PURE__ */ jsx("div", { className: "absolute left-[42%] top-[34%] h-20 w-20 rounded-full border-4", style: { borderColor: tone, boxShadow: `0 0 34px ${tone}` } }),
    /* @__PURE__ */ jsx("div", { className: "absolute left-[43%] top-[47%] h-12 w-14 rounded bg-[#e8d2a4] shadow-lg", children: /* @__PURE__ */ jsx("div", { className: "absolute -top-4 h-6 w-16 -translate-x-1 rounded-sm", style: { background: index % 2 ? "#7f1d1d" : "#1d4d7f" } }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute left-[62%] top-[52%] h-9 w-9 rounded-full bg-[#f8e4ac] shadow-[0_0_28px_rgba(248,228,172,.35)]" }),
    Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "absolute h-8 w-8 rounded-[34%] bg-[#246b44] shadow-lg", style: { left: `${5 + (i * 17 + index * 9) % 88}%`, top: `${10 + (i * 29 + index * 11) % 72}%` } }, i)),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: { background: `radial-gradient(circle at 52% 42%, ${tone}20, transparent 42%)` } })
  ] });
}
function HermesBackdrop() {
  return /* @__PURE__ */ jsxs("div", { className: "pointer-events-none fixed inset-0 -z-10", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,#071018_0%,#03060a_54%,#020305_100%)]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(217,179,95,.16),transparent_30%),radial-gradient(circle_at_72%_8%,rgba(34,211,238,.14),transparent_32%),radial-gradient(circle_at_84%_72%,rgba(167,139,250,.14),transparent_34%)]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(248,228,172,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(248,228,172,.12)_1px,transparent_1px)] [background-size:72px_72px]" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_center,rgba(248,228,172,.45)_1px,transparent_1px)] [background-size:42px_42px]" })
  ] });
}
export {
  HermesWorldLanding as H
};
