import React from "react";

const PlayerRow = ({ player, columns, sortColumn }) => {
  const columnOrder = Object.keys(columns);

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
          </td>
        );
      })}
    </tr>
  );
};

export default PlayerRow;
