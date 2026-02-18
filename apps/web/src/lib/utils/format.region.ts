import { RegionInfo } from "@/types/types"

export function destinationInfo(region: RegionInfo | null | undefined): string {
  if (!region) return ""

  const name: string[] = []
  let current: RegionInfo | null | undefined = region

  while (current) {
    name.push(current.name)
    current = current.parent
  }
  return name.reverse().join(" ")
}
