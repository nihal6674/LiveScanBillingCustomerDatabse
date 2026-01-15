export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="
          w-full px-3 py-2 rounded-lg
          border border-gray-300
          focus:ring-2 focus:ring-blue-500
          focus:border-blue-500
          outline-none
          disabled:bg-gray-100
        "
      />
    </div>
  );
}
