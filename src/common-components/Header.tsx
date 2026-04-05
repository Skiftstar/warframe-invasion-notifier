import { useState } from "react";

function Header({
  timerMinutes,
  timerSeconds,
  isRefreshing,
  doManualRefresh,
}: {
  timerMinutes: number;
  timerSeconds: number;
  isRefreshing: boolean;
  doManualRefresh: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const timerDisplay = `${timerMinutes}:${String(timerSeconds).padStart(2, "0")}`;

  return (
    <div className="Header">
      <div>Cephalon Cynta</div>
      <div className="Timer">
        <button
          className={`refresh-button ${isRefreshing ? "Grineer-color" : isHovered ? "Infested-color" : "Corpus-color"}`}
          onClick={() => {
            if (!isRefreshing) {
              doManualRefresh();
              setIsHovered(false);
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isRefreshing
            ? "Loading..."
            : isHovered
              ? "Refresh now?"
              : `Refresh: ${timerDisplay}`}
        </button>
      </div>
    </div>
  );
}

export default Header;
