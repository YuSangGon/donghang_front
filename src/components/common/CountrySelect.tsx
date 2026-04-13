import { COUNTRY_OPTIONS } from "../../constants/countries";

interface CountrySelectProps {
  value: string;
  onChange: (countryCode: string) => void;
}

function CountrySelect({ value, onChange }: CountrySelectProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-900">
        나라
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-500"
      >
        <option value="">나라를 선택하세요</option>
        {COUNTRY_OPTIONS.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CountrySelect;
