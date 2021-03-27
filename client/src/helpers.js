export const paramStr = (obj) => {
  return Object.keys(obj)
    .map((field) => {
      return field + "=" + encodeURIComponent(obj[field]);
    })
    .join("&");
};

export const prepValForCSV = (val) => {
  let prepped = `"${val}"`; //surround in double quotes so commas don't break things

  return prepped;
};

export const CSV_EOL = "\r";

export const makeCSVDataStr = (columnNames, rows) => {
  let csv = columnNames.join(",") + CSV_EOL;

  console.log(rows);

  csv += rows
    .map((row) => {
      return columnNames
        .map((col) => {
          let val = prepValForCSV(row[col]);

          if (col === "Lng" && row.LngTD) val += "T";

          return val;
        })
        .join(",");
    })
    .join(CSV_EOL);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  return blob;
};
