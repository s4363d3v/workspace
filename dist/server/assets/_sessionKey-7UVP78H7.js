import { jsx, jsxs } from "react/jsx-runtime";
const SplitErrorComponent = function ChatError({
  error,
  reset
}) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center h-full p-6 text-center bg-primary-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4 text-5xl", children: "💬" }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-primary-900 mb-3", children: "Chat Error" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-primary-600 mb-6", children: error instanceof Error ? error.message : "Failed to load chat session" }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-center", children: [
      /* @__PURE__ */ jsx("button", { onClick: reset, className: "px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors", children: "Try Again" }),
      /* @__PURE__ */ jsx("button", { onClick: () => {
        if (typeof window !== "undefined") window.location.href = "/chat";
      }, className: "px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors", children: "Return to Main" })
    ] })
  ] }) });
};
export {
  SplitErrorComponent as errorComponent
};
