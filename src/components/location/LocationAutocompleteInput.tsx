import { useEffect, useRef, useState } from "react";
import { getLocationSuggestions } from "../../api/locationApi";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import type { LocationSuggestion } from "../../types/location";

interface LocationAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

function LocationAutocompleteInput({
  value,
  onChange,
  label = "지역",
  placeholder = "예: 런던, 영국",
}: LocationAutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const debouncedQuery = useDebouncedValue(value, 300);

  useEffect(() => {
    async function fetchSuggestions() {
      const query = debouncedQuery.trim();

      if (!query) {
        setSuggestions([]);
        setIsOpen(false);
        setActiveIndex(-1);
        return;
      }

      if (isSelected) {
        return;
      }

      try {
        setLoading(true);
        const data = await getLocationSuggestions(query);
        setSuggestions(data);
        setIsOpen(data.length > 0);
        setActiveIndex(data.length > 0 ? 0 : -1);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
        setIsOpen(false);
        setActiveIndex(-1);
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [debouncedQuery, isSelected]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeIndex < 0) return;

    const activeItem = itemRefs.current[activeIndex];
    activeItem?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  const handleInputChange = (nextValue: string) => {
    onChange(nextValue);
    setIsSelected(false);

    if (nextValue.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  const handleSelectSuggestion = (item: LocationSuggestion) => {
    onChange(item.displayName);
    setIsSelected(true);
    setIsOpen(false);
    setActiveIndex(-1);

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      if (suggestions.length > 0) {
        setIsOpen(true);
        setActiveIndex(0);
      }
      return;
    }

    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (suggestions.length === 0) return -1;
        if (prev < 0) return 0;
        return Math.min(prev + 1, suggestions.length - 1);
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => {
        if (suggestions.length === 0) return -1;
        if (prev <= 0) return 0;
        return prev - 1;
      });
      return;
    }

    if (event.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        event.preventDefault();
        handleSelectSuggestion(suggestions[activeIndex]);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label
        htmlFor="location"
        className="mb-2 block text-sm font-semibold text-slate-900"
      >
        {label}
      </label>

      <input
        ref={inputRef}
        id="location"
        type="text"
        value={value}
        onChange={(event) => handleInputChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (!isSelected && suggestions.length > 0) {
            setIsOpen(true);
            setActiveIndex(0);
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
      />

      {isOpen && (
        <div
          className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg"
          role="listbox"
          aria-label="지역 자동완성 목록"
        >
          {loading && (
            <div className="px-4 py-3 text-sm text-slate-600">
              지역 검색 중...
            </div>
          )}

          {!loading && suggestions.length === 0 && value.trim() && (
            <div className="px-4 py-3 text-sm text-slate-600">
              검색 결과가 없습니다.
            </div>
          )}

          {!loading &&
            suggestions.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={`${item.displayName}-${index}`}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() => handleSelectSuggestion(item)}
                  className={`block w-full px-4 py-3 text-left text-sm transition ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {item.displayName}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default LocationAutocompleteInput;
