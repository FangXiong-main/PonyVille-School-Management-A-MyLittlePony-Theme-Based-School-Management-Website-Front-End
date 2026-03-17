import * as XLSX from 'xlsx';
export const exportToExcel = (excelFileName, tableData) => {
  /* Step 1: 将表格数据转换为工作表 */
  const worksheet = XLSX.utils.json_to_sheet(tableData);

  /* Step 2: 创建一个新的工作簿 */
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  /* Step 3: 导出为 .xlsx 文件 */
  XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
};