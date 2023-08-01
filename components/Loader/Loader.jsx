import styles from "./Loader.module.css"

export default function Loader(props) {
  return (
    <div className={styles.wrapper} {...props}>
      <div className={styles.loader}></div>
      <div className={styles.text}>Loading</div>
    </div>
  )
}
