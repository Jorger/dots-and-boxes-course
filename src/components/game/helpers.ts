import { PlayerId } from "rune-sdk";
import { randomNumber } from "../../utils/randomNumber";
import {
  BOARD_SIZE,
  EBoardColorWithInitial,
  ETypeLine,
} from "../../utils/constants";
import type {
  IBackgroud,
  IKeyValue,
  ISelectLine,
  Player,
  TStateLines,
} from "../../interfaces";

interface GetCurrentData {
  players: Player[];
  turnID: PlayerId;
}

export const getCurretPlayer = ({ players = [], turnID }: GetCurrentData) =>
  players.find((v) => v.playerID === turnID);

export const getCurrentColor = (data: GetCurrentData) => {
  let currentColor: IBackgroud = EBoardColorWithInitial.INITIAL;

  const currentPlayer = getCurretPlayer(data);

  if (currentPlayer) {
    currentColor = currentPlayer.color;
  }

  return currentColor;
};

export const generateRandomLine = (lines: TStateLines): ISelectLine | null => {
  const MAX_ATTEMPTS = 500;
  let attempts = 0;

  const line: ISelectLine = {
    type: ETypeLine.HORIZONTAL,
    row: 0,
    col: 0,
  };

  while (attempts < MAX_ATTEMPTS) {
    line.type =
      randomNumber(0, 1) === 1 ? ETypeLine.HORIZONTAL : ETypeLine.VERTICAL;

    const maxRow =
      line.type === ETypeLine.HORIZONTAL ? BOARD_SIZE : BOARD_SIZE - 1;

    const maxCol =
      line.type === ETypeLine.HORIZONTAL ? BOARD_SIZE - 1 : BOARD_SIZE;

    line.row = randomNumber(0, maxRow);
    line.col = randomNumber(0, maxCol);

    const keyLine: IKeyValue = `${line.row}-${line.col}`;

    if (!lines[line.type][keyLine]) {
      return line;
    }

    attempts++;
  }

  console.warn("generateRandomLine: Max attempts reached. Board may be full.");
  return null;
};
