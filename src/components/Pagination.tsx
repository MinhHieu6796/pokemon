"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PaginationInfo } from "@/types/pokemon";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
  pagination: PaginationInfo;
}

export default function Pagination({ pagination }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages || page === pagination.currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
    router.push(`${pathname}?${params.toString()}`);
  };

  if (pagination.totalPages <= 1) return null;

  const getVisiblePages = () => {
    const { currentPage, totalPages } = pagination;
    const delta = 2;
    const range: number[] = [];
    
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1);
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-1);
    }

    range.unshift(1);
    range.push(totalPages);

    return range;
  };

  const pages = getVisiblePages();

  return (
    <div className="relative flex items-center justify-center gap-2 py-8 mt-4 border-t border-white/10">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={`
            flex items-center justify-center w-10 h-10 rounded-xl
            border border-white/10 shadow-lg backdrop-blur-md
            transition-all duration-300
            ${pagination.currentPage === 1
              ? "bg-white/5 text-white/20 cursor-not-allowed"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white active:scale-95"
            }
          `}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {pages.map((page, index) => {
            if (page === -1) {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-white/30">
                  ...
                </span>
              );
            }

            const isCurrent = page === pagination.currentPage;

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-xl
                  font-medium text-sm transition-all duration-300
                  border shadow-lg backdrop-blur-md
                  ${isCurrent
                    ? "bg-linear-to-br from-blue-500 to-purple-600 text-white border-transparent scale-110 shadow-blue-500/20"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/20 hover:text-white active:scale-95"
                  }
                `}
              >
                <span className={isCurrent ? "drop-shadow-md" : ""}>
                  {page}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className={`
            flex items-center justify-center w-10 h-10 rounded-xl
            border border-white/10 shadow-lg backdrop-blur-md
            transition-all duration-300
            ${pagination.currentPage === pagination.totalPages
              ? "bg-white/5 text-white/20 cursor-not-allowed"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white active:scale-95"
            }
          `}
          aria-label="Next page"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute right-0 text-sm text-white/40 hidden sm:block">
        Total: <span className="text-white/70 font-medium">{pagination.totalItems}</span>
      </div>
    </div>
  );
}
