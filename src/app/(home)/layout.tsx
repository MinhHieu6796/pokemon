import { fetchTypes } from "@/api/pokemon";
import TypeFilter from "@/components/TypeFilter";
import Header from "@/components/Header";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const typesData = await fetchTypes();
  const availableTypes = typesData.results.map((type: { name: string }) => type.name);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/70">
                Filter by Type
              </h2>
            </div>
            <TypeFilter types={availableTypes} />
          </section>

          {children}
        </div>
      </main>
    </>
  );
}
