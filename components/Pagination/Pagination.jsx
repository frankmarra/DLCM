import ReactPaginate from "react-paginate"
import styles from "./Pagination.module.css"
import cn from "classnames"

export default function Pagination({ pageCount, onPageChange }) {
  if (pageCount <= 1) {
    return
  }

  return (
    <ReactPaginate
      className={cn(styles.component, "cluster")}
      breakLabel="..."
      nextLabel="next >"
      onPageChange={onPageChange}
      pageCount={pageCount}
      previousLabel="< previous"
      renderOnZeroPageCount={null}
    />
  )
}
