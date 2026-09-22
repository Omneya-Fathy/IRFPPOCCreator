import { BookDetailView } from "../../../components/BookDetailView";
import { StorefrontHeader } from "../../../components/layout/StorefrontHeader";

type BookPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;

  return (
    <>
      <StorefrontHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <BookDetailView bookId={id} />
      </main>
    </>
  );
}
