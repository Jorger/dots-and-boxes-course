import { indexInsideMatrix } from "../../../../utils/calculateIndicesMatrix";
import {
  EBoardColor,
  ELineState,
  ETypeLine,
} from "../../../../utils/constants";
import type {
  IBoxLine,
  IKeyValue,
  TBoardColor,
  TLineState,
  TStateBoxes,
  TStateLines,
  TTypeLine,
} from "../../../../interfaces";

interface CalculateExtraProps {
  typeLine: TTypeLine;
  row: number;
  col: number;
  lines: TStateLines;
  boxes: TStateBoxes;
}

/**
 * Calculates the props that can be changed for the lines, based on the information
 * from the lines and boxes...
 * @param param0
 * @returns
 */
export const calculateExtraProps = ({
  typeLine,
  row,
  col,
  lines,
  boxes,
}: CalculateExtraProps) => {
  let state: TLineState = ELineState.ACTIVE;
  let lineColor: TBoardColor = EBoardColor.BLUE;
  let box: IBoxLine | undefined = undefined;
  let lineDelay = 0;

  const keyLine: IKeyValue = `${row}-${col}`;

  /**
   * If a line exists, its status and color are obtained...
   */
  if (lines[typeLine][keyLine]) {
    state = lines[typeLine][keyLine].state;
    lineColor = lines[typeLine][keyLine].color;
    lineDelay = lines[typeLine][keyLine].delay;
  }

  /**
   * Validate if a box has been completed
   */
  if (
    typeLine === ETypeLine.VERTICAL &&
    indexInsideMatrix(col) &&
    boxes[keyLine]?.isComplete
  ) {
    box = boxes[keyLine];
  }

  return { state, lineColor, box, lineDelay };
};
