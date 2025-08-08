import { EBoardColor, ETypeLine } from "./utils/constants";
import { GameState, Player } from "./interfaces";
import { randomNumber } from "./utils/randomNumber";

/**
 * Generate initial state...
 * @param allPlayerIds
 * @returns
 */
const getPlayerData = (allPlayerIds: string[]): GameState => {
  const players: Player[] = [];
  const initialColor = randomNumber(0, 1);
  const colorPlayer1 = initialColor === 0 ? EBoardColor.BLUE : EBoardColor.RED;
  const colorPlayer2 = initialColor === 0 ? EBoardColor.RED : EBoardColor.BLUE;

  players.push(
    {
      playerID: allPlayerIds[0],
      color: colorPlayer1,
      score: 0,
    },
    {
      playerID: allPlayerIds[1],
      color: colorPlayer2,
      score: 0,
    }
  );

  const turnNumber = randomNumber(0, 1);
  const turnID = allPlayerIds[turnNumber];

  return {
    playerIds: allPlayerIds,
    players,
    turnID,
    boxes: {},
    isGameOver: false,
    numBoxesCompleted: 0,
    lines: {
      [ETypeLine.HORIZONTAL]: {},
      [ETypeLine.VERTICAL]: {},
    },
  };
};

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds) => getPlayerData(allPlayerIds),
  actions: {
    onSelectLine: (line, { game, playerId, allPlayerIds }) => {
      console.log("onSelectLine in logic");
      console.log(line);
      console.log({ game, playerId, allPlayerIds });
    },
  },
});
