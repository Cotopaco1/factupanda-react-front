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

  const currentPage = search.page ?? 1;
  const lastPage = paginator?.last_page ?? 1;

  return (
    <Pagination>
      <PaginationContent className="flex-wrap">
        <PaginationItem>
          <PaginationPrevious 
            disabled={currentPage <= 1} 
            to='.' 
            search={(prev) => ({ ...prev, page: Math.max(1, (prev.page ?? 1) - 1) })} 
          />
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
          <PaginationNext 
            to='.' 
            disabled={currentPage >= lastPage} 
            search={(prev) => ({ ...prev, page: Math.min(lastPage, (prev.page ?? 1) + 1) })} 
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
