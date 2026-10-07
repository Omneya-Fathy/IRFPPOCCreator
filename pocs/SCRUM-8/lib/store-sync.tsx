"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  dismissNotification,
  getFeedRecipes,
  getNotifications,
  getRecipe,
  getRecipesByAuthor,
  isFollowing,
  listRecipes,
  subscribeStore,
  toggleFollow,

} from "./store";
import type { EmailNotification, Recipe } from "./types";
import { useActor } from "@/components/actor-provider";

export function useFeedRecipes(): Recipe[] {
  const { actor } = useActor();
  const [items, setItems] = useState<Recipe[]>(() => getFeedRecipes(actor.id));

  useEffect(() => {
    const sync = () => setItems(getFeedRecipes(actor.id));
    sync();
    return subscribeStore(sync);
  }, [actor.id]);

  return items;
}

export function useCookRecipes(cookId: string): Recipe[] {
  const [items, setItems] = useState<Recipe[]>(() => getRecipesByAuthor(cookId));
  const { actor } = useActor();

  useEffect(() => {
    const sync = () => setItems(getRecipesByAuthor(cookId));
    sync();
    return subscribeStore(sync);
  }, [cookId, actor.id]);

  return items;
}

export function useFollowState(cookId: string) {
  const { actor } = useActor();
  const [following, setFollowing] = useState(() => isFollowing(actor.id, cookId));

  useEffect(() => {
    setFollowing(isFollowing(actor.id, cookId));
  }, [actor.id, cookId]);

  const toggle = () => {
    const next = toggleFollow(actor.id, cookId);
    setFollowing(next);
  };

  return { following, toggle };
}

export function useNotifications(): {
  items: EmailNotification[];
  dismiss: (id: string) => void;
} {
  const { actor } = useActor();
  const [items, setItems] = useState(() => getNotifications(actor.id));

  useEffect(() => {
    const sync = () => setItems(getNotifications(actor.id));
    sync();
    return subscribeStore(sync);
  }, [actor.id]);

  const dismiss = (id: string) => {
    dismissNotification(id, actor.id);
    setItems(getNotifications(actor.id));
  };

  return { items, dismiss };
}

export function StoreRefreshBoundary({ children }: { children: ReactNode }) {
  const { actor } = useActor();
  const [, bump] = useState(0);

  useEffect(() => {
    bump((n) => n + 1);
  }, [actor.id]);

  return <>{children}</>;
}

export function refreshRecipesList(): Recipe[] {
  return listRecipes();
}

export function loadRecipe(id: string) {
  return getRecipe(id);
}
