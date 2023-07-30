import ReactPaginate from "react-paginate"
import styles from "./Pagination.module.css"
import cn from "classnames"

export default function Pagination({
  pageCount,
  onPageChange,
  onClick,
  forcePage,
}) {
  if (pageCount <= 1) {
    return
  }

  return (
    <ReactPaginate
      className={cn(styles.component, "cluster")}
      breakLabel="..."
      nextLabel="next >"
      onClick={onClick}
      onPageChange={onPageChange}
      pageCount={pageCount}
      forcePage={forcePage}
      previousLabel="< previous"
      renderOnZeroPageCount={null}
    />
  )
}
