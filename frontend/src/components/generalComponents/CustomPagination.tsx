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

const CustomPagination = () => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" className={cn("h-10 hover:bg-[#00B5A5] hover:text-white px-4 py-2 font-normal text-2xl ![&>svg]:w-4.5 ![&>svg]:h-4.5")} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" className={cn("h-10 hover:bg-[#00B5A5] hover:text-white px-4 py-2 font-normal text-2xl")}>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis className={cn("size-12")} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" className={cn("h-10 px-4 hover:bg-[#00B5A5] hover:text-white font-normal py-2 text-2xl [&>svg]:w-4.5 [&>svg]:h-4.5")} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;