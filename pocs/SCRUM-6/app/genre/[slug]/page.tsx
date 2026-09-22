import { notFound } from "next/navigation";
import { GenreBooksSection } from "../../../components/GenreBooksSection";
import { StorefrontHeader } from "../../../components/layout/StorefrontHeader";
import { PageHeader } from "../../../components/ui/PageHeader";
import { getGenreBySlug } from "../../../lib/store";

type GenrePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GenrePage({ params }: GenrePageProps) {
  const { slug } = await params;
  const genre = getGenreBySlug(slug);

  if (!genre) {
    notFound();
  }

  return (
    <>
      <StorefrontHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <PageHeader
          title={genre.name}
          description="Browse titles in this genre. Availability reflects combined stock across Hawthorne and Cedar."
        />
        <GenreBooksSection
          slug={slug}
          emptyMessage={`No titles found in ${genre.name}.`}
        />
      </main>
    </>
  );
}
