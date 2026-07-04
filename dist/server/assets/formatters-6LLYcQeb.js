function formatModelName(raw) {
  if (!raw) return "—";
  const stripped = raw.includes("/") ? raw.split("/").pop() ?? raw : raw;
  const lower = stripped.toLowerCase();
  if (lower.includes("opus")) {
    const match = stripped.match(/opus[- _]?(\d+)[- _.]?(\d+)/i);
    return match ? `Opus ${match[1]}.${match[2]}` : "Opus";
  }
  if (lower.includes("sonnet")) {
    const match = stripped.match(/sonnet[- _]?(\d+)[- _.]?(\d+)/i);
    return match ? `Sonnet ${match[1]}.${match[2]}` : "Sonnet";
  }
  if (lower.includes("haiku")) {
    const match = stripped.match(/haiku[- _]?(\d+)[- _.]?(\d+)/i);
    return match ? `Haiku ${match[1]}.${match[2]}` : "Haiku";
  }
  if (lower.includes("gemini")) {
    const match = stripped.match(
      /gemini[- _]?(\d+(?:[._]\d+)*)(?:[- _]?(flash|pro|ultra|exp))?/i
    );
    if (match) {
      const version = match[1].replace(/[_]/g, ".");
      const variant = match[2] ? ` ${match[2].charAt(0).toUpperCase()}${match[2].slice(1)}` : "";
      return `Gemini ${version}${variant}`;
    }
    return "Gemini";
  }
  if (lower.includes("codex")) {
    const match = stripped.match(/gpt[- _]?(\d+)[- _.]?(\d+)[- _]codex/i) ?? stripped.match(/codex[- _]?(\d+)[- _.]?(\d+)/i);
    return match ? `Codex ${match[1]}.${match[2]}` : "Codex";
  }
  if (lower.includes("gpt")) {
    const match = stripped.match(/gpt[- _]?(\d+)(?:[- _.]?(\d+))?/i);
    if (match) {
      return match[2] ? `GPT-${match[1]}.${match[2]}` : `GPT-${match[1]}`;
    }
    return stripped.replace(/gpt-/gi, "GPT-");
  }
  if (lower === "delivery-mirror") return "Mirror";
  if (lower.includes("kimi")) return "Kimi K2.5";
  return stripped.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function formatSkillName(raw) {
  if (!raw) return "—";
  const trimmed = raw.trim();
  if (!trimmed.includes(":") && !trimmed.includes("/")) return trimmed;
  const segments = trimmed.split(/[:\/]/);
  return segments[segments.length - 1] || trimmed;
}
function formatRelativeTime(timestampMs) {
  if (!timestampMs || timestampMs <= 0) return "just now";
  const diffMs = Math.max(0, Date.now() - timestampMs);
  const seconds = Math.floor(diffMs / 1e3);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
export {
  formatModelName as a,
  formatSkillName as b,
  formatRelativeTime as f
};
