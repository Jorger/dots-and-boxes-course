import { useEffect, useState } from "react";
// import { PlayerId } from "rune-sdk";

import selectSoundAudio from "./assets/select.wav";
import { GameState } from "./logic.ts";

const selectSound = new Audio(selectSoundAudio);

function App() {
  const [game, setGame] = useState<GameState>();
  // const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>();

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, action }) => {
        setGame(game);
        // setYourPlayerId(yourPlayerId);

        if (action && action.name === "claimCell") selectSound.play();
      },
    });
  }, []);

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return;
  }

  // const { winCombo, cells, lastMovePlayerId, playerIds, freeCells } = game;

  return <>Hello world</>;
}

export default App;
