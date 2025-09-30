import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type PaginationLinkProps = React.ComponentProps<typeof Link>;

const PaginationLink = ({ className, ...props }: PaginationLinkProps) => (
  <Link
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
      className
    )}
    {...props}
  />
);

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 2) {
      // If 2 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <button
              onClick={() => onPageChange(i)}
              className={cn(
                "h-10 px-4 py-2 font-normal cursor-pointer text-2xl inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-gray-200/50",
                currentPage === i
                  ? "bg-gray-200/50"
                  : ""
              )}
            >
              {i}
            </button>
          </PaginationItem>
        );
      }
    } else {
      // Always show page 1
      pages.push(
        <PaginationItem key={1}>
          <button
            onClick={() => onPageChange(1)}
            className={cn(
              "h-10 px-4 py-2 font-normal cursor-pointer text-2xl inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-gray-200/50",
              currentPage === 1
                ? "bg-gray-200/50"
                : ""
            )}
          >
            1
          </button>
        </PaginationItem>
      );

      // Show page 2 if current page is 1 or 2, otherwise show current page
      const secondPage = currentPage <= 2 ? 2 : currentPage;
      if (secondPage <= totalPages) {
        pages.push(
          <PaginationItem key={secondPage}>
            <button
              onClick={() => onPageChange(secondPage)}
              className={cn(
                "h-10 px-4 py-2 cursor-pointer font-normal text-2xl inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-gray-200/50",
                currentPage === secondPage
                  ? "bg-gray-200/50"
                  : ""
              )}
            >
              {secondPage}
            </button>
          </PaginationItem>
        );
      }

      // Show ellipsis if there's a gap
      if (
        totalPages > 3 &&
        (currentPage <= 2 ? 3 : currentPage + 1) < totalPages
      ) {
        pages.push(
          <PaginationItem key="ellipsis">
            <PaginationEllipsis className={cn("size-12")} />
          </PaginationItem>
        );
      }

      // Always show last page (if it's not already shown)
      if (totalPages > 2 && (currentPage <= 2 ? 2 : currentPage) < totalPages) {
        pages.push(
          <PaginationItem key={totalPages}>
            <button
              onClick={() => onPageChange(totalPages)}
              className={cn(
                "h-10 px-4 py-2 cursor-pointer font-normal text-2xl inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-gray-200/50",
                currentPage === totalPages
                  ? "bg-gray-200/50"
                  : ""
              )}
            >
              {totalPages}
            </button>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <button
            onClick={handlePrevious}
            disabled={currentPage <= 1}
            className={cn(
              "h-10 cursor-pointer px-4 py-2 font-normal text-2xl inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-200/50",
              currentPage <= 1 && "opacity-50 cursor-not-allowed"
            )}
          >
            <LuChevronLeft className="w-6 h-6" />
          </button>
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className={cn(
              "h-10 px-4 cursor-pointer font-normal py-2 text-2xl inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-200/50",
              currentPage >= totalPages && "opacity-50 cursor-not-allowed"
            )}
          >
            <LuChevronRight className="w-6 h-6" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
