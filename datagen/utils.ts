export function parseCSV(csvContent: string): Array<Record<string, string>> {
  // Split the CSV content by newlines to get each row
  const rows = csvContent
    .split("\n")
    .map((row) => row.trim())
    .filter((row) => row.length > 0);

  // Extract the header row
  const headers = rows[0].split(",").map((header) => header.trim());

  // Process the remaining rows
  const data = rows.slice(1).map((row) => {
    const values = row.split(",").map((value) => value.trim());
    const obj: Record<string, string> = {};

    // Map each header to the corresponding value
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });

    return obj;
  });

  return data;
}
