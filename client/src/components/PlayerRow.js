import React, { memo, useMemo } from "react";

/**
 * A row used in PlayerTable to display a given player's stats
 * @param {Object} player - an object with player data returned from
 * @param {Object} columns - the schema of the columns to display
 * @param {String} sortColumn - the key of the column currently being used to sort the table
 */
const PlayerRow = ({ player, columns, sortColumn }) => {
  const columnOrder = useMemo(() => Object.keys(columns), [columns]);

  return (
    <tr className="PlayerRow">
      {columnOrder.map((col) => {
        const column = columns[col];
        return (
          <td
            className={
              `PlayerRow__column PlayerRow__column--${col} ` +
              `PlayersTable__cell--${col} ` +
              `PlayersTable__cell--${column.type} ` +
              `${col === sortColumn ? " PlayersTable__cell--sort-column" : ""}`
            }
            key={`PlayerRow__column--${col}`}
          >
            {player[col]}
            {col === "Lng" && player.LngTD ? (
              <em aria-label="Resulted in a Touchdown">T</em>
            ) : null}
          </td>
        );
      })}
    </tr>
  );
};

export default memo(PlayerRow);
