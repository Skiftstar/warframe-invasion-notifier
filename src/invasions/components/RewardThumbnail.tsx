import { useState } from "react";
import { InvasionReward } from "../../api";

const RewardThumbnail = ({
  reward,
  color,
}: {
  reward: InvasionReward;
  color: string;
}) => {
  const [hasError, setHasError] = useState(false);

  let fallbackText = "";
  if (reward.credits > 0) {
    fallbackText = reward.credits + " Credits";
  } else if (reward.itemString) {
    fallbackText = reward.itemString;
  } else if (reward.countedItems.length > 0) {
    fallbackText = reward.countedItems
      .map((item) => {
        const itemName = item.key;
        return `${itemName}${item.count > 1 ? ` (${item.count})` : ""}`;
      })
      .join(", ");
  }

  if (hasError) {
    return (
      <div className={`${color} reward-container`}>
        <span className="fallback-text">{fallbackText}</span>
      </div>
    );
  }

  return (
    <div className={`${color} reward-container`}>
      <img
        src={reward.thumbnail}
        alt={fallbackText}
        onError={() => setHasError(true)}
        style={{ width: "24px", height: "24px", objectFit: "contain" }}
      />
    </div>
  );
};

export default RewardThumbnail;
