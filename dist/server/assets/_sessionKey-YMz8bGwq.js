import { jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { a0 as Route, a1 as moveHistoryMessages, a2 as reconcileSessionDraft, a3 as ErrorBoundary } from "./router-DmH5gXcK.js";
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
const ChatScreen = lazy(async () => {
  const module = await import("./router-DmH5gXcK.js").then((n) => n.a6);
  return {
    default: module.ChatScreen
  };
});
function ChatRoute() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [forcedSession, setForcedSession] = useState(null);
  const params = Route.useParams();
  const activeFriendlyId = typeof params.sessionKey === "string" ? params.sessionKey : "main";
  const isNewChat = activeFriendlyId === "new";
  const forcedSessionKey = forcedSession?.friendlyId === activeFriendlyId ? forcedSession.sessionKey : void 0;
  useEffect(() => {
    if (isNewChat) {
      queryClient.removeQueries({
        queryKey: ["chat", "history", "new", "new"]
      });
    }
  }, [isNewChat, queryClient]);
  const handleSessionResolved = useCallback(function handleSessionResolved2(payload) {
    const sourceFriendlyId = activeFriendlyId;
    const sourceSessionKey = forcedSessionKey ?? activeFriendlyId;
    moveHistoryMessages(queryClient, sourceFriendlyId, sourceSessionKey, payload.friendlyId, payload.sessionKey);
    reconcileSessionDraft(queryClient, sourceFriendlyId, sourceSessionKey, payload.friendlyId, payload.sessionKey);
    queryClient.invalidateQueries({
      queryKey: ["chat", "sessions"]
    });
    setForcedSession({
      friendlyId: payload.friendlyId,
      sessionKey: payload.sessionKey
    });
    try {
      localStorage.setItem("claude-last-session", payload.friendlyId);
    } catch {
    }
    navigate({
      to: "/chat/$sessionKey",
      params: {
        sessionKey: payload.friendlyId
      },
      replace: true
    });
  }, [activeFriendlyId, forcedSessionKey, navigate, queryClient]);
  if (!mounted) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-primary-400", children: "Loading chat…" });
  }
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-primary-400", children: "Loading chat…" }), children: /* @__PURE__ */ jsx(ChatScreen, { activeFriendlyId, isNewChat, forcedSessionKey, onSessionResolved: isNewChat || activeFriendlyId === "main" ? handleSessionResolved : void 0 }) }) });
}
export {
  ChatRoute as component
};
