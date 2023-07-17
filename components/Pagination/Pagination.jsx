import styles from "./Pagination.module.css"
import cn from "classnames"

export default function Pagination({ pages, currentPage, setCurrentPage }) {
  const pageNumbers = [...Array(pages + 1).keys()].slice(1)

  const nextPage = () => {
    if (currentPage !== pages) setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1)
  }

  if (pages <= 5) {
    return (
      <ul role="list" className={cn(styles.pages, "grid")}>
        <li>
          <a onClick={prevPage} href="#">
            {"<<"}
          </a>
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={cn(`${currentPage == number ? styles.active : ""}`)}
          >
            <a
              onClick={() => setCurrentPage(number)}
              className="page-link"
              href="#"
            >
              {number}
            </a>
          </li>
        ))}
        <li>
          <a onClick={nextPage} href="#">
            {">>"}
          </a>
        </li>
      </ul>
    )
  }

  return (
    <ul role="list" className={cn(styles.pages, "grid")}>
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
  )
}
