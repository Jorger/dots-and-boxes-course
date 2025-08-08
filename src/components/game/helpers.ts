import { EBoardColorWithInitial } from "../../utils/constants";
import { PlayerId } from "rune-sdk";
import type { IBackgroud, Player } from "../../interfaces";

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
