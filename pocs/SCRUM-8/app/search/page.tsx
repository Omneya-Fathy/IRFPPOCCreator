import { SearchClient } from "@/components/search-client";
import { PageHeader } from "@/components/ui/page-header";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Search" description="Find recipes by title or by what is in your pantry." />
      <SearchClient />
    </div>
  );
}
