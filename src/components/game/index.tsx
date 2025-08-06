import { EBoardColorWithInitial } from "../../utils/constants.ts";
import { GameState } from "../../logic.ts";
import { GameWrapper } from "./components/index.tsx";
import { IBackgroud } from "../../interfaces/index.ts";
import { useEffect, useState } from "react";

const Game = () => {
  const [game, setGame] = useState<GameState>();
  // const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game }) => {
        setGame(game);
        // setYourPlayerId(yourPlayerId);

        // if (action && action.name === "claimCell") selectSound.play();
      },
    });
  }, []);

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  const currentColor: IBackgroud = EBoardColorWithInitial.BLUE;

  return (
    <GameWrapper disableUI={false} currentColor={currentColor}>
      <div>My Game!!</div>
      <button
        onClick={() => {
          console.log("hello");
        }}
      >
        Click me
      </button>
    </GameWrapper>
  );
};

export default Game;
