import ExcelJS from "exceljs";

export interface ExportColumn {
  header: string;
  accessorKey: string;
  formatter?: (value: unknown) => unknown;
}

export async function exportTableToExcel(
  filename: string,
  columns: ExportColumn[],
  data: Record<string, unknown>[],
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Export");

  // Header row
  worksheet.addRow(columns.map((col) => col.header));
  worksheet.getRow(1).font = { bold: true };

  // Data rows
  data.forEach((row) => {
    const values = columns.map((col) => {
      const raw = row[col.accessorKey];
      return col.formatter ? col.formatter(raw) : (raw ?? "");
    });
    worksheet.addRow(values);
  });

  // Set column widths
  worksheet.columns.forEach((col) => {
    col.width = 20;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

