const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");

exports.exportCSV = (rows) => {
  const parser = new Parser();
  return parser.parse(rows);
};

exports.exportXLSX = async (rows) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Billing");

  ws.columns = Object.keys(rows[0] || {}).map((key) => ({
    header: key,
    key,
    width: 25,
  }));

  rows.forEach((r) => ws.addRow(r));

  return wb.xlsx.writeBuffer();
};
