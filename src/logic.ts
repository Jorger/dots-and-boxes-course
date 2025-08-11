import { calculateIndicesMatrix } from "./utils/calculateIndicesMatrix";
import { randomNumber } from "./utils/randomNumber";
import {
  BOARD_SIZE,
  EBoardColor,
  ELineState,
  ETypeLine,
  TOTAL_LINES_COMPLETE_BOX,
} from "./utils/constants";
import {
  ChangeGameState,
  GameState,
  IKeyValue,
  Player,
  TTypeLine,
} from "./interfaces";

const lineInRange = (index = 0) => index >= 0 && index <= BOARD_SIZE;

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

const changeGameState = ({
  line,
  game,
  playerId,
  allPlayerIds,
}: ChangeGameState) => {
  const { type, row, col } = line;
  const inRange = lineInRange(row) && lineInRange(col);

  if (!inRange) {
    throw Rune.invalidAction();
  }

  const player = game.players.find((v) => v.playerID === playerId);

  if (!player) {
    throw Rune.invalidAction();
  }

  const currentIndex = allPlayerIds.findIndex((v) => v === playerId);

  let completeBox = false;

  // console.log("GAME");
  // console.log(JSON.parse(JSON.stringify(game)));

  for (const key in game.lines) {
    const keyDirection = key as TTypeLine;

    const lines = game.lines[keyDirection];

    Object.keys(lines)
      .filter((key) => !lines[key as IKeyValue].isCommit)
      .forEach((key) => {
        game.lines[keyDirection][key as IKeyValue].state = ELineState.COMPLETED;
        game.lines[keyDirection][key as IKeyValue].isCommit = true;
      });
  }

  Object.keys(game.boxes)
    .filter(
      (key) =>
        game.boxes[key as IKeyValue].isComplete &&
        !game.boxes[key as IKeyValue].isCommit
    )
    .forEach((key) => (game.boxes[key as IKeyValue].isCommit = true));

  const color = player.color;

  const keyLine: IKeyValue = `${row}-${col}`;

  game.lines[type][keyLine] = {
    state: ELineState.SELECTED,
    color,
    isCommit: false,
    delay: 0,
  };

  const indices = calculateIndicesMatrix(row, col, type);

  for (const { row: boxRow, col: boxCol } of indices) {
    const keyBox: IKeyValue = `${boxRow}-${boxCol}`;

    if (!game.boxes[keyBox]) {
      game.boxes[keyBox] = {
        counter: 0,
        isComplete: false,
        isCommit: false,
        delay: 0,
      };
    }

    game.boxes[keyBox].counter++;

    if (game.boxes[keyBox].counter === TOTAL_LINES_COMPLETE_BOX) {
      game.boxes[keyBox].color = color;
      game.boxes[keyBox].isComplete = true;
      completeBox = true;
    }
  }

  if (completeBox) {
    console.log("CONTINUE THE SAME USER");
  } else {
    const nextTurnID = allPlayerIds[currentIndex === 0 ? 1 : 0];
    game.turnID = nextTurnID;
  }

  game.numBoxesCompleted = Object.keys(game.boxes).filter(
    (key) =>
      game.boxes[key as IKeyValue].isComplete &&
      !game.boxes[key as IKeyValue].isCommit
  ).length;
};

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds) => getPlayerData(allPlayerIds),
  actions: {
    onSelectLine: (line, { game, playerId, allPlayerIds }) =>
      changeGameState({ line, game, playerId, allPlayerIds }),
  },
});
