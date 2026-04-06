import { InvasionReward } from "../../api";

const RewardDisplay = ({
  reward,
  color,
}: {
  reward: InvasionReward;
  color: string;
}) => {
  let itenName = "";
  if (reward.credits > 0) {
    itenName = reward.credits + " Credits";
  } else if (reward.itemString) {
    itenName = reward.itemString;
  } else if (reward.countedItems.length > 0) {
    itenName = reward.countedItems
      .map((item) => {
        const itemName = item.key;
        return `${itemName}${item.count > 1 ? ` (${item.count})` : ""}`;
      })
      .join(", ");
  }

  return (
    <div className={`${color} reward-container`}>
      <span className="fallback-text">{itenName}</span>
    </div>
  );
};

export default RewardDisplay;
