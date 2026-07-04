import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { useState, useMemo } from "react";
const REWARDS = [
  { id: "founder-cape", name: "Founder Cape", icon: "🧥", description: "Animated gold-trim cloak cosmetic." },
  { id: "founder-banner", name: "Founder Banner", icon: "🏳️", description: "Guild banner for house halls." },
  { id: "aether-50", name: "Aether x50", icon: "💠", description: "Premium crafting currency." },
  { id: "coins-1000", name: "Coins x1000", icon: "🪙", description: "Starter bankroll for shops." },
  { id: "trader-trial", name: "Trader Agent Trial", icon: "🤖", description: "Trial access to the Trader Agent." },
  { id: "founder-title", name: "Founder Title", icon: "👑", description: "Permanent account title." },
  { id: "founder-pet", name: "Founder Pet", icon: "🐉", description: "Tiny aether wyrm companion." }
];
function FounderVaultPanel({ eligible = false, claimedRewardIds = [], onClaim }) {
  const claimed = new Set(claimedRewardIds);
  const allClaimed = REWARDS.every((reward) => claimed.has(reward.id));
  const canClaim = eligible && !allClaimed;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-label": "Founder vault panel",
      className: "w-[min(94vw,720px)] rounded-[32px] border border-[#d9b35f]/50 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,.21),transparent_38%),linear-gradient(180deg,rgba(30,21,12,.98),rgba(5,5,11,.96))] p-5 text-[#f9e7b5] shadow-[0_30px_100px_rgba(0,0,0,.7),inset_0_1px_0_rgba(255,255,255,.12)]",
      children: [
        /* @__PURE__ */ jsxs("header", { className: "mb-4 flex flex-col gap-3 border-b border-[#d9b35f]/25 pb-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.26em] text-[#d9b35f]/72", children: "Limited Reward Cache" }),
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl font-black text-[#ffe7a3]", children: "Founder Vault" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-xl text-sm text-[#f9e7b5]/68", children: "Seven founder rewards unlock once your account clears the launch-event condition gate." })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "w-fit rounded-full border border-[#d9b35f]/35 bg-black/32 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#d9b35f]", children: [
            claimed.size,
            "/",
            REWARDS.length,
            " claimed"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-7", children: REWARDS.map((reward) => {
          const isClaimed = claimed.has(reward.id);
          return /* @__PURE__ */ jsxs(
            "article",
            {
              "data-testid": "founder-reward-slot",
              className: "relative min-h-[148px] rounded-3xl border border-[#d9b35f]/32 bg-[linear-gradient(180deg,rgba(217,179,95,.13),rgba(0,0,0,.32))] p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.08)]",
              children: [
                /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#fbbf24]/35 bg-black/30 text-3xl shadow-[0_0_22px_rgba(251,191,36,.18)]", "aria-hidden": true, children: reward.icon }),
                /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-black leading-tight text-[#ffe7a3]", children: reward.name }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] leading-snug text-[#f9e7b5]/62", children: reward.description }),
                /* @__PURE__ */ jsx("div", { className: `mt-2 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${isClaimed ? "bg-emerald-300/15 text-emerald-200" : "bg-black/30 text-[#d9b35f]/72"}`, children: isClaimed ? "Claimed" : "Locked" })
              ]
            },
            reward.id
          );
        }) }),
        /* @__PURE__ */ jsxs("footer", { className: "mt-5 flex flex-col gap-3 rounded-3xl border border-[#d9b35f]/24 bg-black/24 p-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-[#ffe7a3]", children: "Founder condition" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-[#f9e7b5]/64", children: "Reserve name + complete launch tutorial. Eligibility syncs from the account ledger." })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClaim,
              disabled: !canClaim,
              "aria-label": "Claim Founder Vault",
              className: "rounded-2xl border border-[#fbbf24]/45 bg-[linear-gradient(180deg,#fde68a,#d9b35f)] px-5 py-2.5 text-sm font-black text-[#211507] shadow-[0_14px_40px_rgba(217,179,95,.28)] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-none disabled:bg-white/8 disabled:text-white/38 disabled:shadow-none",
              children: allClaimed ? "Vault Claimed" : eligible ? "Claim Founder Vault" : "Conditions Not Met"
            }
          )
        ] })
      ]
    }
  );
}
const RARITY_STYLES = {
  common: { label: "Common", border: "#8b7355", glow: "rgba(139,115,85,.28)", text: "#d7c7a4" },
  uncommon: { label: "Uncommon", border: "#5eead4", glow: "rgba(94,234,212,.22)", text: "#99f6e4" },
  rare: { label: "Rare", border: "#60a5fa", glow: "rgba(96,165,250,.28)", text: "#bfdbfe" },
  epic: { label: "Epic", border: "#c084fc", glow: "rgba(192,132,252,.28)", text: "#e9d5ff" },
  legendary: { label: "Legendary", border: "#fbbf24", glow: "rgba(251,191,36,.35)", text: "#fde68a" }
};
const DEFAULT_ITEMS = [
  { id: "training-blade", name: "Training Blade", icon: "🗡️", rarity: "rare", slot: "Weapon", description: "Rare quest reward. Drag into weapon slot to equip." },
  { id: "novice-cloak", name: "Novice Cloak", icon: "🧥", rarity: "uncommon", slot: "Armor", description: "Light cloak stitched with starter-zone wards." },
  { id: "hermes-sigil", name: "Hermes Sigil", icon: "✦", rarity: "epic", slot: "Relic", description: "A charged sigil that unlocks fast-travel whispers." },
  { id: "aether-vial", name: "Aether Vial", icon: "🧪", rarity: "legendary", quantity: 3, description: "Condensed aether for founder crafting recipes." },
  { id: "bronze-coins", name: "Bronze Coins", icon: "🪙", rarity: "common", quantity: 128, description: "Spend with agora merchants." },
  { id: "map-fragment", name: "Map Fragment", icon: "🗺️", rarity: "uncommon", description: "Reveals one hidden grove path." }
];
function inventorySlots(items) {
  return Array.from({ length: 24 }, (_, index) => items[index] ?? null);
}
function InventoryPanel({ items = DEFAULT_ITEMS, onEquip }) {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-label": "Inventory panel",
      className: "w-[min(94vw,520px)] rounded-[28px] border border-[#d9b35f]/45 bg-[linear-gradient(180deg,rgba(23,18,12,.96),rgba(5,5,10,.94))] p-4 text-[#f9e7b5] shadow-[0_28px_90px_rgba(0,0,0,.62),inset_0_1px_0_rgba(255,255,255,.10)] backdrop-blur-xl",
      children: [
        /* @__PURE__ */ jsxs("header", { className: "mb-3 flex items-center justify-between gap-3 border-b border-[#d9b35f]/25 pb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-[#d9b35f]/70", children: "Satchel" }),
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl font-black tracking-tight text-[#ffe7a3]", children: "Inventory" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rounded-full border border-[#d9b35f]/35 bg-black/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#d9b35f]", children: "6 × 4" })
        ] }),
        /* @__PURE__ */ jsx("div", { role: "grid", "aria-label": "Inventory slots", className: "grid grid-cols-6 gap-2", children: inventorySlots(items).map((item, index) => {
          const rarity = item ? RARITY_STYLES[item.rarity] : null;
          return /* @__PURE__ */ jsx(
            "button",
            {
              role: "gridcell",
              "aria-label": item ? `Equip ${item.name} ${item.rarity}` : `Empty slot ${index + 1}`,
              "data-rarity": item?.rarity ?? "empty",
              draggable: Boolean(item),
              onDragStart: (event) => {
                if (!item) return;
                event.dataTransfer.setData("application/x-hermes-inventory-item", item.id);
                event.dataTransfer.effectAllowed = "move";
              },
              onDoubleClick: () => item && onEquip?.(item),
              className: "group relative aspect-square rounded-2xl border bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.13),transparent_42%),linear-gradient(180deg,rgba(41,31,18,.86),rgba(5,5,10,.92))] p-1.5 text-center transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/60",
              style: {
                borderColor: rarity?.border ?? "rgba(217,179,95,.18)",
                boxShadow: item ? `0 0 18px ${rarity?.glow}, inset 0 0 0 1px rgba(255,255,255,.06)` : "inset 0 0 0 1px rgba(255,255,255,.03)"
              },
              children: item ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-full items-center justify-center rounded-xl bg-black/20 text-2xl sm:text-3xl", "aria-hidden": true, children: item.icon }),
                item.quantity ? /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 right-1 rounded-full bg-black/70 px-1.5 text-[10px] font-black text-white", children: item.quantity }) : null,
                /* @__PURE__ */ jsxs("span", { className: "pointer-events-none absolute left-1/2 top-[calc(100%+.45rem)] z-20 hidden w-52 -translate-x-1/2 rounded-xl border border-[#d9b35f]/35 bg-[#07050b]/95 p-2 text-left shadow-2xl group-hover:block group-focus:block", children: [
                  /* @__PURE__ */ jsx("span", { className: "block text-xs font-black text-[#ffe7a3]", children: item.name }),
                  /* @__PURE__ */ jsx("span", { className: "block text-[10px] uppercase tracking-[0.18em]", style: { color: rarity?.text }, children: rarity?.label }),
                  item.slot ? /* @__PURE__ */ jsxs("span", { className: "block text-[11px] text-white/62", children: [
                    "Slot: ",
                    item.slot
                  ] }) : null,
                  /* @__PURE__ */ jsx("span", { className: "mt-1 block text-[11px] leading-snug text-[#f9e7b5]/78", children: item.description })
                ] })
              ] }) : /* @__PURE__ */ jsx("span", { className: "flex h-full items-center justify-center rounded-xl border border-dashed border-[#d9b35f]/10 text-lg text-[#d9b35f]/18", children: "＋" })
            },
            item?.id ?? `empty-${index}`
          );
        }) }),
        /* @__PURE__ */ jsxs("footer", { className: "mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#f9e7b5]/58", children: [
          /* @__PURE__ */ jsx("span", { children: "Drag items into equipment slots. Double-click to quick equip." }),
          /* @__PURE__ */ jsx("span", { className: "text-[#d9b35f]/80", children: "24 slots" })
        ] })
      ]
    }
  );
}
const ZONES = [
  { id: "agora", name: "Agora Commons", x: 42, y: 38, w: 24, h: 22, accent: "#d9b35f", description: "Market plaza and social hub." },
  { id: "forge", name: "The Forge", x: 68, y: 18, w: 20, h: 21, accent: "#22d3ee", description: "Crafting labs and prompt anvils." },
  { id: "grove", name: "Grove of Echoes", x: 14, y: 26, w: 24, h: 24, accent: "#34d399", description: "Bioluminescent music quests." },
  { id: "oracle", name: "Oracle Temple", x: 20, y: 62, w: 24, h: 21, accent: "#a78bfa", description: "Lore archive and memory shrines." },
  { id: "arena", name: "Benchmark Arena", x: 68, y: 62, w: 22, h: 22, accent: "#fb7185", description: "Model duels and ranked trials." },
  { id: "training", name: "Training Grounds", x: 41, y: 69, w: 19, h: 16, accent: "#5eead4", description: "Starter circle and first sword." }
];
function MapPanel({ currentZoneId = "agora", playerPosition = { x: 53, y: 48 } }) {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      role: "dialog",
      "aria-label": "World map",
      className: "relative min-h-[min(720px,86vh)] w-[min(94vw,980px)] overflow-hidden rounded-[32px] border border-[#d9b35f]/45 bg-[linear-gradient(180deg,rgba(20,15,9,.97),rgba(3,5,12,.96))] text-[#f9e7b5] shadow-[0_32px_110px_rgba(0,0,0,.72),inset_0_1px_0_rgba(255,255,255,.10)]",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-[#d9b35f]/25 bg-black/22 px-5 py-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-[#d9b35f]/70", children: "Cartographer View" }),
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl font-black text-[#ffe7a3]", children: "World Map" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "rounded-full border border-[#d9b35f]/30 bg-[#d9b35f]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#d9b35f]", children: "Hermes Realm" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative h-[min(610px,74vh)] overflow-hidden bg-[radial-gradient(circle_at_50%_44%,rgba(217,179,95,.14),transparent_34%),linear-gradient(120deg,rgba(34,211,238,.08),transparent_38%),linear-gradient(230deg,rgba(168,85,247,.10),transparent_36%)]", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 opacity-45",
              style: {
                backgroundImage: "linear-gradient(rgba(217,179,95,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(217,179,95,.13) 1px, transparent 1px)",
                backgroundSize: "54px 54px"
              }
            }
          ),
          /* @__PURE__ */ jsxs("svg", { "aria-hidden": true, className: "absolute inset-0 h-full w-full", viewBox: "0 0 100 100", preserveAspectRatio: "none", children: [
            /* @__PURE__ */ jsx("path", { d: "M21 72 C38 51, 45 57, 54 47 S76 31, 79 26", stroke: "rgba(217,179,95,.44)", strokeWidth: ".8", strokeDasharray: "2 2", fill: "none" }),
            /* @__PURE__ */ jsx("path", { d: "M25 40 C42 30, 47 42, 54 47 S75 70, 80 72", stroke: "rgba(94,234,212,.28)", strokeWidth: ".6", fill: "none" }),
            /* @__PURE__ */ jsx("path", { d: "M32 71 C37 78, 44 78, 51 77", stroke: "rgba(255,255,255,.16)", strokeWidth: ".55", fill: "none" })
          ] }),
          ZONES.map((zone) => {
            const current = zone.id === currentZoneId;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                "aria-label": `Zone highlight ${zone.name}`,
                "data-current-zone": current ? "true" : "false",
                className: "group absolute rounded-[28px] border px-3 py-2 text-left transition duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/60",
                style: {
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.w}%`,
                  height: `${zone.h}%`,
                  borderColor: current ? zone.accent : `${zone.accent}88`,
                  background: current ? `radial-gradient(circle at 50% 15%, ${zone.accent}42, rgba(0,0,0,.48) 64%)` : `linear-gradient(180deg, ${zone.accent}18, rgba(0,0,0,.46))`,
                  boxShadow: current ? `0 0 42px ${zone.accent}70, inset 0 1px 0 rgba(255,255,255,.11)` : `0 0 18px ${zone.accent}24`
                },
                children: [
                  /* @__PURE__ */ jsx("span", { className: "block text-[11px] font-black uppercase tracking-[0.14em]", style: { color: zone.accent }, children: zone.name }),
                  /* @__PURE__ */ jsx("span", { className: "mt-1 hidden text-[10px] leading-snug text-white/64 sm:block", children: zone.description })
                ]
              },
              zone.id
            );
          }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              "aria-label": "Current player position",
              className: "absolute z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#fde68a] bg-[#fbbf24] shadow-[0_0_25px_rgba(251,191,36,.9)]",
              style: { left: `${playerPosition.x}%`, top: `${playerPosition.y}%` },
              children: [
                /* @__PURE__ */ jsx("span", { className: "absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-[#fbbf24]/45" }),
                /* @__PURE__ */ jsx("span", { className: "absolute left-1/2 top-[calc(100%+.35rem)] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#fde68a]", children: "You" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const DIALOG_LINES = [
  "The wind over HermesWorld is carrying a strange static tonight.",
  "Our builders have opened new panels, but the vault locks will only answer a player who knows the old route names.",
  "Find the glowing pins on the world map, inspect your inventory, then return with the founder sigil intact."
];
const CHOICES = [
  { id: "ask-lore", label: "Ask about the static", tone: "Lore" },
  { id: "promise", label: "Promise to recover the sigil", tone: "Heroic" },
  { id: "request-reward", label: "Request the reward terms", tone: "Pragmatic" }
];
function QuestDialogPanel({ npcName = "Athena", npcTitle = "Oracle of the Agora", onAccept, onDecline }) {
  return /* @__PURE__ */ jsx(
    "section",
    {
      role: "dialog",
      "aria-label": "Quest dialog",
      className: "w-[min(94vw,760px)] overflow-hidden rounded-[30px] border border-[#d9b35f]/45 bg-[linear-gradient(135deg,rgba(38,27,14,.97),rgba(8,7,13,.96)_54%,rgba(2,6,18,.94))] text-[#f9e7b5] shadow-[0_30px_100px_rgba(0,0,0,.68),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-xl",
      children: /* @__PURE__ */ jsxs("div", { className: "grid gap-0 md:grid-cols-[230px_1fr]", children: [
        /* @__PURE__ */ jsx("aside", { className: "border-b border-[#d9b35f]/25 bg-[radial-gradient(circle_at_50%_15%,rgba(251,191,36,.24),transparent_46%),linear-gradient(180deg,rgba(217,179,95,.16),rgba(0,0,0,.18))] p-5 md:border-b-0 md:border-r", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-[190px] flex-col items-center text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative h-36 w-36 overflow-hidden rounded-[28px] border-2 border-[#d9b35f]/55 bg-[linear-gradient(180deg,rgba(217,179,95,.24),rgba(17,24,39,.9))] shadow-[0_0_35px_rgba(217,179,95,.22)]", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                alt: `${npcName} portrait`,
                src: "/avatars/athena.png",
                loading: "lazy",
                decoding: "async",
                className: "h-full w-full object-cover",
                onError: (event) => {
                  event.currentTarget.style.display = "none";
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center text-6xl", "aria-hidden": true, children: "⚜️" })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "mt-4 font-serif text-2xl font-black text-[#ffe7a3]", children: "Quest Dialog" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-bold text-white", children: npcName }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-[#d9b35f]/72", children: npcTitle })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex min-h-[430px] flex-col p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between gap-3 border-b border-[#d9b35f]/20 pb-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.24em] text-[#d9b35f]/70", children: "Main Quest" }),
              /* @__PURE__ */ jsx("h3", { className: "font-serif text-xl font-black text-[#ffe7a3]", children: "The Founder Signal" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200", children: "Available" })
          ] }),
          /* @__PURE__ */ jsx("div", { "aria-label": "Dialog scroll", role: "region", className: "min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#d9b35f]/18 bg-black/28 p-4 shadow-inner", children: DIALOG_LINES.map((line) => /* @__PURE__ */ jsxs("p", { className: "mb-3 text-sm leading-6 text-[#f9e7b5]/84", children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2 text-[#d9b35f]", children: "✦" }),
            line
          ] }, line)) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-2 sm:grid-cols-3", children: CHOICES.map((choice) => /* @__PURE__ */ jsxs("button", { className: "rounded-2xl border border-[#d9b35f]/28 bg-[#d9b35f]/8 px-3 py-2 text-left transition hover:border-[#fbbf24]/55 hover:bg-[#fbbf24]/14", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] font-black uppercase tracking-[0.16em] text-[#d9b35f]/68", children: choice.tone }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#f9e7b5]", children: choice.label })
          ] }, choice.id)) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", children: [
            /* @__PURE__ */ jsx("button", { onClick: onDecline, className: "rounded-2xl border border-white/14 px-4 py-2 text-sm font-bold text-white/65 transition hover:bg-white/8", children: "Decline" }),
            /* @__PURE__ */ jsx("button", { onClick: onAccept, className: "rounded-2xl border border-[#fbbf24]/50 bg-[linear-gradient(180deg,#fde68a,#d9b35f)] px-5 py-2 text-sm font-black text-[#1d1307] shadow-[0_12px_35px_rgba(217,179,95,.28)] transition hover:brightness-110", children: "Accept Quest" })
          ] })
        ] })
      ] })
    }
  );
}
function WaveChatPanelsShowcase() {
  return /* @__PURE__ */ jsx(
    "main",
    {
      "aria-label": "Wave chat panel showcase",
      className: "min-h-full bg-[radial-gradient(circle_at_50%_0%,rgba(217,179,95,.18),transparent_34%),linear-gradient(180deg,#07050b,#02030a)] px-4 py-8 text-[#f9e7b5]",
      children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-7xl flex-col gap-8", children: [
        /* @__PURE__ */ jsxs("header", { className: "rounded-[28px] border border-[#d9b35f]/35 bg-black/28 p-5 shadow-2xl backdrop-blur-xl", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black uppercase tracking-[0.28em] text-[#d9b35f]/72", children: "Lovable Wave Chat Panels" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-2 font-serif text-4xl font-black text-[#ffe7a3]", children: "Panel Component Showcase" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-3xl text-sm text-[#f9e7b5]/68", children: "Dev-server screenshot surface for A12 inventory, A13 quest dialog, A14 map, and A15 founder vault mockups. Built as real React components — no PNG hacks." })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "grid gap-8 xl:grid-cols-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(InventoryPanel, {}) }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(FounderVaultPanel, { eligible: true }) })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "flex justify-center", children: /* @__PURE__ */ jsx(QuestDialogPanel, {}) }),
        /* @__PURE__ */ jsx("section", { className: "flex justify-center", children: /* @__PURE__ */ jsx(MapPanel, {}) })
      ] })
    }
  );
}
const HERMES_WEB_ORIGIN = "https://play.hermes-world.ai";
const HERMES_SITE_ORIGIN = "https://hermes-world.ai";
function HermesWorldEmbed() {
  const showPanelShowcase = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("panels") === "wave-chat";
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const webUrl = useMemo(() => {
    const url = new URL("/play/web/", HERMES_WEB_ORIGIN);
    url.searchParams.set("source", "hermes-workspace");
    return url.toString();
  }, []);
  if (showPanelShowcase) {
    return /* @__PURE__ */ jsx(WaveChatPanelsShowcase, {});
  }
  return /* @__PURE__ */ jsxs("main", { className: "relative flex h-full min-h-0 flex-col overflow-hidden bg-[#050015] text-white", children: [
    !failed && /* @__PURE__ */ jsx(
      "iframe",
      {
        title: "HermesWorld",
        src: webUrl,
        onLoad: () => setLoaded(true),
        onError: () => setFailed(true),
        allow: "autoplay; fullscreen; gamepad; clipboard-write; cross-origin-isolated",
        allowFullScreen: true,
        className: "h-full w-full min-h-0 flex-1 border-0 bg-[#050015]"
      }
    ),
    !loaded && !failed && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(168,85,247,.24),transparent_48%),#050015]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/hermesworld-logo.svg",
          alt: "HermesWorld",
          className: "h-14 w-14 animate-pulse rounded-2xl shadow-[0_0_34px_rgba(34,211,238,.25)]"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/70", children: "Loading HermesWorld…" })
    ] }) }),
    failed && /* @__PURE__ */ jsxs("div", { className: "relative flex h-full items-center justify-center px-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(168,85,247,.24),transparent_48%),#050015]" }),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-xl rounded-3xl border border-white/12 bg-black/45 px-6 py-6 text-center shadow-2xl backdrop-blur-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/70", children: "Hermes Workspace" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-2 text-3xl font-black tracking-tight", children: "Open HermesWorld in a full tab" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-white/65", children: "The embedded client couldn’t load here. Open the full web build in a new tab to play." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap justify-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: webUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "rounded-full bg-cyan-300 px-5 py-2 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-white",
              children: "Open full"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${HERMES_SITE_ORIGIN}/`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "rounded-full border border-white/15 bg-white/8 px-5 py-2 text-sm font-bold uppercase tracking-[0.14em] text-white/75 transition hover:border-cyan-200/40 hover:text-white",
              children: "Site root"
            }
          )
        ] })
      ] })
    ] }),
    !failed && /* @__PURE__ */ jsx(
      "a",
      {
        href: webUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/75 backdrop-blur-md transition hover:border-cyan-200/40 hover:text-white",
        children: "Open full ↗"
      }
    )
  ] });
}
function PlaygroundRoute() {
  usePageTitle("HermesWorld");
  return /* @__PURE__ */ jsx(HermesWorldEmbed, {});
}
export {
  PlaygroundRoute as component
};
