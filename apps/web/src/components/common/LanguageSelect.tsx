import { LanguageSelectProps } from "@/types/interfaces/interface.props"

export const LanguageSelect = ({
  label,
  value,
  onChange,
  disabled, 
  tr,
}: LanguageSelectProps) => {
  const languages = ["ko", "en", "ja", "zh", "de", "es", "fr"]
  return (
    <>
      {label && (
        <label
          htmlFor="languageSelection"
          className="block text-sm font-medium text-gray-700 mr-6"
        >
          {label} :
        </label>
      )}
      <select
        id="language"
        name="language"
        autoComplete="language"
        required
        disabled={disabled}
        className="appearance-none block px-4 py-2 bg-gray-100 text-gray-800 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm h-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {tr(`languages.${lang}`)}
          </option>
        ))}
      </select>
      {/* 화살표 아이콘 커스텀 */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </>
  )
}
