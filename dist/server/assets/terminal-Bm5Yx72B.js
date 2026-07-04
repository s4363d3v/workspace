import { lazy } from "react";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
lazy(() => import("./terminal-workspace-DUjCIgk9.js").then((m) => ({
  default: m.TerminalWorkspace
})));
function TerminalRoute() {
  usePageTitle("Terminal");
  return null;
}
export {
  TerminalRoute as component
};
