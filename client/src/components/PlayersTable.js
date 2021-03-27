import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import Loader from "./Loader";
import PlayerRow from "./PlayerRow";
import { paramStr, makeCSVDataStr, browserSupportsDownload } from "../helpers";
import downloadIcon from "../download.svg";

const PlayersTable = ({
  columns, //the table's columns and their definitions
}) => {
  const getPlayers = async (params = {}) => {
    let url = process.env.REACT_APP_PLAYERS_API;

    if (Object.keys(params).length > 0) {
      url += `?${paramStr(params)}`;
    }

    const playersResult = await fetch(url);
    //const playersJSON = await playersResult.json();

    return playersResult;
  };

  const columnOrder = Object.keys(columns);

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
      const tot = resp.headers.get("X-Total-Count");

      if (tot !== null) {
        setTotalRows(tot);
      }

      resp.json().then((data) => setRows(data));
    });
  }, [sortCol, sortDir, curPage, perPage, curFilter]);

  useEffect(() => {
    if (rows !== null && rows.length > 0) {
      const dataStr = makeCSVDataStr(columnOrder, rows);

      setRowsCSV(URL.createObjectURL(dataStr));
    }
  }, [rows]);

  const debounce = (cb, delay = 250) => {
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(cb, delay);
  };

  const handleSortChange = (colName) => {
    setRows(null);

    if (colName === sortCol) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(colName);
      setSortDir("asc");
    }
  };

  const onPlayerSearchChange = (e) => {
    debounce(() => {
      setRows(null);
      setCurFilter(e.target.value);
      setCurPage(1);
      pageField.current.value = 1;
    });
  };

  const handlePageChange = (e) => {
    debounce(() => {
      let val = Number(Math.round(e.target.value));
      const max = Math.ceil(totalRows / perPage);

      if (val >= 1 && val <= max) {
        setRows(null);
        setCurPage(val);
      }
    });
  };

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

        {rows !== null && (
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columnOrder.length}>
                  No Players found named
                  <span className="PlayersTable__query-text">{curFilter}</span>
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
        )}

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
                  max={Math.ceil(totalRows / perPage)}
                />
                <span className="PlayersTable__control-label PlayersTable__control-label--slash">
                  /
                </span>
                <span className="PlayersTable__control-label PlayersTable__control-label--num-pages">
                  {Math.ceil(totalRows / perPage)}
                </span>
                <span className="PlayersTable__control-label PlayersTable__control-label--per-page">
                  Results Per Page:
                </span>
                <input
                  type="number"
                  min={1}
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
                  ></a>
                )}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      {rows === null && <Loader />}
    </>
  );
};

export default memo(PlayersTable);
