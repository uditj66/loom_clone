"use client";
import { cn, generatePagination, updateURLParams } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const pathname = usePathname();
  const pages = generatePagination(currentPage, totalPages);
  const searchParams = useSearchParams();
  const router = useRouter();
  const createPageUrl = (pageNumber: number) => {
    return updateURLParams(
      searchParams,
      {
        page: pageNumber.toString(),
      },
      pathname
    );
  };

  const navigateToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    router.push(createPageUrl(pageNumber));
  };

  return (
    <section className="pagination">
      <button
        className={cn("nav-button", {
          "pointer-events-none opacity-50": currentPage === 1,
        })}
        onClick={() => navigateToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-disabled={currentPage === 1}
      >
        <Image
          src={"assets/icons/arrow-left.svg"}
          alt="left"
          width={16}
          height={16}
        />
        Previous
      </button>
      <div>
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`}>...</span>
          ) : (
            <button
              className={cn({ "bg-pink-100 text-white": currentPage === page })}
              key={`page-${page}`}
              onClick={() => navigateToPage(page as number)}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        className={cn("nav-button", {
          "pointer-events-none opacity-50": currentPage === totalPages,
        })}
        onClick={() => navigateToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-disabled={currentPage === totalPages}
      >
        Next
        <Image
          src={"assets/icons/arrow-right.svg"}
          alt="right"
          width={16}
          height={16}
        />
      </button>
    </section>
  );
};

export default Pagination;
