import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
function ReserveRoute() {
  usePageTitle("Reserve your HermesWorld name");
  const [desiredName, setDesiredName] = useState("");
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [counter, setCounter] = useState({
    loading: true,
    count: 0,
    error: null
  });
  const [submitState, setSubmitState] = useState({
    status: "idle",
    message: null
  });
  useEffect(() => {
    let cancelled = false;
    fetch("/api/hermesworld/reservations", {
      cache: "no-store"
    }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Failed to load counter");
      if (!cancelled) {
        setCounter({
          loading: false,
          count: payload.count || 0,
          error: null
        });
      }
    }).catch((error) => {
      if (!cancelled) {
        setCounter({
          loading: false,
          count: 0,
          error: error.message
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const isDisabled = submitState.status === "submitting";
  const trimmedName = useMemo(() => desiredName.trim(), [desiredName]);
  async function onSubmit(event) {
    event.preventDefault();
    setSubmitState({
      status: "submitting",
      message: null
    });
    try {
      const response = await fetch("/api/hermesworld/reservations", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          desiredName,
          email,
          wallet
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Reservation failed");
      }
      setSubmitState({
        status: "success",
        message: `Reserved ${payload.reservation.desiredName}. Check ${payload.reservation.email} for the confirmation link.`
      });
      setDesiredName("");
      setEmail("");
      setWallet("");
      setCounter((current) => ({
        ...current,
        count: current.count + 1
      }));
    } catch (error) {
      setSubmitState({
        status: "error",
        message: error?.message || "Reservation failed"
      });
    }
  }
  return /* @__PURE__ */ jsxs("main", { className: "relative min-h-screen overflow-hidden bg-[#03060a] px-4 py-8 text-[#f8f3e7] selection:bg-[#d9b35f] selection:text-[#07080d] sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute inset-0 -z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,#071018_0%,#03060a_52%,#020305_100%)]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(217,179,95,.18),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(34,211,238,.16),transparent_30%),radial-gradient(circle_at_82%_78%,rgba(167,139,250,.14),transparent_32%)]" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-10", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] border border-[#d9b35f]/24 bg-[#05080e]/82 p-7 shadow-[0_40px_140px_rgba(0,0,0,.52)] backdrop-blur-2xl sm:p-9", children: [
        /* @__PURE__ */ jsx("a", { href: "/hermes-world", className: "text-[11px] font-black uppercase tracking-[0.22em] text-[#d9b35f]/72 hover:text-[#f8e4ac]", children: "← Back to HermesWorld" }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 inline-flex items-center gap-2 rounded-full border border-[#d9b35f]/30 bg-[#d9b35f]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#f8e4ac]", children: "Name reservation live" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-5 font-serif text-4xl font-bold leading-[0.92] tracking-[-0.05em] text-[#fff6df] sm:text-6xl", children: "Reserve your HermesWorld name before accounts launch." }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-xl text-base leading-7 text-[#d7d0bd]/68 sm:text-lg", children: "Lock your desired handle now. We validate duplicates, profanity, and admin/system names server-side, then email you a confirmation link so the reservation can auto-bind when the account system goes live." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 grid gap-3 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsx(StatCard, { label: "Reservations", value: counter.loading ? "..." : String(counter.count), tone: "gold", subcopy: counter.error ? "Counter temporarily unavailable" : "Public live counter" }),
          /* @__PURE__ */ jsx(StatCard, { label: "Name rules", value: "3–20", tone: "cyan", subcopy: "Letters, numbers, underscores" }),
          /* @__PURE__ */ jsx(StatCard, { label: "Confirmation", value: "Email", tone: "violet", subcopy: "One-click verification" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-2xl border border-white/10 bg-black/24 p-5", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-[#d9b35f]/72", children: "Reservation notes" }),
          /* @__PURE__ */ jsxs("ul", { className: "mt-3 space-y-2 text-sm leading-6 text-[#d7d0bd]/64", children: [
            /* @__PURE__ */ jsx("li", { children: "• Desired names must use letters, numbers, or underscores only." }),
            /* @__PURE__ */ jsx("li", { children: "• Duplicate names are rejected immediately." }),
            /* @__PURE__ */ jsx("li", { children: "• Wallet is optional today, but helps with future account linking." }),
            /* @__PURE__ */ jsx("li", { children: "• Confirmation email required before the reservation is considered locked." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-[2rem] border border-[#d9b35f]/24 bg-[#05080e]/88 p-7 shadow-[0_40px_140px_rgba(0,0,0,.52)] backdrop-blur-2xl sm:p-9", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-[#d9b35f]/72", children: "Reserve handle" }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 text-2xl font-bold text-[#fff6df]", children: trimmedName ? `Claim ${trimmedName}` : "Enter your launch-day name" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rounded-full border border-cyan-200/22 bg-cyan-200/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/82", children: "hermes-world.ai/reserve" })
        ] }),
        /* @__PURE__ */ jsxs("form", { className: "mt-8 space-y-5", onSubmit, children: [
          /* @__PURE__ */ jsx(Field, { label: "Desired name", hint: "3-20 chars • alnum + underscore", value: desiredName, onChange: setDesiredName, placeholder: "Atlas_Builder", disabled: isDisabled, required: true }),
          /* @__PURE__ */ jsx(Field, { label: "Email", hint: "We send the confirmation link here", value: email, onChange: setEmail, placeholder: "you@example.com", disabled: isDisabled, required: true, type: "email" }),
          /* @__PURE__ */ jsx(Field, { label: "Wallet", hint: "Optional today — useful for launch binding", value: wallet, onChange: setWallet, placeholder: "0x... or wallet alias", disabled: isDisabled }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: isDisabled, className: "inline-flex w-full items-center justify-center rounded-xl border border-[#ffe7a3]/55 bg-[linear-gradient(180deg,#ffe7a3,#d9a63f)] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#11100b] shadow-[0_30px_90px_rgba(217,179,95,.32),inset_0_1px_0_rgba(255,255,255,.32)] transition enabled:hover:-translate-y-0.5 enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60", children: isDisabled ? "Submitting…" : "Reserve name" })
        ] }),
        submitState.message ? /* @__PURE__ */ jsx("div", { className: ["mt-5 rounded-2xl border px-4 py-3 text-sm leading-6", submitState.status === "success" ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100" : submitState.status === "error" ? "border-rose-400/25 bg-rose-400/10 text-rose-100" : "border-white/10 bg-white/5 text-[#d7d0bd]"].join(" "), children: submitState.message }) : null
      ] })
    ] })
  ] });
}
function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  type = "text"
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-[#fff6df]", children: label }),
      /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#d7d0bd]/48", children: hint })
    ] }),
    /* @__PURE__ */ jsx("input", { type, value, onChange: (event) => onChange(event.target.value), placeholder, disabled, required, className: "mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#0b1118]/90 px-4 text-sm text-[#fff6df] outline-none ring-0 transition placeholder:text-[#d7d0bd]/30 focus:border-[#d9b35f]/55" })
  ] });
}
function StatCard({
  label,
  value,
  subcopy,
  tone
}) {
  const accent = tone === "gold" ? "text-[#f8e4ac] border-[#d9b35f]/24 bg-[#d9b35f]/10" : tone === "cyan" ? "text-cyan-100 border-cyan-200/24 bg-cyan-200/10" : "text-violet-100 border-violet-200/24 bg-violet-200/10";
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/24 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)]", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-[#d9b35f]/72", children: label }),
    /* @__PURE__ */ jsx("div", { className: `mt-3 inline-flex rounded-full border px-3 py-1 text-lg font-black ${accent}`, children: value }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 text-xs leading-5 text-[#d7d0bd]/55", children: subcopy })
  ] });
}
export {
  ReserveRoute as component
};
