export function exportToWord(htmlContent: string, filename: string) {
  const preHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Export</title>
      <style>
        @page WordSection1 {
          size: 595.3pt 841.9pt; /* A4 Portrait */
          margin: 72.0pt 72.0pt 72.0pt 72.0pt;
        }
        div.WordSection1 { page: WordSection1; }
        body { font-family: 'Times New Roman', serif; font-size: 12pt; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        table, th, td { border: 1px solid black; }
        th, td { padding: 8px; text-align: left; }
        h1, h2, h3, h4, h5, h6 { text-align: center; margin: 0; padding: 0; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-justify { text-align: justify; }
        .mt-4 { margin-top: 20px; }
        .mt-8 { margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class='WordSection1'>
  `;
  const postHtml = "</div></body></html>";
  const sourceHTML = preHtml + htmlContent + postHtml;

  const blob = new Blob(['\ufeff', sourceHTML], {
    type: 'application/msword'
  });
  
  const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);
  
  if ((navigator as any).msSaveOrOpenBlob) {
    (navigator as any).msSaveOrOpenBlob(blob, filename + '.doc');
  } else {
    downloadLink.href = url;
    downloadLink.download = filename + '.doc';
    downloadLink.click();
  }
  
  document.body.removeChild(downloadLink);
}

export function exportToExcel(tableHtml: string, filename: string) {
  const template = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Sheet1</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 4px; }
      </style>
    </head>
    <body>
      ${tableHtml}
    </body>
    </html>
  `;
  
  const blob = new Blob(['\ufeff', template], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  
  downloadLink.href = url;
  downloadLink.download = filename + '.xls';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export function getKopSekolahHtml() {
  return `
    <div style="text-align: center; border-bottom: 3px solid black; padding-bottom: 10px; margin-bottom: 20px;">
      <h2 style="margin: 0; font-size: 16pt;">PEMERINTAH PROVINSI DAERAH / KOTA</h2>
      <h1 style="margin: 5px 0; font-size: 18pt;">NAMA SEKOLAH</h1>
      <p style="margin: 0; font-size: 11pt;">Alamat Lengkap Sekolah, Telepon: (000) 000000, Website: www.sekolah.sch.id</p>
    </div>
  `;
}

