import { Suspense } from "react";
import PokemonListContainer from "./containers/PokemonListContainer";
import { PokemonGridSkeleton } from "@/components/PokemonCardSkeleton";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const pageParam = typeof params.page === "string" ? params.page : "1";
  const typeParam = typeof params.type === "string" ? params.type : "";
  
  const page = parseInt(pageParam, 10);
  const types = typeParam ? typeParam.split(",").filter(Boolean) : [];

  const suspenseKey = `${page}-${types.join(",")}`;

  return (
    <div className="min-h-[400px]">
      <Suspense key={suspenseKey} fallback={<PokemonGridSkeleton />}>
        <PokemonListContainer page={page} types={types} />
      </Suspense>
    </div>
  );
}
