import { useState } from "react";
import CustomSelect from "../../common-components/CustomSelect";

function InvasionNotificationManager({
  onSelectionChange,
  selectedFilters,
}: {
  onSelectionChange: (val: string[]) => void;
  selectedFilters: string[];
}) {
  const [activeFilter, setActiveFilter] = useState("");

  const defaultSelections = [
    "Fieldron",
    "Detonite Injector",
    "Mutalist Alad V Nav Coordinate",
    "Mutagen Mass",
    "Vandal Weapon Part",
    "Wraith Weapon Part",
    "Anything else",
  ];

  const handleFilterChange = (value: string) => {
    console.log("Filtering grid by:", value);
    setActiveFilter(value);
    // You would use this value to .filter() your grid data!
  };

  return (
    <div>
      <div>
        <CustomSelect
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
