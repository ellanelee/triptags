import { RegionInfo } from "@/types/types"
import { CountryUtils } from "./country.utils"

//국가코드, 언어를 받아 언어별 국가명 반환
export function destinationName(
  region: RegionInfo | null | undefined,
  locale: string = "ko",
): string {
  if (!region) return ""

  const name: string[] = []
  let current: RegionInfo | null | undefined = region

  while (current) {
    if (current.level === 1) {
      const localizedName = CountryUtils.getCountryName(current.name, locale)
      name.push(localizedName)
    } else {
      name.push(current.name)
    }
    current = current.parent
  }

  return name.reverse().join(" ")
}
