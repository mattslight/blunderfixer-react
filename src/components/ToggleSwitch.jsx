export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className="h-3 w-7 rounded-full bg-gray-300 transition-colors duration-200 peer-checked:bg-blue-500 dark:bg-gray-600" />
      <div className="absolute top-0.75 left-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-3" />
      <span className="ml-2 text-sm tracking-tight text-gray-200 dark:text-gray-400">
        {label}
      </span>
    </label>
  );
}
