import styles from "./Pagination.module.css"
import cn from "classnames"

const range = (start, end) => {
  return [...Array(end - start).keys()].map((el) => el + start)
}

export default function Pagination({ pageCount, currentPage, setCurrentPage }) {
  // const pageNumbers = [...Array(pageCount + 1).keys()].slice(1)
  // pageNumbers.pop()
  // pageNumbers.shift()
  // let pages = []
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

{
  /* <ul role="list" className={cn(styles.pages, "grid")}>
    <li>
      <a onClick={prevPage} href="#">
        {"<<"}
      </a>
    </li>
    {currentPage <= 3 ? (
      <>
        <li className={currentPage == 1 ? styles.active : ""}>
          <a onClick={() => setCurrentPage(1)} href="#">
            1
          </a>
        </li>
        <li className={currentPage == 2 ? styles.active : ""}>
          <a onClick={() => setCurrentPage(2)} href="#">
            2
          </a>
        </li>
        <li className={currentPage == 3 ? styles.active : ""}>
          <a onClick={() => setCurrentPage(3)} href="#">
            3
          </a>
        </li>
        <li className={currentPage == 4 ? styles.active : ""}>
          <a onClick={() => setCurrentPage(4)} href="#">
            4
          </a>
        </li>
        <li>...</li>
        <li>
          <a onClick={() => setCurrentPage(pages)}>{pages}</a>
        </li>
      </>
    ) : null}
    {currentPage >= 4 && currentPage <= pages - 3 ? (
      <>
        <li>
          <a onClick={() => setCurrentPage(1)} href="#">
            1
          </a>
        </li>
        <li>...</li>
        <li>
          <a onClick={prevPage} href="#">
            {currentPage - 1}
          </a>
        </li>
        <li className={styles.active}>{currentPage}</li>
        <li>
          <a onClick={nextPage} href="#">
            {currentPage + 1}
          </a>
        </li>
        <li>...</li>
        <li>
          <a onClick={() => setCurrentPage(pages)} href="#">
            {pages}
          </a>
        </li>
      </>
    ) : null}
    {currentPage >= pages - 2 ? (
      <>
        <li>
          <a onClick={() => setCurrentPage(1)}>1</a>
        </li>
        <li>...</li>

        <li className={currentPage == pages - 3 ? styles.active : ""}>
          <a onClick={() => setCurrentPage(pages - 3)} href="#">
            {pages - 3}
          </a>
        </li>
        <li className={currentPage == pages - 2 ? styles.active : ""}>
          <a onClick={() => setCurrentPage(pages - 2)} href="#">
            {pages - 2}
          </a>
        </li>
        <li className={currentPage == pages - 1 ? styles.active : ""}>
          <a onClick={() => setCurrentPage(pages - 1)} href="#">
            {pages - 1}
          </a>
        </li>
        <li className={currentPage == pages ? styles.active : ""}>
          <a onClick={() => setCurrentPage(pages)} href="#">
            {pages}
          </a>
        </li>
      </>
    ) : null}
    <li>
      <a onClick={nextPage} href="#">
        {">>"}
      </a>
    </li>
  </ul>
*/
}
