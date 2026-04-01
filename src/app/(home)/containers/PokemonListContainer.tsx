import { Suspense } from "react";
import { getPokemonPage } from "@/api/pokemon";
import PokemonGrid from "@/components/PokemonGrid";
import Pagination from "@/components/Pagination";
import { ITEMS_PER_PAGE } from "@/utils/constants";
import { PaginationInfo } from "@/types/pokemon";

interface PokemonListContainerProps {
  page: number;
  types: string[];
}

export default async function PokemonListContainer({
  page,
  types,
}: PokemonListContainerProps) {
  const initialData = await getPokemonPage(page, ITEMS_PER_PAGE, types);

  const totalPages = Math.ceil(initialData.totalItems / ITEMS_PER_PAGE);

  const paginationInfo: PaginationInfo = {
    currentPage: page,
    totalPages,
    totalItems: initialData.totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
  };

  return (
    <>
      <section className="relative min-h-[400px]">
        {initialData.pokemon.length > 0 ? (
          <PokemonGrid pokemon={initialData.pokemon} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-white/40 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white/70">No Pokémon found</h3>
            <p className="text-sm text-white/40 mt-2">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        )}
      </section>

      <Suspense fallback={null}>
        <Pagination pagination={paginationInfo} />
      </Suspense>
    </>
  );
}
