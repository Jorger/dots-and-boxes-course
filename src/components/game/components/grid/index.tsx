import "./styles.css";
import { Line } from "..";
import { POSITIONS } from "../../../../utils/calculatePositionsLines";
import type { TTypeLine } from "../../../../interfaces";
import { calculateExtraProps } from "./helpers";

// TODO: Pass information for lines and boxes..
const Grid = () => (
  <div className="game-grid">
    {Object.keys(POSITIONS).map((type) => {
      const typeLine = type as TTypeLine;

      return POSITIONS[typeLine].map((data) => {
        const { row, col } = data;

        // TODO: Pass information for lines and boxes..
        const extraProps = calculateExtraProps();

        return (
          <Line
            key={`${type}-${row}-${col}`}
            type={typeLine}
            baseLine={data}
            {...extraProps}
            handleSelect={(data) => {
              console.log(data);
            }}
          />
        );
      });
    })}
  </div>
);

export default Grid;
