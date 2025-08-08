import { GameWrapper, Grid, StartCounter } from "./components/index.tsx";
import { getCurrentColor } from "./helpers.ts";
import { PlayerId } from "rune-sdk";
import { useEffect, useState } from "react";
import {
  EBoardColorWithInitial,
  INITIAL_UI_INTERACTIONS,
} from "../../utils/constants.ts";
import type {
  GameState,
  IBackgroud,
  ISelectLine,
  IUInteractions,
} from "../../interfaces/index.ts";

const Game = () => {
  /**
   * Saves the game state (comes from RUNE)
   */
  const [game, setGame] = useState<GameState>();
  /**
   * Saves the current player id for each session...
   */
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  /**
   * For UI-related actions
   */
  const [uiInteractions, setUiInteractions] = useState<IUInteractions>(
    INITIAL_UI_INTERACTIONS
  );

  /**
   * Calculates the ID of the user who has the turn
   */
  const turnID = game?.turnID || "";

  /**
   * Indicates whether the user has a turn...
   */
  const hasTurn = yourPlayerId === turnID;

  /**
   * Determine if the game is over...
   */
  const isGameOver = game?.isGameOver || false;

  // startTimer, runEffect, delayUI

  const { showCounter } = uiInteractions;

  /**
   * Effect that listens for changes in the game state,
   * events coming from the server.
   */
  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, action, yourPlayerId, event }) => {
        /**
         * Determines if the game has been restarted
         */
        const isNewGame = (event?.name || "") === "stateSync";

        /**
         * Saves the game state from the service...
         */
        setGame(game);

        console.log(game);

        /**
         * Indicates that it is the initial event when the game starts
         */
        if (!action) {
          setYourPlayerId(yourPlayerId);
        }

        /**
         * Reset game states...
         */
        if (isNewGame) {
          setUiInteractions(INITIAL_UI_INTERACTIONS);
        }

        if (action?.name === "onSelectLine") {
          console.log("SELECTED LINE");
        }
      },
    });
  }, []);

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  const handleSelect = (line: ISelectLine) => {
    console.log("handleSelect: ", line);

    if (hasTurn && !isGameOver) {
      Rune.actions.onSelectLine(line);
    }
  };

  /**
   * Function that is executed once the initial game count has finished
   */
  const handleEndStartCounter = () => {
    console.log("COUNTER ENDS, ", { yourPlayerId });
    setUiInteractions({
      ...uiInteractions,
      showCounter: false,
      startTimer: true,
    });
  };

  console.log({ turnID, yourPlayerId, hasTurn, isGameOver });

  // If the counter is displayed, the remaining color in this case
  // is the initial background color
  const currentColor: IBackgroud = showCounter
    ? EBoardColorWithInitial.INITIAL
    : getCurrentColor({
        players: game.players,
        turnID,
      });

  /**
   * Disables the UI if the state indicates so, or if the user does not have
   * a turn, or if it is game over
   */
  const disableUI = uiInteractions.disableUI || !hasTurn || isGameOver;

  return (
    <GameWrapper disableUI={disableUI} currentColor={currentColor}>
      {showCounter && (
        <StartCounter handleEndStartCounter={handleEndStartCounter} />
      )}
      <Grid boxes={game.boxes} lines={game.lines} handleSelect={handleSelect} />
    </GameWrapper>
  );
};

export default Game;
