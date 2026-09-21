import { notFound } from "next/navigation";
import { AuthorBooksSection } from "../../../components/AuthorBooksSection";
import { StorefrontHeader } from "../../../components/layout/StorefrontHeader";
import { PageHeader } from "../../../components/ui/PageHeader";
import { getAuthorBySlug } from "../../../lib/store";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  return (
    <>
      <StorefrontHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <PageHeader
          title={author.name}
          description="Titles by this author with combined in-stock status."
        />
        <AuthorBooksSection
          slug={slug}
          emptyMessage={`No titles found for ${author.name}.`}
        />
      </main>
    </>
  );
}
