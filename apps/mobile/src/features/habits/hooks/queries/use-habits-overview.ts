import { useAuth } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../../data/query-keys";
import { habitsApi } from "../../api/habits-api";

export function useHabitsOverview() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.habits,
    queryFn: async () => habitsApi.listHabits(await getToken()),
    enabled: isLoaded && !!isSignedIn,
  });
}
