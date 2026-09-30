"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useActor } from "@/components/actor-provider";

export function SignInPersonaPicker() {
  const { actor, actors, setActorId } = useActor();
  const router = useRouter();

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
      <p className="text-sm text-muted">
        Active: <span className="font-medium text-foreground">{actor.name}</span>
      </p>
      <ul className="space-y-2">
        {actors.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${
                a.id === actor.id ? "border-primary bg-primary/5" : "border-border hover:bg-background"
              }`}
              onClick={() => setActorId(a.id)}
            >
              <span>
                <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-medium text-primary">
                  {a.initials}
                </span>
                {a.name}
              </span>
              {a.id === actor.id ? <span className="text-xs text-muted">Active</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="primary" className="w-full" onClick={() => router.push("/")}>
        Continue to feed
      </Button>
    </div>
  );
}
