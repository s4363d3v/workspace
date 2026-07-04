import { jsxs, jsx } from "react/jsx-runtime";
const SplitErrorComponent = function FilesError({
  error
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full p-6 text-center bg-primary-50", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-primary-900 mb-3", children: "Failed to Load Files" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-primary-600 mb-4 max-w-md", children: error instanceof Error ? error.message : "An unexpected error occurred" }),
    /* @__PURE__ */ jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors", children: "Reload Page" })
  ] });
};
export {
  SplitErrorComponent as errorComponent
};
