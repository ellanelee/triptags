import { PageProps } from "@/types/interfaces/interface.props"

export default function PageGroups({
  groupSize,
  currentPage,
  totalPage,
  onPageChange,
}: PageProps) {
  const pageGroup = Math.floor((currentPage - 1) / groupSize)
  const lastPageGroup = Math.floor((totalPage - 1) / groupSize)
  const pageStart = pageGroup * groupSize + 1
  const pageEnd = Math.min(pageStart + groupSize - 1, totalPage)
  const pages = []

  //페이지 세부내용 렌더링
  for (let i = pageStart; i <= pageEnd; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-between">
      {/* 맨앞으로 가기  */}
      {pageGroup === 0 ? (
        ""
      ) : (
        <button className="mx-4" type="button" onClick={() => onPageChange(1)}>
          {"<<"}
        </button>
      )}
      {/* //앞으로 가기 (이전 페이지 그룹으로 이동) */}
      {pageGroup > 0 && (
        <button
          className="mx-4"
          type="button"
          onClick={() => onPageChange(pageStart - 1)}
        >
          {"<"}
        </button>
      )}
      {pages.map((el) => (
        <button
          key={el}
          onClick={() => onPageChange(el)}
          className="mx-4 px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          {el}
        </button>
      ))}
      {pageGroup !== lastPageGroup && (
        <button
          type="button"
          className="mx-4"
          onClick={() => onPageChange(pageEnd + 1)}
        >
          {">"}
        </button>
      )}
      {pageEnd >= totalPage ? (
        ""
      ) : (
        <button onClick={() => onPageChange(totalPage)}>{">>"}</button>
      )}
    </div>
  )
}
