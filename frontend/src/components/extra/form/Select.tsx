// Reusable Select Field component
export default function SelectField({
  label,
  id,
  name,
  value,
  onChange,
  error,
  options,
}: {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        }`}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value} className="dark:bg-gray-700">
            {label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
