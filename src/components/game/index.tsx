import { getCurrentColor } from "./helpers.ts";
import { PlayerId } from "rune-sdk";
import { useCallback, useEffect, useState } from "react";
import { useWait } from "../../hooks/useWait.ts";
import {
  COMBINED_DELAY,
  EBoardColorWithInitial,
  INITIAL_UI_INTERACTIONS,
} from "../../utils/constants.ts";
import {
  GameWrapper,
  Grid,
  OpponentThinks,
  Score,
  ShowTurn,
  StartCounter,
} from "./components/index.tsx";
import type {
  GameState,
  IBackgroud,
  ISelectLine,
  IUInteractions,
  TBoardColor,
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

  /**
   * For UI-related actions
   */
  const { showCounter, startTimer, runEffect, delayUI } = uiInteractions;

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
          const delayUI = COMBINED_DELAY * game.numBoxesCompleted;

          setUiInteractions({
            showCounter: false,
            runEffect: true,
            delayUI,
            disableUI: true,
            startTimer: false,
            isGameOver: game.isGameOver,
          });
        }
      },
    });
  }, []);

  useWait(
    runEffect,
    delayUI,
    useCallback(() => {
      setUiInteractions((current) => {
        // TODO: Is Game over, show modal for Rune

        return {
          ...current,
          disableUI: false,
          startTimer: true,
          runEffect: false,
        };
      });
    }, [])
  );

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  /**
   * Function that runs when a user has selected a line,
   * as long as they have the turn...
   * @param line
   */
  const handleSelect = (line: ISelectLine) => {
    if (hasTurn && !isGameOver) {
      setUiInteractions({
        ...uiInteractions,
        disableUI: true,
        startTimer: false,
      });

      Rune.actions.onSelectLine(line);
    }
  };

  /**
   * Function that is executed once the initial game count has finished
   */
  const handleEndStartCounter = () => {
    setUiInteractions({
      ...uiInteractions,
      showCounter: false,
      startTimer: true,
    });
  };

  const handleInterval = () => {
    if (hasTurn && !isGameOver) {
      console.log("Random selection for ", { yourPlayerId });
    }
  };

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
      <Score
        players={game.players}
        yourPlayerId={yourPlayerId || ""}
        turnID={turnID}
        hasTurn={hasTurn}
        startTimer={startTimer && !isGameOver}
        currentColor={currentColor}
        handleInterval={handleInterval}
      />
      {!showCounter && !hasTurn && (
        <OpponentThinks currentColor={currentColor as TBoardColor} />
      )}
      <Grid boxes={game.boxes} lines={game.lines} handleSelect={handleSelect} />
      {!showCounter && hasTurn && (
        <ShowTurn currentColor={currentColor as TBoardColor} />
      )}
    </GameWrapper>
  );
};

export default Game;
