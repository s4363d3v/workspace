import { jsxs, jsx } from "react/jsx-runtime";
const SplitErrorComponent = function EchoStudioError({
  error
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center bg-primary-50 p-6 text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "mb-3 text-xl font-semibold text-primary-900", children: "Failed to Load Echo Studio" }),
    /* @__PURE__ */ jsx("p", { className: "mb-4 max-w-md text-sm text-primary-600", children: error instanceof Error ? error.message : "An unexpected error occurred" }),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => window.location.reload(), className: "rounded-lg bg-accent-500 px-4 py-2 text-white transition-colors hover:bg-accent-600", children: "Reload Page" })
  ] });
};
export {
  SplitErrorComponent as errorComponent
};
