import { useEffect, useState } from "react";
import { InvasionInfo } from "../api";
import SingleInvasionDisplay from "./components/SingleInvasionDisplay";
import "./invasions.css";
import Popup from "../common-components/Popup";
import { Bell } from "lucide-react";
import InvasionNotificationManager from "./components/InvasionNotificationManager";

function DataDisplay({
  errorCode,
  invasionInfos,
}: {
  errorCode: number | undefined;
  invasionInfos: InvasionInfo[];
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(() => {
    const data = JSON.parse(
      localStorage.getItem("cynta_invasion_filters") || "[]",
    );
    return data;
  });

  useEffect(() => {
    checkForInvasionNotifs();
  }, [invasionInfos]);

  const checkForInvasionNotifs = () => {};

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
            setSelectedFilters(vals);
            localStorage.setItem(
              "cynta_invasion_filters",
              JSON.stringify(vals),
            );
          }}
          selectedFilters={selectedFilters}
        />
      </Popup>
      <div className="invasions-display">
        <div className="section-header">
          <div>Invasions</div>
          <Bell
            className="notif-settings-icon"
            size={20}
            onClick={() => {
              setModalOpen(true);
            }}
          />
        </div>
        <div className="invasion-grid">
          {invasionInfos
            .filter((info) => !info.completed)
            .map((info, index) => {
              return <SingleInvasionDisplay info={info} index={index} />;
            })}
        </div>
      </div>
    </div>
  );
}

export default DataDisplay;
