import React, { useEffect, useState, useCallback } from "react";
import "./colors.css";
import "./App.css";
import { fetchItems, getInvasionStatus, InvasionInfo } from "./api";
import Header from "./common-components/Header";
import DataDisplay from "./invasions/InvasionsDataDisplay";

function App() {
  const intervalMs = 5 * 60 * 1000;
  const [nextRun, setNextRun] = useState(Date.now() + intervalMs);
  const [timeLeft, setTimeLeft] = useState(intervalMs);
  const [invasionInfos, setInvasionInfos] = useState<InvasionInfo[]>([]);
  const [errorCode, setErrorCode] = useState<undefined | number>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshInvasionData = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await fetchItems();
    } catch (e: any) {
      setErrorCode(e.status);
      setIsRefreshing(false);
      return;
    }

    const info = await getInvasionStatus();

    setIsRefreshing(false);
    if (typeof info === "number") {
      setErrorCode(info);
      setInvasionInfos([]);
    } else {
      setInvasionInfos(info);
      setErrorCode(undefined);
    }
    const newNextRun = Date.now() + intervalMs;
    setNextRun(newNextRun);
    setTimeLeft(intervalMs);
  }, [intervalMs]);

  useEffect(() => {
    refreshInvasionData();
  }, []);

  useEffect(() => {
    const tick = () => {
      const remaining = nextRun - Date.now();

      if (remaining <= 0) {
        refreshInvasionData();
      } else {
        setTimeLeft(remaining);
      }
    };

    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [nextRun, refreshInvasionData]);

  const minutes = Math.floor(Math.max(0, timeLeft) / 1000 / 60);
  const seconds = Math.floor((Math.max(0, timeLeft) / 1000) % 60);

  return (
    <div>
      <Header
        timerMinutes={minutes}
        timerSeconds={seconds}
        doManualRefresh={refreshInvasionData}
        isRefreshing={isRefreshing}
      />
      <div className="data-display">
        <DataDisplay errorCode={errorCode} invasionInfos={invasionInfos} />
      </div>
    </div>
  );
}

export default App;
