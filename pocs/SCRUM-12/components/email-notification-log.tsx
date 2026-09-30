import { Alert } from "@/components/ui/alert";
import { getEmailNotifications } from "@/lib/store";

export function EmailNotificationLog() {
  const entries = getEmailNotifications().slice(-8).reverse();
  if (entries.length === 0) return null;

  return (
    <section className="mt-10 rounded border border-border bg-card p-4" aria-label="Demo email notifications">
      <h2 className="font-display text-lg font-semibold">Demo email log</h2>
      <p className="mt-1 text-sm text-muted">
        Fictional follower addresses notified when a followed cook publishes (no mail sent).
      </p>
      <ul className="mt-4 space-y-2">
        {entries.map((entry) => (
          <li key={entry.id} className="text-sm">
            <span className="text-foreground">{entry.followerEmail}</span>
            <span className="text-muted"> — notified about </span>
            <span className="font-medium">{entry.recipeTitle}</span>
          </li>
        ))}
      </ul>
      <Alert tone="info" className="mt-4">
        This panel is for demo purposes only; RecipieHub does not send real mail in the POC.
      </Alert>
    </section>
  );
}
