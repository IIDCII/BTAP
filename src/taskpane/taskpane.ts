/* global Excel console */
function parseTableData(dataString: string): string[][] {
  try {
    return JSON.parse(dataString);
  } catch (error) {
    console.error("Error parsing table data:", error);
    throw new Error("Invalid table data string");
  }
}

export async function insertText(dataString: string, inputCell: string) {
  try {
    const data = parseTableData(dataString);
    
    await Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      const range = sheet.getRange(inputCell).getResizedRange(data.length - 1, data[0].length - 1);
      range.values = data;
      range.format.autofitColumns();

      // Optional: Format as a table
      const table = sheet.tables.add(range, true);
      table.style = "TableStyleMedium2";

      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}
