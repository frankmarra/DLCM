import styles from "./Pagination.module.css"
import cn from "classnames"

const range = (start, end) => {
  return [...Array(end - start).keys()].map((el) => el + start)
}

export default function Pagination({ pageCount, currentPage, setCurrentPage }) {
  const getPageRange = (pageCount, currentPage) => {
    let first = Math.floor(5 / 2)
    let last = Math.ceil(5 / 2)
    if (pageCount < 5) {
      return { start: 2, end: pageCount }
    } else if (currentPage <= 2) {
      return { start: 2, end: 5 }
    } else if (currentPage + 1 >= pageCount) {
      return { start: pageCount - 4 + 1, end: pageCount }
    } else if (currentPage == pageCount) {
      return { start: pageCount - 5, end: pageCount - 1 }
    } else {
      return { start: currentPage - 2 + 1, end: currentPage + 1 + 1 }
    }
  }

  const pageRange = getPageRange(pageCount, currentPage)
  const pages = range(pageRange.start, pageRange.end)

  return (
    <ul role="list" className={cn(styles.pages, "grid")}>
      {currentPage === 1 ? null : (
        <>
          <li>
            <a onClick={() => setCurrentPage(currentPage - 1)} href="#">
              PREV
            </a>
          </li>
        </>
      )}
      <li>
        <a
          className={currentPage == 1 ? styles.active : ""}
          onClick={() => setCurrentPage(1)}
          href="#"
        >
          1
        </a>
      </li>
      {currentPage - 2 > 1 && currentPage != 1 ? <p>...</p> : null}
      {pages.map((page) => (
        <li key={page}>
          <a
            className={currentPage == page ? styles.active : ""}
            onClick={() => setCurrentPage(page)}
            href="#"
          >
            {page}
          </a>
        </li>
      ))}
      {currentPage + 2 < pageCount ? <p>...</p> : null}
      <li>
        <a
          className={currentPage == pageCount ? styles.active : ""}
          onClick={() => setCurrentPage(pageCount)}
          href="#"
        >
          {pageCount}
        </a>
      </li>
      {currentPage === pageCount ? null : (
        <>
          <li>
            <a onClick={() => setCurrentPage(currentPage + 1)} href="#">
              NEXT
            </a>
          </li>
        </>
      )}
    </ul>
  )
}
