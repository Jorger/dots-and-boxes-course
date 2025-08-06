import "./styles.css";
import { EBoardColorWithInitial } from "../../../../utils/constants";
import React, { ReactNode } from "react";
import type { IBackgroud } from "../../../../interfaces";

interface GameWrapperProps {
  disableUI: boolean;
  currentColor?: IBackgroud;
  children: JSX.Element | JSX.Element[] | ReactNode;
}

const GameWrapper = ({
  disableUI = true,
  currentColor = EBoardColorWithInitial.INITIAL,
  children,
}: GameWrapperProps) => (
  <div className={`game-wrapper ${currentColor.toLowerCase()}`}>
    {disableUI && <div className="game-wrapper-disable" />}
    {children}
  </div>
);

export default React.memo(GameWrapper);
