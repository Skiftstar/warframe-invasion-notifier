import { useState, useRef, useEffect, ChangeEvent } from "react";
import "./custom-select.css";

interface Props {
  options: string[];
  selectedItems: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const CustomMultiSelect = ({
  options,
  onChange,
  selectedItems,
  placeholder = "Search...",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options
    .filter((opt) => opt.toLowerCase().includes(inputValue.toLowerCase()))
    .sort();

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

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className="select-wrapper">
      <div className="selected-items">
        {selectedItems.map((item) => (
          <div className="selected-item-container">
            <span
              onClick={() => removeItem(item)}
              key={item}
              className="select-tag"
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      <div ref={containerRef}>
        <div className="input-container">
          <input
            className={`select-trigger ${isOpen ? "open" : ""}`}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
          />
        </div>

        {isOpen && (
          <ul className="select-dropdown">
            {filteredOptions
              .filter((option) => !selectedItems.includes(option))
              .map((option) => (
                <li key={option} onClick={() => handleSelect(option)}>
                  {option}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomMultiSelect;
