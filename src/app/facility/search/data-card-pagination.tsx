import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CardDetails = {
  name: string,
}

interface DataCardPaginationProps {
// interface DataCardPaginationProps<TData> {
  // table: Table<TData>;
  data : CardDetails[];
}

export function DataCardPagination({
// export function DataCardPagination<TData>({
//   table,
// }: DataCardPaginationProps<TData>) {
  data,
}: DataCardPaginationProps){
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {data.getFilteredSelectedRowModel().rows.length} of{" "}
        {data.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${data.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              data.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={data.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {data.getState().pagination.pageIndex + 1} of{" "}
          {data.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => data.setPageIndex(0)}
            disabled={!data.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <FaAnglesLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => data.previousPage()}
            disabled={!data.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <FaAngleLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => data.nextPage()}
            disabled={!data.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <FaAngleRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => data.setPageIndex(data.getPageCount() - 1)}
            disabled={!data.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <FaAnglesRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
