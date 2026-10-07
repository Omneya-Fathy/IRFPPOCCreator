"use client";

import { Button } from "@/components/ui/button";
import { useFollowState } from "@/lib/store-sync";

export function CookFollowButton({ cookId }: { cookId: string }) {
  const { following, toggle } = useFollowState(cookId);

  return (
    <Button type="button" variant="primary" onClick={toggle}>
      {following ? "Unfollow" : "Follow"}
    </Button>
  );
}
