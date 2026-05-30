import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import type { LaravelPaginator } from "@/types/paginator";

import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface Props {
  paginator: LaravelPaginator<unknown> | undefined;
}

export function TablePagination({ paginator }: Props) {
  const search = useSearch({
    strict: false,
  });
  const navigate = useNavigate();

  const currentPage = Number(search.page ?? 1);
  const lastPage = paginator?.last_page ?? 1;
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= lastPage;

  const goToPage = (page: number) => {
    const nextPage = Math.min(lastPage, Math.max(1, page));

    if (nextPage === currentPage) return;

    navigate({
      to: ".",
      search: (prev) => ({ ...prev, page: nextPage }),
    });
  };

  return (
    <Pagination>
      <PaginationContent className="flex-wrap">
        <PaginationItem>
          <Button
            type="button"
            variant="ghost"
            disabled={isFirstPage}
            className="gap-1 px-2.5 sm:pl-2.5"
            aria-label="Go to previous page"
            onClick={() => goToPage(currentPage - 1)}
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Previous</span>
          </Button>
        </PaginationItem>
        {/* Buttons */}
        {paginator &&
          Array.from({ length: paginator.last_page }, (_, index) => (
            <PaginationItem key={index}>
              <Button
                type="button"
                variant={currentPage === index + 1 ? "outline" : "ghost"}
                size="icon"
                aria-current={currentPage === index + 1 ? "page" : undefined}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </Button>
            </PaginationItem>
          ))}
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem>
          <Button
            type="button"
            variant="ghost"
            disabled={isLastPage}
            className="gap-1 px-2.5 sm:pr-2.5"
            aria-label="Go to next page"
            onClick={() => goToPage(currentPage + 1)}
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
