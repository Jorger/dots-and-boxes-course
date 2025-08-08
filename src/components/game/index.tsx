import { EBoardColorWithInitial } from "../../utils/constants.ts";
import { GameWrapper, Grid } from "./components/index.tsx";
import { PlayerId } from "rune-sdk";
import { useEffect, useState } from "react";
import type {
  GameState,
  IBackgroud,
  ISelectLine,
} from "../../interfaces/index.ts";

const Game = () => {
  const [game, setGame] = useState<GameState>();
  /**
   * Saves the current player id for each session...
   */
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

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

        console.log({ isNewGame });

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

  console.log({ turnID, yourPlayerId, hasTurn, isGameOver });

  const currentColor: IBackgroud = EBoardColorWithInitial.INITIAL;

  return (
    <GameWrapper disableUI={false} currentColor={currentColor}>
      <Grid boxes={game.boxes} lines={game.lines} handleSelect={handleSelect} />
    </GameWrapper>
  );
};

export default Game;
