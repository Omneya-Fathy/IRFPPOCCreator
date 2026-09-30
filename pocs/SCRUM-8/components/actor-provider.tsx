"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getActiveActorId,
  getDefaultActorId,
  listDemoActors,
  setActiveActorId as setStoreActorId,
} from "@/lib/store";
import type { DemoActor } from "@/lib/types";

type ActorContextValue = {
  actor: DemoActor;
  actors: DemoActor[];
  setActorId: (id: string) => void;
};

const ActorContext = createContext<ActorContextValue | null>(null);

export function ActorProvider({ children }: { children: ReactNode }) {
  const [actorId, setActorIdState] = useState(() => {
    const id = getActiveActorId() || getDefaultActorId();
    setStoreActorId(id);
    return id;
  });

  const setActorId = useCallback((id: string) => {
    const next = setStoreActorId(id);
    if (next) setActorIdState(next.id);
  }, []);

  const value = useMemo(() => {
    const actors = listDemoActors();
    const actor = actors.find((a) => a.id === actorId) ?? actors[0];
    return { actor, actors, setActorId };
  }, [actorId, setActorId]);

  return <ActorContext.Provider value={value}>{children}</ActorContext.Provider>;
}

export function useActor() {
  const ctx = useContext(ActorContext);
  if (!ctx) throw new Error("useActor must be used within ActorProvider");
  return ctx;
}
