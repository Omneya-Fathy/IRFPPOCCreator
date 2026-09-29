"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Book, StaffPickList } from "@/lib/types";

export function PicksEditor({
  lists,
  books,
}: {
  lists: StaffPickList[];
  books: Book[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(lists);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setMessage(null);
    const response = await fetch("/api/staff/picks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lists: draft }),
    });
    if (!response.ok) {
      setMessage("Could not save staff picks.");
      return;
    }
    setMessage("Staff picks saved. The home page will show these lists.");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {message && <Alert tone="success">{message}</Alert>}
      {draft.map((list, index) => (
        <div key={list.id} className="rounded border border-border bg-card p-4 shadow-sm">
          <label className="text-sm font-medium">
            List title
            <Input
              className="mt-1"
              value={list.title}
              onChange={(e) => {
                const next = [...draft];
                next[index] = { ...list, title: e.target.value };
                setDraft(next);
              }}
            />
          </label>
          <p className="mt-3 text-sm text-muted">Book ids (comma-separated)</p>
          <Input
            className="mt-1 font-mono text-xs"
            value={list.bookIds.join(", ")}
            onChange={(e) => {
              const ids = e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              const next = [...draft];
              next[index] = { ...list, bookIds: ids };
              setDraft(next);
            }}
          />
        </div>
      ))}
      <p className="text-xs text-muted">
        Available ids: {books.map((b) => b.id).join(", ")}
      </p>
      <Button type="button" onClick={save}>Save staff picks</Button>
    </div>
  );
}
