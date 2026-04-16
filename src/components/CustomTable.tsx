/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
} from "material-react-table";

interface CustomTableProps<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  enableRowActions?: boolean;
  enableExpanding?: boolean;
  enableColumnFilters?: boolean;
  enableGlobalFilter?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  manualFiltering?: boolean;
  bordered?: boolean;
  enableFullScreenToggle?: boolean;
  enableDensityToggle?: boolean;
  renderRowActions?: (props: any) => React.ReactNode;
  renderDetailPanel?: (props: any) => React.ReactNode;
  renderEmptyRowsFallback?: () => React.ReactNode;
  renderTopToolbarCustomActions?: (props: any) => React.ReactNode;
}

export function CustomTable<T extends MRT_RowData>({
  columns,
  data,
  isLoading = false,
  enableRowActions = false,
  enableExpanding = false,
  enableColumnFilters = true,
  enableSorting = true,
  enablePagination = true,
  enableRowSelection = true,
  enableGlobalFilter = true,
  manualFiltering = false,
  bordered = false,
  enableFullScreenToggle = false,
  enableDensityToggle = false,
  renderRowActions,
  renderDetailPanel,
  renderTopToolbarCustomActions,
  renderEmptyRowsFallback,
  ...tableProps
}: CustomTableProps<T>) {
  const borderColor = "#a6a6a6";

  return (
    <div className="min-h-fit">
      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ isLoading }}
        {...tableProps}
        enableColumnFilters={enableColumnFilters}
        enableSorting={enableSorting}
        enablePagination={enablePagination}
        enableRowSelection={enableRowSelection}
        enableRowActions={enableRowActions}
        enableExpanding={enableExpanding}
        enableGlobalFilter={enableGlobalFilter}
        manualFiltering={manualFiltering}
        enableFullScreenToggle={enableFullScreenToggle}
        enableDensityToggle={enableDensityToggle}
        positionActionsColumn="last"
        muiTablePaperProps={{
          sx: () => ({
            borderRadius: 4,
            border: bordered ? `1px solid ${borderColor}` : "none",
          }),
        }}
        // Header cells styling
        muiTableHeadCellProps={{
          sx: {
            fontWeight: "bold",
            borderRight: bordered ? `1px solid ${borderColor}` : "none",
            borderTop: bordered ? `1px solid ${borderColor}` : "none",
          },
        }}
        // Body rows styling
        muiTableBodyProps={{
          sx: {
            "& .MuiTableRow-root": {
              borderBottom: bordered ? `1px solid ${borderColor}` : "none",
            },
          },
        }}
        // Table cell borders
        muiTableBodyCellProps={{
          sx: {
            borderRight: bordered ? `1px solid ${borderColor}` : "none",
          },
        }}
        // Initial State
        initialState={{
          pagination: { pageSize: 10, pageIndex: 0 },
          showColumnFilters: false,
        }}
        renderEmptyRowsFallback={renderEmptyRowsFallback}
        renderRowActions={renderRowActions}
        renderDetailPanel={renderDetailPanel}
        renderTopToolbarCustomActions={renderTopToolbarCustomActions}
      />
    </div>
  );
}
