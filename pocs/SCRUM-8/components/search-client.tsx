"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { searchRecipes, type SearchMode } from "@/lib/store";
import { getCook } from "@/lib/store";

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("all");

  const results = useMemo(() => searchRecipes(query, mode), [query, mode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium" htmlFor="q">Query</label>
          <Input
            id="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. salmon, focaccia, mole"
          />
        </div>
        <fieldset className="text-sm">
          <legend className="mb-1 font-medium">Search in</legend>
          <div className="flex flex-wrap gap-3">
            {(
              [
                ["all", "Title or ingredient"],
                ["title", "Title only"],
                ["ingredient", "Ingredient only"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {query.trim() ? (
        <ul className="space-y-3" data-testid="search-results">
          {results.length === 0 ? (
            <li className="text-sm text-muted">No recipes matched.</li>
          ) : (
            results.map((recipe) => {
              const cook = getCook(recipe.authorId);
              return (
                <li key={recipe.id} className="rounded-lg border border-border bg-card px-4 py-3">
                  <Link href={`/recipes/${recipe.id}`} className="font-serif text-lg font-semibold hover:text-primary">
                    {recipe.title}
                  </Link>
                  {cook ? <p className="text-sm text-muted">{cook.name}</p> : null}
                </li>
              );
            })
          )}
        </ul>
      ) : (
        <p className="text-sm text-muted">Type to search the in-memory recipe collection.</p>
      )}
    </div>
  );
}
