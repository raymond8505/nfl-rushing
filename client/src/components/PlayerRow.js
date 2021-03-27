import React from "react";

const PlayerRow = ({ player, columns, sortColumn }) => {
  const columnOrder = Object.keys(columns);
  console.log(player);
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

export default PlayerRow;
