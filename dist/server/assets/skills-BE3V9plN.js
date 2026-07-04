import { jsxs, jsx } from "react/jsx-runtime";
import { T as Tabs, f as TabsList, g as TabsTab, h as TabsPanel, B as Button, D as DialogRoot, b as DialogContent, d as DialogTitle, e as DialogDescription, S as ScrollAreaRoot, i as ScrollAreaViewport, j as Markdown, k as ScrollAreaScrollbar, l as ScrollAreaThumb, c as cn, m as Switch, t as toast, w as writeTextToClipboard, n as useFeatureAvailable, o as BackendUnavailableState, p as getUnavailableReason } from "./router-DmH5gXcK.js";
import { u as usePageTitle } from "./use-page-title-DxzhUrGi.js";
import { useState, useMemo, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import "@tanstack/react-router";
import "@hugeicons/react";
import "@hugeicons/core-free-icons";
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
function titleCaseCategory(raw) {
  const value = (raw || "").trim();
  if (!value) return "Productivity";
  return value.split(/[-_/]/).map(
    (word) => word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ""
  ).filter(Boolean).join(" ");
}
function normalizeProfileSkill(raw) {
  const name = (raw.name || "").trim();
  return {
    id: name,
    slug: name,
    name,
    description: raw.description || "",
    author: "",
    triggers: [],
    tags: [],
    homepage: null,
    category: titleCaseCategory(raw.category),
    icon: "✨",
    content: "",
    fileCount: 0,
    sourcePath: raw.path || "",
    installed: true,
    enabled: raw.enabled !== false,
    featuredGroup: void 0,
    security: { level: "safe", flags: [], score: 0 },
    origin: "marketplace"
  };
}
const PAGE_LIMIT = 30;
const DEFAULT_CATEGORIES = [
  "All",
  "Web & Frontend",
  "Coding Agents",
  "Git & GitHub",
  "DevOps & Cloud",
  "Browser & Automation",
  "Image & Video",
  "Search & Research",
  "AI & LLMs",
  "Productivity",
  "Marketing & Sales",
  "Communication",
  "Data & Analytics",
  "Finance & Crypto"
];
function resolveSkillSearchTier(skill, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return 0;
  if (skill.name.toLowerCase().includes(normalizedQuery)) return 0;
  const tagText = skill.tags.join(" ").toLowerCase();
  const triggerText = skill.triggers.join(" ").toLowerCase();
  if (tagText.includes(normalizedQuery) || triggerText.includes(normalizedQuery)) {
    return 1;
  }
  if (skill.description.toLowerCase().includes(normalizedQuery)) return 2;
  return 3;
}
function SkillsScreen() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("installed");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedMarketplaceSearch, setDebouncedMarketplaceSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [origin, setOrigin] = useState("All");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [actionSkillId, setActionSkillId] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState("");
  const profilesQuery = useQuery({
    queryKey: ["skills-profiles-list"],
    queryFn: async function fetchProfiles() {
      const response = await fetch("/api/profiles/list");
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to load profiles");
      }
      return payload;
    },
    staleTime: 6e4
  });
  const profiles = profilesQuery.data?.profiles ?? [];
  const activeProfileName = useMemo(() => {
    const fromActiveFlag = profiles.find((p) => p.active || p.is_active);
    if (fromActiveFlag) return fromActiveFlag.name;
    const explicit = profilesQuery.data?.activeProfile;
    if (explicit) return explicit;
    const defaultProfile = profiles.find((p) => p.is_default);
    return defaultProfile?.name ?? profiles[0]?.name ?? "";
  }, [profiles, profilesQuery.data?.activeProfile]);
  useEffect(() => {
    if (!profiles.length || selectedProfile) return;
    setSelectedProfile(activeProfileName || profiles[0].name);
  }, [profiles, activeProfileName, selectedProfile]);
  const effectiveProfile = selectedProfile || activeProfileName;
  const isOnActiveProfile = !effectiveProfile || effectiveProfile === activeProfileName;
  useEffect(() => {
    if (tab !== "marketplace") return;
    const timeout = window.setTimeout(() => {
      setDebouncedMarketplaceSearch(searchInput);
    }, 250);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput, tab]);
  useEffect(() => {
    if (!isOnActiveProfile && tab !== "installed") {
      setTab("installed");
      setPage(1);
    }
  }, [isOnActiveProfile, tab]);
  const skillsQuery = useQuery({
    queryKey: [
      "skills-browser",
      tab,
      searchInput,
      category,
      origin,
      page,
      sort,
      isOnActiveProfile ? "__active__" : effectiveProfile
    ],
    enabled: isOnActiveProfile || Boolean(effectiveProfile),
    queryFn: async function fetchSkills() {
      if (!isOnActiveProfile) {
        const response2 = await fetch(
          `/api/profiles/skills?name=${encodeURIComponent(effectiveProfile)}`
        );
        const payload2 = await response2.json();
        if (!response2.ok) {
          throw new Error(payload2.error || "Failed to fetch profile skills");
        }
        const normalized = (payload2.items || []).map(normalizeProfileSkill);
        const lowered = searchInput.trim().toLowerCase();
        const filtered = normalized.filter((skill) => {
          if (category !== "All" && skill.category !== category) return false;
          if (!lowered) return true;
          return [skill.name, skill.description, skill.category].join("\n").toLowerCase().includes(lowered);
        });
        const sorted = [...filtered].sort((a, b) => {
          if (sort === "category") {
            const compare = a.category.localeCompare(b.category);
            if (compare !== 0) return compare;
          }
          return a.name.localeCompare(b.name);
        });
        const total = sorted.length;
        const start = (page - 1) * PAGE_LIMIT;
        const skills2 = sorted.slice(start, start + PAGE_LIMIT);
        const categorySet = Array.from(
          /* @__PURE__ */ new Set(["All", ...normalized.map((skill) => skill.category)])
        );
        return { skills: skills2, total, page, categories: categorySet };
      }
      const params = new URLSearchParams();
      params.set("tab", tab);
      params.set("search", searchInput);
      params.set("category", category);
      params.set("origin", origin);
      params.set("page", String(page));
      params.set("limit", String(PAGE_LIMIT));
      params.set("sort", sort);
      const response = await fetch(`/api/skills?${params.toString()}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to fetch skills");
      }
      return payload;
    }
  });
  const hubQuery = useQuery({
    queryKey: ["skills-hub-search", debouncedMarketplaceSearch],
    enabled: tab === "marketplace",
    queryFn: async function fetchHubResults() {
      const params = new URLSearchParams();
      params.set("q", debouncedMarketplaceSearch);
      params.set("source", "all");
      params.set("limit", "20");
      const response = await fetch(
        `/api/skills/hub-search?${params.toString()}`
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to search skills hub");
      }
      return payload;
    }
  });
  const categories = useMemo(
    function resolveCategories() {
      const fromApi = skillsQuery.data?.categories;
      if (Array.isArray(fromApi) && fromApi.length > 0) {
        return fromApi;
      }
      return DEFAULT_CATEGORIES;
    },
    [skillsQuery.data?.categories]
  );
  const totalPages = Math.max(
    1,
    Math.ceil((skillsQuery.data?.total || 0) / PAGE_LIMIT)
  );
  const skills = useMemo(
    function resolveVisibleSkills() {
      const sourceSkills = skillsQuery.data?.skills || [];
      const normalizedQuery = searchInput.trim().toLowerCase();
      if (!normalizedQuery) {
        return sourceSkills;
      }
      return sourceSkills.map(function mapSkillToTier(skill, index) {
        return {
          skill,
          index,
          tier: resolveSkillSearchTier(skill, normalizedQuery)
        };
      }).sort(function sortByTierThenOriginalOrder(a, b) {
        if (a.tier !== b.tier) return a.tier - b.tier;
        return a.index - b.index;
      }).map(function unwrapSkill(entry) {
        return entry.skill;
      });
    },
    [searchInput, skillsQuery.data?.skills]
  );
  const marketplaceSkills = useMemo(
    function resolveMarketplaceSkills() {
      return (hubQuery.data?.results || []).map(function mapHubSkill(skill) {
        const skillId = skill.id || skill.name;
        const author = skill.author || (skill.repo ? skill.repo.split("/")[0] : null) || skill.extra?.author || skill.source || "Community";
        const homepage = skill.homepage || skill.repo || skill.extra?.homepage || null;
        const category2 = skill.category || skill.extra?.category || "Productivity";
        return {
          id: skillId,
          slug: skillId,
          name: skill.name || skillId,
          description: skill.description,
          author: String(author),
          triggers: skill.tags,
          tags: skill.tags,
          homepage: typeof homepage === "string" ? homepage : null,
          category: String(category2),
          icon: skill.source === "github" ? "🐙" : skill.source === "official" || skill.trust_level === "builtin" ? "✅" : skill.source === "skills-sh" ? "📦" : skill.source === "lobehub" ? "🧊" : skill.source === "claude-marketplace" ? "🤖" : "🧩",
          content: [
            skill.description,
            skill.identifier ? `Identifier: ${skill.identifier}` : "",
            skill.trust_level ? `Trust: ${skill.trust_level}` : ""
          ].filter(Boolean).join("\n\n"),
          fileCount: 0,
          sourcePath: skill.identifier || (typeof homepage === "string" ? homepage : "") || skill.source,
          installed: skill.installed,
          enabled: skill.installed,
          featuredGroup: void 0,
          security: {
            level: skill.trust_level === "builtin" ? "safe" : skill.trust_level === "trusted" ? "safe" : "medium",
            flags: [],
            score: 0
          },
          origin: "marketplace"
        };
      });
    },
    [hubQuery.data?.results]
  );
  async function copyCommandAndToast(command, message) {
    try {
      await writeTextToClipboard(command);
      toast(`${message} Copied: ${command}`, {
        type: "warning",
        icon: "📋"
      });
    } catch {
      toast(`${message} ${command}`, {
        type: "warning",
        icon: "📋",
        duration: 7e3
      });
    }
  }
  async function runSkillAction(action, payload) {
    setActionError(null);
    setActionSkillId(payload.skillId);
    if (action !== "toggle" && !isOnActiveProfile) {
      setActionError(
        `Install/uninstall is only available on the active profile. Switch the profile dropdown to "${activeProfileName || "default"}" to manage installs.`
      );
      setActionSkillId(null);
      return;
    }
    try {
      const routeProfileToggle = action === "toggle" && !isOnActiveProfile && Boolean(effectiveProfile);
      const endpoint = routeProfileToggle ? "/api/profiles/toggle-skill" : action === "install" ? "/api/skills/install" : action === "uninstall" ? "/api/skills/uninstall" : "/api/skills/toggle";
      const response = await fetch(endpoint, {
        method: routeProfileToggle ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          routeProfileToggle ? {
            profile: effectiveProfile,
            name: payload.skillId,
            enabled: payload.enabled
          } : {
            action,
            skillId: payload.skillId,
            name: payload.skillId,
            identifier: payload.skillId,
            enabled: payload.enabled,
            source: payload.source
          }
        )
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Action failed");
      }
      if ((action === "install" || action === "uninstall") && data.ok === false) {
        if (data.command) {
          await copyCommandAndToast(
            data.command,
            data.error || "Gateway action unavailable."
          );
          return;
        }
        throw new Error(data.error || "Action failed");
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["skills-browser"] }),
        queryClient.invalidateQueries({ queryKey: ["skills-hub-search"] })
      ]);
      setSelectedSkill(function updateSelectedSkill(current) {
        if (!current || current.id !== payload.skillId) return current;
        if (action === "install") {
          return {
            ...current,
            installed: true,
            enabled: true
          };
        }
        if (action === "uninstall") {
          return {
            ...current,
            installed: false,
            enabled: false
          };
        }
        return {
          ...current,
          enabled: payload.enabled ?? current.enabled
        };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setActionError(errorMessage);
      toast(errorMessage, { type: "error", icon: "❌" });
    } finally {
      setActionSkillId(null);
    }
  }
  function handleTabChange(nextTab) {
    const parsedTab = nextTab === "installed" || nextTab === "marketplace" || nextTab === "featured" ? nextTab : "installed";
    setTab(parsedTab);
    setPage(1);
    if (parsedTab !== "marketplace") {
      setCategory("All");
      setSort("name");
    }
  }
  function handleSearchChange(value) {
    setSearchInput(value);
    setPage(1);
  }
  function handleCategoryChange(value) {
    setCategory(value);
    setPage(1);
  }
  function handleOriginChange(value) {
    setOrigin(value);
    setPage(1);
  }
  function handleSortChange(value) {
    setSort(value);
    setPage(1);
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-full overflow-y-auto bg-surface text-ink", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-4 py-6 pb-[calc(var(--tabbar-h,80px)+1.5rem)] sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("header", { className: "rounded-2xl border border-primary-200 bg-primary-50/85 p-4 backdrop-blur-xl", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center justify-between gap-3", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase text-primary-500 tabular-nums", children: "Hermes Workspace Marketplace" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-medium text-ink text-balance sm:text-3xl", children: "Skills Browser" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-primary-500 text-pretty sm:text-base", children: "Discover, install, and manage skills across your local workspace and Skills Hub." })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "rounded-2xl border border-primary-200 bg-primary-50/80 p-3 backdrop-blur-xl sm:p-4", children: /* @__PURE__ */ jsxs(Tabs, { value: tab, onValueChange: handleTabChange, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          profiles.length > 1 ? /* @__PURE__ */ jsxs("label", { className: "flex h-9 items-center gap-2 rounded-lg border border-primary-200 bg-primary-100/60 px-3 text-xs text-primary-500", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium uppercase tracking-wider text-[10px]", children: "Profile" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: effectiveProfile,
                onChange: (event) => {
                  setSelectedProfile(event.target.value);
                  setPage(1);
                },
                className: "h-7 rounded-md border border-primary-200 bg-primary-50/70 px-2 text-xs text-ink outline-none",
                "aria-label": "Profile",
                children: profiles.map((profile) => /* @__PURE__ */ jsx("option", { value: profile.name, children: profile.name === activeProfileName ? `${profile.name} (active)` : profile.name }, profile.name))
              }
            )
          ] }) : null,
          /* @__PURE__ */ jsx(
            "input",
            {
              value: searchInput,
              onChange: (event) => handleSearchChange(event.target.value),
              placeholder: tab === "marketplace" ? "Search Skills Hub, GitHub, and local fallback" : "Search by name, tags, or description",
              className: "h-9 w-full min-w-0 flex-1 rounded-lg border border-primary-200 bg-primary-100/60 px-3 text-sm text-ink outline-none transition-colors focus:border-primary sm:min-w-[220px]"
            }
          ),
          tab === "installed" ? /* @__PURE__ */ jsx(
            "select",
            {
              value: category,
              onChange: (event) => handleCategoryChange(event.target.value),
              className: "h-9 rounded-lg border border-primary-200 bg-primary-100/60 px-3 text-sm text-ink outline-none",
              children: categories.map((item) => /* @__PURE__ */ jsx("option", { value: item, children: item }, item))
            }
          ) : null,
          tab === "installed" && isOnActiveProfile ? /* @__PURE__ */ jsxs(
            "select",
            {
              value: origin,
              onChange: (event) => handleOriginChange(event.target.value),
              className: "h-9 rounded-lg border border-primary-200 bg-primary-100/60 px-3 text-sm text-ink outline-none",
              children: [
                /* @__PURE__ */ jsx("option", { value: "All", children: "All Origins" }),
                /* @__PURE__ */ jsx("option", { value: "builtin", children: "Built-in" }),
                /* @__PURE__ */ jsx("option", { value: "agent-created", children: "Agent-created" }),
                /* @__PURE__ */ jsx("option", { value: "marketplace", children: "Marketplace" })
              ]
            }
          ) : null,
          tab === "installed" ? /* @__PURE__ */ jsxs(
            "select",
            {
              value: sort,
              onChange: (event) => handleSortChange(
                event.target.value === "category" ? "category" : "name"
              ),
              className: "h-9 rounded-lg border border-primary-200 bg-primary-100/60 px-3 text-sm text-ink outline-none",
              children: [
                /* @__PURE__ */ jsx("option", { value: "name", children: "Name A-Z" }),
                /* @__PURE__ */ jsx("option", { value: "category", children: "Category" })
              ]
            }
          ) : null,
          /* @__PURE__ */ jsxs(
            TabsList,
            {
              className: "ml-auto rounded-xl border border-primary-200 bg-primary-100/60 p-1",
              variant: "default",
              children: [
                /* @__PURE__ */ jsx(TabsTab, { value: "installed", className: "min-w-[110px]", children: "Installed" }),
                isOnActiveProfile ? /* @__PURE__ */ jsx(TabsTab, { value: "marketplace", className: "min-w-[120px]", children: "Marketplace" }) : null
              ]
            }
          )
        ] }),
        actionError ? /* @__PURE__ */ jsx("p", { className: "rounded-lg border border-primary-200 bg-primary-100/60 px-3 py-2 text-sm text-ink", children: actionError }) : null,
        /* @__PURE__ */ jsx(TabsPanel, { value: "installed", className: "pt-2", children: /* @__PURE__ */ jsx(
          SkillsGrid,
          {
            skills,
            loading: skillsQuery.isPending,
            actionSkillId,
            tab: "installed",
            onOpenDetails: setSelectedSkill,
            onInstall: (skillId) => runSkillAction("install", { skillId }),
            onUninstall: (skillId) => runSkillAction("uninstall", { skillId }),
            onToggle: (skillId, enabled) => runSkillAction("toggle", { skillId, enabled })
          }
        ) }),
        /* @__PURE__ */ jsxs(TabsPanel, { value: "marketplace", className: "space-y-3 pt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-2", children: hubQuery.data?.source ? /* @__PURE__ */ jsxs("div", { className: "text-xs text-primary-500", children: [
            "Source: ",
            hubQuery.data.source
          ] }) : /* @__PURE__ */ jsx("div", {}) }),
          hubQuery.error ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: hubQuery.error instanceof Error ? hubQuery.error.message : "Failed to load marketplace skills." }) : hubQuery.data && (hubQuery.data.source === "installed-fallback" || hubQuery.data.source === "error") ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200", children: "Skills Hub search unavailable — showing installed skills instead. Ensure the Hermes Agent gateway is running." }) : null,
          /* @__PURE__ */ jsx(
            SkillsGrid,
            {
              skills: marketplaceSkills,
              loading: hubQuery.isPending,
              actionSkillId,
              tab: "marketplace",
              emptyState: {
                title: searchInput.trim() ? "No hub skills found" : "Search the Skills Hub",
                description: searchInput.trim() ? "Try a different search term. If Skills Hub is unavailable, local installed skills are used as fallback." : "Start typing to search Skills Hub and other skill sources."
              },
              onOpenDetails: setSelectedSkill,
              onInstall: (skillId) => {
                const skill = hubQuery.data?.results.find(
                  (entry) => entry.id === skillId
                );
                runSkillAction("install", {
                  skillId,
                  source: skill?.source
                });
              },
              onUninstall: (skillId) => runSkillAction("uninstall", { skillId }),
              onToggle: (skillId, enabled) => runSkillAction("toggle", { skillId, enabled })
            }
          )
        ] })
      ] }) }),
      tab !== "marketplace" ? /* @__PURE__ */ jsxs("footer", { className: "flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50/80 px-3 py-2.5 text-sm text-primary-500 tabular-nums", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          (skillsQuery.data?.total || 0).toLocaleString(),
          " total skills"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: page <= 1 || skillsQuery.isPending,
              onClick: () => setPage((current) => Math.max(1, current - 1)),
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "min-w-[82px] text-center", children: [
            page,
            " / ",
            totalPages
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: page >= totalPages || skillsQuery.isPending,
              onClick: () => setPage((current) => Math.min(totalPages, current + 1)),
              children: "Next"
            }
          )
        ] })
      ] }) : null
    ] }),
    /* @__PURE__ */ jsx(
      DialogRoot,
      {
        open: Boolean(selectedSkill),
        onOpenChange: (open) => {
          if (!open) {
            setSelectedSkill(null);
          }
        },
        children: /* @__PURE__ */ jsx(DialogContent, { className: "w-[min(960px,95vw)] border-primary-200 bg-primary-50/95 backdrop-blur-sm", children: selectedSkill ? /* @__PURE__ */ jsxs("div", { className: "flex max-h-[85vh] flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "border-b border-primary-200 px-5 py-4", children: [
            /* @__PURE__ */ jsxs(DialogTitle, { className: "text-balance", children: [
              selectedSkill.icon,
              " ",
              selectedSkill.name
            ] }),
            /* @__PURE__ */ jsxs(DialogDescription, { className: "mt-1 text-pretty", children: [
              "by ",
              selectedSkill.author,
              " • ",
              selectedSkill.category,
              " •",
              " ",
              selectedSkill.fileCount.toLocaleString(),
              " files"
            ] }),
            selectedSkill.security && /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-xl border border-primary-200 bg-primary-50/80 overflow-hidden", children: /* @__PURE__ */ jsx(
              SecurityBadge,
              {
                security: selectedSkill.security,
                compact: false
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs(ScrollAreaRoot, { className: "h-[56vh]", children: [
            /* @__PURE__ */ jsx(ScrollAreaViewport, { className: "px-5 py-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              selectedSkill.homepage ? /* @__PURE__ */ jsxs("p", { className: "text-sm text-primary-500 text-pretty", children: [
                "Homepage:",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: selectedSkill.homepage,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "underline decoration-border underline-offset-4 hover:decoration-primary",
                    children: selectedSkill.homepage
                  }
                )
              ] }) : null,
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: selectedSkill.triggers.length > 0 ? selectedSkill.triggers.slice(0, 8).map((trigger) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "rounded-md border border-primary-200 bg-primary-100/50 px-2 py-0.5 text-xs text-primary-500",
                  children: trigger
                },
                trigger
              )) : /* @__PURE__ */ jsx("span", { className: "rounded-md border border-primary-200 bg-primary-100/50 px-2 py-0.5 text-xs text-primary-500", children: "No triggers listed" }) }),
              /* @__PURE__ */ jsx("article", { className: "rounded-xl border border-primary-200 bg-primary-100/30 p-4 backdrop-blur-sm", children: /* @__PURE__ */ jsx(Markdown, { children: selectedSkill.content || `# ${selectedSkill.name}

${selectedSkill.description}` }) })
            ] }) }),
            /* @__PURE__ */ jsx(ScrollAreaScrollbar, { children: /* @__PURE__ */ jsx(ScrollAreaThumb, {}) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-t border-primary-200 px-5 py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              selectedSkill.origin ? /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "rounded-md border px-2 py-0.5 text-xs tabular-nums",
                    selectedSkill.origin === "builtin" && "border-primary-200 bg-primary-100/60 text-primary-500",
                    selectedSkill.origin === "agent-created" && "border-amber-300/70 bg-amber-100/60 text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/30 dark:text-amber-200",
                    selectedSkill.origin === "marketplace" && "border-emerald-300/70 bg-emerald-100/60 text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-900/30 dark:text-emerald-200"
                  ),
                  children: selectedSkill.origin === "builtin" ? "Built-in" : selectedSkill.origin === "agent-created" ? "Agent-created" : "Marketplace"
                }
              ) : null,
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-primary-500 text-pretty", children: [
                "Source:",
                " ",
                /* @__PURE__ */ jsx("code", { className: "inline-code", children: selectedSkill.sourcePath })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              selectedSkill.installed ? /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  disabled: actionSkillId === selectedSkill.id,
                  onClick: () => {
                    runSkillAction("uninstall", {
                      skillId: selectedSkill.id
                    });
                  },
                  children: "Uninstall"
                }
              ) : /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  disabled: actionSkillId === selectedSkill.id,
                  onClick: () => runSkillAction("install", { skillId: selectedSkill.id }),
                  children: "Install"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setSelectedSkill(null),
                  children: "Close"
                }
              )
            ] })
          ] })
        ] }) : null })
      }
    )
  ] });
}
const SECURITY_BADGE = {
  safe: {
    label: "Benign",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    confidence: "HIGH CONFIDENCE"
  },
  low: {
    label: "Benign",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    confidence: "MODERATE"
  },
  medium: {
    label: "Caution",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    confidence: "REVIEW RECOMMENDED"
  },
  high: {
    label: "Warning",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
    confidence: "MANUAL REVIEW"
  }
};
function SecurityBadge({
  security,
  compact = true
}) {
  if (!security) return null;
  const config = SECURITY_BADGE[security.level];
  if (!config) return null;
  const [expanded, setExpanded] = useState(false);
  if (compact) {
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: cn(
            "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors",
            config.badgeClass
          ),
          onMouseEnter: () => setExpanded(true),
          onMouseLeave: () => setExpanded(false),
          onClick: (e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          },
          children: config.label
        }
      ),
      expanded && /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute left-0 bottom-[calc(100%+6px)] z-50 w-72 overflow-hidden rounded-xl border border-primary-200 p-0 shadow-xl",
          style: { backgroundColor: "var(--color-primary-50)" },
          children: /* @__PURE__ */ jsx(SecurityScanCard, { security })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx(SecurityScanCard, { security });
}
function SecurityScanCard({ security }) {
  const [showDetails, setShowDetails] = useState(false);
  const config = SECURITY_BADGE[security.level];
  if (!config) return null;
  const summaryText = security.flags.length === 0 ? "No risky patterns detected. This skill appears safe to install." : security.level === "high" ? `Found ${security.flags.length} potential security concern${security.flags.length !== 1 ? "s" : ""}. Review before installing.` : `The skill's code was scanned for common risk patterns. ${security.flags.length} item${security.flags.length !== 1 ? "s" : ""} noted.`;
  return /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-3 pt-3 pb-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary-400 mb-2", children: "Security Scan" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-primary-500 font-medium w-16 shrink-0", children: "Hermes Workspace" }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
              config.badgeClass
            ),
            children: config.label
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] text-primary-400 uppercase tracking-wide font-medium", children: config.confidence })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-3 pb-2", children: /* @__PURE__ */ jsx("p", { className: "text-primary-500 text-pretty leading-relaxed", children: summaryText }) }),
    security.flags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "border-t border-primary-100", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.stopPropagation();
            setShowDetails((v) => !v);
          },
          className: "flex w-full items-center justify-between px-3 py-2 text-accent-500 hover:text-accent-600 transition-colors",
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium", children: "Details" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px]", children: showDetails ? "▲" : "▼" })
          ]
        }
      ),
      showDetails && /* @__PURE__ */ jsx("div", { className: "px-3 pb-3 space-y-1", children: security.flags.map((flag) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-start gap-2 text-primary-600",
          children: [
            /* @__PURE__ */ jsx("span", { className: "mt-0.5 text-[9px] text-primary-400", children: "●" }),
            /* @__PURE__ */ jsx("span", { children: flag })
          ]
        },
        flag
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-primary-100 px-3 py-2", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] text-primary-400 italic", children: "Like a lobster shell, security has layers — review code before you run it." }) })
  ] });
}
function SkillsGrid({
  skills,
  loading,
  actionSkillId,
  tab,
  emptyState,
  onOpenDetails,
  onInstall,
  onUninstall,
  onToggle
}) {
  if (loading) {
    return /* @__PURE__ */ jsx(SkillsSkeleton, { count: tab === "installed" ? 6 : 9 });
  }
  if (skills.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-dashed border-primary-200 bg-primary-100/40 px-4 py-8 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary-700", children: emptyState?.title || "No skills found" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-primary-500 text-pretty max-w-sm mx-auto", children: emptyState?.description || "Try adjusting your filters or search term" })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3", children: /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: skills.map((skill) => {
    const isActing = actionSkillId === skill.id;
    return /* @__PURE__ */ jsxs(
      motion.article,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.18 },
        className: "relative z-0 flex min-h-[220px] flex-col rounded-2xl border border-primary-200 bg-primary-50/85 p-4 shadow-sm backdrop-blur-sm hover:z-20 focus-within:z-20",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xl leading-none", children: skill.icon }),
                /* @__PURE__ */ jsx("h3", { className: "line-clamp-1 min-w-0 text-base font-medium text-ink text-balance", children: skill.name })
              ] }),
              skill.author ? /* @__PURE__ */ jsxs("p", { className: "line-clamp-1 text-xs text-primary-500", children: [
                "by ",
                skill.author
              ] }) : null
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-shrink-0 flex-wrap items-center gap-1.5", children: [
              skill.origin ? /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "rounded-md border px-2 py-0.5 text-xs tabular-nums",
                    skill.origin === "builtin" && "border-primary-200 bg-primary-100/60 text-primary-500",
                    skill.origin === "agent-created" && "border-amber-300/70 bg-amber-100/60 text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/30 dark:text-amber-200",
                    skill.origin === "marketplace" && "border-emerald-300/70 bg-emerald-100/60 text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-900/30 dark:text-emerald-200"
                  ),
                  children: skill.origin === "builtin" ? "Built-in" : skill.origin === "agent-created" ? "Agent-created" : "Marketplace"
                }
              ) : null,
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "rounded-md border px-2 py-0.5 text-xs tabular-nums",
                    skill.installed ? "border-primary/40 bg-primary/15 text-primary" : "border-primary-200 bg-primary-100/60 text-primary-500"
                  ),
                  children: skill.installed ? "Installed" : "Available"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "line-clamp-3 min-h-[58px] text-sm text-primary-500 text-pretty", children: skill.description }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(SecurityBadge, { security: skill.security }),
            /* @__PURE__ */ jsx("span", { className: "rounded-md border border-primary-200 bg-primary-100/50 px-2 py-0.5 text-xs text-primary-500", children: skill.category }),
            skill.triggers.slice(0, 2).map((trigger) => /* @__PURE__ */ jsx(
              "span",
              {
                className: "rounded-md border border-primary-200 bg-primary-100/50 px-2 py-0.5 text-xs text-primary-500",
                children: trigger
              },
              `${skill.id}-${trigger}`
            ))
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center justify-between gap-2 pt-3", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => onOpenDetails(skill),
                children: "Details"
              }
            ),
            tab === "installed" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-primary-500", children: [
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    checked: skill.enabled,
                    disabled: isActing,
                    onCheckedChange: (checked) => onToggle(skill.id, checked),
                    "aria-label": `Toggle ${skill.name}`
                  }
                ),
                skill.enabled ? "Enabled" : "Disabled"
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  disabled: isActing,
                  onClick: () => onUninstall(skill.id),
                  children: "Uninstall"
                }
              )
            ] }) : skill.installed ? /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: isActing,
                onClick: () => onUninstall(skill.id),
                children: "Uninstall"
              }
            ) : /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                disabled: isActing,
                onClick: () => onInstall(skill.id),
                children: "Install"
              }
            )
          ] })
        ]
      },
      `${tab}-${skill.id}`
    );
  }) }) });
}
function SkillsSkeleton({
  count,
  large = false
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "grid gap-3",
        large ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      ),
      children: Array.from({ length: count }).map((_, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn(
            "animate-pulse rounded-2xl border border-primary-200 bg-primary-50/70 p-4",
            large ? "min-h-[120px]" : "min-h-[100px]"
          ),
          children: [
            /* @__PURE__ */ jsx("div", { className: "mb-3 h-5 w-2/5 rounded-md bg-primary-100" }),
            /* @__PURE__ */ jsx("div", { className: "mb-2 h-4 w-3/4 rounded-md bg-primary-100" }),
            /* @__PURE__ */ jsx("div", { className: "h-4 w-1/2 rounded-md bg-primary-100" }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 h-20 rounded-xl bg-primary-100/80" }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 h-8 w-1/3 rounded-md bg-primary-100" })
          ]
        },
        index
      ))
    }
  );
}
function SkillsRoute() {
  usePageTitle("Skills");
  if (!useFeatureAvailable("skills")) {
    return /* @__PURE__ */ jsx(BackendUnavailableState, { feature: "Skills", description: getUnavailableReason("Skills") });
  }
  return /* @__PURE__ */ jsx(SkillsScreen, {});
}
export {
  SkillsRoute as component
};
