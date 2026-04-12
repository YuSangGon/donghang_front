import { useEffect, useRef, useState } from "react";
import {
  loadMapsLibrary,
  loadMarkerLibrary,
  loadPlacesLibrary,
} from "../../lib/googleMaps";

interface GooglePlacePickerWithMapProps {
  onSelect: (place: {
    address: string;
    placeId: string;
    lat: number;
    lng: number;
  }) => void;
}

interface SuggestionItem {
  text: string;
  placeId: string;
}

function GooglePlacePickerWithMap({ onSelect }: GooglePlacePickerWithMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const placesServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const onSelectRef = useRef(onSelect);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (mapInstanceRef.current || !mapRef.current) return;

      const { Map } = await loadMapsLibrary();
      const { AdvancedMarkerElement } = await loadMarkerLibrary();
      await loadPlacesLibrary();

      if (!isMounted || !mapRef.current) return;

      const map = new Map(mapRef.current, {
        center: { lat: 51.5072, lng: -0.1276 },
        zoom: 10,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
      });

      const marker = new AdvancedMarkerElement({
        map,
        position: { lat: 51.5072, lng: -0.1276 },
        title: "selected place",
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      placesServiceRef.current = new google.maps.places.AutocompleteService();
    }

    init();

    return () => {
      isMounted = false;
      if (markerRef.current) {
        markerRef.current.map = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    // 이미 선택된 상태면 다시 자동완성 안 띄움
    if (isSelected) {
      return;
    }

    if (!placesServiceRef.current) return;

    const timer = window.setTimeout(() => {
      setLoading(true);

      placesServiceRef.current?.getPlacePredictions(
        {
          input: query,
        },
        (predictions, status) => {
          setLoading(false);

          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !predictions
          ) {
            setSuggestions([]);
            setIsOpen(false);
            setActiveIndex(-1);
            return;
          }

          const next = predictions.map((item) => ({
            text: item.description,
            placeId: item.place_id,
          }));

          setSuggestions(next);
          setIsOpen(next.length > 0);
          setActiveIndex(next.length > 0 ? 0 : -1);
        },
      );
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, isSelected]);

  const moveToPlace = async (placeId: string) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ placeId }, (results, status) => {
      if (
        status !== "OK" ||
        !results ||
        results.length === 0 ||
        !mapInstanceRef.current ||
        !markerRef.current
      ) {
        return;
      }

      const result = results[0];
      const location = result.geometry.location;
      const viewport = result.geometry.viewport;

      if (viewport) {
        mapInstanceRef.current.fitBounds(viewport);
      } else {
        mapInstanceRef.current.setCenter(location);
        mapInstanceRef.current.setZoom(17);
      }

      markerRef.current.position = location;
      markerRef.current.title = result.formatted_address;

      const address = result.formatted_address ?? "";
      const lat = location.lat();
      const lng = location.lng();

      setQuery(address);
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
      setIsSelected(true);

      onSelectRef.current({
        address,
        placeId,
        lat,
        lng,
      });
    });
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowDown") {
      if (!isOpen && !isSelected && suggestions.length > 0) {
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex(0);
        return;
      }

      if (isOpen) {
        event.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : suggestions.length - 1,
        );
      }
      return;
    }

    if (event.key === "ArrowUp") {
      if (isOpen) {
        event.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
      return;
    }

    if (event.key === "Enter") {
      if (isOpen && activeIndex >= 0 && activeIndex < suggestions.length) {
        event.preventDefault();
        await moveToPlace(suggestions[activeIndex].placeId);
      }
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          위치
        </label>

        <input
          type="text"
          value={query}
          onChange={(event) => {
            const nextValue = event.target.value;
            setQuery(nextValue);

            // 사용자가 다시 수정하면 선택 상태 해제
            setIsSelected(false);

            if (nextValue.trim()) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
              setSuggestions([]);
              setActiveIndex(-1);
            }
          }}
          onFocus={() => {
            // 이미 선택된 상태면 수정 전까지 안 띄움
            if (isSelected) return;

            if (suggestions.length > 0) {
              setIsOpen(true);
              setActiveIndex((prev) => (prev >= 0 ? prev : 0));
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="주소 또는 지역 검색"
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
        />

        {isOpen && (
          <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
            {loading && (
              <div className="px-4 py-3 text-sm text-slate-600">검색 중...</div>
            )}

            {!loading && suggestions.length === 0 && query.trim() && (
              <div className="px-4 py-3 text-sm text-slate-600">
                검색 결과가 없습니다.
              </div>
            )}

            {!loading &&
              suggestions.map((item, index) => (
                <button
                  key={item.placeId}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => moveToPlace(item.placeId)}
                  className={`block w-full px-4 py-3 text-left text-sm transition ${
                    activeIndex === index
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {item.text}
                </button>
              ))}
          </div>
        )}
      </div>

      <div
        ref={mapRef}
        className="h-[320px] w-full overflow-hidden rounded-3xl border border-slate-300 bg-slate-100"
      />
    </div>
  );
}

export default GooglePlacePickerWithMap;
