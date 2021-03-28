import React, { useState, useRef, memo, useEffect, useMemo } from "react";
import Loader from "./Loader";
import PlayerRow from "./PlayerRow";
import {
  makeCSVDataStr,
  browserSupportsDownload,
  getPlayers,
} from "../helpers";
import downloadIcon from "../download.svg";

const PlayersTable = ({
  columns, //the table's columns and their definitions
  maxPerPage = 300, //the most rows a user can display in the table
}) => {
  const columnOrder = useMemo(() => Object.keys(columns), [columns]);

  const [rows, setRows] = useState(null);
  const [sortCol, setSortCol] = useState(columnOrder[0]);
  const [sortDir, setSortDir] = useState("asc");
  const [curPage, setCurPage] = useState(1);
  const [totPages, setTotPages] = useState(1);
  const [perPage, setPerPage] = useState(16);
  const [curFilter, setCurFilter] = useState("");
  const [totalRows, setTotalRows] = useState(null);
  const [rowsCSV, setRowsCSV] = useState("");

  const debounceTimer = useRef(-1);
  const pageField = useRef(null);

  //re-query the API if any sorting or display vars change
  useEffect(() => {
    const params = {
      _sort: sortCol,
      _order: sortDir,
      _page: curPage,
      _limit: perPage,
    };

    if (curFilter !== "") {
      params.q = curFilter;
    }

    getPlayers(params).then((resp) => {
      if (resp.headers === undefined) {
        alert(`There was an error retrieving player data: ${resp.message}`);
      }

      //json-server puts the total count in a header,
      //we need that to calculate the total pages
      //for display
      const tot = resp.headers.get("X-Total-Count");

      if (tot !== null) {
        setTotalRows(tot);
        setTotPages(Math.ceil(tot / perPage));
      }

      resp.json().then((data) => setRows(data));
    });
  }, [sortCol, sortDir, curPage, perPage, curFilter]);

  //update the data string for download if rows or columns change
  useEffect(() => {
    if (rows !== null && rows.length > 0) {
      const dataStr = makeCSVDataStr(columnOrder, rows);

      setRowsCSV(dataStr);
    }
  }, [rows, columnOrder]);

  /**
   * Barebones debounce function for handling user generated events
   * @param {Function} cb
   * @param {Int} [delay] - default 250, ms to wait before firing the cb.
   *                        250 is the average human response delay to visual stimulae
   */
  const debounce = (cb, delay = 250) => {
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(cb, delay);
  };

  /**
   * Callback for when the user changes sort criteria
   * if column remains the same, only toggle direction
   * otherwise set dir to asc as well as the new column
   */
  const handleSortChange = (colName) => {
    setRows(null);

    if (colName === sortCol) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(colName);
      setSortDir("asc");
    }
  };

  /**
   * handles the onChange event for the search field
   * nulls the rows, and sets the current page in anticipation of
   * fresh data
   */
  const onPlayerSearchChange = (e) => {
    debounce(() => {
      setRows(null);
      setCurFilter(e.target.value);
      setCurPage(1);
      pageField.current.value = 1;
    });
  };

  /**
   * Handles when the user changes the page in the page number field
   */
  const handlePageChange = (e) => {
    debounce(() => {
      let val = Number(Math.round(e.target.value));

      if (val >= 1 && val <= totPages) {
        setRows(null);
        setCurPage(val);
      }
    });
  };

  /**
   * handles when the user changes the per page number
   */
  const onPerPageChange = (e) => {
    debounce(() => {
      const val = Number(Math.round(e.target.value));

      if (val > 0) {
        setPerPage(val);
      }
    });
  };

  return (
    <>
      <table className="PlayersTable">
        <thead>
          <tr>
            {columnOrder.map((colName) => {
              const column = columns[colName];
              return (
                <th
                  onClick={(e) => {
                    handleSortChange(colName);
                  }}
                  key={colName}
                  className={`PlayersTable__cell PlayersTable__cell--${colName} PlayersTable__cell--${
                    column.type
                  }${
                    colName === sortCol
                      ? " PlayersTable__cell--sort-" + sortDir
                      : ""
                  }`}
                >
                  <abbr title={column.description}>{colName}</abbr>
                </th>
              );
            })}
          </tr>
        </thead>

        {
          //don't show the table body without rows, but we still want the header and footer
          rows !== null && (
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columnOrder.length}>
                    No Players found named
                    <span className="PlayersTable__query-text">
                      {curFilter}
                    </span>
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => {
                  return (
                    <PlayerRow
                      player={row}
                      sortColumn={sortCol}
                      columns={columns}
                      key={`PlayerRow--${i}`}
                    />
                  );
                })
              )}
            </tbody>
          )
        }

        <tfoot className="PlayersTable__footer">
          <tr>
            <td>
              <input
                type="search"
                placeholder="Search..."
                onChange={onPlayerSearchChange}
                defaultValue={curFilter}
                className="PlayersTable__filter"
              />
            </td>
            <td
              colSpan={columnOrder.length - 1}
              className="PlayersTable__pagination-controls"
            >
              <div>
                <span className="PlayersTable__control-label PlayersTable__control-label--page-num">
                  Page:
                </span>
                <input
                  type="number"
                  className="PlayersTable__control PlayersTable__control--page-num"
                  placeholder="pg"
                  defaultValue={curPage}
                  onChange={handlePageChange}
                  ref={pageField}
                  min={1}
                  max={totPages}
                />
                <span className="PlayersTable__control-label PlayersTable__control-label--slash">
                  /
                </span>
                <span className="PlayersTable__control-label PlayersTable__control-label--num-pages">
                  {totPages}
                </span>
                <span className="PlayersTable__control-label PlayersTable__control-label--per-page">
                  Results Per Page:
                </span>
                <input
                  type="number"
                  min={1}
                  max={maxPerPage}
                  defaultValue={perPage}
                  className="PlayersTable__control PlayersTable__control--per-page"
                  onChange={onPerPageChange}
                />
                {browserSupportsDownload && (
                  <a
                    href={rowsCSV}
                    className="PlayersTable__control PlayersTable__control--download-btn"
                    style={{
                      backgroundImage: `url(${downloadIcon})`,
                    }}
                    download="NFL-Rushing-from-theScore.csv"
                  >
                    <span className="sr-only">
                      Download table contents as CSV
                    </span>
                  </a>
                )}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      {
        //show the loarder whenever rows are null
        rows === null && <Loader />
      }
    </>
  );
};

export default memo(PlayersTable);
