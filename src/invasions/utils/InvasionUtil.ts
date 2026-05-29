import {
  getInvasionWeaponComponents,
  InvasionInfo,
  InvasionReward,
} from "../../api";

const defaultSelections: string[] = [
  "Fieldron",
  "Detonite Injector",
  "Mutalist Alad V Nav Coordinate",
  "Mutagen Mass",
  "Anything else",
];

let invasionDrops: string[] = [];

export const updateInvasionDrops = () => {
  invasionDrops = [...defaultSelections, ...getInvasionWeaponComponents()];
};

export const getInvasionDrops = () => {
  return invasionDrops;
};

export const checkForAndSendInvasionNotifs = (
  invasionInfos: InvasionInfo[],
  selectedFilters: string[],
) => {
  const seenInvasions: string[] = JSON.parse(
    localStorage.getItem("cynta_seen_invasions") || "[]",
  );

  invasionInfos.forEach((info) => {
    if (!seenInvasions.includes(info.id)) {
      seenInvasions.push(info.id);

      const itemFromFilter = hasRewardFromFilter(info, selectedFilters);
      if (itemFromFilter) {
        showNotification(itemFromFilter);
      }
    }
  });

  localStorage.setItem("cynta_seen_invasions", JSON.stringify(seenInvasions));
};

const hasRewardFromFilter = (info: InvasionInfo, selectedFilters: string[]) => {
  const rewards = [
    ...getRewardsFromInvasion(info.attacker.reward),
    ...getRewardsFromInvasion(info.defender.reward),
  ];

  for (const reward of rewards) {
    if (selectedFilters.includes(reward)) {
      return reward;
    }

    console.log(invasionDrops);
    if (
      selectedFilters.includes("Anything else") &&
      !invasionDrops.includes(reward)
    ) {
      return reward;
    }
  }
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
