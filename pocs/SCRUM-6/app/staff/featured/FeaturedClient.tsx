"use client";

import { useEffect, useState } from "react";

export function FeaturedClient() {
  const [isbns, setIsbns] = useState("");
  const [message, setMessage] = useState("");

  async function loadFeatured() {
    const response = await fetch("/api/staff/featured");
    const data = await response.json();
    setIsbns((data.isbns ?? []).join("\n"));
  }

  useEffect(() => {
    void loadFeatured();
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const list = isbns
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);
    const response = await fetch("/api/staff/featured", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isbns: list }),
    });
    if (response.ok) {
      setMessage("Featured list updated");
      await loadFeatured();
    } else {
      const data = await response.json();
      setMessage(data.error ?? "Update failed");
    }
  }

  return (
    <section>
      <h1>Staff featured list</h1>
      <p>Enter one ISBN per line.</p>
      <form onSubmit={handleSave}>
        <label>
          Featured ISBNs
          <textarea
            rows={8}
            value={isbns}
            onChange={(event) => setIsbns(event.target.value)}
          />
        </label>
        <button type="submit">Save featured list</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
