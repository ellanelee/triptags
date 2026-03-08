import { PageProps } from "@/types/interfaces/interface.props"

export default function PageGroups({
  groupSize = 10,
  currentPage,
  totalPage,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PageProps) {
  const pageGroup = Math.floor(currentPage / groupSize)
  const pageStart = pageGroup * groupSize + 1
  const pageEnd = Math.min(pageStart + groupSize - 1, totalPage)
  const pages = []
  for (let i = pageStart; i <= pageEnd; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-between w-full">
      {hasPrevPage && (
        <button type="button" onClick={() => onPageChange(currentPage - 1)}>
          Prev
        </button>
      )}
      {pages.map((el) => (
        <span className="mx-1 px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer">
          {el}
        </span>
      ))}
      {hasNextPage && (
        <button type="button" onClick={() => onPageChange(currentPage + 1)}>
          Next
        </button>
      )}
    </div>
  )
}
