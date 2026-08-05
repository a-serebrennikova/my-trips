import { useState, useRef, useCallback, useEffect } from "react";

interface UseLikeOptions {
  initialLiked: boolean;
  debounceDelay?: number;
  onError?: (error: Error) => void;
}

interface UseLikeReturn {
  liked: boolean;
  toggleLike: () => void;
}

type LikeApiFunction = (
  state: boolean,
  signal: AbortSignal,
) => Promise<unknown>;

export function useLike(
  apiCall: LikeApiFunction,
  options: UseLikeOptions,
): UseLikeReturn {
  const { initialLiked, debounceDelay = 300, onError } = options;

  const [liked, setLiked] = useState<boolean>(initialLiked);

  const confirmedRef = useRef<boolean>(initialLiked);
  const desiredRef = useRef<boolean>(initialLiked);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const requestAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    confirmedRef.current = initialLiked;
    desiredRef.current = initialLiked;
  }, [initialLiked]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      requestAbortRef.current?.abort();
    };
  }, []);

  const performSync = useCallback(async (): Promise<void> => {
    const desiredState = desiredRef.current;

    if (desiredState === confirmedRef.current) {
      return;
    }

    requestAbortRef.current?.abort();
    const controller = new AbortController();
    requestAbortRef.current = controller;

    try {
      await apiCall(desiredState, controller.signal);
      confirmedRef.current = desiredState;
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        onError?.(error);
      }
    } finally {
      requestAbortRef.current = null;

      if (desiredRef.current !== confirmedRef.current) {
        debounceTimerRef.current = setTimeout(() => {
          performSync();
        }, debounceDelay);
      }
    }
  }, [apiCall, debounceDelay, onError]);

  const toggleLike = useCallback((): void => {
    const nextState = !desiredRef.current;
    desiredRef.current = nextState;
    setLiked(nextState);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (!requestAbortRef.current) {
      void performSync();
    } else {
      debounceTimerRef.current = setTimeout(() => {
        void performSync();
      }, debounceDelay);
    }
  }, [debounceDelay, performSync]);

  return { liked, toggleLike };
}
