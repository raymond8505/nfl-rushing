/**
 * Takes a flat object of key val pairs and returns a string representation of it
 * @param {Object} obj an object of key val pairs meant for use in a parameters string
 * @returns & delimited string of key=val for use in a url
 */
export const paramStr = (obj) => {
  return Object.keys(obj)
    .map((field) => {
      return field + "=" + encodeURIComponent(obj[field]);
    })
    .join("&");
};

/**
 * Takes a value and preps it for use in a CSV string
 * @param {Any} val
 * @returns String
 */
export const prepValForCSV = (val) => {
  let prepped = `"${val}"`; //surround in double quotes so commas don't break things

  return prepped;
};

/**
 * End of line character for use in CSVs
 * @var {String}
 */
export const CSV_EOL = "\r";

/**
 * Whether or not the current browser supports the download attribute on anchor tags
 * @var {Boolean}
 */
export const browserSupportsDownload =
  document.createElement("a").download !== "undefined";

/**
 *
 * @param {String[]} columnNames - the names to appear at the top of each column in the csv
 * @param {Object[]} rows - an array of objects with keys matching the given headers
 * @returns {Blob}
 */
export const makeCSVDataStr = (columnNames, rows) => {
  let csv = columnNames.join(",") + CSV_EOL;

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

  return URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" })
  );
};
/**
 * Takes an object of parameters and returns a fetch Promise or null on error
 * @param {*} [params] - parameters to pass to the backend API
 * @see https://www.npmjs.com/package/json-server
 * @returns Promise|null returns a promise on success and null on failure
 */
export const getPlayers = async (params = {}) => {
  let url = process.env.REACT_APP_PLAYERS_API;

  if (Object.keys(params).length > 0) {
    url += `?${paramStr(params)}`;
  }

  try {
    const playersResult = await fetch(url, {
      headers: {
        "Cache-Control": "max-age=300",
        Expires: new Date(new Date().getTime() + 300000).toUTCString(),
      },
    });
    //const playersJSON = await playersResult.json();
    return playersResult;
  } catch (e) {
    return e;
  }
};
