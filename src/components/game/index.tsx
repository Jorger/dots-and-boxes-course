import { EBoardColorWithInitial } from "../../utils/constants.ts";
import { GameState } from "../../logic.ts";
import { GameWrapper, Line } from "./components/index.tsx";
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
      <Line
        type="HORIZONTAL"
        state="ACTIVE"
        lineColor="BLUE"
        baseLine={{
          left: 100,
          top: 200,
          row: 0,
          col: 0,
        }}
        handleSelect={(data) => {
          console.log(data);
        }}
      />

      <Line
        type="HORIZONTAL"
        state="ACTIVE"
        lineColor="BLUE"
        baseLine={{
          left: 300,
          top: 200,
          row: 0,
          col: 0,
        }}
        handleSelect={(data) => {
          console.log(data);
        }}
      />

      <Line
        type="VERTICAL"
        state="COMPLETED"
        lineColor="RED"
        baseLine={{
          left: 200,
          top: 300,
          row: 0,
          col: 0,
        }}
        box={{
          isComplete: true,
          color: "BLUE",
          delay: 0,
          isCommit: false,
        }}
        handleSelect={(data) => {
          console.log(data);
        }}
      />
    </GameWrapper>
  );
};

export default Game;
