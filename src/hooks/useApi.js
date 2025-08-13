import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../lib/http/axios";
import { normalizeError } from "../lib/http/utils";

export function useApiQuery(key, req, options = {}) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await http.request(req);
      return res.data;
    },
    ...options,
  });
}

export function useApiMutation(reqBuilder, options = {}) {
  return useMutation({
    mutationFn: async (vars) => {
      try {
        const res = await http.request(reqBuilder(vars));
        return res.data;
      } catch (e) {
        throw normalizeError(e);
      }
    },
    ...options,
  });
}