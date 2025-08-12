import {
  calculateIndicesMatrix,
  calculateLinesMatrix,
} from "./utils/calculateIndicesMatrix";
import { randomNumber } from "./utils/randomNumber";
import {
  BOARD_SIZE,
  EBoardColor,
  ELineState,
  ETypeLine,
  TOTAL_BOXES,
  TOTAL_LINES_COMPLETE_BOX,
} from "./utils/constants";
import {
  ChangeGameState,
  GameState,
  IIndicesMatrix,
  IKeyValue,
  Player,
  TBoardColor,
  TTypeLine,
} from "./interfaces";

// import { TEST_DATA } from "./base_data";

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

  // return {
  //   playerIds: allPlayerIds,
  //   players,
  //   turnID,
  //   boxes: TEST_DATA.boxes,
  //   isGameOver: false,
  //   numBoxesCompleted: 0,
  //   lines: TEST_DATA.lines,
  // };
};

interface ValidateCompleteLines {
  indices: IIndicesMatrix[];
  delay: number;
  color: TBoardColor;
  game: GameState;
}

const validateCompleteLines = ({
  indices,
  delay,
  color,
  game,
}: ValidateCompleteLines) => {
  /**
   * Lines are validated to see if there are multiple boxes being completed.
   */
  for (const { row: boxRow, col: boxCol } of indices) {
    const keyBox: IKeyValue = `${boxRow}-${boxCol}`;

    if (!game.boxes?.[keyBox]?.isComplete) {
      /**
       * Get the lines that make up the box and leave only
       * the unoccupied lines...
       */
      const boxLines = calculateLinesMatrix(boxRow, boxCol).filter(
        ({ row, col, type }) => {
          const keyLine: IKeyValue = `${row}-${col}`;
          return !game.lines[type][keyLine];
        }
      );

      // The lines are iterated and it is validated whether the box can be complete...
      for (const line of boxLines) {
        /**
         * Get the boxes that belong to the line...
         */
        const newIndices = calculateIndicesMatrix(
          line.row,
          line.col,
          line.type
        );

        /**
         * Iterate through each of the boxes and validate whether the line would complete a box
         */
        const lineCompleteBox =
          newIndices.filter(({ row: newBoxRow, col: newBoxCol }) => {
            const keyBox: IKeyValue = `${newBoxRow}-${newBoxCol}`;
            return (
              game.boxes?.[keyBox]?.counter === TOTAL_LINES_COMPLETE_BOX - 1
            );
          }).length !== 0;

        if (lineCompleteBox) {
          const keyLine: IKeyValue = `${line.row}-${line.col}`;

          game.lines[line.type][keyLine] = {
            state: ELineState.SELECTED,
            color,
            isCommit: false,
            delay,
          };

          for (const { row: newBoxRow, col: newBoxCol } of newIndices) {
            const newKeyBox: IKeyValue = `${newBoxRow}-${newBoxCol}`;

            if (!game.boxes[newKeyBox]) {
              game.boxes[newKeyBox] = {
                counter: 0,
                isComplete: false,
                isCommit: false,
                delay,
              };
            }

            game.boxes[newKeyBox].counter++;

            if (game.boxes[newKeyBox].counter === TOTAL_LINES_COMPLETE_BOX) {
              game.boxes[newKeyBox].color = color;
              game.boxes[newKeyBox].isComplete = true;
              game.boxes[newKeyBox].delay = delay;
            }
          }

          validateCompleteLines({
            indices: newIndices,
            delay: delay + 1,
            color,
            game,
          });
        }
      }
    }
  }
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
    validateCompleteLines({
      indices,
      color,
      game,
      delay: 1,
    });

    // Score.
    for (let i = 0; i < game.players.length; i++) {
      const playerColor = game.players[i].color;

      const score = Object.keys(game.boxes).filter(
        (key) =>
          game.boxes[key as IKeyValue].isComplete &&
          game.boxes[key as IKeyValue].color === playerColor
      ).length;

      game.players[i].score = score;
    }
  } else {
    const nextTurnID = allPlayerIds[currentIndex === 0 ? 1 : 0];
    game.turnID = nextTurnID;
  }

  game.numBoxesCompleted = Object.keys(game.boxes).filter(
    (key) =>
      game.boxes[key as IKeyValue].isComplete &&
      !game.boxes[key as IKeyValue].isCommit
  ).length;

  const totalBoxesCompleted = game.players[0].score + game.players[1].score;

  game.isGameOver = totalBoxesCompleted === TOTAL_BOXES;

  if (game.isGameOver) {
    const indexWinner = game.players[0].score > game.players[1].score ? 0 : 1;
    const winner = game.playerIds[indexWinner];
    const loser = game.playerIds[indexWinner === 0 ? 1 : 0];

    Rune.gameOver({
      players: {
        [winner]: "WON",
        [loser]: "LOST",
      },
      delayPopUp: true,
    });
  }
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
