import { useEffect, useRef } from "react";
import { loadMapsLibrary, loadMarkerLibrary } from "../../lib/googleMaps";

interface GoogleMapViewProps {
  lat: number;
  lng: number;
  title?: string;
}

function GoogleMapView({ lat, lng, title = "위치" }: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let marker: google.maps.marker.AdvancedMarkerElement | null = null;

    async function init() {
      const { Map } = await loadMapsLibrary();
      const { AdvancedMarkerElement } = await loadMarkerLibrary();

      if (!mapRef.current) return;

      const map = new Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
      });

      marker = new AdvancedMarkerElement({
        map,
        position: { lat, lng },
        title,
      });
    }

    init();

    return () => {
      if (marker) {
        marker.map = null;
      }
    };
  }, [lat, lng, title]);

  return <div ref={mapRef} className="h-[360px] w-full rounded-3xl" />;
}

export default GoogleMapView;
