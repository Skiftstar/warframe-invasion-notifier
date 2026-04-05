import { useState, useRef, useEffect, ChangeEvent } from "react";
import "./custom-select.css";

interface Props {
  options: string[];
  selectedItems: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const CustomSelect = ({
  options,
  onChange,
  selectedItems,
  placeholder = "Search...",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(inputValue.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    // Prevent duplicates
    if (!selectedItems.includes(option)) {
      const newItems = [...selectedItems, option];
      onChange(newItems);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const removeItem = (itemToRemove: string) => {
    const newItems = selectedItems.filter((item) => item !== itemToRemove);
    onChange(newItems);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) setIsOpen(true);

    // Optional: Trigger your API call here if
    // inputValue.length > 2
  };

  return (
    <div className="select-wrapper" ref={containerRef}>
      <div className="input-container">
        {/* Render Tags for Multi-Select */}
        {selectedItems.map((item) => (
          <span key={item} className="select-tag">
            {item}
            <button onClick={() => removeItem(item)}>&times;</button>
          </span>
        ))}

        <input
          className={`select-trigger ${isOpen ? "open" : ""}`}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedItems.length === 0 ? placeholder : ""}
        />
      </div>

      {isOpen && (
        <ul className="select-dropdown">
          {/* Show filtered predefined list */}
          {filteredOptions.length > 0
            ? filteredOptions
                .filter((option) => !selectedItems.includes(option))
                .map((option) => (
                  <li key={option} onClick={() => handleSelect(option)}>
                    {option}
                  </li>
                ))
            : /* Show "Add Custom" if no match found */
              inputValue && (
                <li
                  className="custom-add"
                  onClick={() => handleSelect(inputValue)}
                >
                  Search for "{inputValue}"...
                </li>
              )}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
