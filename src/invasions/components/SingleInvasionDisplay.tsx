import React from "react";
import { InvasionInfo } from "../../api";
import RewardDisplay from "./RewardDisplay";

function SingleInvasionDisplay({
  info,
  index,
}: {
  info: InvasionInfo;
  index: number;
}) {
  return (
    <div
      className="invasion-info-wrapper"
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="reward-display">
        <div className="attacker-reward">
          {info.attacker.reward ? (
            <RewardDisplay
              reward={info.attacker.reward}
              color={`${info.attacker.faction}-color`}
            />
          ) : (
            <div />
          )}
        </div>
        <div className="defender-reward">
          {info.defender.reward ? (
            <RewardDisplay
              reward={info.defender.reward}
              color={`${info.defender.faction}-color`}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
      <div className="faction-progress-display">
        <div
          className={`${info.defender.faction}-color progress-container`}
          style={{
            width: "100%",
            height: "35px",
            borderRadius: "0px 0px 4px 4px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className={`${info.attacker.faction}-color`}
            style={{
              width: `${info.completion}%`,
              height: "100%",
              transition: "width 0.3s ease-in-out",
            }}
          />

          <div className="progress-text">{info.completion.toFixed(2)}%</div>
        </div>
      </div>
      <div className="node-display">{info.node}</div>
    </div>
  );
}

export default SingleInvasionDisplay;
