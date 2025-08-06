import { GameState } from "../../logic.ts";
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

  return <>Hello world again!</>;
};

export default Game;
