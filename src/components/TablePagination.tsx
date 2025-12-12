import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { LaravelPaginator } from "@/types/paginator"

import { useSearch } from '@tanstack/react-router'


interface Props {
  paginator: LaravelPaginator<any> | undefined;
}

export function TablePagination({ paginator }: Props) {
  const search = useSearch({
    strict: false
  });
  // const router = useRouter();

  return (
    <Pagination>
      <PaginationContent className="flex-wrap">
        <PaginationItem>
          <PaginationPrevious disabled={(search.page ?? 1) <= 1} to='.' search={(prev) => ({ ...prev, page: (prev.page ?? 2) - 1 })} />
        </PaginationItem>
        {/* Buttons */}
        {paginator && Array.from({ length: paginator.last_page }, (_, index) => (

          <PaginationItem key={index}>
            <PaginationLink isActive={search.page == index + 1} to="." search={(prev) => ({ ...prev, page: index + 1 })}>{index + 1}</PaginationLink>
          </PaginationItem>

        ))}
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem>
          <PaginationNext to='.' disabled={(search.page ?? 1) >= (paginator?.last_page ?? 0)} search={(prev) => ({ ...prev, page: (prev.page ?? 0) + 1 })} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
