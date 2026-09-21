import { FeaturedBooksSection } from "../components/FeaturedBooksSection";
import { StorefrontHeader } from "../components/layout/StorefrontHeader";
import { PageHeader } from "../components/ui/PageHeader";

export default function HomePage() {
  return (
    <>
      <StorefrontHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <PageHeader
          title="Staff picks"
          description="Curated titles from our Hawthorne and Cedar booksellers — browse, search, and order for delivery."
        />
        <FeaturedBooksSection />
      </main>
    </>
  );
}
