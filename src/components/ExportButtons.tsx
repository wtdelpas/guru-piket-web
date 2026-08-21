"use client";

import { exportToExcel, exportToWord, getKopSekolahHtml } from "@/lib/exportUtils";
import { Download, FileText, FileSpreadsheet } from "lucide-react";

interface ExportButtonsProps {
  title: string;
  tableData: any[];
  columns: { header: string; key: string | ((row: any) => string) }[];
  filename: string;
}

export default function ExportButtons({ title, tableData, columns, filename }: ExportButtonsProps) {
  
  function generateHtmlContent() {
    const kop = getKopSekolahHtml();
    
    // Tanggal cetak
    const today = new Date();
    const dateStr = today.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    let html = kop;
    html += `<h3 style="text-align: center; margin-bottom: 20px;">${title}</h3>`;
    
    html += `<table><thead><tr>`;
    // No. column
    html += `<th style="width: 5%;">No</th>`;
    for (const col of columns) {
      html += `<th>${col.header}</th>`;
    }
    html += `</tr></thead><tbody>`;
    
    tableData.forEach((row, index) => {
      html += `<tr>`;
      html += `<td style="text-align: center;">${index + 1}</td>`;
      for (const col of columns) {
        let cellValue = "";
        if (typeof col.key === "function") {
          cellValue = col.key(row);
        } else {
          cellValue = String(row[col.key] || "-");
        }
        // replace \n with <br/>
        cellValue = cellValue.replace(/\n/g, "<br/>");
        html += `<td>${cellValue}</td>`;
      }
      html += `</tr>`;
    });
    
    html += `</tbody></table>`;
    
    html += `
      <div style="margin-top: 50px; text-align: right; margin-right: 50px;">
        <p>Dicetak pada: ${dateStr}</p>
        <p style="margin-top: 60px;">________________________</p>
        <p>Mengetahui,</p>
      </div>
    `;

    return html;
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => exportToWord(generateHtmlContent(), filename)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm text-sm"
      >
        <FileText size={16} />
        <span className="hidden sm:inline">Ekspor Word</span>
        <span className="sm:hidden">Word</span>
      </button>
      <button 
        onClick={() => exportToExcel(generateHtmlContent(), filename)}
        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition shadow-sm text-sm"
      >
        <FileSpreadsheet size={16} />
        <span className="hidden sm:inline">Ekspor Excel</span>
        <span className="sm:hidden">Excel</span>
      </button>
    </div>
  );
}
