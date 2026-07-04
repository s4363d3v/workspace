import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { $ as Route } from "./router-DmH5gXcK.js";
import "@tanstack/react-router";
import "@tanstack/react-query";
import "@hugeicons/react";
import "@hugeicons/core-free-icons";
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
function ReserveConfirmRoute() {
  usePageTitle("Confirm HermesWorld reservation");
  const token = Route.useSearch({
    strict: false
  }).token || "";
  const [state, setState] = useState({
    status: "loading",
    message: "Confirming your reservation…"
  });
  useEffect(() => {
    if (!token) {
      setState({
        status: "error",
        message: "Missing confirmation token. Re-open the link from your email."
      });
      return;
    }
    fetch("/api/hermesworld/reservations/confirm", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        token
      })
    }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Confirmation failed");
      }
      setState({
        status: "success",
        message: `${payload.reservation.desiredName} is now confirmed for launch.`
      });
    }).catch((error) => {
      setState({
        status: "error",
        message: error.message
      });
    });
  }, [token]);
  return /* @__PURE__ */ jsx("main", { className: "flex min-h-screen items-center justify-center bg-[#03060a] px-4 text-[#f8f3e7]", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xl rounded-[2rem] border border-[#d9b35f]/24 bg-[#05080e]/88 p-8 shadow-[0_40px_140px_rgba(0,0,0,.52)] backdrop-blur-2xl sm:p-10", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black uppercase tracking-[0.22em] text-[#d9b35f]/72", children: "Email confirmation" }),
    /* @__PURE__ */ jsx("h1", { className: "mt-4 font-serif text-4xl font-bold leading-[0.95] tracking-[-0.05em] text-[#fff6df]", children: state.status === "success" ? "Name locked in." : state.status === "error" ? "Confirmation problem." : "Confirming reservation…" }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-base leading-7 text-[#d7d0bd]/68", children: state.message }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsx("a", { href: "/reserve", className: "inline-flex items-center justify-center rounded-xl border border-[#ffe7a3]/55 bg-[linear-gradient(180deg,#ffe7a3,#d9a63f)] px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#11100b] shadow-[0_30px_90px_rgba(217,179,95,.32),inset_0_1px_0_rgba(255,255,255,.32)]", children: "Back to reserve" }),
      /* @__PURE__ */ jsx("a", { href: "/hermes-world", className: "inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#f8e4ac]", children: "HermesWorld landing" })
    ] })
  ] }) });
}
export {
  ReserveConfirmRoute as component
};
