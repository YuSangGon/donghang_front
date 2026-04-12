import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let isInitialized = false;

export function initializeGoogleMaps() {
  if (isInitialized) return;

  setOptions({
    key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    v: "weekly",
    language: "en",
    libraries: ["places", "marker"],
    mapIds: import.meta.env.VITE_GOOGLE_MAP_ID
      ? [import.meta.env.VITE_GOOGLE_MAP_ID]
      : undefined,
  });

  isInitialized = true;
}

export async function loadMapsLibrary() {
  initializeGoogleMaps();
  return importLibrary("maps") as Promise<google.maps.MapsLibrary>;
}

export async function loadPlacesLibrary() {
  initializeGoogleMaps();
  return importLibrary("places") as Promise<google.maps.PlacesLibrary>;
}

export async function loadMarkerLibrary() {
  initializeGoogleMaps();
  return importLibrary("marker") as Promise<google.maps.MarkerLibrary>;
}
