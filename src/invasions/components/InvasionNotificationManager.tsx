import { useEffect, useState } from "react";
import CustomMultiSelect from "../../common-components/CustomMultiSelect";
import { getInvasionDrops, updateInvasionDrops } from "../utils/InvasionUtil";

function InvasionNotificationManager({
  onSelectionChange,
  selectedFilters,
}: {
  onSelectionChange: (val: string[]) => void;
  selectedFilters: string[];
}) {
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Permission granted!");
      }
    });
  };

  return (
    <div>
      <div>
        <CustomMultiSelect
          options={getInvasionDrops()}
          onChange={onSelectionChange}
          placeholder="Filter by Reward..."
          selectedItems={selectedFilters}
        />
      </div>
    </div>
  );
}

export default InvasionNotificationManager;
