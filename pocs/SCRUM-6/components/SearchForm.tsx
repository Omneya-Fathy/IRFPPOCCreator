"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

type SearchFormProps = {
  initialQuery?: string;
};

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
      <div className="flex-1">
        <Input
          label="Search by title or ISBN"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try Piranesi or 9781635575637"
        />
      </div>
      <div className="sm:self-end">
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}
