import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

// CSV Export
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

// PDF Export
export const exportToPDF = (data, filename, columns) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(16);
  doc.text(`${filename} Report`, 14, 15);
  
  // Table
  const tableData = data.map(row => 
    columns.map(col => row[col.key])
  );
  
  autoTable(doc, {
    head: [columns.map(col => col.label)],
    body: tableData,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 197, 94] }
  });

  doc.save(`${filename}.pdf`);
};