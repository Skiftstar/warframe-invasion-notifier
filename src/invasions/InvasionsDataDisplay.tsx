import { useEffect, useState } from "react";
import { InvasionInfo, InvasionReward } from "../api";
import SingleInvasionDisplay from "./components/SingleInvasionDisplay";
import "./invasions.css";
import Popup from "../common-components/Popup";
import { Bell, BellRing } from "lucide-react";
import InvasionNotificationManager from "./components/InvasionNotificationManager";

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
    checkForInvasionNotifs();
  }, [invasionInfos]);

  const checkForInvasionNotifs = () => {
    const seenInvasions: string[] = JSON.parse(
      localStorage.getItem("cynta_seen_invasions") || "[]",
    );

    invasionInfos.forEach((info) => {
      if (!seenInvasions.includes(info.id)) {
        seenInvasions.push(info.id);

        const itemFromFilter = hasRewardFromFilter(info);
        if (itemFromFilter) {
          showNotification(itemFromFilter);
        }
      }
    });

    localStorage.setItem("cynta_seen_invasions", JSON.stringify(seenInvasions));
  };

  const hasRewardFromFilter = (info: InvasionInfo) => {
    const rewards = [
      ...getRewardsFromInvasion(info.attacker.reward),
      ...getRewardsFromInvasion(info.defender.reward),
    ];

    if (
      selectedNoticationFilters.includes("Anything else") &&
      rewards.length > 0
    )
      return rewards[0];

    rewards.forEach((reward) => {
      if (selectedNoticationFilters.includes(reward)) {
        return reward;
      }
    });

    return undefined;
  };

  const getRewardsFromInvasion = (rewardInfo: InvasionReward) => {
    const rewards: string[] = [];

    if (!rewardInfo) return rewards;

    if (rewardInfo.credits > 0) {
      rewards.push("Credits");
    }
    if (rewardInfo.itemString) {
      rewards.push(rewardInfo.itemString);
    }
    if (rewardInfo.countedItems.length > 0) {
      rewards.push(...rewardInfo.countedItems.map((item) => item.key));
    }
    return rewards;
  };

  const showNotification = (item: string) => {
    if (Notification.permission === "granted") {
      const notification = new Notification("Warframe Invasion Alert!", {
        body: `New invasion for ${item}!`,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

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
