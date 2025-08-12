import "./styles.css";
import { playSound } from "../../../../sounds";
import { useWait } from "../../../../hooks";
import {
  BOARD_SIZE,
  COMBINED_DELAY,
  EBoardColor,
  ELineState,
  ESounds,
  ETypeLine,
  LINE_SIZE,
  TILE_SIZE,
  TIME_EXPAND_LINE,
} from "../../../../utils/constants";
import React, { useCallback } from "react";
import type {
  IBaseLine,
  IBoxLine,
  ISelectLine,
  TBoardColor,
  TLineState,
  TTypeLine,
} from "../../../../interfaces";

interface LineProps {
  type: TTypeLine;
  state: TLineState;
  baseLine: IBaseLine;
  lineColor?: TBoardColor;
  lineDelay?: number;
  box?: IBoxLine;
  handleSelect: (data: ISelectLine) => void;
}

const Line = ({
  type = ETypeLine.VERTICAL,
  state = ELineState.ACTIVE,
  baseLine = { left: 0, top: 0, row: 0, col: 0 },
  lineColor = EBoardColor.BLUE,
  lineDelay = 0,
  box = { isComplete: false, delay: 0 },
  handleSelect,
}: LineProps) => {
  const { left = 0, top = 0, row = 0, col = 0 } = baseLine;
  // Box
  const {
    isComplete: isBoxComplete = false,
    color: boxColor = "",
    delay: boxDealy = 0,
    isCommit: isBoxCommit = false,
  } = box;

  const isVertical = type === ETypeLine.VERTICAL;
  const isLast = col === BOARD_SIZE - (isVertical ? 0 : 1);
  const width = isVertical ? LINE_SIZE : TILE_SIZE;
  const height = isVertical ? TILE_SIZE : LINE_SIZE + 2;
  const isLineSelected = state === ELineState.SELECTED;
  const delayLineSelected = lineDelay * COMBINED_DELAY;
  const isBoxCompleteAnimation = isBoxComplete && !isBoxCommit;
  const delayBoxComplete = TIME_EXPAND_LINE + COMBINED_DELAY * boxDealy;

  // Sound for line
  useWait(
    isLineSelected,
    delayLineSelected,
    useCallback(() => playSound(ESounds.STROKE), [])
  );

  useWait(
    isBoxCompleteAnimation,
    delayBoxComplete,
    useCallback(() => playSound(ESounds.BOX), [])
  );

  const classNameFillingBox = isBoxComplete
    ? `filling-box ${boxColor.toLowerCase()} ${!isBoxCommit ? "animate" : ""}`
    : "";

  const classNameLastLine = isLast ? "last" : "";

  const className = `game-line ${classNameFillingBox} ${state.toLowerCase()} ${type.toLowerCase()} ${classNameLastLine}`;

  const style = {
    width,
    height,
    left,
    top,
    "--line-color": "",
    "--line-delay": "",
    "--box-delay": "",
  };

  if (isLineSelected) {
    style["--line-color"] =
      `var(${lineColor === EBoardColor.BLUE ? "--line-blue" : "--line-red"})`;

    // Timeout before the line animation...
    style["--line-delay"] = `${delayLineSelected}ms`;
  }

  if (isBoxCompleteAnimation) {
    style["--box-delay"] = `${delayBoxComplete}ms`;
  }

  const title = `${type} Line, ${row} - ${col}`;

  return (
    <button
      className={className}
      style={style}
      title={title}
      disabled={!(state === ELineState.ACTIVE)}
      onClick={() =>
        handleSelect({
          type,
          row,
          col,
        })
      }
    />
  );
};

export default React.memo(Line);
