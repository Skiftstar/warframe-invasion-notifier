import { useEffect, useState } from "react";
import CustomMultiSelect from "../../common-components/CustomMultiSelect";
import { getInvasionItemDrops, items } from "../../api";

function InvasionNotificationManager({
  onSelectionChange,
  selectedFilters,
}: {
  onSelectionChange: (val: string[]) => void;
  selectedFilters: string[];
}) {
  const [invasionDrops, setInvasionDrops] = useState<string[]>([]);

  const defaultSelections = [
    "Fieldron",
    "Detonite Injector",
    "Mutalist Alad V Nav Coordinate",
    "Mutagen Mass",
    "Anything else",
    ...invasionDrops,
  ];

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    setInvasionDrops(getInvasionItemDrops());
  }, [items]);

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
          options={defaultSelections}
          onChange={onSelectionChange}
          placeholder="Filter by Reward..."
          selectedItems={selectedFilters}
        />
      </div>
    </div>
  );
}

export default InvasionNotificationManager;
