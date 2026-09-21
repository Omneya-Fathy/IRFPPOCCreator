import { StorefrontHeader } from "../../components/layout/StorefrontHeader";
import { SearchResultsSection } from "../../components/SearchResultsSection";
import { SearchForm } from "../../components/SearchForm";
import { PageHeader } from "../../components/ui/PageHeader";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;

  return (
    <>
      <StorefrontHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <PageHeader
          title="Search"
          description="Find books by title or ISBN."
        />
        <div className="mb-6">
          <SearchForm initialQuery={q} />
        </div>
        <SearchResultsSection query={q} />
      </main>
    </>
  );
}
