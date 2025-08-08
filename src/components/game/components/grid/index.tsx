import "./styles.css";
import { Line } from "..";
import { POSITIONS } from "../../../../utils/calculatePositionsLines";
import type {
  ISelectLine,
  TStateBoxes,
  TStateLines,
  TTypeLine,
} from "../../../../interfaces";
import { calculateExtraProps } from "./helpers";

interface GridProps {
  lines: TStateLines;
  boxes: TStateBoxes;
  handleSelect: (data: ISelectLine) => void;
}

const Grid = ({ lines, boxes, handleSelect }: GridProps) => (
  <div className="game-grid">
    {Object.keys(POSITIONS).map((type) => {
      const typeLine = type as TTypeLine;

      return POSITIONS[typeLine].map((data) => {
        const { row, col } = data;

        const extraProps = calculateExtraProps({
          typeLine,
          boxes,
          lines,
          row,
          col,
        });

        return (
          <Line
            key={`${type}-${row}-${col}`}
            type={typeLine}
            baseLine={data}
            {...extraProps}
            handleSelect={handleSelect}
          />
        );
      });
    })}
  </div>
);

export default Grid;
