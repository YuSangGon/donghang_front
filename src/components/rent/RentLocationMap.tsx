interface RentLocationMapProps {
  lat: number;
  lng: number;
}

function RentLocationMap({ lat, lng }: RentLocationMapProps) {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-sm">
      <iframe
        title="rent-location-map"
        src={src}
        className="h-[360px] w-full border-0"
        loading="lazy"
      />
    </div>
  );
}

export default RentLocationMap;
