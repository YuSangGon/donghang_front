import type { LocationSuggestion } from "../types/location";

export async function getLocationSuggestions(
  query: string,
): Promise<LocationSuggestion[]> {
  const response = await fetch(
    `/api/locations/suggest?q=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error("지역 자동완성 목록을 불러오지 못했습니다.");
  }

  return response.json();
}
