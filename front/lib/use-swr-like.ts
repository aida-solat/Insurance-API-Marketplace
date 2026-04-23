"use client";

import { useCallback, useEffect, useState } from "react";

export interface AsyncState<T> {
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
  refresh: () => Promise<void>;
}

export default function useSWRLike<T>(
  key: unknown[],
  fetcher: () => Promise<T>,
): AsyncState<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const value = await fetcher();
      setData(value);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(key)]);

  useEffect(() => {
    run();
  }, [run]);

  return { data, error, loading, refresh: run };
}
