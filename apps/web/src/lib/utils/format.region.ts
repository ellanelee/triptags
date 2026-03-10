import { RegionInfo } from "@/types/types"
import { localeCountryName } from "./country"

export function destinationName(
  region: RegionInfo | null | undefined,
  locale: string = "ko",
): string {
  if (!region) return ""

  const name: string[] = []
  let current: RegionInfo | null | undefined = region

  while (current) {
    if (current.level === 1) {
      const localizedName = localeCountryName(current.name, locale)
      name.push(localizedName)
    } else {
      name.push(current.name)
    }
    current = current.parent
  }

  return name.reverse().join(" ")
}




