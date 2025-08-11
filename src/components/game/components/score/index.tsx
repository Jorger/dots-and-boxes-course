import "./styles.css";
import { getPlayersScore } from "./helpers";
import { PlayerId } from "rune-sdk";
import { TIME_INTERVAL_CHRONOMETER } from "../../../../utils/constants";
import { useEffect, useState } from "react";
import { useInterval } from "../../../../hooks";
import type {
  IBackgroud,
  Player,
  PlayerScore,
  TBoardColor,
} from "../../../../interfaces";

interface RenderPlayerProps {
  player: PlayerScore;
  turnID: PlayerId;
}

const RenderPlayer = ({ player, turnID }: RenderPlayerProps) => (
  <div
    className={`game-score-profile ${turnID === player.playerId ? player.color.toLowerCase() : ""}`}
  >
    <img
      src={player.avatarUrl}
      alt={player.displayName}
      title={player.displayName}
    />
  </div>
);

const RenderScore = ({
  score = 0,
  color,
}: {
  score: number;
  color: TBoardColor;
}) => <div className={`game-score-value ${color.toLowerCase()}`}>{score}</div>;

interface ScoreProps {
  players: Player[];
  yourPlayerId: PlayerId;
  turnID: PlayerId;
  hasTurn: boolean;
  startTimer: boolean;
  currentColor: IBackgroud;
  handleInterval: () => void;
}

const Score = ({
  players,
  yourPlayerId,
  turnID,
  hasTurn,
  startTimer = false,
  currentColor,
  handleInterval,
}: ScoreProps) => {
  const [countdown, setCountdown] = useState({
    progress: 1,
    isRunning: false,
  });

  useEffect(
    () => setCountdown({ isRunning: startTimer, progress: 100 }),
    [startTimer]
  );

  useInterval(
    () => {
      const newProgress = countdown.progress - 1;

      setCountdown({ ...countdown, progress: newProgress });

      if (newProgress === 0) {
        setCountdown({ progress: newProgress, isRunning: false });

        handleInterval();
      }
    },
    countdown.isRunning ? TIME_INTERVAL_CHRONOMETER : null
  );

  const timerStyle = {
    "--timer-progress": `${countdown.progress}% 100%`,
    "--timer-position": hasTurn ? "100% 0" : "0 0",
  } as React.CSSProperties;

  const playersScore = getPlayersScore({ players, yourPlayerId });

  return (
    <div className="game-score">
      <div className="game-score-container">
        <div
          className={`game-score-progress ${currentColor.toLowerCase()}`}
          style={timerStyle}
        >
          <div className="game-score-progress-item">
            <RenderPlayer player={playersScore[0]} turnID={turnID} />
            <RenderScore
              color={playersScore[0].color}
              score={playersScore[0].score}
            />
            <div className="game-score-dot" />
            <RenderScore
              color={playersScore[1].color}
              score={playersScore[1].score}
            />
            <RenderPlayer player={playersScore[1]} turnID={turnID} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
