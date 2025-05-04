import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import {
  useReactTable,
  getSortedRowModel,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { usePaginatedUsers } from "../hooks/usePaginatedUsers";

const UserTable = React.memo(({ search }) => {
  const [sorting, setSorting] = useState([]);
  const { users, fetchNextPage, hasMore, isLoading, error, reset } =
    usePaginatedUsers(search);
  const formatPhone = (phone) => {
    if (!phone) return "N/A";
    const digits = phone.replace(/\D/g, "").slice(-10);
    return `+1 ${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };
  const parentRef = useRef();

  useEffect(() => {
    reset();
  }, [search, reset]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <div
              onClick={column.getToggleSortingHandler()}
              className="w-60 cursor-pointer select-none flex items-center justify-between"
            >
              Name
              <span>
                {isSorted === "asc" ? "▲" : isSorted === "desc" ? "▼" : "▲▼"}
              </span>
            </div>
          );
        },
        cell: ({ getValue }) => (
          <div className="truncate w-60">{getValue()}</div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <div
              onClick={column.getToggleSortingHandler()}
              className="w-72 cursor-pointer select-none flex items-center justify-between"
            >
              Email
              <span>
                {isSorted === "asc" ? "▲" : isSorted === "desc" ? "▼" : "▲▼"}
              </span>
            </div>
          );
        },
        cell: ({ getValue }) => (
          <div className="truncate w-72">{getValue()}</div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "phone",
        header: () => <div className="w-48">Phone</div>,
        cell: ({ getValue }) => (
          <div className="truncate w-48">{formatPhone(getValue())}</div>
        ),
      },
      {
        accessorKey: "companyCity",
        header: () => <div className="w-72">Company (City)</div>,
        cell: ({ row }) => {
          const company = row.original.company?.name || "";
          const city = row.original.address?.city || "";
          return <div className="truncate w-72">{`${company} (${city})`}</div>;
        },
      },
    ],
    []
  );

  const data = useMemo(() => {
    return users.map((user) => ({
      ...user,
      companyCity: `${user.company.name} (${user.address.city})`,
    }));
  }, [users]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  const handleScroll = useCallback(() => {
    if (!parentRef.current || !hasMore || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
    if (scrollHeight - scrollTop - clientHeight < 300) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasMore, isLoading]);

  useEffect(() => {
    const scrollContainer = parentRef.current;
    let timeout;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleScroll();
      }, 400);
    };

    scrollContainer?.addEventListener("scroll", onScroll);
    return () => scrollContainer?.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  useEffect(() => {
    reset();
    fetchNextPage();
  }, [search]);
  useEffect(() => {
    reset();
    fetchNextPage();
  }, []);

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-x-auto border rounded-lg shadow bg-white"
    >
      <table className="table-auto w-full border-collapse">
        <thead className="sticky top-0 bg-gray-100 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow, i) => {
            const row = table.getRowModel().rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                className={`absolute w-full transition-colors ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-100`}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  display: "table",
                  tableLayout: "auto",
                  width: "100%",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-2 py-1 border truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {isLoading && <p className="p-2 text-center text-gray-500">Loading...</p>}
      {!hasMore && !isLoading && (
        <p className="p-2 text-center text-gray-400 text-sm">End of results</p>
      )}
      {error && (
        <p className="text-red-500 hover:bg-blue-100 text-center">
          Error: {error}
        </p>
      )}
    </div>
  );
});

export default UserTable;
