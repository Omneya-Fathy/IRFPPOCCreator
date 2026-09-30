import { followAction, unfollowAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function FollowControls({
  cookId,
  isFollowing,
  signedIn,
}: {
  cookId: string;
  isFollowing: boolean;
  signedIn: boolean;
}) {
  if (!signedIn) {
    return (
      <p className="text-sm text-muted">Sign in to follow this cook from their profile.</p>
    );
  }

  async function toggleFollow() {
    "use server";
    if (isFollowing) {
      await unfollowAction(cookId);
    } else {
      await followAction(cookId);
    }
  }

  return (
    <form action={toggleFollow}>
      <Button type="submit" variant="primary">
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </form>
  );
}
