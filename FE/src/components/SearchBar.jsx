
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search..."
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        px-4
        py-2
        rounded-xl
        border
        outline-none
        focus:ring-2
        focus:ring-black
      "
    />
  )
}