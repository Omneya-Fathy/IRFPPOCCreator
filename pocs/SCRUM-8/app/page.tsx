import { HomeFeed } from "@/components/home-feed";
import { PageHeader } from "@/components/ui/page-header";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="From cooks you follow"
        description="New recipes land here first — open one to cook step by step."
      />
      <HomeFeed />
    </div>
  );
}
