/**
 * PDF export utility
 * Exports data as PDF in tabular format
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportData {
  [key: string]: string | number;
}

/**
 * Export data to PDF in tabular format
 */
export function exportToPDF(
  data: ExportData[],
  filename: string = "export",
  title: string = "Student List"
): void {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert data to array format for autoTable
  const tableData = data.map((row) =>
    headers.map((header) => String(row[header] || ""))
  );
  
  // Add table using autoTable function (pass doc as first parameter)
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 25,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202], // Blue header
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 25 },
  });
  
  // Save PDF
  doc.save(`${filename}.pdf`);
}

