/**
 * Excel export utility
 * Exports data as CSV format (compatible with Excel)
 */

export interface ExportData {
  [key: string]: string | number;
}

/**
 * Export data to Excel (CSV format - compatible with Excel)
 */
export function exportToExcel(
  data: ExportData[],
  filename: string = "export"
): void {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content with BOM for Excel UTF-8 support
  const BOM = "\uFEFF";
  const csvContent = BOM + [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  // Use Excel MIME type for better compatibility
  const blob = new Blob([csvContent], { 
    type: "application/vnd.ms-excel;charset=utf-8;" 
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xls`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

