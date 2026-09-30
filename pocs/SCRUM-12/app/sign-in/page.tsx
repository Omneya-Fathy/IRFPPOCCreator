import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { loadSessionFromCookie, registerAction, signInAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/store";

async function registerForm(formData: FormData) {
  "use server";
  const result = await registerAction(formData);
  if (result.ok) {
    redirect(result.redirectTo || "/");
  }
}

async function signInForm(formData: FormData) {
  "use server";
  const result = await signInAction(formData);
  if (result.ok) {
    redirect(result.redirectTo || "/");
  }
  return result.error;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  await loadSessionFromCookie();
  const user = getCurrentUser();
  const params = await searchParams;
  const redirectTo = params.redirect ?? "/";
  const showSignInError = params.error === "1";

  if (user) {
    redirect(redirectTo);
  }

  return (
    <AppShell user={null}>
      <PageHeader
        title="Join RecipieHub"
        description="Register or sign in with a fictional cook account to publish recipes and follow cooks."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Register</h2>
          <form action={registerForm} className="mt-4 space-y-3">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div>
              <label className="text-sm font-medium" htmlFor="reg-name">
                Display name
              </label>
              <Input id="reg-name" name="displayName" required />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="reg-email">
                Email (fictional)
              </label>
              <Input id="reg-email" name="email" type="email" required />
            </div>
            <Button type="submit">Create demo cook</Button>
          </form>
        </section>
        <section className="rounded border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Sign in</h2>
          <p className="mt-1 text-sm text-muted">
            Try{" "}
            <span className="font-mono text-xs">demo.follower@example.cook</span> or any fixture
            email.
          </p>
          <form
            action={async (formData) => {
              "use server";
              const error = await signInForm(formData);
              if (error) {
                redirect(`/sign-in?redirect=${encodeURIComponent(redirectTo)}&error=1`);
              }
            }}
            className="mt-4 space-y-3"
          >
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div>
              <label className="text-sm font-medium" htmlFor="sign-email">
                Email
              </label>
              <Input id="sign-email" name="email" type="email" required />
            </div>
            <Button type="submit">Sign in</Button>
          </form>
          {showSignInError ? (
            <Alert tone="error" className="mt-3">
              No cook found with that email. Register first.
            </Alert>
          ) : null}
        </section>
      </div>
      <p className="mt-6 text-sm text-muted">
        <Link href="/" className="underline">
          Back to feed
        </Link>
      </p>
    </AppShell>
  );
}
