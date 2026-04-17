/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type Dispatch, type SetStateAction } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
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
  enableColumnPinning?: boolean;
  manualFiltering?: boolean;
  bordered?: boolean;
  enableFullScreenToggle?: boolean;
  enableDensityToggle?: boolean;
  columnPinning?: {
    left: string[];
    right: string[];
  };
  onColumnPinningChange?: Dispatch<
    SetStateAction<{ left: string[]; right: any[] }>
  >;
  columnFilters?: MRT_ColumnFiltersState;
  onColumnFiltersChange?: React.Dispatch<
    React.SetStateAction<MRT_ColumnFiltersState>
  >;
  renderRowActions?: (props: any) => React.ReactNode;
  renderDetailPanel?: (props: any) => React.ReactNode;
  renderEmptyRowsFallback?: () => React.ReactNode;
  renderTopToolbarCustomActions?: (props: any) => React.ReactNode;
}

export function CustomTable<T extends MRT_RowData>({
  columns,
  data,
  isLoading = false,
  columnPinning = {
    left: [],
    right: [],
  },
  enableRowActions = false,
  enableExpanding = false,
  enableColumnFilters = true,
  enableSorting = true,
  enablePagination = true,
  enableRowSelection = true,
  enableGlobalFilter = true,
  enableColumnPinning = false,
  manualFiltering = false,
  bordered = false,
  enableFullScreenToggle = false,
  enableDensityToggle = false,
  columnFilters = [],
  onColumnFiltersChange = () => {},
  onColumnPinningChange = () => {},
  renderRowActions,
  renderDetailPanel,
  renderTopToolbarCustomActions,
  renderEmptyRowsFallback,
  ...tableProps
}: CustomTableProps<T>) {
  const borderColor = "#a6a6a6";
  const tableState = {
    isLoading,
    columnPinning,
    ...(manualFiltering ? { columnFilters } : {}),
  };

  return (
    <div className="min-h-fit">
      <MaterialReactTable
        columns={columns}
        data={data}
        {...tableProps}
        state={tableState}
        {...(manualFiltering ? { onColumnFiltersChange } : {})}
        enableColumnFilters={enableColumnFilters}
        enableSorting={enableSorting}
        enableColumnPinning={enableColumnPinning}
        enablePagination={enablePagination}
        enableRowSelection={enableRowSelection}
        enableRowActions={enableRowActions}
        enableExpanding={enableExpanding}
        enableGlobalFilter={enableGlobalFilter}
        manualFiltering={manualFiltering}
        onColumnPinningChange={onColumnPinningChange}
        enableFullScreenToggle={enableFullScreenToggle}
        enableDensityToggle={enableDensityToggle}
        enableRowVirtualization
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
        displayColumnDefOptions={{
          "mrt-row-actions": {
            size: 140,
            minSize: 140,
            maxSize: 180,
            muiTableBodyCellProps: {
              sx: {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                overflow: "visible",
              },
            },
          },
        }}
        renderEmptyRowsFallback={renderEmptyRowsFallback}
        renderRowActions={renderRowActions}
        renderDetailPanel={renderDetailPanel}
        renderTopToolbarCustomActions={renderTopToolbarCustomActions}
      />
    </div>
  );
}
