import { useEffect, useState } from "react";
import { InvasionInfo, InvasionReward } from "../api";
import SingleInvasionDisplay from "./components/SingleInvasionDisplay";
import "./invasions.css";
import Popup from "../common-components/Popup";
import { Bell, BellRing } from "lucide-react";
import InvasionNotificationManager from "./components/InvasionNotificationManager";
import { checkForAndSendInvasionNotifs } from "./utils/InvasionUtil";

function DataDisplay({
  errorCode,
  invasionInfos,
}: {
  errorCode: number | undefined;
  invasionInfos: InvasionInfo[];
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedNoticationFilters, setSelectedNotificationFilters] = useState<
    string[]
  >(() => {
    const data = JSON.parse(
      localStorage.getItem("cynta_invasion_filters") || "[]",
    );
    return data;
  });

  useEffect(() => {
    checkForAndSendInvasionNotifs(invasionInfos, selectedNoticationFilters);
  }, [invasionInfos]);

  if (!errorCode && invasionInfos.length === 0) return <div />;

  return errorCode ? (
    <div className="error-display">
      Error: {errorCode}
      {errorCode === 404 ? <div> Is the API down?</div> : <div />}
    </div>
  ) : (
    <div>
      <Popup
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Invasion Notifications"
      >
        <InvasionNotificationManager
          onSelectionChange={(vals: string[]) => {
            setSelectedNotificationFilters(vals);
            localStorage.setItem(
              "cynta_invasion_filters",
              JSON.stringify(vals),
            );
          }}
          selectedFilters={selectedNoticationFilters}
        />
      </Popup>
      <div className="invasions-display">
        <div className="section-header">
          <div>Invasions</div>
          {selectedNoticationFilters.length === 0 ? (
            <Bell
              className="notif-settings-icon"
              size={20}
              onClick={() => {
                setModalOpen(true);
              }}
            />
          ) : (
            <BellRing
              className="notif-settings-icon"
              size={20}
              onClick={() => {
                setModalOpen(true);
              }}
            />
          )}
        </div>
        <div className="invasion-grid">
          {invasionInfos
            .filter((info) => !info.completed)
            .map((info, index) => {
              return (
                <div key={`invasion-${index}`}>
                  <SingleInvasionDisplay info={info} index={index} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default DataDisplay;
