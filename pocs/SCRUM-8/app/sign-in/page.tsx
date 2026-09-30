import { SignInPersonaPicker } from "@/components/sign-in-persona";
import { PageHeader } from "@/components/ui/page-header";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <PageHeader
        title="Switch demo cook"
        description="Optional persona picker — the app works without visiting this page. Choose who publishes and follows."
      />
      <SignInPersonaPicker />
    </div>
  );
}
