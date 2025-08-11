import "./styles.css";
import type { TBoardColor } from "../../../../interfaces";
import { EBoardColor } from "../../../../utils/constants";

interface OpponentThinksProps {
  currentColor: TBoardColor;
}

const OpponentThinks = ({
  currentColor = EBoardColor.BLUE,
}: OpponentThinksProps) => (
  <div className="game-turn-opponent">
    <div className={`game-turn-opponent-label ${currentColor.toLowerCase()}`}>
      Opponent thinks
    </div>
  </div>
);

export default OpponentThinks;
