import { EBoardColor, ELineState } from "../../../../utils/constants";
import type {
  IBoxLine,
  TBoardColor,
  TLineState,
  TTypeLine,
} from "../../../../interfaces";

interface CalculateExtraProps {
  typeLine: TTypeLine;
  row: number;
  col: number;
}

// TODO: Use this types
// lines: TStateLines;
// boxes: TStateBoxes;

// TODO: Complete function
/*
{
  typeLine,
  row,
  col,
}: CalculateExtraProps
*/
export const calculateExtraProps = () => {
  // let state: TLineState = ELineState.ACTIVE;
  // let lineColor: TBoardColor = EBoardColor.BLUE;
  // let box: IBoxLine | undefined = undefined;
  // let lineDelay = 0;

  const state: TLineState = ELineState.ACTIVE;
  const lineColor: TBoardColor = EBoardColor.BLUE;
  const box: IBoxLine | undefined = undefined;
  const lineDelay = 0;

  return { state, lineColor, box, lineDelay };
};
