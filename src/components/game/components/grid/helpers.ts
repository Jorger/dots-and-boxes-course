import { EBoardColor, ELineState } from "../../../../utils/constants";
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

export const calculateExtraProps = ({
  typeLine,
  row,
  col,
  lines,
  // TODO: validate boxes
  boxes,
}: CalculateExtraProps) => {
  let state: TLineState = ELineState.ACTIVE;
  let lineColor: TBoardColor = EBoardColor.BLUE;
  // let box: IBoxLine | undefined = undefined;
  const box: IBoxLine | undefined = undefined;
  let lineDelay = 0;

  const keyLine: IKeyValue = `${row}-${col}`;

  if (lines[typeLine][keyLine]) {
    state = lines[typeLine][keyLine].state;
    lineColor = lines[typeLine][keyLine].color;
    lineDelay = lines[typeLine][keyLine].delay;
  }

  return { state, lineColor, box, lineDelay };
};
