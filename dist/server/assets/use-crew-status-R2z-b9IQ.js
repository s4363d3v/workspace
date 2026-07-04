import { useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
function getOnlineStatus(member) {
  if (!member.profileFound) return "unknown";
  if (member.gatewayState === "unknown") return "unknown";
  if (member.gatewayState === "running" && member.processAlive) return "online";
  return "offline";
}
const QUERY_KEY = ["crew", "status"];
const POLL_INTERVAL_MS = 3e4;
async function fetchCrewStatus() {
  const res = await fetch("/api/crew-status");
  if (!res.ok) throw new Error(`Failed to fetch crew status: ${res.status}`);
  return res.json();
}
function useCrewStatus() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchCrewStatus,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    staleTime: 2e4
  });
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [queryClient]);
  return {
    crew: query.data?.crew ?? [],
    lastUpdated: query.data?.fetchedAt ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}
export {
  getOnlineStatus as g,
  useCrewStatus as u
};
